import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const SESSION_KEY = 'bullish_titan_intro_done';
const LUXURY_EASE = [0.22, 1, 0.36, 1] as const;

export const LogoIntro: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const { pathname } = useLocation();
  const isLandingHero = pathname === '/';
  const [visible, setVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    if (window.location.pathname === '/') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    try {
      return window.sessionStorage.getItem(SESSION_KEY) !== '1';
    } catch {
      return false;
    }
  });

  const dismiss = () => {
    setVisible(false);
    try {
      window.sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // ignore storage errors
    }
  };

  useEffect(() => {
    if (reducedMotion && visible) {
      dismiss();
      return;
    }
    if (!visible) return;

    const timer = window.setTimeout(() => {
      dismiss();
    }, 2850);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        dismiss();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [visible, reducedMotion]);

  if (reducedMotion || isLandingHero) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Bullish Titan Academy introduction"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.75, ease: LUXURY_EASE }}
          onClick={dismiss}
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-[#000000] select-none cursor-pointer"
        >
          {/* Ambient radial obsidian glow behind crest */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute h-[420px] w-[420px] rounded-full opacity-40"
            style={{
              background:
                'radial-gradient(circle, rgba(201,162,75,0.16) 0%, rgba(140,106,31,0.05) 45%, transparent 72%)',
            }}
          />

          <div className="relative h-64 w-64 sm:h-72 sm:w-72 flex items-center justify-center">
            {/* Step 1: Gold shield outline draws itself */}
            <svg
              aria-hidden="true"
              viewBox="0 0 200 220"
              className="pointer-events-none absolute inset-0 h-full w-full"
              fill="none"
            >
              <defs>
                <linearGradient id="intro-shield-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8C6A1F" />
                  <stop offset="50%" stopColor="#C9A24B" />
                  <stop offset="100%" stopColor="#F0D58A" />
                </linearGradient>
              </defs>
              <motion.path
                d="M 42,50 Q 100,26 158,50 L 158,176 Q 100,200 42,176 Z"
                stroke="url(#intro-shield-grad)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0.2 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.15, ease: LUXURY_EASE }}
              />
            </svg>

            {/* Step 2: Helmet & emblem gently fade in inside the drawn shield */}
            <motion.div
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.85, duration: 0.85, ease: LUXURY_EASE }}
              className="relative h-full w-full overflow-hidden flex items-center justify-center"
            >
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-11-15_at_11.43.04_PM_dff4afd1.jpeg"
                alt="Bullish Titan Academy crest"
                className="h-full w-full object-contain mix-blend-lighten"
              />

              {/* Step 3: Soft light-gold shimmer sweeps once across the helmet */}
              <motion.div
                aria-hidden="true"
                initial={{ x: '-130%', opacity: 0 }}
                animate={{ x: '135%', opacity: [0, 0.75, 0] }}
                transition={{ delay: 1.3, duration: 1.1, ease: 'easeInOut' }}
                className="pointer-events-none absolute inset-y-8 w-1/2 -skew-x-12 mix-blend-screen"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(240,213,138,0) 0%, rgba(240,213,138,0.45) 50%, rgba(240,213,138,0) 100%)',
                }}
              />
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.7, ease: LUXURY_EASE }}
            className="mt-4 font-mono text-[10px] uppercase tracking-[0.34em] text-[#9A968C]"
          >
            Forged Capital Discipline
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
