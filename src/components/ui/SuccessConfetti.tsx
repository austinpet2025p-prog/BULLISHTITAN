import React from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const CONFETTI_PIECES = Array.from({ length: 18 }, (_, idx) => {
  const angle = (idx / 18) * Math.PI * 2;
  const dist = 55 + (idx % 3) * 24;
  return {
    id: idx,
    dx: Math.cos(angle) * dist,
    dy: Math.sin(angle) * dist - 18,
    rot: (idx * 47) % 360,
    color: idx % 3 === 0 ? '#F0D58A' : idx % 3 === 1 ? '#C9A24B' : '#8C6A1F',
  };
});

export const SuccessConfetti: React.FC<{ active: boolean }> = ({ active }) => {
  const reducedMotion = useReducedMotion();
  if (!active || reducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative mx-auto h-0 w-0 overflow-visible"
    >
      {CONFETTI_PIECES.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
          animate={{ x: p.dx, y: p.dy, opacity: 0, scale: 0.4, rotate: p.rot }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-0 top-0 h-2 w-2 rounded-xs"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
};
