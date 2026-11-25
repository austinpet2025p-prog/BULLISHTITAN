import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface CountUpValueProps {
  end: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  formatLocale?: boolean;
  className?: string;
}

/**
 * Smoothly counts from 0 to `end` only once visible in the viewport.
 * Respects prefers-reduced-motion by rendering the target value immediately.
 */
export const CountUpValue: React.FC<CountUpValueProps> = ({
  end,
  duration = 1750,
  decimals = 0,
  prefix = '',
  suffix = '',
  formatLocale = true,
  className,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reducedMotion = useReducedMotion();
  const [current, setCurrent] = useState<number>(reducedMotion ? end : 0);

  useEffect(() => {
    if (reducedMotion) {
      setCurrent(end);
      return;
    }
    if (!inView) return;

    let rafId = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Smooth quartic deceleration — zero overshoot or bounce
      const eased = 1 - Math.pow(1 - progress, 4);
      setCurrent(eased * end);
      if (progress < 1) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        setCurrent(end);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [end, duration, inView, reducedMotion]);

  const rounded = decimals > 0 ? Number(current.toFixed(decimals)) : Math.round(current);
  const formatted = formatLocale
    ? rounded.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : decimals > 0
    ? rounded.toFixed(decimals)
    : String(rounded);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};
