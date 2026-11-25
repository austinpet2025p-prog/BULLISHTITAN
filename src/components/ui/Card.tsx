import React, { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface CardProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  hoverLift?: boolean;
  featured?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  id,
  children,
  className,
  hoverLift = false,
  featured = false,
  onClick,
}) => {
  const reducedMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!hoverLift || reducedMotion || e.pointerType === 'touch') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -py * 4, ry: px * 4 });
  };

  return (
    <motion.div
      id={id}
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        if (tilt.rx !== 0 || tilt.ry !== 0) setTilt({ rx: 0, ry: 0 });
      }}
      animate={
        hoverLift && !reducedMotion
          ? { rotateX: tilt.rx, rotateY: tilt.ry }
          : undefined
      }
      whileHover={
        hoverLift && !reducedMotion
          ? { y: -4, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }
          : undefined
      }
      className={cn(
        'rounded-lg p-6 sm:p-7 transition-colors duration-200 [transform-style:preserve-3d]',
        featured
          ? 'hairline-gold-bright'
          : 'hairline-gold hover:border-[#C9A24B]/45',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </motion.div>
  );
};
