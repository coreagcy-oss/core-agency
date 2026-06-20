/**
 * Рендер PNG-иконок из public/favicon.svg (фирменный логотип на чёрном фоне).
 *
 * Зачем: Google в результатах поиска подхватывает favicon надёжнее в формате
 * PNG/ICO, чем чистый SVG. Этот скрипт через headless Chrome растеризует наш
 * favicon.svg в несколько размеров (для поиска, для iOS, классический ico-замена).
 *
 * Запуск вручную: node scripts/make-favicon.mjs
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const svgPath = path.join(root, 'public', 'favicon.svg');

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

const sizes = [
  { file: 'favicon-256.png', size: 256 }, // для Google-поиска (высокое разрешение)
  { file: 'favicon-96.png', size: 96 },
  { file: 'apple-touch-icon.png', size: 180 }, // iOS «на экран домой»
];

const run = async () => {
  const exe = findChrome();
  if (!exe) {
    console.warn('[favicon] Chrome не найден — PNG не созданы.');
    process.exit(0);
  }
  const svg = readFileSync(svgPath, 'utf8');
  const browser = await puppeteer.launch({
    executablePath: exe,
    headless: 'new',
    args: ['--no-sandbox', '--force-device-scale-factor=1'],
  });
  try {
    const page = await browser.newPage();
    for (const { file, size } of sizes) {
      const inner = svg.replace('width="1024" height="1024"', `width="${size}" height="${size}"`);
      const html = `<!doctype html><html><head><style>
        html,body{margin:0;padding:0;background:#000}
        #i{width:${size}px;height:${size}px;display:block;background:#000}
        #i svg{display:block}
      </style></head><body><div id="i">${inner}</div></body></html>`;
      await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
      await page.setContent(html, { waitUntil: 'load' });
      const buf = await page.screenshot({
        type: 'png',
        omitBackground: false,
        clip: { x: 0, y: 0, width: size, height: size },
      });
      writeFileSync(path.join(root, 'public', file), buf);
      console.log(`[favicon] ${file} (${size}x${size}) — ok`);
    }
  } finally {
    await browser.close();
  }
};

run().catch((e) => {
  console.warn('[favicon] не удалось:', e.message);
  process.exit(0);
});
