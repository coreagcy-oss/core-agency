import { useEffect, useRef, useState } from 'react';
import { asset } from '../utils/asset';
import './SlotGame.css';

// 'LOGO' — фирменный символ Core Agency. Выигрыш только при трёх логотипах.
const SYMBOLS = ['🎯', '🚀', '💎', '⚡', '🔥', '📈', 'LOGO'];
const PRIZES = [
  { code: 'CORE-AUDIT', title: 'Бесплатный аудит маркетинга' },
  { code: 'CORE-MANUALS', title: '3 полезных мануала' },
  { code: 'CORE-SCRIPT', title: 'Скрипт продаж на высокий чек' },
];
const MAX_TRIES = 3;
// Реальный, низкий шанс выигрыша
const WIN_CHANCE = 0.12;

// Звуковая линейка игрового автомата
const SFX = {
  lever: asset('audio/lever.mp3'), // нажатие рычага/кнопки
  spin: asset('audio/spin.mp3'), // кручение механизма (барабаны)
  win: asset('audio/win.mp3'), // джекпот — выигрыш 3 логотипов
};

// Параметры «колеса»: длина ленты и тайминги остановки барабанов
const SPIN_EASE = 'cubic-bezier(0.06, 0.7, 0.12, 1)'; // быстрый старт → плавная остановка
const REEL_BASE_LEN = 26; // сколько символов прокручивается на первом барабане
const REEL_LEN_STEP = 7; // каждый следующий барабан крутит дольше
const REEL_BASE_MS = 1900; // длительность остановки первого барабана
const REEL_STEP_MS = 520; // задержка остановки каждого следующего

function randSym() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function Symbol({ value }) {
  if (value === 'LOGO') {
    return <img className="slot-logo" src={asset('logo.svg')} alt="Core Agency" draggable="false" />;
  }
  return <span className="slot-sym">{value}</span>;
}

export default function SlotGame() {
  // Каждый барабан — это лента символов, которая прокручивается вверх.
  const [strips, setStrips] = useState([['LOGO'], ['LOGO'], ['LOGO']]);
  const [offsets, setOffsets] = useState([0, 0, 0]); // px сдвига ленты вверх
  const [durations, setDurations] = useState([0, 0, 0]); // c — длительность прокрутки

  const [tries, setTries] = useState(MAX_TRIES);
  const [spinning, setSpinning] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | win | lose | over
  const [prize, setPrize] = useState(null);
  const [copied, setCopied] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const reelsRef = useRef(null);
  const restRef = useRef(['LOGO', 'LOGO', 'LOGO']); // текущие видимые символы
  const timers = useRef([]);

  // --- Звуковая линейка автомата (реальные сэмплы) ---
  const sndRef = useRef({});
  const soundOnRef = useRef(true);
  useEffect(() => {
    soundOnRef.current = soundOn;
  }, [soundOn]);

  useEffect(() => {
    const map = {};
    Object.entries(SFX).forEach(([k, src]) => {
      const a = new Audio(src);
      a.preload = 'auto';
      map[k] = a;
    });
    map.spin.loop = true; // механизм крутится всё время прокрутки
    map.lever.volume = 0.75;
    map.spin.volume = 0.5;
    map.win.volume = 0.8;
    sndRef.current = map;
    return () => Object.values(map).forEach((a) => a.pause());
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const play = (key) => {
    if (!soundOnRef.current) return;
    const a = sndRef.current[key];
    if (!a) return;
    try {
      a.currentTime = 0;
      a.play().catch(() => {});
    } catch {
      /* noop */
    }
  };
  const stopSound = (key) => {
    const a = sndRef.current[key];
    if (!a) return;
    a.pause();
    try {
      a.currentTime = 0;
    } catch {
      /* noop */
    }
  };

  const toggleSound = () => {
    setSoundOn((v) => {
      const next = !v;
      if (!next) Object.values(sndRef.current).forEach((a) => a.pause());
      return next;
    });
  };

  // высота одной ячейки барабана = высота окна барабана (квадрат)
  const cellHeight = () => {
    const reel = reelsRef.current?.querySelector('.slot-reel');
    return reel ? reel.clientHeight : 120;
  };

  const spin = () => {
    if (spinning || tries <= 0 || status === 'win') return;
    setSpinning(true);
    setStatus('idle');
    timers.current.forEach(clearTimeout);
    timers.current = [];

    play('lever');
    const spinTimer = setTimeout(() => play('spin'), 160);

    const willWin = Math.random() < WIN_CHANCE;
    let targets;
    if (willWin) {
      targets = ['LOGO', 'LOGO', 'LOGO'];
    } else {
      let a = randSym();
      let b = randSym();
      let c = randSym();
      while (a === 'LOGO' && b === 'LOGO' && c === 'LOGO') c = '🎯';
      targets = [a, b, c];
    }

    const cellH = cellHeight();

    // строим ленты: индекс 0 = текущий видимый символ (бесшовный старт),
    // дальше случайные символы, в конце — целевой символ
    const newStrips = targets.map((target, i) => {
      const len = REEL_BASE_LEN + i * REEL_LEN_STEP;
      const middle = Array.from({ length: len }, () => randSym());
      return [restRef.current[i], ...middle, target];
    });

    // мгновенно ставим ленты в исходное положение (без анимации)
    setStrips(newStrips);
    setDurations([0, 0, 0]);
    setOffsets([0, 0, 0]);

    // после сброса в исходное положение запускаем прокрутку
    // с разной длительностью на каждый барабан (поздние крутятся дольше)
    const startTimer = setTimeout(() => {
      setDurations(newStrips.map((_, i) => (REEL_BASE_MS + i * REEL_STEP_MS) / 1000));
      setOffsets(newStrips.map((s) => (s.length - 1) * cellH));
    }, 40);

    // момент полной остановки последнего барабана
    const totalMs = REEL_BASE_MS + 2 * REEL_STEP_MS + 80;
    const endTimer = setTimeout(() => {
      clearTimeout(spinTimer);
      stopSound('spin');
      restRef.current = targets;
      const remaining = tries - 1;
      setTries(remaining);

      if (willWin) {
        setPrize(PRIZES[Math.floor(Math.random() * PRIZES.length)]);
        setStatus('win');
        play('win');
      } else {
        setStatus(remaining <= 0 ? 'over' : 'lose');
      }
      setSpinning(false);
    }, totalMs);

    timers.current = [spinTimer, startTimer, endTimer];
  };

  const copy = () => {
    if (!prize) return;
    navigator.clipboard?.writeText(prize.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const btnLabel = spinning
    ? 'КРУТИМ...'
    : status === 'win'
    ? 'ВЫ ВЫИГРАЛИ!'
    : tries <= 0
    ? 'ПОПЫТКИ ЗАКОНЧИЛИСЬ'
    : 'КРУТИТЬ';

  return (
    <div className="slot">
      <button
        className={`slot-music ${soundOn ? 'on' : ''}`}
        onClick={toggleSound}
        aria-label={soundOn ? 'Выключить звук' : 'Включить звук'}
        title={soundOn ? 'Выключить звук' : 'Включить звук'}
      >
        {soundOn ? '🔊' : '🔇'}
      </button>

      <div className="slot-head">
        <div className="slot-eyebrow">🎰 Бонус-игра</div>
        <h3 className="slot-title">Попытай свою удачу!</h3>
        <p className="slot-subtitle">Собери 3 наших логотипа и забери промокод на подарок</p>
      </div>

      <div
        className={`slot-reels ${spinning ? 'spinning' : ''} ${status === 'win' ? 'win' : ''}`}
        ref={reelsRef}
      >
        {strips.map((strip, i) => (
          <div className="slot-reel" key={i}>
            <div
              className="slot-strip"
              style={{
                transform: `translateY(-${offsets[i]}px)`,
                transition: durations[i] ? `transform ${durations[i]}s ${SPIN_EASE}` : 'none',
              }}
            >
              {strip.map((s, j) => (
                <div className="slot-cell" key={j}>
                  <Symbol value={s} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {status === 'win' && prize && (
        <div className="slot-result win">
          <div className="slot-result-title">🎉 Три логотипа! Вы выиграли!</div>
          <div className="slot-prize-name">{prize.title}</div>
          <button className={`slot-copy ${copied ? 'done' : ''}`} onClick={copy}>
            {copied ? '✓ СКОПИРОВАНО' : `КОПИРОВАТЬ ПРОМОКОД · ${prize.code}`}
          </button>
          <div className="slot-hint">Введите промокод в форме заявки ниже</div>
        </div>
      )}

      {status === 'lose' && (
        <div className="slot-result">
          <div className="slot-result-title muted-title">Не повезло в этот раз 🙃</div>
          <div className="slot-hint">Нужно 3 логотипа — попробуйте ещё!</div>
        </div>
      )}

      {status === 'over' && (
        <div className="slot-result">
          <div className="slot-result-title muted-title">Попытки закончились</div>
          <div className="slot-hint">
            Не повезло в этот раз. Оставьте заявку ниже — мы всё равно поможем!
          </div>
        </div>
      )}

      {status !== 'win' && (
        <>
          <button className="slot-btn magnetic" onClick={spin} disabled={spinning || tries <= 0}>
            {btnLabel}
          </button>
          <div className="slot-tries">Осталось попыток: {Math.max(tries, 0)}</div>
        </>
      )}
    </div>
  );
}
