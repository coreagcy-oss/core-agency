import { ADVANTAGES } from '../data/content';
import { useReveal } from '../hooks/useReveal';
import './Advantages.css';

export default function Advantages() {
  const scope = useReveal();
  const count = ADVANTAGES.length;

  return (
    <section className="section advantages" id="advantages" ref={scope}>
      <div className="container">
        <div className="adv-head">
          <div className="section-eyebrow reveal">Наши преимущества</div>
          <h2 className="section-title reveal" data-delay="0.05">
            Почему{' '}
            <span className="muted">
              выбирают{' '}
              <span className="adv-em">
                именно
                <svg
                  className="adv-underline"
                  viewBox="0 0 220 38"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path className="adv-ul adv-ul-1" d="M5 16C52 27 150 28 215 11" pathLength="1" />
                  <path className="adv-ul adv-ul-2" d="M9 30C60 37 156 36 211 24" pathLength="1" />
                </svg>
              </span>{' '}
              нас
            </span>
          </h2>
        </div>

        <div className="adv-ring reveal" data-delay="0.12" style={{ '--adv-count': count }}>
          <div className="adv-rotor">
            <span className="adv-rim" aria-hidden="true" />
            {ADVANTAGES.map((_, i) => (
              <span className="adv-spoke" key={`s${i}`} style={{ '--i': i }} aria-hidden="true" />
            ))}
            {ADVANTAGES.map((a, i) => (
              <div className="adv-node" key={i} style={{ '--i': i }}>
                <div className="adv-bubble">
                  <h3 className="adv-title">{a.title}</h3>
                  <p className="adv-desc">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="adv-hub">
            <span className="adv-hub-lead">Над амбициями вашего проекта будет работать</span>
            <span className="adv-hub-num gradient-text">10+</span>
            <span className="adv-hub-text">
              профессионалов
              <br />
              в своей нише
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
