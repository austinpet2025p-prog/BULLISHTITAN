import React, { Suspense, lazy, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { GoldHairlineDivider } from '../components/ui/TitanMotifs';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { cn } from '../lib/utils';

const ScrollKineticSculpture3D = lazy(
  () => import('../components/three/ScrollKineticSculpture3D')
);

interface SpatialStage {
  index: string;
  label: string;
  title: string;
  body: string;
  metric: string;
  href: string;
}

const SPATIAL_STAGES: SpatialStage[] = [
  {
    index: '01',
    label: 'Clarity',
    title: 'Always Have a Clear Plan Before You Trade.',
    body: 'Instead of chasing fast candles, learn to spot clean turning zones on Forex Majors and Synthetic Indices before clicking a button.',
    metric: '86 Core Lessons',
    href: '/training',
  },
  {
    index: '02',
    label: 'Safety',
    title: 'Keep Every Loss Small (1.0% Max Risk).',
    body: 'Size every trade safely before entering so no single loss ever causes stress—allowing good habits to grow your account steadily.',
    metric: '1.0% Max Risk Cap',
    href: '/results',
  },
  {
    index: '03',
    label: 'Timing',
    title: 'Trade Only During Active Market Hours.',
    body: 'Focus on the cleanest London and New York moves or steady 24/7 synthetic cycles with clear pre-market notes and live signal alerts.',
    metric: 'Forex · Gold · V75',
    href: '/signals',
  },
  {
    index: '04',
    label: 'Support',
    title: 'Grow With Personal Coaching & Managed Plans.',
    body: 'Move forward with weekly 1-on-1 trade checks or explore our Managed Account plans built for calm, long-term consistency.',
    metric: 'Coaching & Managed Plans',
    href: '/mentorship',
  },
];

/**
 * Apple-inspired sticky scroll showcase:
 * Keeps the interactive 3D gold astrolabe centered on the left while
 * scroll progress continuously morphs its internal candlestick geometry and rings.
 */
export const SpatialFlowSection: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);
  const [activeStage, setActiveStage] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const progressScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const clamped = Math.max(0, Math.min(1, latest));
    scrollProgressRef.current = clamped;
    const idx = Math.min(
      SPATIAL_STAGES.length - 1,
      Math.max(0, Math.floor(clamped * SPATIAL_STAGES.length))
    );
    setActiveStage(idx);
  });

  const scrollToStage = (idx: number) => {
    setActiveStage(idx);
    scrollProgressRef.current = idx / Math.max(1, SPATIAL_STAGES.length - 1);
    document.getElementById(`spatial-stage-${idx}`)?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'center',
    });
  };

  return (
    <section
      id="spatial-architecture"
      ref={containerRef}
      className="relative bg-[#000000] py-20 sm:py-28 border-t border-[#C9A24B]/16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Clean Editorial Header */}
        <div className="max-w-2xl mb-14 sm:mb-20">
          <div className="flex items-center gap-3 mb-3.5">
            <span className="font-display italic text-sm text-[#C9A24B]">02</span>
            <span className="h-px w-8 bg-gold-gradient opacity-80" aria-hidden="true" />
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-gradient">
              Interactive Trading Guide
            </p>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#EDE6D6] leading-[1.06] tracking-tight">
            Built to Move With Your Pace.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#9A968C] leading-relaxed">
            Four simple steps—drag, click, or scroll down to watch our 3D market model shift through each stage of calm trading.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Left Sticky Interactive 3D Viewport */}
          <div className="lg:col-span-6 lg:sticky lg:top-24">
            <div className="relative rounded-2xl border border-[#C9A24B]/20 bg-[#050506] overflow-hidden">
              <Suspense
                fallback={
                  <div className="h-[340px] sm:h-[420px] lg:h-[520px] flex items-center justify-center">
                    <span className="font-mono text-xs text-[#C9A24B]">
                      Loading 3D Market Model...
                    </span>
                  </div>
                }
              >
                <ScrollKineticSculpture3D
                  scrollProgressRef={scrollProgressRef}
                  activeStage={activeStage}
                />
              </Suspense>

              {/* Clean bottom hairline telemetry strip (no backdrop-blur over WebGL) */}
              <div className="border-t border-[#C9A24B]/18 bg-[#0B0B0C] px-5 py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-gold-gradient tabular-nums">
                    {SPATIAL_STAGES[activeStage].index} / 0{SPATIAL_STAGES.length}
                  </span>
                  <span className="text-[#9A968C]" aria-hidden="true">·</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#EDE6D6]">
                    {SPATIAL_STAGES[activeStage].label}
                  </span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#9A968C] hidden sm:inline">
                  Click Sculpture to Pulse
                </span>
              </div>
            </div>

            {/* Interactive Stage Switcher Row */}
            <div className="mt-4 grid grid-cols-4 gap-2">
              {SPATIAL_STAGES.map((stage, idx) => {
                const isActive = idx === activeStage;
                return (
                  <button
                    key={stage.index}
                    type="button"
                    onClick={() => scrollToStage(idx)}
                    className={cn(
                      'rounded-lg border px-2.5 py-2 text-left transition-colors duration-200',
                      isActive
                        ? 'border-[#C9A24B]/65 bg-[#141414] text-[#F0D58A]'
                        : 'border-[#C9A24B]/15 bg-[#000000] text-[#9A968C] hover:border-[#C9A24B]/35 hover:text-[#EDE6D6]'
                    )}
                  >
                    <span className="block font-mono text-[10px] tabular-nums">
                      {stage.index}
                    </span>
                    <span className="block text-xs font-medium truncate">
                      {stage.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Scrolling Apple Editorial Chapters */}
          <div className="lg:col-span-6 relative pl-6 sm:pl-9">
            {/* Continuous vertical hairline track + scroll-scrubbed fill */}
            <div
              aria-hidden="true"
              className="absolute left-0 top-2 bottom-2 w-px bg-[#C9A24B]/18"
            />
            <motion.div
              aria-hidden="true"
              style={reducedMotion ? { scaleY: 1 } : { scaleY: progressScaleY }}
              className="absolute left-0 top-2 bottom-2 w-[2px] origin-top bg-gradient-to-b from-[#8C6A1F] via-[#C9A24B] to-[#F0D58A]"
            />

            <div className="space-y-16 sm:space-y-24 py-2">
              {SPATIAL_STAGES.map((stage, idx) => {
                const isActive = idx === activeStage;
                return (
                  <motion.article
                    key={stage.index}
                    id={`spatial-stage-${idx}`}
                    onViewportEnter={() => setActiveStage(idx)}
                    viewport={{ amount: 0.45 }}
                    initial={reducedMotion ? false : { opacity: 0.45, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      'transition-opacity duration-500 py-4 sm:py-6',
                      isActive ? 'opacity-100' : 'opacity-60 lg:opacity-45 hover:opacity-90'
                    )}
                  >
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold-gradient font-semibold">
                        Phase {stage.index} · {stage.label}
                      </span>
                      <span className="font-mono text-xs text-[#9A968C] tabular-nums">
                        {stage.metric}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#EDE6D6] leading-[1.12]">
                      {stage.title}
                    </h3>

                    <p className="mt-4 text-sm sm:text-base text-[#9A968C] leading-relaxed max-w-xl">
                      {stage.body}
                    </p>

                    <div className="mt-6">
                      <GoldHairlineDivider className="mb-4" />
                      <Link
                        to={stage.href}
                        className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#F0D58A] hover:underline"
                      >
                        Explore {stage.label}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
