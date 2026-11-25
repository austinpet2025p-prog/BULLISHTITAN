import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

export function useCountUp(target: number, durationMs = 1400, start = true) {
  const reducedMotion = useReducedMotion();
  const [value, setValue] = useState(reducedMotion ? target : 0);

  useEffect(() => {
    if (!start) return;
    if (reducedMotion) {
      setValue(target);
      return;
    }

    let frame = 0;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) {
        frame = window.requestAnimationFrame(step);
      }
    };

    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [target, durationMs, start, reducedMotion]);

  return value;
}
