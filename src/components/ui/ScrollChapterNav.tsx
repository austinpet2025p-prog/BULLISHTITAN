import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ChapterLink {
  id: string;
  label: string;
}

const HOME_CHAPTERS: ChapterLink[] = [
  { id: 'hero', label: 'Start' },
  { id: 'about', label: 'About' },
  { id: 'spatial-architecture', label: 'How It Works' },
  { id: 'programs', label: 'Programs' },
  { id: 'results', label: 'Results' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'testimonials', label: 'Stories' },
  { id: 'pricing-enrollment', label: 'Pricing' },
  { id: 'faq', label: 'FAQ' },
];

/**
 * Minimal Apple-style right-edge vertical chapter rail on large viewports.
 * Tracks the currently centered section and allows one-click smooth scroll jumps.
 */
export const ScrollChapterNav: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string>('hero');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    HOME_CHAPTERS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(id);
            }
          });
        },
        { rootMargin: '-42% 0px -42% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  return (
    <nav
      aria-label="Page sections"
      className="fixed right-5 top-1/2 z-30 hidden xl:flex -translate-y-1/2 flex-col items-end gap-3"
    >
      {HOME_CHAPTERS.map((ch) => {
        const active = activeId === ch.id;
        return (
          <button
            key={ch.id}
            type="button"
            onClick={() => jumpTo(ch.id)}
            aria-label={`Jump to ${ch.label}`}
            className="group flex items-center gap-2.5 py-0.5 focus-visible:outline-2 focus-visible:outline-[#C9A24B] rounded"
          >
            <span
              className={cn(
                'font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300',
                active
                  ? 'opacity-100 text-[#F0D58A] translate-x-0'
                  : 'opacity-0 translate-x-1 text-[#9A968C] group-hover:opacity-90 group-hover:translate-x-0'
              )}
            >
              {ch.label}
            </span>
            <motion.span
              aria-hidden="true"
              animate={{
                width: active ? 22 : 10,
                opacity: active ? 1 : 0.45,
              }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'h-[2px] rounded-full transition-colors',
                active ? 'bg-gold-gradient' : 'bg-[#C9A24B]/60 group-hover:bg-[#F0D58A]'
              )}
            />
          </button>
        );
      })}
    </nav>
  );
};
