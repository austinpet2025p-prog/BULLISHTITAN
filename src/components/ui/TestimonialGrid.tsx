import React, { useId, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { LayoutGrid, Rows2 } from 'lucide-react';
import { ShieldCrestBadge, GoldHairlineDivider } from './TitanMotifs';
import { TESTIMONIAL_TEMPLATES, type TestimonialTemplate } from '../../data/academyData';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';

export type TestimonialGridLayout = '3x2' | '2x2';
export type TestimonialMarketFilter = 'All' | 'Forex & Gold' | 'Synthetic Indices';

export interface TestimonialGridItem extends Partial<TestimonialTemplate> {
  id: string;
  name: string;
  role: string;
  quote: string;
  metricValue: string;
  metricLabel: string;
  timeframe?: string;
}

export interface TestimonialGridProps {
  items?: TestimonialGridItem[];
  defaultLayout?: TestimonialGridLayout;
  allowLayoutToggle?: boolean;
  allowCategoryFilter?: boolean;
  className?: string;
}

const CARD_JEWEL_ACCENTS = [
  {
    surface: 'hairline-sapphire',
    metricClass: 'text-sapphire-gold',
    kickerColor: 'text-[#93C5FD]',
    dividerBorder: 'border-[#60A5FA]/20',
  },
  {
    surface: 'hairline-emerald',
    metricClass: 'text-emerald-gold',
    kickerColor: 'text-[#6EE7B7]',
    dividerBorder: 'border-[#34D399]/20',
  },
  {
    surface: 'hairline-amethyst',
    metricClass: 'text-gold-gradient',
    kickerColor: 'text-[#D8B4FE]',
    dividerBorder: 'border-[#C084FC]/20',
  },
  {
    surface: 'hairline-bronze',
    metricClass: 'text-gold-gradient',
    kickerColor: 'text-[#FCD34D]',
    dividerBorder: 'border-[#F59E0B]/20',
  },
  {
    surface: 'hairline-gold-bright',
    metricClass: 'text-sapphire-gold',
    kickerColor: 'text-[#F0D58A]',
    dividerBorder: 'border-[#C9A24B]/22',
  },
  {
    surface: 'hairline-emerald',
    metricClass: 'text-emerald-gold',
    kickerColor: 'text-[#6EE7B7]',
    dividerBorder: 'border-[#34D399]/20',
  },
] as const;

const APPLE_EASE = [0.16, 1, 0.3, 1] as const;

export const TestimonialGrid: React.FC<TestimonialGridProps> = ({
  items = TESTIMONIAL_TEMPLATES,
  defaultLayout = '3x2',
  allowLayoutToggle = true,
  allowCategoryFilter = true,
  className,
}) => {
  const reducedMotion = useReducedMotion();
  const filterTabId = useId();
  const layoutTabId = useId();

  const [layout, setLayout] = useState<TestimonialGridLayout>(defaultLayout);
  const [filter, setFilter] = useState<TestimonialMarketFilter>('All');

  const filteredItems = useMemo(() => {
    const base =
      filter === 'All'
        ? items
        : items.filter((item) => item.marketCategory === filter);

    const limit = layout === '2x2' ? 4 : 6;
    return base.slice(0, limit);
  }, [filter, items, layout]);

  const filterOptions: TestimonialMarketFilter[] = ['All', 'Forex & Gold', 'Synthetic Indices'];

  return (
    <div className={cn('space-y-6', className)}>
      {(allowCategoryFilter || allowLayoutToggle) && (
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#C9A24B]/18">
          {allowCategoryFilter && (
            <div
              role="tablist"
              aria-label="Filter success stories by desk discipline"
              className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-[#C9A24B]/24 bg-[#000000] p-1"
            >
              {filterOptions.map((opt) => {
                const active = filter === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(opt)}
                    className={cn(
                      'relative px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors min-h-[38px]',
                      active ? 'text-[#000000] font-semibold' : 'text-[#9A968C] hover:text-[#EDE6D6]'
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId={filterTabId}
                        transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 360, damping: 32 }}
                        className="absolute inset-0 rounded-lg bg-gold-gradient"
                      />
                    )}
                    <span className="relative z-10">
                      {opt === 'All' ? 'All Disciplines' : opt}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-3 ml-auto">
            <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider text-[#9A968C] tabular-nums">
              Showing {filteredItems.length} Verified Ledgers
            </span>

            {allowLayoutToggle && (
              <div
                role="tablist"
                aria-label="Grid column layout"
                className="inline-flex items-center gap-1 rounded-xl border border-[#60A5FA]/28 bg-[#091326]/65 p-1"
              >
                {(
                  [
                    { key: '3x2', label: '3×2', aria: '3 by 2 grid view', Icon: LayoutGrid },
                    { key: '2x2', label: '2×2', aria: '2 by 2 focus grid view', Icon: Rows2 },
                  ] as const
                ).map(({ key, label, aria, Icon }) => {
                  const active = layout === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-label={aria}
                      onClick={() => setLayout(key)}
                      className={cn(
                        'relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-mono text-xs font-medium whitespace-nowrap shrink-0 transition-colors min-h-[38px]',
                        active ? 'text-[#000000] font-semibold' : 'text-[#9A968C] hover:text-[#EDE6D6]'
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId={layoutTabId}
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
            )}
          </div>
        </div>
      )}

      {/* Responsive 2x2 or 3x2 High-Impact Stat Grid */}
      <div
        className={cn(
          'grid gap-6',
          layout === '2x2'
            ? 'grid-cols-1 md:grid-cols-2'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        )}
      >
        {filteredItems.map((story, idx) => {
          const theme = CARD_JEWEL_ACCENTS[idx % CARD_JEWEL_ACCENTS.length];
          return (
            <motion.article
              key={story.id}
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { duration: 0.45, delay: Math.min(idx * 0.06, 0.25), ease: APPLE_EASE }
              }
              whileHover={reducedMotion ? undefined : { y: -3 }}
              className={cn(
                'flex h-full flex-col justify-between rounded-2xl p-6 sm:p-7 transition-transform duration-200',
                theme.surface
              )}
            >
              <div>
                {/* Top Unboxed Typographic Metadata */}
                <div
                  className={cn(
                    'flex items-center justify-between gap-3 pb-4 border-b font-mono text-[11px]',
                    theme.dividerBorder
                  )}
                >
                  <span className={cn('font-semibold tracking-wider truncate', theme.kickerColor)}>
                    0{idx + 1} · {story.focusAsset ?? 'FX & Synthetics'}
                  </span>
                  {story.timeframe && (
                    <span className="text-[#9A968C] whitespace-nowrap shrink-0 tabular-nums">
                      {story.timeframe}
                    </span>
                  )}
                </div>

                {/* Centered High-Impact Stat Focal Block */}
                <div className="py-6 text-center">
                  <p
                    className={cn(
                      'font-display text-4xl sm:text-5xl font-bold tracking-tight tabular-nums leading-none',
                      theme.metricClass
                    )}
                  >
                    {story.metricValue}
                  </p>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#EDE6D6]/90 font-semibold">
                    {story.metricLabel}
                  </p>
                </div>

                {/* Structured Detailed Metrics Ledger (Hairline Divided, Zero Nested Cards) */}
                <div
                  className={cn(
                    'grid grid-cols-3 gap-3 py-3.5 border-y text-center font-mono tabular-nums',
                    theme.dividerBorder
                  )}
                >
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-[#9A968C]">
                      Risk Cap
                    </span>
                    <span className="mt-0.5 block text-xs font-semibold text-[#EDE6D6]">
                      {story.riskCap ?? '1.0% Max'}
                    </span>
                  </div>
                  <div className={cn('border-x px-1', theme.dividerBorder)}>
                    <span className="block text-[10px] uppercase tracking-wider text-[#9A968C]">
                      Sample
                    </span>
                    <span className="mt-0.5 block text-xs font-semibold text-[#EDE6D6]">
                      {story.sampleSize ?? 'Verified Log'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-[#9A968C]">
                      Execution
                    </span>
                    <span className={cn('mt-0.5 block text-xs font-semibold', theme.kickerColor)}>
                      {story.consistencyDelta ?? 'Audited'}
                    </span>
                  </div>
                </div>

                {/* Story Quote */}
                <blockquote className="mt-5 font-display italic text-sm sm:text-base text-[#EDE6D6]/92 leading-relaxed">
                  &ldquo;{story.quote}&rdquo;
                </blockquote>
              </div>

              {/* Attributable Member Footer */}
              <div className="mt-6">
                <GoldHairlineDivider className="mb-4" />
                <div className="flex items-center gap-3">
                  {story.initials && (
                    <ShieldCrestBadge className="h-10 w-9 shrink-0">
                      <span className="font-mono text-[11px] font-bold text-[#F0D58A]">
                        {story.initials}
                      </span>
                    </ShieldCrestBadge>
                  )}
                  <div className="min-w-0">
                    <p className="font-display text-base font-bold text-[#EDE6D6] truncate">
                      {story.name}
                    </p>
                    <p className="text-xs text-[#9A968C] truncate">
                      {story.role}
                      {story.location ? ` · ${story.location}` : ''}
                    </p>
                    {story.program && (
                      <p className="mt-0.5 font-mono text-[10px] text-[#C9A24B]/90 truncate">
                        {story.program}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
};
