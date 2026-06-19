import { useEffect, useRef, useState } from 'react';
import { asset } from '../utils/asset';
import './MusicToggle.css';

/**
 * Фоновая музыка сайта с мягким управлением.
 * Браузеры блокируют автозапуск со звуком — поэтому пробуем запустить
 * при первом жесте пользователя и всегда даём явную кнопку вкл/выкл.
 */
export default function MusicToggle() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.32;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    // попытка запустить при первом взаимодействии
    const tryStart = () => {
      if (userPaused.current) return cleanup();
      audio.play().then(cleanup).catch(() => {});
    };
    const cleanup = () => {
      window.removeEventListener('pointerdown', tryStart);
      window.removeEventListener('keydown', tryStart);
      window.removeEventListener('wheel', tryStart);
    };
    window.addEventListener('pointerdown', tryStart, { once: false });
    window.addEventListener('keydown', tryStart, { once: false });
    window.addEventListener('wheel', tryStart, { once: false, passive: true });

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      cleanup();
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      userPaused.current = false;
      audio.play().catch(() => {});
    } else {
      userPaused.current = true;
      audio.pause();
    }
  };

  return (
    <>
      <audio ref={audioRef} src={asset('audio/site-music.mp3')} loop preload="auto" />
      <button
        className={`music-toggle magnetic ${playing ? 'is-playing' : ''}`}
        onClick={toggle}
        aria-label={playing ? 'Выключить музыку' : 'Включить музыку'}
        title={playing ? 'Выключить музыку' : 'Включить музыку'}
      >
        <span className="music-bars" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </span>
      </button>
    </>
  );
}
