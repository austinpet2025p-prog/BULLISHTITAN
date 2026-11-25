import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import { ArrowRight, Search } from 'lucide-react';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Button } from '../ui/Button';
import { GlobalSearchModal } from './GlobalSearchModal';
import { cn } from '../../lib/utils';

export interface NavbarProps {
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

export const BrandMark: React.FC<{ className?: string }> = ({ className }) => (
  <img
    src="/assets/aistudio/WhatsApp_Image_2026-11-15_at_11.43.04_PM_dff4afd1.jpeg"
    alt="Bullish Titan Academy logo"
    width={44}
    height={44}
    decoding="async"
    className={cn(
      'h-10 w-10 sm:h-11 sm:w-11 shrink-0 object-contain mix-blend-lighten select-none',
      className
    )}
  />
);

const DAMPED_SPRING = { stiffness: 140, damping: 32, mass: 0.9 };
const LUXURY_EASE = [0.22, 1, 0.36, 1] as const;

const NavbarBrand: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const linkRef = useRef<HTMLAnchorElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springX = useSpring(rawX, DAMPED_SPRING);
  const springY = useSpring(rawY, DAMPED_SPRING);

  const emblemX = useTransform(springX, [-0.5, 0.5], [-4, 4]);
  const emblemY = useTransform(springY, [-0.5, 0.5], [-3, 3]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-9, 9]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [9, -9]);

  const textX = useTransform(springX, [-0.5, 0.5], [-2, 2]);
  const textY = useTransform(springY, [-0.5, 0.5], [-1.5, 1.5]);

  const handlePointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (reducedMotion || e.pointerType === 'touch' || !linkRef.current) return;
    const rect = linkRef.current.getBoundingClientRect();
    const nx = Math.max(-0.5, Math.min(0.5, (e.clientX - rect.left) / rect.width - 0.5));
    const ny = Math.max(-0.5, Math.min(0.5, (e.clientY - rect.top) / rect.height - 0.5));
    rawX.set(nx);
    rawY.set(ny);
  };

  const handlePointerLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <Link
      ref={linkRef}
      to="/"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="group flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#C9A24B] rounded-lg py-1 pr-1.5"
    >
      <motion.div
        style={
          reducedMotion
            ? undefined
            : {
                x: emblemX,
                y: emblemY,
                rotateX,
                rotateY,
                transformPerspective: 560,
              }
        }
        whileHover={reducedMotion ? undefined : { scale: 1.03 }}
        transition={{ duration: 0.45, ease: LUXURY_EASE }}
        className="relative h-10 w-10 sm:h-11 sm:w-11 shrink-0 overflow-hidden"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 44 44"
          className="pointer-events-none absolute inset-0 h-full w-full"
          fill="none"
        >
          <motion.path
            d="M 8,10 Q 22,5 36,10 L 36,36 Q 22,41 8,36 Z"
            stroke="url(#titan-gold-grad)"
            strokeWidth="0.9"
            strokeOpacity="0.65"
            initial={reducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.35, ease: LUXURY_EASE }}
          />
        </svg>

        <motion.img
          src="/assets/aistudio/WhatsApp_Image_2026-11-15_at_11.43.04_PM_dff4afd1.jpeg"
          alt="Bullish Titan Academy logo"
          width={44}
          height={44}
          decoding="async"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.85, ease: LUXURY_EASE }}
          className="h-full w-full object-contain mix-blend-lighten select-none"
        />

        {!reducedMotion && (
          <motion.span
            aria-hidden="true"
            initial={{ x: '-140%', opacity: 0 }}
            animate={{ x: '150%', opacity: [0, 0.7, 0] }}
            transition={{ delay: 0.75, duration: 1.0, ease: 'easeInOut' }}
            className="pointer-events-none absolute inset-y-1 w-5 -skew-x-12 mix-blend-screen"
            style={{
              background:
                'linear-gradient(90deg, rgba(240,213,138,0), rgba(240,213,138,0.45), rgba(240,213,138,0))',
            }}
          />
        )}
      </motion.div>

      <motion.span
        style={reducedMotion ? undefined : { x: textX, y: textY }}
        className="font-display text-base sm:text-lg font-semibold tracking-tight text-[#EDE6D6] transition-colors duration-300 group-hover:text-[#F0D58A]"
      >
        Bullish Titan
      </motion.span>
    </Link>
  );
};

export const Navbar: React.FC<NavbarProps> = () => {
  const { isScrolled } = useScrollProgress();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
        return;
      }
      if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement | null;
        const tag = target?.tagName?.toLowerCase();
        const isEditable =
          tag === 'input' ||
          tag === 'textarea' ||
          tag === 'select' ||
          Boolean(target?.isContentEditable);
        if (!isEditable) {
          e.preventDefault();
          setSearchOpen(true);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleEnrollClick = () => {
    const scrollTarget = () => {
      document.getElementById('pricing-enrollment')?.scrollIntoView({ behavior: 'smooth' });
    };

    if (pathname === '/') {
      scrollTarget();
    } else {
      navigate('/#pricing-enrollment');
    }
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          isScrolled
            ? 'h-16 bg-[#000000]/94 backdrop-blur-md border-b border-[#C9A24B]/24'
            : 'h-20 bg-[#000000]/65 backdrop-blur-sm border-b border-[#C9A24B]/10'
        )}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8">
          <NavbarBrand />

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search modules, plans, or signals (Ctrl+K)"
              className="flex h-[42px] items-center gap-2.5 rounded-xl border border-[#C9A24B]/30 bg-[#0B0C10]/90 px-3 sm:px-3.5 text-xs text-[#9A968C] hover:border-[#F0D58A]/65 hover:text-[#EDE6D6] transition-colors"
            >
              <Search className="h-4 w-4 text-[#C9A24B] shrink-0" />
              <span className="hidden md:inline whitespace-nowrap">
                Search modules, plans, signals...
              </span>
              <span className="hidden sm:inline md:hidden">Search</span>
              <kbd className="hidden lg:inline-block rounded border border-[#C9A24B]/25 bg-[#050608] px-1.5 py-0.5 font-mono text-[10px] text-[#C9A24B]">
                ⌘K
              </kbd>
            </button>

            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleEnrollClick}
              className="min-h-[42px] px-4 sm:px-6"
            >
              Enter Ranks
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <GlobalSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
