import { Suspense, lazy } from 'react';

const HeroScene = lazy(() => import('./HeroScene'));
import { MARQUEE_SERVICES } from '../data/content';
import { scrollToId } from '../utils/scroll';
import './Hero.css';

export default function Hero() {
  const go = (href) => scrollToId(href);

  return (
    <section className="hero" id="hero">
      <div className="hero-scene">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
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
            Мы не придумываем кампании — мы строим{' '}
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
