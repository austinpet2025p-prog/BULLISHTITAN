import React, { useId, useState } from 'react';
import { motion } from 'motion/react';
import { GalleryHorizontalEnd, LayoutGrid } from 'lucide-react';
import { Section } from '../components/ui/Section';
import { TestimonialGrid } from '../components/ui/TestimonialGrid';
import { FloatingStatCards } from '../components/ui/FloatingStatCards';
import { TestimonialCarousel } from '../components/ui/TestimonialCarousel';
import { TESTIMONIAL_TEMPLATES } from '../data/academyData';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { cn } from '../lib/utils';

type TestimonialsViewMode = 'grid' | 'carousel';

export const TestimonialsSection: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const modeId = useId();
  const [viewMode, setViewMode] = useState<TestimonialsViewMode>('grid');

  return (
    <Section
      id="testimonials"
      romanIndex="06"
      kicker="Student Stories"
      title="Real Feedback From Our Students"
      subtitle="See how everyday traders built calm habits and clear risk rules across Forex, Gold, and Synthetic Indices."
    >
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sapphire-gold font-semibold">
          {viewMode === 'grid'
            ? 'Featured Student Reviews'
            : 'Interactive Review Slider'}
        </p>

        <div
          role="tablist"
          aria-label="Student review layout"
          className="inline-flex items-center gap-1 rounded-xl border border-[#C9A24B]/24 bg-[#000000] p-1"
        >
          {(
            [
              { key: 'grid', label: 'Grid View', Icon: LayoutGrid },
              { key: 'carousel', label: 'Slider View', Icon: GalleryHorizontalEnd },
            ] as const
          ).map(({ key, label, Icon }) => {
            const active = viewMode === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setViewMode(key)}
                className={cn(
                  'relative inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors min-h-[38px]',
                  active ? 'text-[#000000] font-semibold' : 'text-[#9A968C] hover:text-[#EDE6D6]'
                )}
              >
                {active && (
                  <motion.span
                    layoutId={modeId}
                    transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 360, damping: 32 }}
                    className="absolute inset-0 rounded-lg bg-gold-gradient"
                  />
                )}
                <Icon className="relative z-10 h-3.5 w-3.5" aria-hidden="true" />
                <span className="relative z-10">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {viewMode === 'grid' ? (
        <FloatingStatCards>
          <TestimonialGrid items={TESTIMONIAL_TEMPLATES} defaultLayout="3x2" />
        </FloatingStatCards>
      ) : (
        <TestimonialCarousel items={TESTIMONIAL_TEMPLATES} defaultMode="slider" />
      )}
    </Section>
  );
};
