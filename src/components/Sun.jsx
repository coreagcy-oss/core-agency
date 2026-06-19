import './Sun.css';

/**
 * Декоративное солнце в верхнем левом углу — тёплый источник света
 * с мягким ореолом и медленно вращающимися лучами. Чисто фоновый слой.
 */
export default function Sun() {
  return (
    <div className="sun" aria-hidden="true">
      <span className="sun-glow" />
      <span className="sun-rays" />
      <span className="sun-core" />
    </div>
  );
}
