// Возвращает путь к файлу из public/ с учётом базового пути сборки
// (на GitHub Pages base = '/core-agency/'). Без него ассеты ломаются на проде.
export const asset = (p) => `${import.meta.env.BASE_URL}${String(p).replace(/^\//, '')}`;
