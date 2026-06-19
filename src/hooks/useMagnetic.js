import { useEffect } from 'react';
import { gsap } from 'gsap';

// Магнитное притяжение для всех элементов с классом .magnetic
export function useMagnetic(ready) {
  useEffect(() => {
    if (!ready) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const els = Array.from(document.querySelectorAll('.magnetic'));
    const cleanups = els.map((el) => {
      const strength = parseFloat(el.dataset.magnetic || 0.35);
      const move = (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        gsap.to(el, { x: x * strength, y: y * strength, duration: 0.6, ease: 'power3.out' });
      };
      const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      el.addEventListener('mousemove', move);
      el.addEventListener('mouseleave', leave);
      return () => {
        el.removeEventListener('mousemove', move);
        el.removeEventListener('mouseleave', leave);
      };
    });
    return () => cleanups.forEach((c) => c());
  }, [ready]);
}
