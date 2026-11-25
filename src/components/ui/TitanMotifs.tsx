import React, { useId } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const LUXURY_EASE = [0.22, 1, 0.36, 1] as const;

export interface ShieldFrameProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  variant?: 'landscape' | 'crest';
  bright?: boolean;
  caption?: string;
  noReveal?: boolean;
}

/**
 * Architectural frame reusing the arched-crown, vertical-sided, tapered-bottom
 * shield geometry from the Bullish Titan Academy emblem.
 * Gently rises into view and draws its metallic gold border slowly on scroll.
 */
export const ShieldFrame: React.FC<ShieldFrameProps> = ({
  children,
  className,
  innerClassName,
  variant = 'landscape',
  bright = false,
  caption,
  noReveal = false,
}) => {
  const reducedMotion = useReducedMotion();
  const clipId = useId().replace(/:/g, '');
  const pathData =
    variant === 'crest'
      ? 'M 0.02,0.09 Q 0.5,0.008 0.98,0.09 L 0.98,0.89 Q 0.5,0.992 0.02,0.89 Z'
      : 'M 0.01,0.045 Q 0.5,0.005 0.99,0.045 L 0.99,0.955 Q 0.5,0.995 0.01,0.955 Z';

  const borderPath =
    variant === 'crest'
      ? 'M 2,9 Q 50,1 98,9 L 98,89 Q 50,99 2,89 Z'
      : 'M 1,4.5 Q 50,0.5 99,4.5 L 99,95.5 Q 50,99.5 1,95.5 Z';

  const skipMotion = reducedMotion || noReveal;

  return (
    <motion.figure
      className={cn('relative', className)}
      initial={skipMotion ? false : { opacity: 0, y: 20 }}
      whileInView={skipMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.9, ease: LUXURY_EASE }}
    >
      <div className="relative p-[5px]">
        <svg className="sr-only" aria-hidden="true" width="0" height="0">
          <defs>
            <clipPath id={clipId} clipPathUnits="objectBoundingBox">
              <path d={pathData} />
            </clipPath>
          </defs>
        </svg>

        <div
          style={{ clipPath: `url(#${clipId})` }}
          className={cn('relative overflow-hidden bg-[#0B0B0C]', innerClassName)}
        >
          {children}
        </div>

        {/* Metallic gold shield 1px hairline border — traces cleanly into place */}
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <motion.path
            d={borderPath}
            fill="none"
            stroke="url(#titan-gold-grad)"
            strokeWidth={bright ? '1.35' : '1'}
            strokeOpacity={bright ? '0.8' : '0.45'}
            vectorEffect="non-scaling-stroke"
            initial={skipMotion ? { pathLength: 1 } : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.16 }}
            transition={{ duration: 1.2, ease: LUXURY_EASE }}
          />
        </svg>
      </div>

      {caption && (
        <figcaption className="mt-3 text-center font-mono text-[11px] tracking-wider uppercase text-[#9A968C]">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
};

export interface ShieldCrestAvatarProps {
  children: React.ReactNode;
  className?: string;
}

export const ShieldCrestBadge: React.FC<ShieldCrestAvatarProps> = ({
  children,
  className,
}) => (
  <div
    className={cn(
      'relative flex h-12 w-11 shrink-0 items-center justify-center bg-[#141414] shield-clip-crest',
      className
    )}
  >
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <path
        d="M 2,10 Q 50,1 98,10 L 98,89 Q 50,99 2,89 Z"
        fill="none"
        stroke="url(#titan-gold-grad)"
        strokeWidth="1.25"
        strokeOpacity="0.65"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
    <span className="relative z-10">{children}</span>
  </div>
);

/**
 * Centered shield architectural divider separating editorial bands.
 * Left and right gold hairlines draw smoothly outward when scrolled into view.
 */
export const ShieldSectionDivider: React.FC<{ className?: string; label?: string }> = ({
  className,
  label,
}) => {
  const reducedMotion = useReducedMotion();

  return (
    <div className={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)} aria-hidden="true">
      <div className="flex items-center gap-5 py-3">
        <motion.div
          className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C9A24B]/30 to-[#C9A24B]/55 origin-right"
          initial={reducedMotion ? false : { scaleX: 0, opacity: 0.4 }}
          whileInView={reducedMotion ? undefined : { scaleX: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.05, ease: LUXURY_EASE }}
        />

        <div className="flex items-center gap-3 shrink-0">
          <svg viewBox="0 0 36 42" className="h-7 w-6 text-[#C9A24B]" fill="none">
            <motion.path
              d="M 3,6 Q 18,1 33,6 L 33,33 Q 18,40 3,33 Z"
              stroke="url(#titan-gold-grad)"
              strokeWidth="1.15"
              fill="#0B0B0C"
              initial={reducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.95, ease: LUXURY_EASE }}
            />
            <motion.path
              d="M 10,27 Q 19,25 25,13"
              stroke="url(#titan-gold-grad)"
              strokeWidth="1.25"
              strokeLinecap="round"
              initial={reducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ delay: 0.25, duration: 0.8, ease: LUXURY_EASE }}
            />
            <motion.path
              d="M 20.5,14 L 25.5,12.2 L 26.2,17.5"
              stroke="url(#titan-gold-grad)"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ delay: 0.65, duration: 0.45, ease: LUXURY_EASE }}
            />
          </svg>
          {label && (
            <motion.span
              initial={reducedMotion ? false : { opacity: 0 }}
              whileInView={reducedMotion ? undefined : { opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ delay: 0.25, duration: 0.65, ease: LUXURY_EASE }}
              className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#9A968C]"
            >
              {label}
            </motion.span>
          )}
        </div>

        <motion.div
          className="h-px flex-1 bg-gradient-to-l from-transparent via-[#C9A24B]/30 to-[#C9A24B]/55 origin-left"
          initial={reducedMotion ? false : { scaleX: 0, opacity: 0.4 }}
          whileInView={reducedMotion ? undefined : { scaleX: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.05, ease: LUXURY_EASE }}
        />
      </div>
    </div>
  );
};

/**
 * Pure 1px metallic gold hairline divider that draws gently across from left to right.
 */
export const GoldHairlineDivider: React.FC<{ className?: string }> = ({ className }) => {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      className={cn(
        'h-px w-full bg-gradient-to-r from-[#8C6A1F]/40 via-[#C9A24B]/55 to-transparent origin-left',
        className
      )}
      initial={reducedMotion ? false : { scaleX: 0, opacity: 0.3 }}
      whileInView={reducedMotion ? undefined : { scaleX: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.95, ease: LUXURY_EASE }}
    />
  );
};

/**
 * Slow, understated fade-and-rise reveal for text, figures, and editorial rows.
 */
export const EditorialReveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className, delay = 0 }) => {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ delay, duration: 0.85, ease: LUXURY_EASE }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Subtle curved rising-arrow motif linking sequential vertical sections.
 */
export const RisingArrowConnector: React.FC<{
  className?: string;
  align?: 'center' | 'left' | 'right';
}> = ({ className, align = 'center' }) => {
  const reducedMotion = useReducedMotion();

  const justifyClass =
    align === 'left'
      ? 'justify-start pl-6 sm:pl-12'
      : align === 'right'
      ? 'justify-end pr-6 sm:pr-12'
      : 'justify-center';

  return (
    <div
      className={cn(
        'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex pointer-events-none select-none',
        justifyClass,
        className
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 120 72" className="h-14 w-24 overflow-visible" fill="none">
        <motion.path
          d="M 18,64 C 24,42 54,44 92,10"
          stroke="url(#titan-gold-grad)"
          strokeWidth="1.1"
          strokeOpacity="0.6"
          strokeLinecap="round"
          initial={reducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.15, ease: LUXURY_EASE }}
        />
        <motion.path
          d="M 80,12 L 94,8 L 91,22"
          stroke="url(#titan-gold-grad)"
          strokeWidth="1.25"
          strokeOpacity="0.78"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.75, duration: 0.45, ease: LUXURY_EASE }}
        />
      </svg>
    </div>
  );
};
