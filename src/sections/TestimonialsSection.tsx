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
      kicker="The Phalanx · Field Ledgers"
      title="Field Ledgers From Across the Phalanx"
      subtitle="Verified execution discipline and quantitative risk logs from fellows across Forex Majors, Gold, and Synthetic Indices cohorts."
    >
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sapphire-gold font-semibold">
          {viewMode === 'grid'
            ? 'Featured Victory Ledgers · Complements Desk Marquee'
            : 'Interactive Ledger Slider & Continuous Stream'}
        </p>

        <div
          role="tablist"
          aria-label="Field ledger display format"
          className="inline-flex items-center gap-1 rounded-xl border border-[#C9A24B]/24 bg-[#000000] p-1"
        >
          {(
            [
              { key: 'grid', label: 'Ledger Grid', Icon: LayoutGrid },
              { key: 'carousel', label: 'Carousel View', Icon: GalleryHorizontalEnd },
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
