import { PACKAGES } from '../data/content';
import { useReveal } from '../hooks/useReveal';
import { scrollToId } from '../utils/scroll';
import './Packages.css';

export default function Packages() {
  const scope = useReveal();
  const go = (href) => scrollToId(href);

  return (
    <section className="section packages" id="packages" ref={scope}>
      <div className="container">
        <div className="pkg-head">
          <div>
            <div className="section-eyebrow reveal">Тарифы</div>
            <h2 className="section-title reveal" data-delay="0.05">
              Пакеты <span className="muted">под ваш </span>
              <span className="gradient-text">масштаб</span>
            </h2>
          </div>
        </div>

        <div className="pkg-grid">
          {PACKAGES.map((p, i) => (
            <article
              className={`pkg reveal ${p.highlight ? 'pkg-hl' : ''}`}
              key={p.name}
              data-delay={(i * 0.05).toFixed(2)}
              style={{ '--pkg-accent': p.accent }}
            >
              {p.highlight && <span className="pkg-pop">Хит</span>}
              <div className="pkg-name">{p.name}</div>
              <div className="pkg-price">{p.price}</div>
              <ul className="pkg-features">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <button className="pkg-btn magnetic" onClick={() => go('#contact')}>
                Выбрать
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
