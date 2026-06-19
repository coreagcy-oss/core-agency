import { useEffect, useState } from 'react';
import { NAV_LINKS, TELEGRAM_URL } from '../data/content';
import { scrollToId } from '../utils/scroll';
import { asset } from '../utils/asset';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
  }, [open]);

  const go = (e, href) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(href);
  };

  return (
    <>
      <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <a href="#hero" className="nav-logo magnetic" onClick={(e) => go(e, '#hero')}>
          <img src={asset('logo.svg')} className="nav-logo-mark" alt="Core Agency" />
          Core<span>Agency</span>
        </a>

        <nav className="nav-links">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={(e) => go(e, l.href)}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav-right">
          <a
            href="#contact"
            className="btn btn-primary nav-cta magnetic"
            onClick={(e) => go(e, '#contact')}
          >
            Обсудить проект
          </a>
          <button
            className={`nav-burger ${open ? 'active' : ''}`}
            aria-label="Меню"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`nav-overlay ${open ? 'open' : ''}`}>
        <nav className="nav-overlay-links">
          {NAV_LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              style={{ transitionDelay: `${0.05 + i * 0.05}s` }}
              onClick={(e) => go(e, l.href)}
            >
              <span className="ov-num">0{i + 1}</span>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav-overlay-foot">
          <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">
            Написать в Telegram →
          </a>
          <span>ПОЛНЫЙ ЦИКЛ. РЕЗУЛЬТАТЫ.</span>
        </div>
      </div>
    </>
  );
}
