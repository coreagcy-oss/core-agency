import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './Preloader.css';

export default function Preloader({ onComplete }) {
  const root = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      onComplete?.();
    };

    // Анимация интро крутится через GSAP/requestAnimationFrame. Если страница
    // открыта в фоновой/неактивной вкладке, rAF тормозится почти до нуля —
    // таймлайн застывает, и сайт навсегда висит на прелоадере. Жёсткий таймаут
    // гарантирует, что контент покажется в любом случае.
    const fallback = setTimeout(finish, 2600);

    const obj = { v: 0 };
    const tl = gsap.timeline({
      onComplete: finish,
    });
    // Длительности сокращены, чтобы контент открывался быстрее (лучше LCP),
    // сохраняя тот же визуальный сценарий интро.
    tl.to(obj, {
      v: 100,
      duration: 1.1,
      ease: 'power2.inOut',
      onUpdate: () => setCount(Math.round(obj.v)),
    });
    tl.to('.pl-bar', { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, 0);
    tl.to('.pl-content', { y: -40, opacity: 0, duration: 0.5, ease: 'power3.in' }, '+=0.1');
    tl.to(
      root.current,
      {
        yPercent: -100,
        duration: 0.7,
        ease: 'power4.inOut',
      },
      '-=0.1'
    );
    return () => {
      clearTimeout(fallback);
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div className="preloader" ref={root}>
      <div className="pl-content">
        <div className="pl-logo">
          <span className="pl-core">CORE</span>
          <span className="pl-agency">AGENCY</span>
        </div>
        <div className="pl-tag">АГЕНТСТВО ПОЛНОГО ЦИКЛА</div>
        <div className="pl-bar-wrap">
          <div className="pl-bar" />
        </div>
      </div>
      <div className="pl-count">{String(count).padStart(3, '0')}</div>
    </div>
  );
}
