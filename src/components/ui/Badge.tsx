import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'success' | 'danger' | 'neutral';
  className?: string;
}

const badgeStyles: Record<NonNullable<BadgeProps['variant']>, string> = {
  gold: 'bg-[#C9A24B]/12 text-[#F0D58A] border-[#C9A24B]/35',
  success: 'bg-[#1F9D6B]/14 text-[#1F9D6B] border-[#1F9D6B]/35',
  danger: 'bg-[#EF4444]/12 text-[#F87171] border-[#EF4444]/30',
  neutral: 'bg-[#141414] text-[#9A968C] border-[#C9A24B]/20',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className,
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap shrink-0 tabular-nums',
        badgeStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
