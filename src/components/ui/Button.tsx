import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  to?: string;
  fullWidth?: boolean;
  magnetic?: boolean;
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-gold-gradient text-[#000000] font-semibold hover:brightness-[1.03] shield-clip-button',
  secondary:
    'bg-[#0B0B0C] text-[#EDE6D6] hover:bg-[#141414] shield-clip-button',
  outline:
    'bg-transparent text-[#EDE6D6] hover:text-[#F0D58A] hover:bg-[#0B0B0C]/65 shield-clip-button',
  ghost:
    'bg-transparent text-[#9A968C] hover:text-[#EDE6D6] hover:bg-[#141414] rounded-md',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-9 px-4 text-xs',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-7 text-sm tracking-wide',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      to,
      fullWidth,
      magnetic = true,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const reducedMotion = useReducedMotion();
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
      if (!magnetic || reducedMotion || e.pointerType === 'touch') return;
      const rect = e.currentTarget.getBoundingClientRect();
      const dx = ((e.clientX - rect.left) / rect.width - 0.5) * 3.5;
      const dy = ((e.clientY - rect.top) / rect.height - 0.5) * 2.5;
      setOffset({ x: dx, y: dy });
    };

    const handlePointerLeave = () => {
      if (offset.x !== 0 || offset.y !== 0) setOffset({ x: 0, y: 0 });
    };

    const showShieldFrame = variant !== 'ghost';

    const classes = cn(
      'group relative overflow-hidden inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap shrink-0 transition-all duration-300 ease-out focus-visible:outline-2 focus-visible:outline-[#C9A24B] disabled:opacity-50 disabled:pointer-events-none',
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && 'w-full',
      className
    );

    const style =
      magnetic && !reducedMotion
        ? { transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }
        : undefined;

    const shieldBorderNode = showShieldFrame && (
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <path
          d="M 1,9 Q 50,1 99,9 L 99,91 Q 50,99 1,91 Z"
          fill="none"
          stroke={variant === 'primary' ? '#F0D58A' : 'url(#titan-gold-grad)'}
          strokeWidth={variant === 'primary' ? '1' : '1.1'}
          strokeOpacity={variant === 'primary' ? '0.48' : '0.44'}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );

    // Slow luxury metallic gold sheen sweeping cleanly across hover
    const goldShineSweepNode = !reducedMotion && (
      <span
        aria-hidden="true"
        className="btn-gold-sweep pointer-events-none absolute inset-y-0 w-1/2"
        style={{
          background:
            variant === 'primary'
              ? 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,248,225,0.44) 50%, rgba(255,255,255,0) 100%)'
              : 'linear-gradient(90deg, rgba(240,213,138,0) 0%, rgba(240,213,138,0.22) 50%, rgba(240,213,138,0) 100%)',
        }}
      />
    );

    if (to) {
      return (
        <Link
          to={to}
          className={classes}
          style={style}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          {shieldBorderNode}
          {goldShineSweepNode}
          <span className="relative z-10 inline-flex items-center justify-center gap-2">
            {children}
          </span>
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        style={style}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={onClick}
        {...props}
      >
        {shieldBorderNode}
        {goldShineSweepNode}
        <span className="relative z-10 inline-flex items-center justify-center gap-2">
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';
