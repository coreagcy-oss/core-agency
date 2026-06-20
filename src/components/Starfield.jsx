import { useEffect, useRef } from 'react';
import './Starfield.css';

/**
 * Лёгкий глобальный звёздный фон на canvas 2D.
 * Тянется на весь вьюпорт, висит позади контента, не ловит события.
 * Уважает prefers-reduced-motion (рисует статичный кадр без анимации).
 */
export default function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars = [];
    let meteors = [];
    let meteorTimer = 2200; // мс до первого метеора
    let raf = 0;
    let last = 0;

    const spawnMeteor = () => {
      const speed = Math.random() * 0.35 + 0.45; // px/мс
      const ang = (Math.PI / 180) * (Math.random() * 16 + 22); // 22–38° к горизонту
      const ux = -Math.cos(ang); // летит влево-вниз
      const uy = Math.sin(ang);
      meteors.push({
        x: Math.random() * width * 0.75 + width * 0.25,
        y: Math.random() * height * 0.45 - 40,
        ux,
        uy,
        speed,
        len: Math.random() * 130 + 150,
        life: 0,
        ttl: Math.random() * 520 + 1080, // мс
      });
    };

    const drawMeteors = (dt) => {
      meteorTimer -= dt;
      if (meteorTimer <= 0) {
        spawnMeteor();
        meteorTimer = Math.random() * 4200 + 2600;
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.life += dt;
        m.x += m.ux * m.speed * dt;
        m.y += m.uy * m.speed * dt;
        const p = m.life / m.ttl;
        if (p >= 1 || m.x < -m.len || m.y > height + m.len) {
          meteors.splice(i, 1);
          continue;
        }
        const alpha = Math.sin(Math.min(1, p) * Math.PI) * 0.9;
        const tx = m.x - m.ux * m.len;
        const ty = m.y - m.uy * m.len;
        const grad = ctx.createLinearGradient(m.x, m.y, tx, ty);
        grad.addColorStop(0, `rgba(255, 232, 196, ${alpha})`);
        grad.addColorStop(0.35, `rgba(255, 170, 80, ${alpha * 0.5})`);
        grad.addColorStop(1, 'rgba(255, 106, 26, 0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.9, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 244, 214, ${alpha})`;
        ctx.fill();
      }
    };

    // оттенки фирменной палитры (оранжево-жёлтые)
    const palette = [
      [255, 106, 26],
      [255, 157, 46],
      [255, 190, 77],
      [255, 220, 150],
    ];

    const build = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // плотность зависит от площади экрана
      const count = Math.round((width * height) / 9000);
      stars = new Array(count).fill(0).map(() => {
        const c = palette[(Math.random() * palette.length) | 0];
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.4 + 0.3,
          // медленный дрейф вверх + лёгкий боковой снос
          vx: (Math.random() - 0.5) * 0.04,
          vy: -(Math.random() * 0.12 + 0.02),
          baseAlpha: Math.random() * 0.5 + 0.15,
          twinkle: Math.random() * Math.PI * 2,
          twSpeed: Math.random() * 0.0012 + 0.0004,
          color: c,
        };
      });
    };

    const draw = (now) => {
      const dt = last ? now - last : 16;
      last = now;
      ctx.clearRect(0, 0, width, height);

      for (const s of stars) {
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.twinkle += s.twSpeed * dt;

        // заворачиваем по краям
        if (s.y < -2) {
          s.y = height + 2;
          s.x = Math.random() * width;
        }
        if (s.x < -2) s.x = width + 2;
        else if (s.x > width + 2) s.x = -2;

        const a = s.baseAlpha * (0.6 + 0.4 * Math.sin(s.twinkle));
        const [r, g, b] = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx.fill();
      }

      drawMeteors(dt);

      raf = requestAnimationFrame(draw);
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        const [r, g, b] = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${s.baseAlpha})`;
        ctx.fill();
      }
    };

    const onResize = () => {
      build();
      if (reduce) drawStatic();
    };

    // Инициализацию (отрисовку + непрерывный rAF) откладываем до простоя
    // браузера после первого экрана, чтобы фон не конкурировал за поток
    // во время загрузки и не ухудшал LCP/TTI.
    let started = false;
    let idleId = 0;
    const start = () => {
      if (started) return;
      started = true;
      build();
      if (reduce) drawStatic();
      else raf = requestAnimationFrame(draw);
      window.addEventListener('resize', onResize);
    };
    const ric =
      window.requestIdleCallback || ((cb) => window.setTimeout(() => cb(), 1));
    idleId = ric(start, { timeout: 2500 });

    return () => {
      if (idleId && window.cancelIdleCallback) window.cancelIdleCallback(idleId);
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />;
}
