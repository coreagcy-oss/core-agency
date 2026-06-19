import './SectionDivider.css';

/**
 * Тонкий «звёздный» разделитель между секциями.
 * Мягко светящаяся линия с затуханием по краям и искрой-звездой в центре —
 * даёт визуальное разделение блоков без резких черт.
 */
export default function SectionDivider() {
  return (
    <div className="section-divider" aria-hidden="true">
      <span className="section-divider-line" />
      <span className="section-divider-star">✦</span>
      <span className="section-divider-line" />
    </div>
  );
}
