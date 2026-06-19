/**
 * Prerender (SSG-snapshot) для одностраничного сайта Core Agency.
 *
 * Зачем: сайт — SPA на React + Three.js. В исходном dist/index.html лежит
 * пустой <div id="root">, а весь текст подгружается скриптом. Поисковики
 * (особенно Яндекс) такой контент видят плохо. Скрипт поднимает собранный
 * сайт через `vite preview`, открывает его в headless Chrome, ждёт полной
 * отрисовки DOM и вшивает готовую разметку с текстом прямо в dist/index.html.
 *
 * Best-effort: если Chrome не найден или что-то пошло не так — печатаем
 * предупреждение и выходим с кодом 0, не ломая сборку (остаётся обычный SPA).
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distIndex = path.join(root, 'dist', 'index.html');
const PORT = 5099;
const ORIGIN = `http://localhost:${PORT}/`;

function findChrome() {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ].filter(Boolean);
  return candidates.find((p) => {
    try {
      return existsSync(p);
    } catch {
      return false;
    }
  });
}

async function waitForServer(url, timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {
      /* ещё не поднялся */
    }
    await sleep(300);
  }
  return false;
}

async function main() {
  if (!existsSync(distIndex)) {
    console.warn('[prerender] dist/index.html не найден — пропускаю.');
    return;
  }

  const executablePath = findChrome();
  if (!executablePath) {
    console.warn('[prerender] Chrome не найден — оставляю обычный SPA (без prerender).');
    return;
  }

  let puppeteer;
  try {
    puppeteer = (await import('puppeteer-core')).default;
  } catch {
    console.warn('[prerender] puppeteer-core не установлен — пропускаю.');
    return;
  }

  // Поднимаем собранный сайт.
  const preview = spawn(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['vite', 'preview', '--port', String(PORT), '--strictPort'],
    { cwd: root, stdio: 'ignore' }
  );

  let browser;
  try {
    const up = await waitForServer(ORIGIN);
    if (!up) throw new Error('vite preview не поднялся вовремя');

    browser = await puppeteer.launch({
      executablePath,
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--enable-unsafe-swiftshader',
        '--use-gl=angle',
        '--use-angle=swiftshader',
        '--hide-scrollbars',
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(ORIGIN, { waitUntil: 'networkidle0', timeout: 45000 });

    // Ждём, пока смонтируется реальный контент.
    await page.waitForSelector('h1.hero-title', { timeout: 20000 });
    await page.waitForSelector('footer', { timeout: 20000 });
    await sleep(800);

    const rootHtml = await page.evaluate(() => {
      // Убираем оверлей-прелоадер из снимка — он не нужен поисковику.
      document.querySelectorAll('.preloader').forEach((el) => el.remove());
      // Снимаем inline opacity:0, выставленный анимациями, чтобы текст
      // не был спрятан в статичном HTML (для краулеров и на случай без-JS).
      document.querySelectorAll('[style]').forEach((el) => {
        const s = el.getAttribute('style') || '';
        if (/opacity\s*:\s*0/.test(s) || /visibility\s*:\s*hidden/.test(s)) {
          el.style.opacity = '';
          el.style.visibility = '';
          el.style.transform = '';
        }
      });
      const r = document.getElementById('root');
      return r ? r.innerHTML : '';
    });

    if (!rootHtml || rootHtml.length < 500) {
      throw new Error(`снимок слишком короткий (${rootHtml.length} симв.) — похоже, контент не отрисовался`);
    }

    let html = readFileSync(distIndex, 'utf8');
    const emptyRoot = /<div id="root">\s*<\/div>/;
    if (!emptyRoot.test(html)) {
      console.warn('[prerender] не нашёл пустой <div id="root"></div> — пропускаю встраивание.');
      return;
    }
    html = html.replace(emptyRoot, `<div id="root">${rootHtml}</div>`);
    writeFileSync(distIndex, html, 'utf8');
    console.log(`[prerender] OK — вшито ${rootHtml.length} символов разметки в dist/index.html`);
  } catch (err) {
    console.warn(`[prerender] предупреждение: ${err?.message || err}. Оставляю обычный SPA.`);
  } finally {
    if (browser) await browser.close().catch(() => {});
    preview.kill();
  }
}

main().then(() => process.exit(0));
