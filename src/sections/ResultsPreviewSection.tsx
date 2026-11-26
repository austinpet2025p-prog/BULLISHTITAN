import React, { useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Section } from '../components/ui/Section';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { RiskDisclaimer } from '../components/ui/RiskDisclaimer';
import { SafeImage } from '../components/ui/SafeImage';
import {
  ShieldFrame,
  EditorialReveal,
  GoldHairlineDivider,
} from '../components/ui/TitanMotifs';
import { ACADEMY_ASSETS, DEMO_EQUITY_CURVE } from '../data/academyData';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { cn } from '../lib/utils';

type RangeKey = '30D' | '90D' | '1Y';
const LUXURY_EASE = [0.22, 1, 0.36, 1] as const;

function buildSmoothSvgPath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;

  let d = `M ${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const midX = ((p0.x + p1.x) / 2).toFixed(2);
    d += ` C ${midX},${p0.y.toFixed(2)} ${midX},${p1.y.toFixed(2)} ${p1.x.toFixed(2)},${p1.y.toFixed(2)}`;
  }
  return d;
}

export const ResultsPreviewSection: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const [range, setRange] = useState<RangeKey>('90D');
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start end', 'center center'],
  });

  const stageScale = useTransform(scrollYProgress, [0, 1], [0.955, 1]);
  const stageOpacity = useTransform(scrollYProgress, [0, 0.7], [0.72, 1]);

  const dataset = DEMO_EQUITY_CURVE[range];

  const chartGeometry = useMemo(() => {
    const width = 760;
    const height = 300;
    const padLeft = 48;
    const padRight = 24;
    const padTop = 26;
    const padBottom = 38;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    const allValues = dataset.flatMap((d) => [d.demoIndex, d.benchmark]);
    const minVal = Math.floor(Math.min(...allValues) - 1);
    const maxVal = Math.ceil(Math.max(...allValues) + 1);
    const span = Math.max(1, maxVal - minVal);

    const toPoint = (val: number, idx: number) => ({
      x: padLeft + (idx / Math.max(1, dataset.length - 1)) * plotW,
      y: padTop + (1 - (val - minVal) / span) * plotH,
    });

    const growthPoints = dataset.map((d, idx) => toPoint(d.demoIndex, idx));
    const basePoints = dataset.map((d, idx) => toPoint(d.benchmark, idx));

    const growthPath = buildSmoothSvgPath(growthPoints);
    const baselinePath = buildSmoothSvgPath(basePoints);

    const lastGrowth = growthPoints[growthPoints.length - 1];
    const firstGrowth = growthPoints[0];
    const areaPath =
      growthPath && lastGrowth && firstGrowth
        ? `${growthPath} L ${lastGrowth.x.toFixed(2)},${(padTop + plotH).toFixed(2)} L ${firstGrowth.x.toFixed(2)},${(padTop + plotH).toFixed(2)} Z`
        : '';

    const yTicks = [0, 0.33, 0.66, 1].map((t) => ({
      val: (maxVal - t * span).toFixed(0),
      y: padTop + t * plotH,
    }));

    return {
      width,
      height,
      padLeft,
      padRight,
      padTop,
      plotH,
      growthPoints,
      basePoints,
      growthPath,
      baselinePath,
      areaPath,
      yTicks,
    };
  }, [dataset]);

  const activePointIdx = hoverIdx ?? dataset.length - 1;
  const activeDatum = dataset[activePointIdx];
  const activeCoord = chartGeometry.growthPoints[activePointIdx];
  const startVal = dataset[0]?.demoIndex ?? 100;
  const endVal = dataset[dataset.length - 1]?.demoIndex ?? 100;
  const netReturnPct = (((endVal - startVal) / startVal) * 100).toFixed(1);

  return (
    <Section
      id="results"
      romanIndex="04"
      kicker="Sample Track Record"
      title="Steady Growth With Small Risks"
      subtitle="See how risking just 1% per trade protects an account during quiet weeks and helps steady wins add up over time."
    >
      <div ref={stageRef} className="grid gap-10 lg:grid-cols-12 items-start">
        {/* Left: Self-Drawing SVG Equity Curve with Scroll-Zoom Settle */}
        <motion.div
          style={reducedMotion ? undefined : { scale: stageScale, opacity: stageOpacity }}
          className="lg:col-span-8 hairline-emerald bg-aurora-obsidian rounded-xl p-5 sm:p-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-[#34D399]/18">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-emerald-gold">
                Demo Risk-Managed Index · Illustrative Dataset
              </p>
              <h3 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-[#EDE6D6]">
                1% Fixed-Risk Equity Trajectory ({range})
              </h3>
            </div>

            <Tabs
              value={range}
              onChange={(next) => {
                setHoverIdx(null);
                setRange(next);
              }}
              options={[
                { value: '30D', label: '30D' },
                { value: '90D', label: '90D' },
                { value: '1Y', label: '1Y' },
              ]}
            />
          </div>

          {/* Interactive Value Readout Bar */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#C9A24B]/16 bg-[#000000]/80 px-4 py-2.5 text-xs font-mono tabular-nums">
            <span className="text-[#9A968C]">
              Checkpoint: <strong className="text-[#EDE6D6]">{activeDatum?.label}</strong>
            </span>
            <div className="flex flex-wrap items-center gap-5">
              <span className="text-[#1F9D6B] font-semibold">
                Equity Curve: {activeDatum?.demoIndex.toFixed(1)} pts
              </span>
              <span className="text-[#C9A24B]">
                Baseline: {activeDatum?.benchmark.toFixed(1)} pts
              </span>
            </div>
          </div>

          {/* Self-Drawing Equity SVG */}
          <div className="relative w-full">
            <svg
              viewBox={`0 0 ${chartGeometry.width} ${chartGeometry.height}`}
              className="w-full h-auto overflow-visible select-none"
              role="img"
              aria-label={`Self-drawing demo equity curve for ${range}`}
            >
              <defs>
                <linearGradient id="equityEmeraldArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34D399" stopOpacity="0.34" />
                  <stop offset="55%" stopColor="#2563EB" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="#091326" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="equityEmeraldStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="50%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#F0D58A" />
                </linearGradient>
              </defs>

              {/* Horizontal hairlines & Y-axis labels */}
              {chartGeometry.yTicks.map((tick) => (
                <g key={tick.val + tick.y}>
                  <line
                    x1={chartGeometry.padLeft}
                    y1={tick.y}
                    x2={chartGeometry.width - chartGeometry.padRight}
                    y2={tick.y}
                    stroke="rgba(201, 162, 75, 0.1)"
                    strokeWidth="1"
                  />
                  <text
                    x={chartGeometry.padLeft - 10}
                    y={tick.y + 4}
                    textAnchor="end"
                    fill="#9A968C"
                    fontSize="11"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {tick.val}
                  </text>
                </g>
              ))}

              {/* Subtle under-curve emerald area fill */}
              {chartGeometry.areaPath && (
                <motion.path
                  key={`area-${range}`}
                  d={chartGeometry.areaPath}
                  fill="url(#equityEmeraldArea)"
                  initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ delay: 0.35, duration: 1.4, ease: LUXURY_EASE }}
                />
              )}

              {/* Gold Baseline Curve */}
              <motion.path
                key={`base-${range}`}
                d={chartGeometry.baselinePath}
                fill="none"
                stroke="#C9A24B"
                strokeOpacity="0.55"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                initial={reducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 1.8, ease: LUXURY_EASE }}
              />

              {/* Primary Self-Drawing Emerald Equity Curve */}
              <motion.path
                key={`growth-${range}`}
                d={chartGeometry.growthPath}
                fill="none"
                stroke="url(#equityEmeraldStroke)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 2.1, ease: LUXURY_EASE }}
              />

              {/* X-axis labels & interactive inspection targets */}
              {dataset.map((datum, idx) => {
                const pt = chartGeometry.growthPoints[idx];
                const isSelected = idx === activePointIdx;
                return (
                  <g
                    key={datum.label}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoverIdx(idx)}
                    onClick={() => setHoverIdx(idx)}
                  >
                    {isSelected && (
                      <line
                        x1={pt.x}
                        y1={chartGeometry.padTop}
                        x2={pt.x}
                        y2={chartGeometry.padTop + chartGeometry.plotH}
                        stroke="rgba(240, 213, 138, 0.28)"
                        strokeWidth="1"
                      />
                    )}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? 5.5 : 3.2}
                      fill={isSelected ? '#1F9D6B' : '#0B0B0C'}
                      stroke="#1F9D6B"
                      strokeWidth="2"
                    />
                    <circle cx={pt.x} cy={pt.y} r="18" fill="transparent" />
                    <text
                      x={pt.x}
                      y={chartGeometry.height - 10}
                      textAnchor="middle"
                      fill={isSelected ? '#F0D58A' : '#9A968C'}
                      fontSize="11"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {datum.label}
                    </text>
                  </g>
                );
              })}

              {/* Highlight halo around active/final point */}
              {activeCoord && (
                <circle
                  cx={activeCoord.x}
                  cy={activeCoord.y}
                  r="10"
                  fill="none"
                  stroke="#1F9D6B"
                  strokeOpacity="0.4"
                  strokeWidth="1.25"
                />
              )}
            </svg>
          </div>

          <GoldHairlineDivider className="mt-4" />
          <div className="pt-5 grid grid-cols-3 gap-4 font-mono tabular-nums">
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-[#9A968C]">
                Sample Max Risk
              </span>
              <span className="mt-1 block text-sm sm:text-base font-semibold text-[#EDE6D6]">
                1.0% / Trade
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-[#9A968C]">
                Demo Period Delta
              </span>
              <span className="mt-1 block text-sm sm:text-base font-semibold text-[#1F9D6B]">
                +{netReturnPct}% Index
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-[#9A968C]">
                Target R:R Band
              </span>
              <span className="mt-1 block text-sm sm:text-base font-semibold text-[#F0D58A]">
                1 : 2.5+
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right: Briefing Lounge & Full Results Link */}
        <div className="lg:col-span-4 space-y-6">
          <ShieldFrame
            variant="landscape"
            bright
            innerClassName="aspect-[16/10] w-full"
            caption="PLATE I — BRIEFING DESK & AUDIT LOGS"
          >
            <SafeImage
              src={ACADEMY_ASSETS.deskHero}
              alt="Bullish Titan Academy institutional briefing lounge"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/65 via-transparent to-transparent" />
          </ShieldFrame>

          <EditorialReveal delay={0.12} className="space-y-4">
            <GoldHairlineDivider />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-gradient font-semibold pt-2">
              Golden Rule
            </p>
            <h3 className="font-display text-2xl font-bold text-[#EDE6D6]">
              Safety First, Patience Always
            </h3>
            <p className="text-sm text-[#9A968C] leading-relaxed">
              Every trade logged across our Forex and Synthetic Indices classes follows a strict stop-loss rule and weekly check-in before anyone trades bigger sizes.
            </p>
            <Button to="/results" variant="secondary" fullWidth className={cn('min-h-[46px]')}>
              View Full Track Record
              <ArrowRight className="h-4 w-4" />
            </Button>
          </EditorialReveal>
        </div>
      </div>

      <RiskDisclaimer compact className="mt-8" />
    </Section>
  );
};
