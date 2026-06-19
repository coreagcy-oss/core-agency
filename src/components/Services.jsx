import { DIRECTIONS } from '../data/content';
import { useReveal } from '../hooks/useReveal';
import { scrollToId } from '../utils/scroll';
import ServiceIcon from './ServiceIcon';
import './Services.css';

// Подсвечиваем внутри описания нужные слова/числа.
// Числа (содержат цифру) — отдельный «фактовый» стиль, остальное — словесный акцент.
function renderDesc(desc, emphasis = []) {
  if (!emphasis.length) return desc;
  const escaped = emphasis.map((e) => e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp(`(${escaped.join('|')})`, 'g');
  return desc.split(re).map((part, i) =>
    emphasis.includes(part) ? (
      <strong key={i} className={/\d/.test(part) ? 'dir-num' : 'dir-em'}>
        {part}
      </strong>
    ) : (
      part
    )
  );
}

export default function Services() {
  const scope = useReveal();
  const go = (href) => scrollToId(href);

  return (
    <section className="section services" id="services" ref={scope}>
      <div className="container">
        <div className="services-head">
          <div>
            <div className="section-eyebrow reveal">На чём мы специализируемся</div>
            <h2 className="section-title reveal" data-delay="0.05">
              Наши <span className="muted">направления</span>
            </h2>
          </div>
        </div>

        <div className="dir-list">
          {DIRECTIONS.map((d, i) => (
            <article
              className="dir reveal"
              key={d.num}
              data-delay={(i * 0.06).toFixed(2)}
              style={{ '--dir-accent': d.accent }}
            >
              <div className="dir-icon" aria-hidden="true">
                <ServiceIcon index={i} />
              </div>
              <div className="dir-main">
                <h3 className="dir-title">
                  <span className="dir-title-name">{d.title}</span>
                  {d.isNew && <span className="badge gold dir-new">Флагман</span>}
                </h3>
                <p className="dir-desc">
                  <span className="dir-desc-dash" aria-hidden="true">—</span>{' '}
                  {renderDesc(d.desc, d.emphasis)}
                </p>
                {d.highlight && (
                  <p className="dir-highlight">
                    <span className="dir-highlight-dash" aria-hidden="true">—</span>
                    {d.highlight}
                  </p>
                )}
                <div className="dir-tags">
                  {d.tags.map((t) => (
                    <span className="dir-tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <button
                className="dir-cta magnetic"
                onClick={() => go('#contact')}
                aria-label={`Начать проект: ${d.title}`}
              >
                <span>{d.isNew ? 'Узнать больше' : 'Начать проект'}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 17L17 7M17 7H8M17 7V16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className="dir-glow" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
