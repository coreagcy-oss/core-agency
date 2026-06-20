/**
 * Конвертация картинок кейсов JPG → WebP с разумным ресайзом.
 *
 * Зачем: PageSpeed просит next-gen формат + «properly size images». Исходники
 * 1244×1400 (~0.4 МБ каждый) выводятся в колонке ~400px, т.е. вдвое крупнее
 * нужного. Рендерим через headless Chrome (canvas.toDataURL('image/webp')).
 *
 * Запуск: node scripts/convert-cases.mjs
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dir = path.join(root, 'public', 'cases');

// maxW — целевая ширина (учёт retina). Широкий кейс (sunthai) крупнее.
const targets = [
  { file: 'kaif', maxW: 880 },
  { file: 'phuket', maxW: 880 },
  { file: 'playa', maxW: 880 },
  { file: 'sunthai', maxW: 1320 },
];
const QUALITY = 0.82;

function findChrome() {
  const c = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);
  return c.find((p) => { try { return existsSync(p); } catch { return false; } });
}

const run = async () => {
  const exe = findChrome();
  if (!exe) { console.warn('[cases] Chrome не найден'); process.exit(0); }
  const browser = await puppeteer.launch({
    executablePath: exe, headless: 'new', args: ['--no-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.setContent('<!doctype html><html><body></body></html>');
    for (const { file, maxW } of targets) {
      const src = path.join(dir, `${file}.jpg`);
      if (!existsSync(src)) { console.warn(`[cases] нет ${file}.jpg`); continue; }
      const b64 = readFileSync(src).toString('base64');
      const result = await page.evaluate(async (dataUrl, maxW, q) => {
        const img = new Image();
        await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = dataUrl; });
        const scale = Math.min(1, maxW / img.naturalWidth);
        const w = Math.round(img.naturalWidth * scale);
        const h = Math.round(img.naturalHeight * scale);
        const cv = document.createElement('canvas');
        cv.width = w; cv.height = h;
        const ctx = cv.getContext('2d');
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, w, h);
        return { url: cv.toDataURL('image/webp', q), w, h };
      }, `data:image/jpeg;base64,${b64}`, maxW, QUALITY);
      const buf = Buffer.from(result.url.split(',')[1], 'base64');
      writeFileSync(path.join(dir, `${file}.webp`), buf);
      const before = readFileSync(src).length;
      console.log(`[cases] ${file}.webp ${result.w}×${result.h} — ${Math.round(buf.length / 1024)} КБ (было ${Math.round(before / 1024)} КБ JPG)`);
    }
  } finally {
    await browser.close();
  }
};

run().catch((e) => { console.warn('[cases] ошибка:', e.message); process.exit(1); });
