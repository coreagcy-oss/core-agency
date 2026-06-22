import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROCESS } from '../data/content';
import './Process.css';

gsap.registerPlugin(ScrollTrigger);

export default function Process() {
  const pin = useRef(null);
  const track = useRef(null);
  const trackWrap = useRef(null);
  const planets = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // Десктоп: горизонтальный pinned-скролл
    mm.add('(min-width: 921px)', () => {
      const el = track.current;
      const getScroll = () => Math.max(0, el.scrollWidth - pin.current.clientWidth);

      const tween = gsap.to(el, {
        x: () => -getScroll(),
        ease: 'none',
        scrollTrigger: {
          trigger: pin.current,
          start: 'top top',
          end: () => '+=' + getScroll(),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const panelEls = gsap.utils.toArray('.proc-panel');

      panelEls.forEach((panel, i) => {
        // подсветка активной панели в центре трека
        ScrollTrigger.create({
          trigger: panel,
          containerAnimation: tween,
          start: 'left 78%',
          end: 'right 55%',
          onToggle: (self) => panel.classList.toggle('active', self.isActive),
        });

        // пройденные панели уезжают поочерёдно вверх/вниз и гаснут,
        // когда подходят к левому краю под вводным блоком —
        // вводный заголовок при этом остаётся на месте
        gsap.fromTo(
          panel,
          { yPercent: 0, autoAlpha: 1 },
          {
            yPercent: i % 2 === 0 ? -135 : 135,
            autoAlpha: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              containerAnimation: tween,
              start: 'left 28%',
              end: 'left -38%',
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      // Дальние планеты дрейфуют медленнее панелей (параллакс),
      // поэтому выглядят как далёкий фон и «проворачиваются» вместе с камерой.
      const planetTween = gsap.to(planets.current, {
        x: () => -getScroll() * 0.4,
        ease: 'none',
        scrollTrigger: {
          trigger: pin.current,
          start: 'top top',
          end: () => '+=' + getScroll(),
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Вводный блок «Клиентский путь» убираем сразу, как только
      // панели 1–2 трогаются с места — гасим его в первые проценты прокрутки.
      const introFade = gsap.to(pin.current, {
        '--proc-intro-op': 0,
        ease: 'none',
        scrollTrigger: {
          trigger: pin.current,
          start: 'top top',
          end: () => '+=' + getScroll() * 0.12,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        planetTween.scrollTrigger && planetTween.scrollTrigger.kill();
        planetTween.kill();
        introFade.scrollTrigger && introFade.scrollTrigger.kill();
        introFade.kill();
        tween.kill();
      };
    });

    // Мобильный: вступительный блок остаётся обычным заголовком сверху,
    // а шаги 01–06 листаются горизонтально (как на ПК), а не вниз.
    // Закрепляем обёртку трека на высоту экрана и сдвигаем трек по X.
    mm.add('(max-width: 920px)', () => {
      const el = track.current;
      const wrap = trackWrap.current;
      const getScroll = () => Math.max(0, el.scrollWidth - wrap.clientWidth);

      const tween = gsap.to(el, {
        x: () => -getScroll(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: () => '+=' + getScroll(),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // подсветка активной панели, когда она в центре экрана
      const panelEls = gsap.utils.toArray('.proc-panel');
      panelEls.forEach((panel) => {
        ScrollTrigger.create({
          trigger: panel,
          containerAnimation: tween,
          start: 'left 85%',
          end: 'right 45%',
          onToggle: (self) => panel.classList.toggle('active', self.isActive),
        });
      });

      return () => {
        tween.scrollTrigger && tween.scrollTrigger.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="process" id="process">
      <div className="proc-pin" ref={pin}>
        <div className="proc-intro">
          <div className="section-eyebrow">Как мы работаем</div>
          <h2 className="proc-h2">
            Клиентский <span className="muted">путь</span>
          </h2>
          <blockquote className="proc-quote">
            Мы создали понятный для вас путь сотрудничества —{' '}
            <strong>прозрачный и надёжный</strong>
          </blockquote>
          <span className="proc-scroll-hint">
            Листайте дальше <span className="proc-scroll-arrow">→</span>
          </span>
        </div>

        <div className="proc-planets" ref={planets} aria-hidden="true">
          <span className="proc-planet proc-planet--saturn">
            <span className="proc-planet-ring" />
          </span>
          <span className="proc-planet proc-planet--mars" />
          <span className="proc-planet proc-planet--neptune" />
          <span className="proc-planet proc-planet--gas" />
        </div>

        <div className="proc-track-wrap" ref={trackWrap}>
          <div className="proc-track" ref={track}>
            {PROCESS.map((p) => {
              const [firstWord, ...restWords] = p.title.split(' ');
              return (
                <article className="proc-panel" key={p.step}>
                  <span className="proc-panel-step">{p.step}</span>
                  <div className="proc-panel-body">
                    <h3 className="proc-panel-title">
                      <span className="proc-panel-title-main">{firstWord}</span>
                      {restWords.length > 0 && (
                        <span className="proc-panel-title-sub">{restWords.join(' ')}</span>
                      )}
                    </h3>
                    <p className="proc-panel-desc">{p.desc}</p>
                  </div>
                  <span className="proc-panel-glow" aria-hidden="true" />
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
