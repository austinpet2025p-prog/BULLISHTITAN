import React, { useId } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface TabOption<T extends string> {
  value: T;
  label: string;
}

export interface TabsProps<T extends string> {
  options: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function Tabs<T extends string>({
  options,
  value,
  onChange,
  className,
}: TabsProps<T>) {
  const reducedMotion = useReducedMotion();
  const groupId = useId();

  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex flex-wrap items-center gap-1 rounded-xl border border-[#C9A24B]/24 bg-[#0B0B0C] p-1',
        className
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'relative px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors duration-200',
              active ? 'text-[#000000] font-semibold' : 'text-[#9A968C] hover:text-[#EDE6D6]'
            )}
          >
            {active && (
              <motion.span
                layoutId={`tabs-pill-${groupId}`}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 360, damping: 32, mass: 0.85 }
                }
                aria-hidden="true"
                className="absolute inset-0 rounded-lg bg-gold-gradient"
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
