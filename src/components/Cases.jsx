import { CASES } from '../data/content';
import { useReveal } from '../hooks/useReveal';
import './Cases.css';

export default function Cases() {
  const scope = useReveal();

  return (
    <section className="section cases" id="cases" ref={scope}>
      <div className="container">
        <div className="cases-head">
          <div className="section-eyebrow reveal">Наши клиенты</div>
          <h2 className="cases-title section-title reveal" data-delay="0.05">
            <span className="cases-word">Кейсы</span> <span className="gradient-text">агентства</span>
          </h2>
        </div>

        <div className="cases-gallery">
          {CASES.map((c, i) => (
            <figure
              className={`case reveal ${c.wide ? 'case-wide' : ''}`}
              key={c.name}
              data-delay={(i * 0.06).toFixed(2)}
            >
              <div className="case-frame">
                <img src={c.img} alt={c.name} loading="lazy" />
              </div>
              <figcaption className="case-cap">
                <span className="case-cap-num-wrap">
                  <span className="case-cap-num gradient-text">{c.metric}</span>
                  {c.circle && (
                    <svg
                      className="case-cap-circle"
                      viewBox="0 0 240 110"
                      fill="none"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path
                        className="case-cap-circle-path"
                        d="M30 62 C 26 28, 100 16, 146 20 C 210 26, 228 50, 212 74 C 196 100, 120 108, 68 99 C 26 92, 14 64, 34 40"
                        stroke="var(--accent2)"
                        strokeWidth="3.4"
                        strokeLinecap="round"
                        pathLength="1"
                      />
                    </svg>
                  )}
                </span>
                <span className="case-cap-name">{c.name}</span>
                <span className="case-cap-sub">{c.sub}</span>
              </figcaption>
            </figure>
          ))}
        </div>

      </div>
    </section>
  );
}
