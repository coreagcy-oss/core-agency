import './Planets.css';

/**
 * Глобальный декоративный слой с планетами Солнечной системы.
 * Распределены по всей высоте сайта, висят позади контента (z-index:-1),
 * проявляются в «пустых» местах на тёмном фоне. Чисто фоновый слой.
 */
export default function Planets() {
  return (
    <div className="site-planets" aria-hidden="true">
      <span className="planet planet--mercury" />
      <span className="planet planet--venus" />
      <span className="planet planet--earth">
        <span className="planet-earth-glow" />
      </span>
      <span className="planet planet--jupiter" />
      <span className="planet planet--saturn">
        <span className="planet-ring" />
      </span>
      <span className="planet planet--uranus" />
    </div>
  );
}
