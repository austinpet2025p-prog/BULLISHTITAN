import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Lock,
  ShieldCheck,
  ZoomIn,
} from 'lucide-react';
import { AnimatePresence, motion, type PanInfo } from 'motion/react';
import { SafeImage } from '../ui/SafeImage';
import { ShieldFrame } from '../ui/TitanMotifs';
import { Tabs } from '../ui/Tabs';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { RiskDisclaimer } from '../ui/RiskDisclaimer';
import { ACADEMY_ASSETS } from '../../data/academyData';
import {
  MANAGED_ACCOUNT_AUDITS,
  type ManagedAccountAudit,
} from '../../data/extendedData';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';

type AuditFilter = 'all' | 'Forex & Gold' | 'Synthetic Indices';

interface MandateAuditShowcaseProps {
  onSelectPhaseForKyc: (phaseName: string) => void;
}

const ITEMS_PER_PAGE = 3;

export const MandateAuditShowcase: React.FC<MandateAuditShowcaseProps> = ({
  onSelectPhaseForKyc,
}) => {
  const reducedMotion = useReducedMotion();
  const [filter, setFilter] = useState<AuditFilter>('all');
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [inspectAudit, setInspectAudit] = useState<ManagedAccountAudit | null>(null);

  const filteredAudits = useMemo(() => {
    if (filter === 'all') return MANAGED_ACCOUNT_AUDITS;
    return MANAGED_ACCOUNT_AUDITS.filter((item) => item.marketGroup === filter);
  }, [filter]);

  const totalPages = Math.max(1, Math.ceil(filteredAudits.length / ITEMS_PER_PAGE));
  const safePage = page % totalPages;
  const visibleAudits = filteredAudits.slice(
    safePage * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  const handleFilterChange = (next: AuditFilter) => {
    setFilter(next);
    setPage(0);
    setDirection(1);
  };

  const goToPage = (nextPage: number, nextDir: 1 | -1) => {
    setDirection(nextDir);
    setPage((nextPage + totalPages) % totalPages);
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (totalPages <= 1) return;
    if (info.offset.x < -48 || info.velocity.x < -300) {
      goToPage(safePage + 1, 1);
    } else if (info.offset.x > 48 || info.velocity.x > 300) {
      goToPage(safePage - 1, -1);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs<AuditFilter>
          value={filter}
          onChange={handleFilterChange}
          options={[
            { value: 'all', label: 'All Demo Audits' },
            { value: 'Forex & Gold', label: 'Forex & Gold' },
            { value: 'Synthetic Indices', label: 'Synthetic Indices' },
          ]}
        />

        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#9A968C] tabular-nums">
          Page {String(safePage + 1).padStart(2, '0')} of {String(totalPages).padStart(2, '0')} · Swipe or Paginate
        </p>
      </div>

      {/* Directional Swipeable 3-Column Showcase Grid */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${filter}-${safePage}`}
            custom={direction}
            initial={
              reducedMotion
                ? false
                : { opacity: 0, x: direction > 0 ? 32 : -32 }
            }
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, x: direction > 0 ? -32 : 32 }
            }
            transition={{ duration: 0.32, ease: [0.16, 1, 0.36, 1] }}
            drag={reducedMotion || totalPages <= 1 ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={handleDragEnd}
            className="grid gap-6 md:grid-cols-3"
          >
            {visibleAudits.map((audit, idx) => (
              <motion.article
                key={audit.id}
                initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={{
                  duration: 0.32,
                  delay: reducedMotion ? 0 : idx * 0.06,
                  ease: [0.16, 1, 0.36, 1],
                }}
                className="group relative rounded-lg hairline-gold bg-[#0B0B0C] p-4 flex flex-col justify-between transition-colors duration-200 hover:border-[#F0D58A]/55"
              >
                <div>
                  <ShieldFrame variant="landscape" innerClassName="aspect-[16/10] w-full">
                    <SafeImage
                      src={ACADEMY_ASSETS[audit.imageKey]}
                      alt={`${audit.title} — ${audit.phase}`}
                      width={900}
                      height={560}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#000000]/90 via-[#000000]/30 to-transparent"
                    />

                    {/* Lightbox Zoom Button inspired by reference project-block-one */}
                    <button
                      type="button"
                      onClick={() => setInspectAudit(audit)}
                      aria-label={`Inspect ${audit.title} audit`}
                      className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-md border border-[#C9A24B]/45 bg-[#000000]/85 text-[#F0D58A] transition-all duration-200 hover:border-[#F0D58A] hover:scale-105 focus-visible:outline-2 focus-visible:outline-[#F0D58A]"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </button>

                    {/* Hover-Reveal Governance Overlay (Compositor transform + opacity only) */}
                    <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2 transition-transform duration-300 ease-out group-hover:-translate-y-0.5">
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#F0D58A] truncate">
                          {audit.phase} · {audit.marketGroup}
                        </p>
                        <p className="font-mono text-xs text-[#EDE6D6] tabular-nums truncate">
                          {audit.instrumentFocus}
                        </p>
                      </div>
                      <span className="font-mono text-xs font-semibold text-[#EF4444] shrink-0 tabular-nums">
                        {audit.maxDrawdown}
                      </span>
                    </div>
                  </ShieldFrame>

                  <div className="pt-4 px-1">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-[#9A968C]">
                      {audit.horizon}
                    </p>
                    <h3 className="mt-1.5 font-display text-lg font-bold text-[#EDE6D6] leading-snug">
                      {audit.title}
                    </h3>
                    <p className="mt-2 text-xs text-[#9A968C] leading-relaxed">
                      {audit.summary}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#C9A24B]/18 flex items-center justify-between gap-2 px-1">
                  <span className="font-mono text-xs font-semibold text-[#1F9D6B] tabular-nums">
                    {audit.demoReturn}
                  </span>
                  <button
                    type="button"
                    onClick={() => setInspectAudit(audit)}
                    className="inline-flex items-center gap-1.5 py-1 text-xs font-semibold text-[#F0D58A] hover:underline whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#C9A24B] rounded"
                  >
                    Inspect Dossier
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Reference Numbered Pagination Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => goToPage(safePage - 1, -1)}
          aria-label="Previous audit records page"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-[#C9A24B]/24 bg-[#0B0B0C] text-[#EDE6D6] hover:border-[#F0D58A]/60 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <ul className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, idx) => (
            <li key={idx}>
              <button
                type="button"
                onClick={() => goToPage(idx, idx > safePage ? 1 : -1)}
                aria-current={safePage === idx ? 'page' : undefined}
                aria-label={`Audit page ${idx + 1}`}
                className={cn(
                  'flex h-10 min-w-[40px] items-center justify-center rounded-md border font-mono text-xs font-semibold transition-colors tabular-nums',
                  safePage === idx
                    ? 'border-[#F0D58A] bg-gold-gradient text-[#000000]'
                    : 'border-[#C9A24B]/22 bg-[#0B0B0C] text-[#9A968C] hover:border-[#C9A24B]/50 hover:text-[#EDE6D6]'
                )}
              >
                {idx + 1}
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => goToPage(safePage + 1, 1)}
          aria-label="Next audit records page"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-[#C9A24B]/24 bg-[#0B0B0C] text-[#EDE6D6] hover:border-[#F0D58A]/60 transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <RiskDisclaimer compact />

      {/* Audit Dossier Lightbox Modal */}
      <Modal
        isOpen={Boolean(inspectAudit)}
        onClose={() => setInspectAudit(null)}
        title={inspectAudit?.title || 'Managed Mandate Audit'}
        subtitle={
          inspectAudit
            ? `${inspectAudit.phase} · ${inspectAudit.horizon}`
            : undefined
        }
        size="lg"
      >
        {inspectAudit && (
          <div className="space-y-5">
            <ShieldFrame variant="landscape" bright innerClassName="aspect-[16/9] w-full">
              <SafeImage
                src={ACADEMY_ASSETS[inspectAudit.imageKey]}
                alt={inspectAudit.title}
                width={1100}
                height={620}
                className="h-full w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#000000]/85 via-transparent to-transparent"
              />
              <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <span className="text-[#F0D58A] font-semibold">
                  {inspectAudit.instrumentFocus}
                </span>
                <span className="text-[#EDE6D6]">{inspectAudit.custodyNote}</span>
              </div>
            </ShieldFrame>

            <div className="grid gap-3 sm:grid-cols-3 border-y border-[#C9A24B]/20 py-4 font-mono">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[#9A968C]">
                  Indicative Demo Change
                </span>
                <span className="mt-1 block text-base font-bold text-[#1F9D6B] tabular-nums">
                  {inspectAudit.demoReturn}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[#9A968C]">
                  Observed Demo Drawdown
                </span>
                <span className="mt-1 block text-base font-bold text-[#EF4444] tabular-nums">
                  {inspectAudit.maxDrawdown}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[#9A968C]">
                  Mandate Rank
                </span>
                <span className="mt-1 block text-base font-bold text-[#F0D58A]">
                  {inspectAudit.phase}
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gold-gradient">
                <ShieldCheck className="h-4 w-4 text-[#C9A24B]" />
                <span>Mandate Governance &amp; Stewardship Rules Enforced</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-[#EDE6D6]/90">
                {inspectAudit.rulesApplied.map((rule) => (
                  <li key={rule} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 shrink-0 text-[#C9A24B] mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#C9A24B]/18">
              <div className="flex items-center gap-2 text-xs text-[#9A968C]">
                <Lock className="h-3.5 w-3.5 text-[#C9A24B]" />
                <span>Capital remains strictly inside client-owned broker custody.</span>
              </div>
              <Button
                variant="primary"
                onClick={() => {
                  const chosen = inspectAudit.phase;
                  setInspectAudit(null);
                  onSelectPhaseForKyc(chosen);
                }}
              >
                Apply Under {inspectAudit.phase}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <RiskDisclaimer compact />
          </div>
        )}
      </Modal>
    </div>
  );
};
