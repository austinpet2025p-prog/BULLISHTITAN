import React from 'react';
import { AnimatePresence, motion, type Variants } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface PageTransitionProps {
  routeKey: string;
  children: React.ReactNode;
  id?: string;
  className?: string;
  offsetY?: number;
}

const TRANSITION_EASE = [0.22, 1, 0.36, 1] as const;

export const PageTransition: React.FC<PageTransitionProps> = ({
  routeKey,
  children,
  id = 'main-content',
  className = 'flex-1',
  offsetY = 18,
}) => {
  const reducedMotion = useReducedMotion();

  const variants: Variants = reducedMotion
    ? {
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 1, y: 0 },
      }
    : {
        initial: { opacity: 0, y: offsetY },
        animate: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.55,
            ease: TRANSITION_EASE,
          },
        },
        exit: {
          opacity: 0,
          y: -8,
          transition: {
            duration: 0.24,
            ease: TRANSITION_EASE,
          },
        },
      };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main
        id={id}
        key={routeKey}
        variants={variants}
        initial={reducedMotion ? false : 'initial'}
        animate="animate"
        exit={reducedMotion ? undefined : 'exit'}
        className={className}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
};
