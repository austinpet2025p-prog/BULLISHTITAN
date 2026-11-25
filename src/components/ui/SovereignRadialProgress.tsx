import React, { useId, useMemo } from 'react';
import { motion } from 'motion/react';
import { Award, CheckCircle2, ShieldCheck } from 'lucide-react';
import { COURSES, type CourseItem } from '../../data/academyData';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';

export interface SovereignRadialProgressProps {
  /** Array of completed lesson keys formatted as `${courseId}:${moduleIndex}:${lessonIndex}` */
  completedLessons: string[];
  /** Optional focused course; if omitted, aggregates across all Forge courses */
  course?: CourseItem;
  /** Toggle a specific lesson key directly when interactive preview is desired */
  onToggleLesson?: (lessonKey: string) => void;
  /** Optional click handler when user clicks a module item */
  onSelectModule?: (courseId: string, moduleIndex: number) => void;
  /** Compact mode for dashboard overview cards vs full showcase */
  variant?: 'full' | 'compact';
  className?: string;
}

interface MandateTierInfo {
  rank: string;
  subtitle: string;
  accentClass: string;
}

function getMandateTier(percent: number): MandateTierInfo {
  if (percent >= 90) {
    return {
      rank: 'Sovereign Archon',
      subtitle: 'Full Mandate Readiness · Mastery Certified',
      accentClass: 'text-[#34D399]',
    };
  }
  if (percent >= 60) {
    return {
      rank: 'Strategos Commander',
      subtitle: 'Senior Execution & Risk Governance',
      accentClass: 'text-[#F0D58A]',
    };
  }
  if (percent >= 25) {
    return {
      rank: 'Vanguard Builder',
      subtitle: 'Active Liquidity & Precision Phase',
      accentClass: 'text-[#F0D58A]',
    };
  }
  return {
    rank: 'Agoge Initiate',
    subtitle: 'Foundational Structure Formation',
    accentClass: 'text-[#C9A24B]',
  };
}

interface ModuleProgressRow {
  courseId: string;
  moduleIndex: number;
  title: string;
  completedCount: number;
  totalCount: number;
  percent: number;
  firstLessonKey: string;
  nextIncompleteKey: string;
}

export const SovereignRadialProgress: React.FC<SovereignRadialProgressProps> = ({
  completedLessons,
  course,
  onToggleLesson,
  onSelectModule,
  variant = 'full',
  className,
}) => {
  const reducedMotion = useReducedMotion();
  const uid = useId().replace(/:/g, '');
  const gradGoldEmerald = `sovereign-grad-${uid}`;
  const gradEmerald = `emerald-grad-${uid}`;
  const glowFilter = `sovereign-glow-${uid}`;

  const { totalLessons, completedCount, percent, modules } = useMemo(() => {
    const targetCourses = course ? [course] : COURSES;
    let total = 0;
    let done = 0;
    const modRows: ModuleProgressRow[] = [];

    targetCourses.forEach((c) => {
      c.modules.forEach((mod, mIdx) => {
        let modDone = 0;
        let nextIncomplete = `${c.id}:${mIdx}:0`;
        let foundIncomplete = false;

        mod.lessons.forEach((_les, lIdx) => {
          const key = `${c.id}:${mIdx}:${lIdx}`;
          total += 1;
          if (completedLessons.includes(key)) {
            done += 1;
            modDone += 1;
          } else if (!foundIncomplete) {
            nextIncomplete = key;
            foundIncomplete = true;
          }
        });

        const modTotal = mod.lessons.length;
        const modPct = modTotal > 0 ? Math.round((modDone / modTotal) * 100) : 0;

        modRows.push({
          courseId: c.id,
          moduleIndex: mIdx,
          title: mod.title,
          completedCount: modDone,
          totalCount: modTotal,
          percent: modPct,
          firstLessonKey: `${c.id}:${mIdx}:0`,
          nextIncompleteKey: foundIncomplete
            ? nextIncomplete
            : `${c.id}:${mIdx}:${Math.max(0, modTotal - 1)}`,
        });
      });
    });

    const pct = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
    return {
      totalLessons: total,
      completedCount: done,
      percent: pct,
      modules: modRows,
    };
  }, [completedLessons, course]);

  const tier = getMandateTier(percent);

  // Main dial geometry
  const size = variant === 'compact' ? 148 : 188;
  const center = size / 2;
  const outerRadius = variant === 'compact' ? 58 : 74;
  const innerRadius = variant === 'compact' ? 46 : 60;
  const outerCirc = 2 * Math.PI * outerRadius;
  const innerCirc = 2 * Math.PI * innerRadius;
  const outerOffset = outerCirc - (percent / 100) * outerCirc;

  // Inner ring tracks how many modules reached 100% mastery
  const masteredModulesCount = modules.filter((m) => m.percent === 100).length;
  const moduleMasteryPct =
    modules.length > 0 ? Math.round((masteredModulesCount / modules.length) * 100) : 0;
  const innerOffset = innerCirc - (moduleMasteryPct / 100) * innerCirc;

  // 24 precision dial ticks around perimeter
  const ticks = useMemo(() => {
    const rOuter = outerRadius + 9;
    const rInner = outerRadius + 5;
    return Array.from({ length: 24 }, (_, idx) => {
      const angle = (idx / 24) * Math.PI * 2 - Math.PI / 2;
      return {
        x1: center + Math.cos(angle) * rInner,
        y1: center + Math.sin(angle) * rInner,
        x2: center + Math.cos(angle) * rOuter,
        y2: center + Math.sin(angle) * rOuter,
        major: idx % 6 === 0,
      };
    });
  }, [center, outerRadius]);

  return (
    <div
      className={cn(
        'rounded-2xl border border-stone-200 dark:border-[#C9A24B]/28 bg-white dark:bg-[#07090C] p-5 sm:p-6 shadow-sm dark:shadow-[0_18px_48px_rgba(0,0,0,0.65)]',
        className
      )}
    >
      {/* Top Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-200 dark:border-[#C9A24B]/18 pb-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-gold-gradient">
            Sovereign Mandate Completion
          </p>
          <h3 className="mt-1 font-display text-lg sm:text-xl font-bold text-stone-900 dark:text-[#EDE6D6]">
            {course ? course.title : 'Forge Training Ascension'}
          </h3>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#1F9D6B]/40 bg-[#1F9D6B]/12 px-2.5 py-1">
          <Award className="h-3.5 w-3.5 text-[#34D399]" />
          <span className="font-mono text-[11px] font-semibold text-[#1F9D6B] dark:text-[#34D399]">
            {tier.rank}
          </span>
        </div>
      </div>

      {/* Main Layout: Radial Gauge + Module Mini-Rings */}
      <div
        className={cn(
          'mt-5 grid gap-6 items-center',
          variant === 'compact' ? 'grid-cols-1 md:grid-cols-12' : 'grid-cols-1 lg:grid-cols-12'
        )}
      >
        {/* Radial Dial */}
        <div
          className={cn(
            'flex flex-col items-center justify-center',
            variant === 'compact' ? 'md:col-span-5' : 'lg:col-span-5'
          )}
        >
          <div className="relative flex items-center justify-center">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              role="img"
              aria-label={`Sovereign Mandate completion at ${percent} percent, rank ${tier.rank}`}
              className="overflow-visible"
            >
              <defs>
                <linearGradient id={gradGoldEmerald} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8C6A1F" />
                  <stop offset="45%" stopColor="#F0D58A" />
                  <stop offset="100%" stopColor="#34D399" />
                </linearGradient>
                <linearGradient id={gradEmerald} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1F9D6B" />
                  <stop offset="100%" stopColor="#34D399" />
                </linearGradient>
                <filter id={glowFilter} x="-25%" y="-25%" width="150%" height="150%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Perimeter calibration ticks */}
              {ticks.map((t, idx) => (
                <line
                  key={idx}
                  x1={t.x1}
                  y1={t.y1}
                  x2={t.x2}
                  y2={t.y2}
                  stroke={t.major ? '#C9A24B' : 'rgba(201, 162, 75, 0.28)'}
                  strokeWidth={t.major ? 1.6 : 1}
                  strokeLinecap="round"
                />
              ))}

              {/* Outer background track */}
              <circle
                cx={center}
                cy={center}
                r={outerRadius}
                fill="none"
                stroke="currentColor"
                strokeWidth={variant === 'compact' ? 8 : 9.5}
                className="text-stone-200 dark:text-[#151820]"
              />

              {/* Inner module mastery track */}
              <circle
                cx={center}
                cy={center}
                r={innerRadius}
                fill="none"
                stroke="currentColor"
                strokeWidth={3.5}
                className="text-stone-200/80 dark:text-[#121917]"
              />

              {/* Inner emerald arc (Modules 100% mastered) */}
              <motion.circle
                cx={center}
                cy={center}
                r={innerRadius}
                fill="none"
                stroke={`url(#${gradEmerald})`}
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeDasharray={innerCirc}
                initial={
                  reducedMotion
                    ? { strokeDashoffset: innerOffset }
                    : { strokeDashoffset: innerCirc }
                }
                animate={{ strokeDashoffset: innerOffset }}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { duration: 0.75, ease: [0.16, 1, 0.36, 1] }
                }
                transform={`rotate(-90 ${center} ${center})`}
              />

              {/* Outer Gold-to-Emerald Sovereign Mandate arc */}
              <motion.circle
                cx={center}
                cy={center}
                r={outerRadius}
                fill="none"
                stroke={`url(#${gradGoldEmerald})`}
                strokeWidth={variant === 'compact' ? 8 : 9.5}
                strokeLinecap="round"
                strokeDasharray={outerCirc}
                initial={
                  reducedMotion
                    ? { strokeDashoffset: outerOffset }
                    : { strokeDashoffset: outerCirc }
                }
                animate={{ strokeDashoffset: outerOffset }}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { duration: 0.85, ease: [0.16, 1, 0.36, 1] }
                }
                transform={`rotate(-90 ${center} ${center})`}
                filter={percent > 0 ? `url(#${glowFilter})` : undefined}
              />
            </svg>

            {/* Center Telemetry */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-stone-500 dark:text-[#9A968C]">
                Mandate
              </span>
              <span className="font-display text-3xl sm:text-4xl font-bold text-emerald-gold tabular-nums leading-none mt-0.5">
                {percent}%
              </span>
              <span className="mt-1 font-mono text-[10px] text-stone-600 dark:text-[#A39E93] tabular-nums">
                {completedCount}/{totalLessons} Drills
              </span>
            </div>
          </div>

          <p className={cn('mt-3 font-mono text-xs font-semibold', tier.accentClass)}>
            {tier.rank}
          </p>
          <p className="mt-0.5 text-[11px] text-center text-stone-600 dark:text-[#9A968C]">
            {tier.subtitle}
          </p>
        </div>

        {/* Module Radial Mini-Rings List */}
        <div
          className={cn(
            'space-y-2.5',
            variant === 'compact' ? 'md:col-span-7' : 'lg:col-span-7'
          )}
        >
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-[#9A968C] pb-1">
            <span>Module Breakdown</span>
            <span className="text-[#1F9D6B] dark:text-[#34D399]">
              {masteredModulesCount}/{modules.length} Mastered
            </span>
          </div>

          <div className="max-h-[290px] overflow-y-auto pr-1 space-y-2">
            {modules.map((mod) => {
              const miniR = 15;
              const miniCirc = 2 * Math.PI * miniR;
              const miniOffset = miniCirc - (mod.percent / 100) * miniCirc;
              const isMastered = mod.percent === 100;

              return (
                <div
                  key={`${mod.courseId}-${mod.moduleIndex}`}
                  className={cn(
                    'flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 transition-colors',
                    isMastered
                      ? 'border-[#1F9D6B]/45 bg-[#1F9D6B]/8 dark:bg-[#081A14]'
                      : 'border-stone-200 dark:border-[#C9A24B]/20 bg-stone-50 dark:bg-[#0D1016]'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSelectModule?.(mod.courseId, mod.moduleIndex)}
                    disabled={!onSelectModule}
                    className={cn(
                      'flex items-center gap-3 min-w-0 flex-1 text-left',
                      onSelectModule ? 'cursor-pointer' : 'cursor-default'
                    )}
                  >
                    <div className="relative h-10 w-10 shrink-0 flex items-center justify-center">
                      <svg className="h-10 w-10 -rotate-90" viewBox="0 0 38 38" aria-hidden="true">
                        <circle
                          cx="19"
                          cy="19"
                          r={miniR}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="text-stone-200 dark:text-[#1A1D24]"
                        />
                        <circle
                          cx="19"
                          cy="19"
                          r={miniR}
                          fill="none"
                          stroke={isMastered ? '#34D399' : '#F0D58A'}
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray={miniCirc}
                          strokeDashoffset={miniOffset}
                          className="transition-all duration-500"
                        />
                      </svg>
                      <span className="absolute font-mono text-[9px] font-bold tabular-nums text-stone-800 dark:text-[#EDE6D6]">
                        {mod.percent}%
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs sm:text-sm font-semibold text-stone-900 dark:text-[#EDE6D6]">
                        {mod.title}
                      </p>
                      <p className="font-mono text-[10px] text-stone-500 dark:text-[#9A968C] tabular-nums">
                        {mod.completedCount} of {mod.totalCount} lessons complete
                      </p>
                    </div>
                  </button>

                  <div className="shrink-0 flex items-center gap-2">
                    {onToggleLesson && (
                      <button
                        type="button"
                        onClick={() =>
                          onToggleLesson(isMastered ? mod.firstLessonKey : mod.nextIncompleteKey)
                        }
                        className={cn(
                          'inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors',
                          isMastered
                            ? 'border-[#1F9D6B]/45 bg-[#1F9D6B]/15 text-[#1F9D6B] dark:text-[#34D399]'
                            : 'border-[#C9A24B]/35 bg-[#C9A24B]/10 text-amber-800 dark:text-[#F0D58A] hover:border-[#F0D58A]'
                        )}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        {isMastered ? 'Mastered' : '+1 Drill'}
                      </button>
                    )}
                    {!onToggleLesson && isMastered && (
                      <ShieldCheck className="h-4 w-4 text-[#34D399]" aria-label="Module mastered" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
