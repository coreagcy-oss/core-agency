import { useEffect, useState } from 'react';

/**
 * Определяет мобильный вьюпорт (по умолчанию ≤ 760px).
 * Значение вычисляется синхронно при первом клиентском рендере, поэтому
 * тяжёлые декоративные слои (3D-сцена, планеты) на телефоне даже не
 * монтируются — это убирает их вклад в LCP и работу потока.
 */
export function useIsMobile(maxWidth = 760) {
  const query = `(max-width: ${maxWidth}px)`;
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return isMobile;
}
