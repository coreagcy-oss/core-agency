// Единая точка прокрутки к секции: использует Lenis, если он инициализирован,
// иначе откатывается к нативному scrollIntoView.
export function scrollToId(href) {
  const target = document.querySelector(href);
  if (!target) return;
  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(target, { offset: 0, duration: 1.2 });
  } else {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}
