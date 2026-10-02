import { useCallback, useEffect, useState } from 'react';

export function useCountdown(initialSeconds: number) {
  const [endAt, setEndAt] = useState(() => Date.now() + initialSeconds * 1000);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (Date.now() >= endAt) return;

    const id = setInterval(() => {
      const n = Date.now();
      setNow(n);
      if (n >= endAt) clearInterval(id);
    }, 500);

    return () => clearInterval(id);
  }, [endAt]);

  const restart = useCallback((seconds: number) => {
    const t = Date.now();
    setEndAt(t + seconds * 1000);
    setNow(t);
  }, []);

  const secondsLeft = Math.max(0, Math.ceil((endAt - now) / 1000));
  return { secondsLeft, isDone: secondsLeft === 0, restart };
}
