import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const d = dot.current;
    const r = ring.current;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf;

    const move = (e) => {
      mx = e.clientX;
      my = e.clientY;
      d.style.transform = `translate(${mx}px, ${my}px)`;
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      r.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    const over = (e) => {
      if (e.target.closest('a, button, .magnetic, input, textarea, [data-cursor="hover"]')) {
        r.classList.add('hover');
      }
    };
    const out = (e) => {
      if (e.target.closest('a, button, .magnetic, input, textarea, [data-cursor="hover"]')) {
        r.classList.remove('hover');
      }
    };
    const leave = () => {
      d.classList.add('hidden');
      r.classList.add('hidden');
    };
    const enter = () => {
      d.classList.remove('hidden');
      r.classList.remove('hidden');
    };

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', over);
    document.addEventListener('mouseout', out);
    document.addEventListener('mouseleave', leave);
    document.addEventListener('mouseenter', enter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', over);
      document.removeEventListener('mouseout', out);
      document.removeEventListener('mouseleave', leave);
      document.removeEventListener('mouseenter', enter);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" />
      <div ref={dot} className="cursor-dot" />
    </>
  );
}
