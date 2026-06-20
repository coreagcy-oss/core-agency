import { Suspense, lazy, useEffect, useState } from 'react';

const HeroScene = lazy(() => import('./HeroScene'));
import { MARQUEE_SERVICES } from '../data/content';
import { scrollToId } from '../utils/scroll';
import './Hero.css';

export default function Hero() {
  const go = (href) => scrollToId(href);

  // Тяжёлая 3D-сцена на Three.js (~215 КБ + ~10 с работы потока) монтируется
  // только ПОСЛЕ первой отрисовки и в момент простоя браузера, чтобы не
  // блокировать загрузку, LCP и интерактивность. До этого виден фоновый
  // градиент .hero-scene-glow — внешне первый экран не меняется.
  const [show3D, setShow3D] = useState(false);
  useEffect(() => {
    const ric =
      window.requestIdleCallback || ((cb) => window.setTimeout(() => cb(), 1));
    let id;
    const start = () => {
      id = ric(() => setShow3D(true), { timeout: 2500 });
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => {
      if (id && window.cancelIdleCallback) window.cancelIdleCallback(id);
      window.removeEventListener('load', start);
    };
  }, []);

  return (
    <section className="hero" id="hero">
      <div className="hero-scene">
        <Suspense fallback={null}>{show3D && <HeroScene />}</Suspense>
        <div className="hero-scene-glow" />
      </div>

      <div className="container hero-inner">
        <h1 className="hero-title">
          Растим прибыль
          <br />
          через <span className="gradient-text">бренд</span>
        </h1>

        <blockquote className="hero-quote">
          <p className="hero-quote-main">
            Мы не придумываем компании — мы строим{' '}
            <strong>системы, которые продают без нас</strong>
          </p>
        </blockquote>

        <div className="hero-cta">
          <button className="btn btn-primary magnetic" onClick={() => go('#contact')}>
            Обсудить проект
          </button>
          <button className="btn btn-ghost magnetic" onClick={() => go('#services')}>
            Наши услуги
          </button>
        </div>

        <div className="hero-badge badge">
          <span className="pulse-dot" />
          ПРИНИМАЕМ НОВЫЕ ПРОЕКТЫ
        </div>
      </div>

      <button className="hero-scroll" onClick={() => go('#stats')} aria-label="Листайте вниз">
        <span className="hero-scroll-text">ЛИСТАЙТЕ ВНИЗ</span>
        <span className="hero-scroll-line" />
      </button>

      <div className="hero-marquee marquee" aria-hidden="true">
        <div className="marquee__track">
          {MARQUEE_SERVICES.map((s, i) => (
            <span className="hero-marquee-item" key={`a${i}`}>
              {s}
              <span className="hero-marquee-star">✦</span>
            </span>
          ))}
        </div>
        <div className="marquee__track" aria-hidden="true">
          {MARQUEE_SERVICES.map((s, i) => (
            <span className="hero-marquee-item" key={`b${i}`}>
              {s}
              <span className="hero-marquee-star">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
