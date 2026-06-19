import { useEffect, useState } from 'react';

export default function RotatingWord({ words, interval = 2200, className = '' }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words, interval]);

  return (
    <span className={`rot-word ${className}`}>
      <span className="rot-word__inner" key={i}>
        {words[i]}
      </span>
    </span>
  );
}
