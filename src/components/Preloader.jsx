import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './Preloader.css';

export default function Preloader({ onComplete }) {
  const root = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const obj = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => onComplete?.(),
    });
    tl.to(obj, {
      v: 100,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => setCount(Math.round(obj.v)),
    });
    tl.to('.pl-bar', { scaleX: 1, duration: 2, ease: 'power2.inOut' }, 0);
    tl.to('.pl-content', { y: -40, opacity: 0, duration: 0.6, ease: 'power3.in' }, '+=0.15');
    tl.to(
      root.current,
      {
        yPercent: -100,
        duration: 0.9,
        ease: 'power4.inOut',
      },
      '-=0.1'
    );
    return () => tl.kill();
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
