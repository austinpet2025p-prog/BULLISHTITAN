import React, { useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const STREAM_TERMS = [
  'Liquidity Architecture',
  '1.0% Drawdown Shield',
  'London & New York Overlap',
  'Synthetic Volatility Cycles',
  'Capital Preservation',
  'Disciplined Execution',
];

/**
 * Apple-sleek horizontal flow band whose speed and direction subtly respond
 * to the user's real-time scroll velocity, framed by 1px metallic gold hairlines.
 */
export const FlowVelocityBand: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const directionRef = useRef(1);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 48,
    stiffness: 320,
  });
  const velocityFactor = useTransform(smoothVelocity, [-1800, 0, 1800], [-3.5, 0, 3.5]);

  useAnimationFrame((_, delta) => {
    if (reducedMotion || document.hidden) return;
    const v = velocityFactor.get();
    if (v < -0.15) directionRef.current = -1;
    else if (v > 0.15) directionRef.current = 1;

    // Gentle base speed (% per second) + smooth scroll velocity boost
    const moveBy = directionRef.current * 1.45 * (delta / 1000) + v * 1.15 * (delta / 1000);
    let next = baseX.get() - moveBy;
    if (next <= -50) next += 50;
    if (next > 0) next -= 50;
    baseX.set(next);
  });

  const xTransform = useTransform(baseX, (val) => `${val}%`);

  if (reducedMotion) {
    return (
      <div className="border-y border-[#C9A24B]/16 bg-[#000000] py-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono uppercase tracking-[0.22em] text-[#9A968C]">
          {STREAM_TERMS.map((term, idx) => (
            <React.Fragment key={term}>
              <span className={idx % 2 === 0 ? 'text-[#EDE6D6]/85' : 'text-[#C9A24B]'}>
                {term}
              </span>
              {idx < STREAM_TERMS.length - 1 && (
                <span aria-hidden="true" className="text-[#8C6A1F]">
                  ·
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-[#C9A24B]/18 bg-[#000000] py-5 select-none"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#000000] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#000000] to-transparent" />

      <motion.div style={{ x: xTransform }} className="flex w-max items-center whitespace-nowrap">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center gap-8 pr-8">
            {STREAM_TERMS.map((term, idx) => (
              <React.Fragment key={`${dup}-${term}`}>
                <span
                  className={
                    idx % 2 === 0
                      ? 'font-display italic text-lg sm:text-xl text-[#EDE6D6]/80 tracking-tight'
                      : 'font-mono text-[11px] uppercase tracking-[0.24em] text-[#C9A24B]'
                  }
                >
                  {term}
                </span>
                <span className="h-1 w-1 rounded-full bg-[#8C6A1F]/70" />
              </React.Fragment>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};
