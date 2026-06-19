import { useEffect, useRef } from 'react';

// Появление элементов .reveal через IntersectionObserver — надёжно работает
// независимо от способа прокрутки (нативный скролл, Lenis, anchor-переходы).
export function useReveal() {
  const scope = useRef(null);

  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    const targets = el.querySelectorAll('.reveal');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach((t) => t.classList.add('in'));
      return;
    }

    targets.forEach((t) => {
      const delay = parseFloat(t.dataset.delay || 0);
      t.style.transitionDelay = `${delay}s`;
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return scope;
}
