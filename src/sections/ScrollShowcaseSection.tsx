import React, { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight, Compass, Layers, Radio, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ACADEMY_ASSETS } from '../data/academyData';
import { SafeImage } from '../components/ui/SafeImage';
import { ShieldFrame } from '../components/ui/TitanMotifs';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { cn } from '../lib/utils';

interface ShowcaseChapter {
  step: string;
  roman: string;
  title: string;
  tag: string;
  description: string;
  metricLabel: string;
  metricValue: string;
  accentHex: string;
  image: string;
  imageAlt: string;
  href: string;
  icon: React.FC<{ className?: string }>;
}

const CHAPTERS: ShowcaseChapter[] = [
  {
    step: '01',
    roman: 'I',
    title: 'Market Structure Precision',
    tag: 'The Forge · Forex & Synthetic Architecture',
    description:
      'Replace subjective guesswork with multi-timeframe liquidity mapping, London and New York session discipline, and 24/7 synthetic volatility cycle literacy.',
    metricLabel: 'The Forge Syllabus',
    metricValue: '86 Field Modules',
    accentHex: '#60A5FA',
    image: ACADEMY_ASSETS.courseFoundations,
    imageAlt: 'Institutional trading workstation displaying structured candlestick architecture',
    href: '/training',
    icon: Layers,
  },
  {
    step: '02',
    roman: 'II',
    title: 'Capital Shield Engine',
    tag: 'Drawdown & Variance Governance',
    description:
      'Every position begins with pre-defined invalidation and fixed-fractional sizing (0.5% to 1.0% max exposure). Defend capital first so statistical edge endures and compounds.',
    metricLabel: 'Shield Standard',
    metricValue: '1.0% Max / Trade',
    accentHex: '#34D399',
    image: ACADEMY_ASSETS.courseLiquidity,
    imageAlt: 'Dark financial terminal rendering liquidity curves and depth bars',
    href: '/results',
    icon: ShieldCheck,
  },
  {
    step: '03',
    roman: 'III',
    title: 'Direct Strategos Command',
    tag: '12-Week Live Desk Audits',
    description:
      'Cut months of solitary trial and error through weekly 1-on-1 journal reviews, live chart critiques, and behavioral mastery alongside strategists bound by the same rules.',
    metricLabel: 'Strategos Format',
    metricValue: '1-on-1 & Phalanx',
    accentHex: '#C084FC',
    image: ACADEMY_ASSETS.mentorshipRoom,
    imageAlt: 'Private institutional trading mentorship boardroom at dusk',
    href: '/mentorship',
    icon: Compass,
  },
  {
    step: '04',
    roman: 'IV',
    title: 'Vanguard Intelligence',
    tag: 'Forex, Gold & Synthetic Indices Dispatch',
    description:
      'Receive vetted setups with entry zones, hard invalidation levels, staged exit targets, and full structural rationale dispatched cleanly across desk channels.',
    metricLabel: 'Theatre Coverage',
    metricValue: 'FX · Gold · V75',
    accentHex: '#FBBF24',
    image: ACADEMY_ASSETS.signalsHub,
    imageAlt: 'Multi-screen quantitative volatility radar analytics studio',
    href: '/signals',
    icon: Radio,
  },
];

export const ScrollShowcaseSection: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end center'],
  });

  const railHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const idx = Math.min(
      CHAPTERS.length - 1,
      Math.max(0, Math.floor(latest * CHAPTERS.length))
    );
    setActiveIndex(idx);
  });

  const activeChapter = CHAPTERS[activeIndex];

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-28 border-y border-[#C9A24B]/18 bg-aurora-obsidian"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14 items-start">
          {/* Left Sticky Narrative Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="h-px w-8 bg-gold-gradient" aria-hidden="true" />
                <p className="font-mono text-[11px] uppercase font-semibold tracking-[0.22em] text-sapphire-gold">
                  Execution Architecture
                </p>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#EDE6D6] leading-[1.08]">
                Forged for Disciplined Currency &amp; Index Strategists
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#9A968C] leading-relaxed">
                Inspect the four institutional divisions guiding every Bullish Titan member from foundational training to sovereign capital command.
              </p>
            </div>

            {/* Scroll-linked Progress Rail */}
            <div className="relative pl-5 border-l border-[#60A5FA]/20 divide-y divide-[#C9A24B]/15">
              <motion.div
                aria-hidden="true"
                style={reducedMotion ? { height: '100%' } : { height: railHeight }}
                className="absolute left-[-1px] top-0 w-[2px] bg-gradient-to-b from-[#60A5FA] via-[#34D399] to-[#F0D58A]"
              />

              {CHAPTERS.map((chapter, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={chapter.step}
                    type="button"
                    onClick={() => {
                      setActiveIndex(idx);
                      document.getElementById(`showcase-card-${chapter.step}`)?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                      });
                    }}
                    className={cn(
                      'w-full text-left py-3.5 px-3 transition-all',
                      isActive
                        ? 'bg-[#0B0B0C] opacity-100'
                        : 'bg-transparent opacity-65 hover:opacity-95'
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display italic text-sm font-semibold text-gold-gradient">
                        Chapter {chapter.roman}
                      </span>
                      <span className="font-mono text-[11px] text-[#9A968C]">
                        {chapter.metricValue}
                      </span>
                    </div>
                    <p className="mt-1 font-display text-base font-bold text-[#EDE6D6]">
                      {chapter.title}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center justify-between border-t border-[#C9A24B]/22 pt-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#9A968C]">
                  {activeChapter.metricLabel}
                </p>
                <p className="font-mono text-sm font-semibold text-gold-gradient">
                  {activeChapter.metricValue}
                </p>
              </div>
              <Link
                to={activeChapter.href}
                className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#F0D58A] hover:underline"
              >
                Inspect Division
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Shield-Framed Editorial Plates */}
          <div className="lg:col-span-7 space-y-12 sm:space-y-16">
            {CHAPTERS.map((chapter, idx) => {
              const Icon = chapter.icon;
              return (
                <motion.article
                  id={`showcase-card-${chapter.step}`}
                  key={chapter.step}
                  initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
                  whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.18 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  onViewportEnter={() => setActiveIndex(idx)}
                  className="group space-y-5 border-b border-[#C9A24B]/20 pb-10"
                >
                  <ShieldFrame
                    variant="landscape"
                    bright={activeIndex === idx}
                    innerClassName="aspect-[16/9] w-full"
                    noReveal
                  >
                    <SafeImage
                      src={chapter.image}
                      alt={chapter.imageAlt}
                      width={1280}
                      height={720}
                      className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#000000]/75 via-transparent to-transparent"
                    />
                    <div
                      className="absolute bottom-4 left-5 flex items-center gap-2.5"
                      style={{ color: chapter.accentHex }}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-mono text-[11px] uppercase tracking-[0.2em] font-semibold">
                        PILLAR {chapter.roman} · {chapter.metricValue}
                      </span>
                    </div>
                  </ShieldFrame>

                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
                    <div className="max-w-xl">
                      <p
                        className="font-mono text-[11px] uppercase tracking-wider font-semibold"
                        style={{ color: chapter.accentHex }}
                      >
                        {chapter.tag}
                      </p>
                      <h3 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-[#EDE6D6]">
                        {chapter.title}
                      </h3>
                      <p className="mt-2.5 text-sm text-[#9A968C] leading-relaxed">
                        {chapter.description}
                      </p>
                    </div>

                    <Link
                      to={chapter.href}
                      className="inline-flex items-center gap-1.5 shrink-0 font-mono text-xs font-semibold text-[#EDE6D6] hover:text-[#F0D58A] transition-colors pb-1 border-b border-[#C9A24B]/40"
                    >
                      Enter Division
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
