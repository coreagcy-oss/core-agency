import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollThread.css';

gsap.registerPlugin(ScrollTrigger);

// элементы, при наведении на которые шар «преломляется» (тускнеет до еле заметной точки)
const SOLID =
  'h1,h2,h3,h4,p,a,button,img,blockquote,strong,article,figure,li,input,textarea,label,' +
  '.btn,.badge,.pkg,.proc-panel,.proc-intro,.adv-bubble,.adv-hub,.case-frame,.case-cap,' +
  '.slot,.field,.dir,.stat,.cases-arrow-curve,.section-title,.hero-title';

export default function ScrollThread() {
  const wrap = useRef(null);
  const svg = useRef(null);
  const path = useRef(null);
  const lamp = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const el = path.current;
    const svgEl = svg.current;
    const orb = lamp.current;
    const host = wrap.current;
    let len = el.getTotalLength();
    let H = host.offsetHeight || 1;
    let lastVeiled = null;

    const measure = () => {
      len = el.getTotalLength();
      H = host.offsetHeight || 1;
    };

    // ищем точку линии, чья вертикаль совпадает с нужной позицией в документе
    // (y линии монотонно растёт по длине → бинарный поиск)
    const pointAtDocY = (docY) => {
      const targetVbY = Math.max(0, Math.min(1000, (docY / H) * 1000));
      let lo = 0;
      let hi = len;
      for (let i = 0; i < 16; i++) {
        const mid = (lo + hi) * 0.5;
        if (el.getPointAtLength(mid).y < targetVbY) lo = mid;
        else hi = mid;
      }
      return el.getPointAtLength((lo + hi) * 0.5);
    };

    const tick = () => {
      const vh = window.innerHeight;
      const sc = window.scrollY;
      // вертикаль шара зафиксирована около центра экрана + лёгкое «дыхание» на месте,
      // поэтому он никогда не пропадает из виду; вместе со скроллом он едет по линии
      const bob = Math.sin(performance.now() / 900) * 6;
      const orbVpY = vh * 0.5 + bob;
      const docY = sc + orbVpY;

      const pt = pointAtDocY(docY);
      const rect = svgEl.getBoundingClientRect();
      const sx = rect.left + (pt.x / 100) * rect.width;
      orb.style.transform = `translate3d(${sx}px, ${orbVpY}px, 0) translate(-50%, -50%)`;

      // преломление: тускнеет над любым объектом, ярко горит в пустоте
      const under = document.elementFromPoint(sx, orbVpY);
      const veiled = !!(under && under.closest(SOLID));
      if (veiled !== lastVeiled) {
        orb.classList.toggle('is-veiled', veiled);
        lastVeiled = veiled;
      }
    };

    gsap.ticker.add(tick);

    // держим H/len актуальными: высота документа меняется из-за пина
    // «Клиентского пути», подгрузки шрифтов и картинок — иначе шар
    // считает позицию по устаревшей высоте и «улетает» с линии
    measure();
    const t = setTimeout(measure, 400);
    window.addEventListener('load', measure);
    window.addEventListener('resize', measure);
    ScrollTrigger.addEventListener('refresh', measure);

    const ro = new ResizeObserver(measure);
    ro.observe(host);
    if (document.body) ro.observe(document.body);

    return () => {
      clearTimeout(t);
      window.removeEventListener('load', measure);
      window.removeEventListener('resize', measure);
      ScrollTrigger.removeEventListener('refresh', measure);
      ro.disconnect();
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <>
      <div className="scroll-thread" ref={wrap} aria-hidden="true">
        <svg
          ref={svg}
          className="scroll-thread-svg"
          viewBox="0 0 100 1000"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="thread-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent2)" stopOpacity="0.12" />
              <stop offset="20%" stopColor="var(--accent)" stopOpacity="0.6" />
              <stop offset="55%" stopColor="var(--accent2)" stopOpacity="0.55" />
              <stop offset="85%" stopColor="var(--accent)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="var(--accent3)" stopOpacity="0.12" />
            </linearGradient>
            <filter id="thread-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="1.6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* единая непрерывная нить — уходит за края экрана, нигде не обрывается */}
          <path
            ref={path}
            className="scroll-thread-path"
            d="M50 -40
               C 90 60, 92 120, 60 180
               S 6 255, 12 325
               S 80 405, 86 478
               S 28 552, 20 622
               S 82 698, 76 770
               S 22 845, 40 912
               S 72 972, 52 1040"
            stroke="url(#thread-grad)"
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#thread-glow)"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* светящийся шар поверх контента */}
      <div className="scroll-thread-lamp" ref={lamp} aria-hidden="true">
        <span className="scroll-thread-core" />
      </div>
    </>
  );
}
