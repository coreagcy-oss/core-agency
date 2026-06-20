# Core Agency — контекст проекта (хендофф для нового чата)

> Скопируй этот файл целиком в новый чат, чтобы быстро ввести ассистента в курс дела.

## О проекте
- **Core Agency** — иммерсивный сайт маркетингового агентства полного цикла, на русском языке.
- Путь: `/Users/filip/core-agency`
- Стек: **Vite + React 18**, **Three.js** (@react-three/fiber + drei), **GSAP + ScrollTrigger**, **Lenis** (плавный скролл).
- Палитра: оранжево-чёрная (акцент `#FE9817`).
- Хостинг: **GitHub Pages**, репозиторий `coreagcy-oss/core-agency`, ветка `main`, авто-деплой при пуше.
- Домен: **core-agency.pro** (кастомный, CDN + HTTPS от GitHub Pages).

## Постоянные правила (важно соблюдать)
1. **Не спрашивать разрешения при внесении правок в проект** — код / CSS / контент править, билдить, коммитить и пушить автономно.
2. **После КАЖДОГО изменения сайта → commit + push в `main`**.
3. **Сложные фичи (например блог) — сначала план, потом реализация.**
4. **Всё общение на русском.**
5. Технически «пользовательские» действия (регистрация аккаунтов, пароли, DNS, настройки в кабинетах вебмастера) ассистент сделать не может — их выполняет владелец.

## Что уже сделано

### Производительность (цель — загрузка за 2–3 секунды) ✅
- Lighthouse (mobile): **Performance 96**, FCP 1.3s, LCP 1.3s, TBT 0ms, CLS 0.007.
- Google Fonts подключены **неблокирующе** (`rel=preload as=style onload=...` + `<noscript>` фолбэк + `display=swap`). Веса урезаны: Unbounded 400;600;700;800, Golos 400;500;600.
- Музыка (`site-music.mp3`, 4.27 МБ) — `preload="none"`, грузится только по первому действию пользователя (MusicToggle.jsx).
- Логотип `logo.svg` сжат SVGO 146КБ → 51КБ (viewBox восстановлен).
- Кейс-картинки переведены в **WebP**: было ~1.5 МБ JPG → стало ~412 КБ. Проставлены `width/height` (защита от CLS) и `loading="lazy"`.

### SEO / иконки / брендинг ✅
- `<title>`: `CORE — премиальный маркетинг 22 века | маркетинговое агентство полного цикла: реклама, брендинг, продвижение в Москве и СПб`
- og:title / twitter:title = `CORE — премиальный маркетинг 22 века`.
- **Favicon** — оригинальный логотип на чёрном **круглом** фоне. Сгенерированы PNG (256, 96, apple-touch 180) + SVG для надёжного подхвата в Google:
  ```html
  <link rel="icon" type="image/png" sizes="256x256" href="/favicon-256.png" />
  <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96.png" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  ```
  ⚠️ Google обновляет фавикон в выдаче по своему графику (от нескольких дней до недель).
- Логотип в **прелоадере** над надписью CORE AGENCY — в белой закруглённой рамке (ПК + мобилка), проверено скриншотами.

### Что НЕ чинится кодом
- PageSpeed-аудит «cache policy» (`Cache-Control: max-age=600`) — ограничение GitHub Pages, переопределить нельзя. Решение на будущее — поставить перед доменом **Cloudflare**.

## Отложенные задачи
- **Блог на сайте** из Telegram-постов (40+ подписчиков, 10–15 постов-статей). Требует плана перед реализацией; статьи добавить в `sitemap.xml`.
- **Карточки бизнеса**: Яндекс.Бизнес (yandex.ru/sprav), Google Business (business.google.com), 2ГИС. Можно подготовить тексты.
- **Cloudflare** перед доменом для кэша/скорости.
- На стороне владельца: запросить индексацию в GSC и Яндекс.Вебмастер, отправить sitemap.xml.

## Полезные команды
```bash
cd /Users/filip/core-agency
npm run build                      # сборка + prerender (postbuild)
node scripts/make-favicon.mjs      # перегенерировать PNG-фавиконы из favicon.svg
node scripts/convert-cases.mjs     # пересжать кейс-картинки JPG → WebP
```

## Ключевые файлы
- `index.html` — мета, title, шрифты, фавиконы.
- `src/components/Preloader.jsx` / `Preloader.css` — интро-прелоадер с логотипом.
- `src/components/MusicToggle.jsx` — аудио (`preload="none"`).
- `src/components/Cases.jsx` + `src/data/content.js` — кейсы (WebP, w/h).
- `src/utils/asset.js` — `asset(p)` с учётом `BASE_URL` (= `/core-agency/`).
- `scripts/make-favicon.mjs`, `scripts/convert-cases.mjs`, `scripts/prerender.mjs`.
- `public/logo.svg`, `public/favicon.svg`, `public/favicon-256.png`, `public/favicon-96.png`, `public/apple-touch-icon.png`.
- `public/robots.txt`, `public/sitemap.xml`.

## Контакты на сайте
- Email: coreagcy@gmail.com
- Телефон: +7 995 628 51 54
- Telegram: t.me/filbaki (@filbaki)
- Портфолио: t.me/coreworkspace (@coreworkspace)
- География: Москва / СПб
