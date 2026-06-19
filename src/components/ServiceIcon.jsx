// Объёмные SVG-иконки-кластеры для направлений услуг.
// Тонированы в фирменный оранжевый градиент, но формы узнаваемы.
// Заменяют прежние цифры 01–04 слева от названия услуги.

function PromoIcon() {
  // Instagram + YouTube — продвижение в соцсетях
  return (
    <svg viewBox="0 0 72 72" width="100%" height="100%" aria-hidden="true">
      <defs>
        <linearGradient id="si-promo-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff9d2e" />
          <stop offset="1" stopColor="#ff3d00" />
        </linearGradient>
        <linearGradient id="si-promo-b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffbe4d" />
          <stop offset="1" stopColor="#ff6a1a" />
        </linearGradient>
      </defs>
      {/* YouTube-плашка (сзади) */}
      <g filter="url(#si-shadow)">
        <rect x="6" y="26" width="40" height="28" rx="9" fill="url(#si-promo-a)" />
        <path d="M22 34.5l11 5.5-11 5.5z" fill="#0c0a08" />
      </g>
      {/* Instagram-плашка (спереди) */}
      <rect x="30" y="10" width="32" height="32" rx="10" fill="none" stroke="url(#si-promo-b)" strokeWidth="4" />
      <circle cx="46" cy="26" r="7.5" fill="none" stroke="url(#si-promo-b)" strokeWidth="4" />
      <circle cx="55.5" cy="16.5" r="2.6" fill="#ffbe4d" />
      <filter id="si-shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#ff3d00" floodOpacity="0.45" />
      </filter>
    </svg>
  );
}

function AutoIcon() {
  // Робот — автоматизация и ИИ
  return (
    <svg viewBox="0 0 72 72" width="100%" height="100%" aria-hidden="true">
      <defs>
        <linearGradient id="si-auto" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffbe4d" />
          <stop offset="1" stopColor="#ff6a1a" />
        </linearGradient>
      </defs>
      <g filter="url(#si-shadow2)">
        {/* антенна */}
        <line x1="36" y1="8" x2="36" y2="16" stroke="url(#si-auto)" strokeWidth="3.2" strokeLinecap="round" />
        <circle cx="36" cy="7" r="3" fill="#ffbe4d" />
        {/* голова */}
        <rect x="16" y="16" width="40" height="32" rx="10" fill="none" stroke="url(#si-auto)" strokeWidth="4" />
        {/* глаза */}
        <circle cx="28" cy="30" r="4" fill="url(#si-auto)" />
        <circle cx="44" cy="30" r="4" fill="url(#si-auto)" />
        {/* рот */}
        <line x1="27" y1="40" x2="45" y2="40" stroke="url(#si-auto)" strokeWidth="3.2" strokeLinecap="round" />
        {/* уши */}
        <line x1="14" y1="28" x2="14" y2="36" stroke="url(#si-auto)" strokeWidth="3.2" strokeLinecap="round" />
        <line x1="58" y1="28" x2="58" y2="36" stroke="url(#si-auto)" strokeWidth="3.2" strokeLinecap="round" />
        {/* шея/основание */}
        <line x1="36" y1="48" x2="36" y2="54" stroke="url(#si-auto)" strokeWidth="3.2" />
        <line x1="26" y1="58" x2="46" y2="58" stroke="url(#si-auto)" strokeWidth="4" strokeLinecap="round" />
      </g>
      <filter id="si-shadow2" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#ff6a1a" floodOpacity="0.45" />
      </filter>
    </svg>
  );
}

function DesignIcon() {
  // Акварельный мазок + кисть — визуальный дизайн
  return (
    <svg viewBox="0 0 72 72" width="100%" height="100%" aria-hidden="true">
      <defs>
        <radialGradient id="si-blob" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#ffbe4d" />
          <stop offset="0.55" stopColor="#ff7a18" />
          <stop offset="1" stopColor="#ff3d00" />
        </radialGradient>
        <linearGradient id="si-brush" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd9a0" />
          <stop offset="1" stopColor="#ff6a1a" />
        </linearGradient>
      </defs>
      <g filter="url(#si-shadow3)">
        {/* акварельная клякса */}
        <path
          d="M20 18c10-6 24-4 28 6 4 9-2 16-9 19-8 3-19 4-24-3-5-8-4-18 5-22z"
          fill="url(#si-blob)"
          opacity="0.92"
        />
        {/* брызги */}
        <circle cx="50" cy="48" r="3" fill="#ff9d2e" />
        <circle cx="18" cy="46" r="2" fill="#ffbe4d" />
        {/* кисть */}
        <rect
          x="40" y="40" width="6" height="22" rx="3"
          transform="rotate(38 43 51)"
          fill="url(#si-brush)"
        />
        <path d="M52 56l6 6-3 3-6-6z" fill="#221913" />
      </g>
      <filter id="si-shadow3" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#ff3d00" floodOpacity="0.4" />
      </filter>
    </svg>
  );
}

function ContentIcon() {
  // Лиды (люди) + бейдж 3× усиленного охвата — контент-завод
  return (
    <svg viewBox="0 0 72 72" width="100%" height="100%" aria-hidden="true">
      <defs>
        <linearGradient id="si-lead" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffbe4d" />
          <stop offset="1" stopColor="#ff6a1a" />
        </linearGradient>
        <linearGradient id="si-badge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff9d2e" />
          <stop offset="1" stopColor="#ff3d00" />
        </linearGradient>
      </defs>
      <g filter="url(#si-shadow4)">
        {/* лид сзади */}
        <circle cx="20" cy="24" r="6" fill="url(#si-lead)" opacity="0.55" />
        <path d="M10 46c0-6 4.5-10 10-10s10 4 10 10z" fill="url(#si-lead)" opacity="0.55" />
        {/* основной лид */}
        <circle cx="32" cy="26" r="8" fill="url(#si-lead)" />
        <path d="M18 52c0-8 6.3-14 14-14s14 6 14 14z" fill="url(#si-lead)" />
      </g>
      {/* бейдж 3× с восходящей стрелкой */}
      <g filter="url(#si-shadow4)">
        <rect x="40" y="8" width="28" height="20" rx="10" fill="url(#si-badge)" />
        <text
          x="51" y="18"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="Unbounded, sans-serif"
          fontSize="12"
          fontWeight="800"
          fill="#0c0a08"
        >
          3x
        </text>
        <path d="M61 21l3-6 3 6z" fill="#0c0a08" />
      </g>
      <filter id="si-shadow4" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#ff6a1a" floodOpacity="0.45" />
      </filter>
    </svg>
  );
}

const ICONS = [PromoIcon, AutoIcon, DesignIcon, ContentIcon];

export default function ServiceIcon({ index }) {
  const Icon = ICONS[index] || PromoIcon;
  return <Icon />;
}
