import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  align?: 'left' | 'center';
  noReveal?: boolean;
  romanIndex?: string;
}

export const Section: React.FC<SectionProps> = ({
  id,
  children,
  className,
  containerClassName,
  kicker,
  title,
  subtitle,
  align = 'left',
  noReveal = false,
  romanIndex,
}) => {
  const reducedMotion = useReducedMotion();

  const header = (kicker || title || subtitle) && (
    <div
      className={cn(
        'mb-12 sm:mb-16',
        align === 'center' ? 'text-center mx-auto max-w-3xl' : 'max-w-3xl'
      )}
    >
      {kicker && (
        <div
          className={cn(
            'flex items-center gap-3 mb-3.5',
            align === 'center' && 'justify-center'
          )}
        >
          {romanIndex && (
            <span className="font-display italic text-sm text-[#C9A24B]">
              {romanIndex}
            </span>
          )}
          <motion.span
            className="h-px w-8 bg-gold-gradient opacity-80 origin-left"
            aria-hidden="true"
            initial={noReveal || reducedMotion ? false : { scaleX: 0 }}
            whileInView={noReveal || reducedMotion ? undefined : { scaleX: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          />
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-gradient">
            {kicker}
          </p>
        </div>
      )}
      {title && (
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#EDE6D6] leading-[1.08] tracking-tight">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="mt-4 max-w-2xl text-sm sm:text-base text-[#9A968C] leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );

  return (
    <section id={id} className={cn('py-20 sm:py-28 relative', className)}>
      <div className={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', containerClassName)}>
        {noReveal || reducedMotion ? (
          <>
            {header}
            {children}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            {header}
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
};
