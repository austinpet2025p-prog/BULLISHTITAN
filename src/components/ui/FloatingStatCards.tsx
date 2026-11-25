import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { Activity, ArrowDownRight, ArrowUpRight, Pause, Play } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';

export interface VolatilityStatItem {
  id: string;
  label: string;
  symbol: string;
  baseChangePct: number;
  basePrice: number;
  decimals: number;
  unitLabel: string;
  sessionNote: string;
  sparkline: number[];
  jewel: 'emerald' | 'sapphire' | 'bronze' | 'amethyst';
  orbitTilt: {
    rotateX: number;
    rotateY: number;
    floatOffsetY: number;
    duration: number;
  };
}

export interface FloatingStatCardsProps {
  children?: React.ReactNode;
  stats?: VolatilityStatItem[];
  className?: string;
}

const DEFAULT_VOLATILITY_STATS: VolatilityStatItem[] = [
  {
    id: 'vol-75',
    label: 'Volatility Index',
    symbol: 'V75 · 24/7 Synthetic',
    baseChangePct: 1.24,
    basePrice: 214850.4,
    decimals: 1,
    unitLabel: '214,850.4 pts',
    sessionNote: 'ATR Regime: Structured Expansion',
    sparkline: [22, 26, 24, 31, 29, 36, 42, 46],
    jewel: 'emerald',
    orbitTilt: { rotateX: 5, rotateY: 8, floatOffsetY: -8, duration: 5.4 },
  },
  {
    id: 'xau-usd',
    label: 'Gold Volatility',
    symbol: 'XAU/USD · NY Overlap',
    baseChangePct: 0.78,
    basePrice: 2648.4,
    decimals: 2,
    unitLabel: '$2,648.40 / oz',
    sessionNote: 'London–NY Liquidity Sweep Active',
    sparkline: [30, 28, 33, 35, 34, 39, 41, 45],
    jewel: 'bronze',
    orbitTilt: { rotateX: 5, rotateY: -8, floatOffsetY: -6, duration: 6.1 },
  },
  {
    id: 'boom-500',
    label: 'Boom 500 Pulse',
    symbol: 'B500 · Spike Index',
    baseChangePct: 0.94,
    basePrice: 3812.4,
    decimals: 2,
    unitLabel: '3,812.40 pts',
    sessionNote: 'Tick Variance: 1 : 2.8 Target Band',
    sparkline: [18, 22, 20, 29, 27, 37, 35, 44],
    jewel: 'sapphire',
    orbitTilt: { rotateX: -5, rotateY: 8, floatOffsetY: -7, duration: 5.8 },
  },
  {
    id: 'eur-usd',
    label: 'EUR/USD Implied Vol',
    symbol: 'G10 FX · London Desk',
    baseChangePct: -0.19,
    basePrice: 1.0842,
    decimals: 4,
    unitLabel: '1.08420 rate',
    sessionNote: 'Range Compression Before Fix',
    sparkline: [38, 36, 37, 34, 35, 32, 31, 29],
    jewel: 'amethyst',
    orbitTilt: { rotateX: -5, rotateY: -8, floatOffsetY: -9, duration: 6.5 },
  },
];

const JEWEL_STYLES = {
  emerald: {
    surface: 'hairline-emerald',
    stroke: '#34D399',
    textAccent: 'text-[#34D399]',
    glowColor: 'rgba(52, 211, 153, 0.16)',
  },
  sapphire: {
    surface: 'hairline-sapphire',
    stroke: '#60A5FA',
    textAccent: 'text-[#60A5FA]',
    glowColor: 'rgba(96, 165, 250, 0.16)',
  },
  bronze: {
    surface: 'hairline-bronze',
    stroke: '#FBBF24',
    textAccent: 'text-[#F0D58A]',
    glowColor: 'rgba(251, 191, 36, 0.16)',
  },
  amethyst: {
    surface: 'hairline-amethyst',
    stroke: '#C084FC',
    textAccent: 'text-[#D8B4FE]',
    glowColor: 'rgba(192, 132, 252, 0.16)',
  },
} as const;

interface SingleFloatingCardProps {
  item: VolatilityStatItem;
  index: number;
  livePct: number;
  livePrice: number;
  sparkPoints: number[];
  isFocused: boolean;
  onSelect: () => void;
  reducedMotion: boolean;
}

const floatVariants = {
  initial: { y: 0, rotateZ: 0 },
  float: (custom: { offsetY: number; duration: number; delay: number; zTilt: number }) => ({
    y: [0, custom.offsetY, 0, Math.round(custom.offsetY * 0.35), 0],
    rotateZ: [0, custom.zTilt, 0, -custom.zTilt * 0.5, 0],
    transition: {
      duration: custom.duration,
      delay: custom.delay,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  }),
};

const SingleFloatingStatCard: React.FC<SingleFloatingCardProps> = ({
  item,
  index,
  livePct,
  livePrice,
  sparkPoints,
  isFocused,
  onSelect,
  reducedMotion,
}) => {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);

  const springConfig = { stiffness: 220, damping: 24, mass: 0.7 };
  const tiltX = useSpring(
    useTransform(pointerY, [0, 1], [item.orbitTilt.rotateX + 8, item.orbitTilt.rotateX - 8]),
    springConfig
  );
  const tiltY = useSpring(
    useTransform(pointerX, [0, 1], [item.orbitTilt.rotateY - 9, item.orbitTilt.rotateY + 9]),
    springConfig
  );

  const sheenX = useTransform(pointerX, [0, 1], ['15%', '85%']);
  const sheenY = useTransform(pointerY, [0, 1], ['15%', '85%']);
  const jewel = JEWEL_STYLES[item.jewel];
  const dynamicGoldSheen = useMotionTemplate`radial-gradient(240px circle at ${sheenX} ${sheenY}, color-mix(in srgb, var(--color-gold-bright) 28%, transparent), ${jewel.glowColor} 45%, transparent 76%)`;

  const isUp = livePct >= 0;
  const formattedPct = `${isUp ? '+' : ''}${livePct.toFixed(2)}%`;

  // Mini SVG sparkline geometry
  const svgW = 84;
  const svgH = 26;
  const minPt = Math.min(...sparkPoints);
  const maxPt = Math.max(...sparkPoints);
  const span = Math.max(1, maxPt - minPt);
  const polylinePoints = sparkPoints
    .map((val, idx) => {
      const x = (idx / Math.max(1, sparkPoints.length - 1)) * svgW;
      const y = svgH - 3 - ((val - minPt) / span) * (svgH - 6);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (reducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    pointerX.set(Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)));
    pointerY.set(Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height)));
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  const hoverInnerGlowShadow = isHovered
    ? '0 22px 46px rgba(0, 0, 0, 0.78), inset 0 0 26px color-mix(in srgb, var(--color-gold-bright) 26%, transparent), inset 0 1px 0 color-mix(in srgb, var(--color-gold-bright) 72%, transparent), 0 0 18px color-mix(in srgb, var(--color-gold-bright) 18%, transparent)'
    : isFocused
      ? '0 18px 42px rgba(0, 0, 0, 0.68), inset 0 0 14px color-mix(in srgb, var(--color-gold-bright) 12%, transparent)'
      : '0 18px 42px rgba(0, 0, 0, 0.68)';

  return (
    <motion.div
      variants={reducedMotion ? undefined : floatVariants}
      initial={reducedMotion ? undefined : 'initial'}
      animate={reducedMotion ? undefined : 'float'}
      custom={{
        offsetY: item.orbitTilt.floatOffsetY,
        duration: item.orbitTilt.duration,
        delay: index * 0.45,
        zTilt: index % 2 === 0 ? 0.35 : -0.35,
      }}
      style={{ perspective: 1100 }}
      className="w-full lg:w-[295px] will-change-transform"
    >
      <motion.button
        ref={cardRef}
        type="button"
        onClick={onSelect}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        aria-pressed={isFocused}
        style={
          reducedMotion
            ? { boxShadow: hoverInnerGlowShadow }
            : {
                rotateX: tiltX,
                rotateY: tiltY,
                transformStyle: 'preserve-3d',
                boxShadow: hoverInnerGlowShadow,
              }
        }
        whileHover={reducedMotion ? undefined : { scale: 1.038 }}
        whileTap={reducedMotion ? undefined : { scale: 0.985 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'group relative w-full text-left rounded-xl p-4 sm:p-4.5 transition-shadow duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-gold-bright)]',
          jewel.surface,
          isFocused && 'ring-1 ring-[var(--color-gold-bright)]/60'
        )}
      >
        {/* Brighter --color-gold-bright Inner Hover Glow + Dynamic Specular Sheen */}
        <span
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 85% 75% at 50% 0%, color-mix(in srgb, var(--color-gold-bright) 20%, transparent), transparent 72%)',
          }}
          className={cn(
            'pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-200',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
        />
        {!reducedMotion && (
          <motion.span
            aria-hidden="true"
            style={{ background: dynamicGoldSheen }}
            className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          />
        )}

        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9A968C] truncate">
              {item.symbol}
            </p>
            <p className="mt-1 font-display text-sm sm:text-base font-bold text-[#EDE6D6] truncate">
              {item.label}:{' '}
              <span
                className={cn(
                  'font-mono font-bold tabular-nums',
                  isUp ? jewel.textAccent : 'text-[#FB7185]'
                )}
              >
                {formattedPct}
              </span>
            </p>
          </div>

          <span
            className={cn(
              'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#000000]/70',
              isUp ? jewel.textAccent : 'text-[#FB7185]'
            )}
          >
            {isUp ? (
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </span>
        </div>

        <div className="relative z-10 mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="block font-mono text-[11px] font-semibold text-[#EDE6D6] tabular-nums truncate">
              {livePrice.toLocaleString(undefined, {
                minimumFractionDigits: item.decimals,
                maximumFractionDigits: item.decimals,
              })}
            </span>
            <span className="block font-mono text-[10px] text-[#9A968C] truncate">
              {item.sessionNote}
            </span>
          </div>

          <svg
            width={svgW}
            height={svgH}
            viewBox={`0 0 ${svgW} ${svgH}`}
            className="shrink-0 overflow-visible"
            aria-hidden="true"
          >
            <polyline
              fill="none"
              stroke={isUp ? jewel.stroke : '#FB7185'}
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={polylinePoints}
            />
          </svg>
        </div>
      </motion.button>
    </motion.div>
  );
};

export const FloatingStatCards: React.FC<FloatingStatCardsProps> = ({
  children,
  stats = DEFAULT_VOLATILITY_STATS,
  className,
}) => {
  const reducedMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);

  const [paused, setPaused] = useState(false);
  const [focusedId, setFocusedId] = useState<string>(stats[0]?.id ?? 'vol-75');
  const [tickDeltas, setTickDeltas] = useState<Record<string, { pctOffset: number; spark: number[] }>>(() => {
    const init: Record<string, { pctOffset: number; spark: number[] }> = {};
    for (const s of stats) {
      init[s.id] = { pctOffset: 0, spark: [...s.sparkline] };
    }
    return init;
  });

  // Scroll-linked counter-parallax between top & bottom orbiting volatility pairs
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start end', 'end start'],
  });
  const topOrbitY = useTransform(scrollYProgress, [0, 1], [14, -14]);
  const bottomOrbitY = useTransform(scrollYProgress, [0, 1], [-12, 12]);

  useEffect(() => {
    if (reducedMotion || paused) return;

    const timer = window.setInterval(() => {
      setTickDeltas((prev) => {
        const next: typeof prev = { ...prev };
        for (const s of stats) {
          const cur = prev[s.id] ?? { pctOffset: 0, spark: s.sparkline };
          const stepDelta = (Math.random() - 0.48) * 0.06;
          const clampedOffset = Math.max(-0.22, Math.min(0.26, cur.pctOffset + stepDelta));
          const lastVal = cur.spark[cur.spark.length - 1] ?? 30;
          const nextPt = Math.max(12, Math.min(54, lastVal + stepDelta * 45));
          next[s.id] = {
            pctOffset: clampedOffset,
            spark: [...cur.spark.slice(1), Number(nextPt.toFixed(1))],
          };
        }
        return next;
      });
    }, 2200);

    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, stats]);

  const topPair = stats.slice(0, 2);
  const bottomPair = stats.slice(2, 4);
  const activeStat = stats.find((s) => s.id === focusedId) ?? stats[0];

  const renderCard = (item: VolatilityStatItem, index: number) => {
    const state = tickDeltas[item.id] ?? { pctOffset: 0, spark: item.sparkline };
    const livePct = item.baseChangePct + state.pctOffset;
    const livePrice = item.basePrice * (1 + state.pctOffset * 0.0025);

    return (
      <SingleFloatingStatCard
        key={item.id}
        item={item}
        index={index}
        livePct={livePct}
        livePrice={livePrice}
        sparkPoints={state.spark}
        isFocused={focusedId === item.id}
        onSelect={() => setFocusedId(item.id)}
        reducedMotion={reducedMotion}
      />
    );
  };

  return (
    <div ref={stageRef} className={cn('relative', className)}>
      {/* Ambient Depth Backlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-4 top-8 bottom-8 rounded-3xl bg-[radial-gradient(ellipse_70%_40%_at_20%_15%,rgba(37,99,235,0.09),transparent_60%),radial-gradient(ellipse_65%_45%_at_80%_85%,rgba(16,185,129,0.08),transparent_60%)]"
      />

      {/* Top Volatility Telemetry Ribbon & 3D Orbiting Pair */}
      <div className="relative z-10 mb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#9A968C]">
            <Activity className="h-3.5 w-3.5 text-[#34D399]" aria-hidden="true" />
            <span className="uppercase tracking-[0.18em] text-[#EDE6D6]/90 font-semibold">
              Market Volatility Context
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-[#C9A24B] truncate">
              Focused: {activeStat?.label} ({activeStat?.symbol})
            </span>
          </div>

          {!reducedMotion && (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-[#C9A24B]/24 bg-[#000000]/85 px-3 py-1.5 font-mono text-[11px] text-[#EDE6D6] hover:border-[var(--color-gold-bright)]/65 transition-colors whitespace-nowrap shrink-0"
            >
              {paused ? (
                <Play className="h-3 w-3 text-[#34D399]" aria-hidden="true" />
              ) : (
                <Pause className="h-3 w-3 text-[var(--color-gold-bright)]" aria-hidden="true" />
              )}
              <span>{paused ? 'Resume Live Ticks' : 'Pause Volatility Feed'}</span>
            </button>
          )}
        </div>

        <motion.div
          style={reducedMotion ? undefined : { y: topOrbitY }}
          className="grid gap-4 sm:grid-cols-2 lg:flex lg:items-center lg:justify-between"
        >
          {topPair.map((item, idx) => renderCard(item, idx))}
        </motion.div>
      </div>

      {/* Central Testimonial Grid Stage */}
      <div className="relative z-20">{children}</div>

      {/* Bottom 3D Orbiting Volatility Pair */}
      {bottomPair.length > 0 && (
        <motion.div
          style={reducedMotion ? undefined : { y: bottomOrbitY }}
          className="relative z-10 mt-6 grid gap-4 sm:grid-cols-2 lg:flex lg:items-center lg:justify-between"
        >
          {bottomPair.map((item, idx) => renderCard(item, idx + topPair.length))}
        </motion.div>
      )}
    </div>
  );
};
