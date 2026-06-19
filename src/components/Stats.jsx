import { useEffect, useRef, useState } from 'react';
import { STATS } from '../data/content';
import './Stats.css';

function Counter({ value, suffix, prefix }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !done.current) {
            done.current = true;
            const start = performance.now();
            const dur = 1600;
            const tick = (now) => {
              const p = Math.min((now - start) / dur, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              setN(Math.round(eased * value));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.5 }
    );
    if (el) io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {prefix}
      {n}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="stats" id="stats">
      <div className="container">
        <div className="stats-head">
          <h2 className="stats-title">
            Цифры, которыми <span className="gradient-text">мы гордимся</span>
          </h2>
        </div>
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <div className="stat" key={i}>
              <div className="stat-value">
                <Counter value={s.value} suffix={s.suffix} prefix={s.prefix} />
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
