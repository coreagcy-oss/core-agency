import { useState } from 'react';
import {
  TELEGRAM_URL,
  TELEGRAM_HANDLE,
  AGENCY_EMAIL,
  AGENCY_PHONE_DISPLAY,
  AGENCY_PHONE_TEL,
} from '../data/content';
import { scrollToId } from '../utils/scroll';
import { asset } from '../utils/asset';
import LegalModal from './LegalModal';
import './Footer.css';

export default function Footer() {
  const [legal, setLegal] = useState(null); // 'privacy' | 'consent' | null

  const go = (e, href) => {
    e.preventDefault();
    scrollToId(href);
  };

  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#hero" className="footer-logo" onClick={(e) => go(e, '#hero')}>
              <img src={asset('logo.svg')} className="nav-logo-mark" alt="Core Agency" />
              Core<span>Agency</span>
            </a>
            <p className="footer-tagline">
              Агентство полного цикла. Растим прибыль через бренд.
            </p>
          </div>

          <div className="footer-contacts">
            <a href={`tel:${AGENCY_PHONE_TEL}`}>{AGENCY_PHONE_DISPLAY}</a>
            <a href={`mailto:${AGENCY_EMAIL}`}>{AGENCY_EMAIL}</a>
            <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">
              Telegram | {TELEGRAM_HANDLE}
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 Core Agency · Агентство полного цикла</p>
          <div className="footer-legal">
            <button type="button" onClick={() => setLegal('privacy')}>
              Политика конфиденциальности
            </button>
            <button type="button" onClick={() => setLegal('consent')}>
              Согласие на обработку персональных данных
            </button>
          </div>
        </div>
      </div>

      {legal && <LegalModal doc={legal} onClose={() => setLegal(null)} />}
    </footer>
  );
}
