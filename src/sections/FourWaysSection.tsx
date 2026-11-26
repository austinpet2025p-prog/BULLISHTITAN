import React, { Suspense, lazy, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { ArrowUpRight, BookOpen, Briefcase, Radio, ShieldCheck, Users } from 'lucide-react';
import { Section } from '../components/ui/Section';
import { Button } from '../components/ui/Button';
import { ShieldCrestBadge, EditorialReveal } from '../components/ui/TitanMotifs';
import { CORE_PROGRAMS, type ProgramPillar } from '../data/academyData';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { cn } from '../lib/utils';

const TrainingScene3D = lazy(() => import('../components/three/TrainingScene3D'));
const MentorshipScene3D = lazy(() => import('../components/three/MentorshipScene3D'));
const SignalsRadarScene3D = lazy(() => import('../components/three/SignalsRadarScene3D'));
const InvestmentScene3D = lazy(() => import('../components/three/InvestmentScene3D'));
const RiskVaultScene3D = lazy(() => import('../components/three/RiskVaultScene3D'));

const iconMap = {
  training: BookOpen,
  mentorship: Users,
  signals: Radio,
  investment: Briefcase,
};

const PANEL_NUMBERS = ['01', '02', '03', '04'];
const PANEL_LABELS = ['Courses', 'Coaching', 'Signals', 'Managed'];

const STRATEGIC_PILLARS: Record<ProgramPillar['id'], string[]> = {
  training: [
    'Beginner, Intermediate & Advanced paths',
    '86 short lessons on Forex & Synthetics',
    'Easy risk calculator & trade journal sheets',
  ],
  mentorship: [
    '12-week group & 1-on-1 trade reviews',
    'Live London & New York chart classes',
    'Step-by-step help to stop emotional trades',
  ],
  signals: [
    'Checked Forex, Gold & V75 trade alerts',
    'Clear Buy/Sell price, Stop Loss & 3 Targets',
    'Sent to Telegram, WhatsApp & Lot Calculator',
  ],
  investment: [
    'Money stays safely in your own broker account',
    'Starter ($900) up to Private VIP ($10,000+)',
    'Fair 50/50 profit split & strict loss limits',
  ],
};

const PANEL_JEWEL_THEME: Record<
  ProgramPillar['id'],
  {
    surface: string;
    glowRgba: string;
    metricClass: string;
    briefBorder: string;
    arrowHover: string;
  }
> = {
  training: {
    surface: 'hairline-sapphire',
    glowRgba: 'rgba(96, 165, 250, 0.18)',
    metricClass: 'text-[#60A5FA]',
    briefBorder: 'border-[#60A5FA]/35 bg-[#060D1C]/85',
    arrowHover: 'group-hover:border-[#60A5FA]/75 group-hover:text-[#93C5FD]',
  },
  mentorship: {
    surface: 'hairline-amethyst',
    glowRgba: 'rgba(192, 132, 252, 0.18)',
    metricClass: 'text-[#C084FC]',
    briefBorder: 'border-[#C084FC]/35 bg-[#10091E]/85',
    arrowHover: 'group-hover:border-[#C084FC]/75 group-hover:text-[#D8B4FE]',
  },
  signals: {
    surface: 'hairline-emerald',
    glowRgba: 'rgba(52, 211, 153, 0.18)',
    metricClass: 'text-[#34D399]',
    briefBorder: 'border-[#34D399]/35 bg-[#051610]/85',
    arrowHover: 'group-hover:border-[#34D399]/75 group-hover:text-[#6EE7B7]',
  },
  investment: {
    surface: 'hairline-bronze',
    glowRgba: 'rgba(245, 158, 11, 0.20)',
    metricClass: 'text-[#FBBF24]',
    briefBorder: 'border-[#F0D58A]/40 bg-[#140E06]/85',
    arrowHover: 'group-hover:border-[#FBBF24]/75 group-hover:text-[#FDE68A]',
  },
};

const CARD_SPRING = { stiffness: 210, damping: 22, mass: 0.65 };
const APPLE_EASE = [0.16, 1, 0.36, 1] as const;

type StudioModelKey = 'training' | 'mentorship' | 'signals' | 'investment' | 'vault';

const ARTIFACT_GLOW: Record<StudioModelKey, string> = {
  training: 'radial-gradient(circle at 38% 50%, rgba(59, 130, 246, 0.22), rgba(240, 213, 138, 0.08) 55%, transparent 75%)',
  mentorship: 'radial-gradient(circle at 38% 50%, rgba(168, 85, 247, 0.22), rgba(240, 213, 138, 0.08) 55%, transparent 75%)',
  signals: 'radial-gradient(circle at 38% 50%, rgba(16, 185, 129, 0.24), rgba(59, 130, 246, 0.08) 55%, transparent 75%)',
  investment: 'radial-gradient(circle at 38% 50%, rgba(59, 130, 246, 0.2), rgba(245, 158, 11, 0.14) 55%, transparent 75%)',
  vault: 'radial-gradient(circle at 38% 50%, rgba(245, 158, 11, 0.22), rgba(16, 185, 129, 0.12) 55%, transparent 75%)',
};

interface StudioArtifactItem {
  key: StudioModelKey;
  tabLabel: string;
  code: string;
  title: string;
  subtitle: string;
  spec: string;
  href: string;
  cta: string;
}

const STUDIO_ARTIFACTS: StudioArtifactItem[] = [
  {
    key: 'training',
    tabLabel: 'Video Courses',
    code: '01 · Step-by-Step Lessons',
    title: 'Clear Chart Playbooks & Price Patterns',
    subtitle:
      'Watch short, easy video lessons that show green buy candles, red pullbacks, and simple rules you can follow right away.',
    spec: '86 Video Lessons · 3 Skill Levels',
    href: '/training',
    cta: 'Explore Courses',
  },
  {
    key: 'mentorship',
    tabLabel: '1-on-1 Coaching',
    code: '02 · Personal Guidance',
    title: 'Live Chart Help & Weekly Reviews',
    subtitle:
      'Sit directly with a senior coach who checks your trades each week and helps you fix mistakes fast.',
    spec: '12 Weeks · Weekly 1-on-1 Check-Ins',
    href: '/mentorship',
    cta: 'Meet Your Coaches',
  },
  {
    key: 'signals',
    tabLabel: 'Daily Signals',
    code: '03 · Live Trade Alerts',
    title: 'Real-Time Market Scanner & Trade Ideas',
    subtitle:
      'Spot clear Buy (green), Sell (red), and Gold opportunities during London and New York hours—sent straight to your phone.',
    spec: 'Forex · Gold · Synthetic Indices',
    href: '/signals',
    cta: 'See Live Signals',
  },
  {
    key: 'investment',
    tabLabel: 'Managed Accounts',
    code: '04 · Safe Custody',
    title: 'Hands-Free Account Trading Worldwide',
    subtitle:
      'Our experienced team trades carefully during London, New York, Dubai, and Tokyo sessions while your money stays in your own broker account.',
    spec: '4 Clear Plans · You Keep Control',
    href: '/investment',
    cta: 'View Investment Plans',
  },
  {
    key: 'vault',
    tabLabel: 'Safety Shield',
    code: '05 · Account Protection',
    title: '1.0% Risk Limit & Money Safety Rule',
    subtitle:
      'Every single trade has a strict safety stop so one bad move can never wipe out your hard-earned savings.',
    spec: '1.0% Max Risk Per Trade · Clear Rules',
    href: '/results',
    cta: 'See Track Record',
  },
];

interface EliteCommandCardProps {
  program: ProgramPillar;
  idx: number;
  reducedMotion: boolean;
}

const EliteCommandCard: React.FC<EliteCommandCardProps> = ({
  program,
  idx,
  reducedMotion,
}) => {
  const Icon = iconMap[program.id];
  const num = PANEL_NUMBERS[idx];
  const shortTitle = PANEL_LABELS[idx];
  const jewel = PANEL_JEWEL_THEME[program.id];
  const pillars = STRATEGIC_PILLARS[program.id];

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [touchExpanded, setTouchExpanded] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, CARD_SPRING);
  const smoothY = useSpring(mouseY, CARD_SPRING);

  const rotateY = useTransform(smoothX, [0, 1], [-8.5, 8.5]);
  const rotateX = useTransform(smoothY, [0, 1], [8.5, -8.5]);
  const glowX = useTransform(smoothX, [0, 1], [0, 100]);
  const glowY = useTransform(smoothY, [0, 1], [0, 100]);
  const radialHighlight = useMotionTemplate`radial-gradient(460px circle at ${glowX}% ${glowY}%, ${jewel.glowRgba}, transparent 68%)`;

  const strategicRevealed = isHovered || isFocused || touchExpanded;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || e.pointerType === 'touch') return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    mouseX.set(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
    mouseY.set(Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)));
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'touch') {
      setIsHovered(true);
    }
  };

  const handlePointerLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    setIsHovered(false);
  };

  return (
    <EditorialReveal delay={idx * 0.08} className="h-full">
      <motion.div
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onFocusCapture={() => setIsFocused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setIsFocused(false);
          }
        }}
        whileHover={reducedMotion ? undefined : { scale: 1.015 }}
        transition={{ duration: 0.25, ease: APPLE_EASE }}
        style={
          reducedMotion
            ? undefined
            : {
                rotateX,
                rotateY,
                transformPerspective: 1000,
                transformStyle: 'preserve-3d',
              }
        }
        className="h-full"
      >
        <Link
          to={program.href}
          className={cn(
            'group relative flex h-full flex-col justify-between rounded-xl p-7 sm:p-9 overflow-hidden transition-[border-color,box-shadow,filter] duration-300',
            jewel.surface,
            strategicRevealed && 'shadow-[0_26px_64px_rgba(0,0,0,0.85)] brightness-[1.07]'
          )}
        >
          {/* Specular pointer-tracking jewel glare */}
          {!reducedMotion && (
            <motion.span
              aria-hidden="true"
              style={{ background: radialHighlight }}
              className={cn(
                'pointer-events-none absolute inset-0 transition-opacity duration-300',
                strategicRevealed ? 'opacity-100' : 'opacity-30'
              )}
            />
          )}

          {/* Top Edge Metallic Shimmer on Hover */}
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F0D58A] to-transparent transition-opacity duration-300',
              strategicRevealed ? 'opacity-90' : 'opacity-20'
            )}
          />

          <div
            className="relative z-10 flex flex-1 flex-col"
            style={reducedMotion ? undefined : { transform: 'translateZ(24px)' }}
          >
            {/* Header Row: Index + Elite Command Badge */}
            <div className="flex items-start justify-between gap-4 pb-6 mb-6 border-b border-[#C9A24B]/18">
              <span
                className="font-display text-6xl sm:text-7xl font-bold leading-none tracking-tight text-gold-gradient tabular-nums select-none"
                aria-hidden="true"
              >
                {num}
              </span>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#F0D58A]">
                    Academy Path
                  </span>
                  <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-[#9A968C]">
                    {shortTitle}
                  </span>
                </div>
                <ShieldCrestBadge className="h-11 w-10">
                  <Icon className="h-4 w-4 text-[#F0D58A]" />
                </ShieldCrestBadge>
              </div>
            </div>

            <p className={cn('font-mono text-[11px] uppercase tracking-[0.18em] font-semibold', jewel.metricClass)}>
              {program.metricLabel}
            </p>
            <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[#EDE6D6] group-hover:text-[#F0D58A] transition-colors duration-300">
              {program.title}
            </h3>
            <p className="mt-3 text-sm sm:text-base text-[#EDE6D6]/90 leading-relaxed">
              {program.benefit}
            </p>

            {/* Fixed-footprint Stage that reveals Details on Hover */}
            <div
              className="relative mt-5 min-h-[146px] flex flex-col justify-center"
              style={reducedMotion ? undefined : { transform: 'translateZ(14px)' }}
            >
              <AnimatePresence mode="wait">
                {strategicRevealed ? (
                  <motion.div
                    key="strategic-brief"
                    initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: APPLE_EASE }}
                    className={cn(
                      'rounded-xl border p-4 backdrop-blur-md space-y-2.5',
                      jewel.briefBorder
                    )}
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-gold-gradient">
                      Quick Overview
                    </p>
                    <p className="text-xs sm:text-sm text-[#EDE6D6]/90 leading-relaxed">
                      {program.description}
                    </p>
                    <ul className="space-y-1 pt-1 border-t border-[#C9A24B]/18">
                      {pillars.map((pillar) => (
                        <li
                          key={pillar}
                          className="flex items-start gap-2 font-mono text-[11px] text-[#C8C2B6]"
                        >
                          <span className={cn('mt-1 h-1.5 w-1.5 shrink-0 rounded-sm bg-current', jewel.metricClass)} />
                          <span>{pillar}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle-prompt"
                    initial={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.16 }}
                    className="rounded-xl border border-dashed border-[#C9A24B]/24 bg-[#07080C]/55 px-4 py-5 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C9A24B]">
                        Inside This Program
                      </p>
                      <p className="mt-1 text-xs text-[#9A968C]">
                        Move your mouse here to see what is included
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setTouchExpanded((v) => !v);
                      }}
                      className="lg:hidden shrink-0 rounded-md border border-[#C9A24B]/35 px-2.5 py-1 font-mono text-[10px] uppercase text-[#F0D58A]"
                    >
                      Details
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div
            className="relative z-10 mt-7 pt-5 border-t border-[#C9A24B]/18 flex items-center justify-between gap-4"
            style={reducedMotion ? undefined : { transform: 'translateZ(18px)' }}
          >
            <span className={cn('font-mono text-xs font-semibold', jewel.metricClass)}>
              {strategicRevealed ? `Open ${shortTitle}` : `Explore ${shortTitle}`}
            </span>
            <span
              className={cn(
                'inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#C9A24B]/28 bg-[#000000]/80 text-[#F0D58A] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
                jewel.arrowHover
              )}
            >
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </Link>
      </motion.div>
    </EditorialReveal>
  );
};

export const FourWaysSection: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const studioTabId = useId();
  const [activeArtifact, setActiveArtifact] = useState<StudioModelKey>('training');

  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ['start end', 'end start'],
  });

  const oddColY = useTransform(scrollYProgress, [0, 1], [14, -14]);
  const evenColY = useTransform(scrollYProgress, [0, 1], [-10, 14]);

  const currentArtifact =
    STUDIO_ARTIFACTS.find((a) => a.key === activeArtifact) ?? STUDIO_ARTIFACTS[0];

  const renderArtifactScene = () => {
    switch (activeArtifact) {
      case 'training':
        return <TrainingScene3D />;
      case 'mentorship':
        return <MentorshipScene3D />;
      case 'signals':
        return <SignalsRadarScene3D />;
      case 'investment':
        return <InvestmentScene3D />;
      case 'vault':
        return <RiskVaultScene3D />;
    }
  };

  return (
    <Section
      id="programs"
      romanIndex="03"
      kicker="Four Ways We Help You"
      title="Pick the Right Path for You"
      subtitle="Move your mouse over any card to see how each program helps you learn, trade safely, or grow your account."
    >
      <div ref={gridRef} className="grid gap-6 md:grid-cols-2">
        {CORE_PROGRAMS.map((program, idx) => (
          <motion.div
            key={program.id}
            style={
              reducedMotion
                ? undefined
                : { y: idx % 2 === 0 ? oddColY : evenColY }
            }
            className="h-full"
          >
            <EliteCommandCard
              program={program}
              idx={idx}
              reducedMotion={reducedMotion}
            />
          </motion.div>
        ))}
      </div>

      {/* Interactive 3D Hardware Studio Switcher */}
      <EditorialReveal delay={0.12} className="mt-14 sm:mt-16">
        <div
          className="relative overflow-hidden hairline-gold-bright rounded-2xl p-6 sm:p-8 lg:p-10"
          style={{ backgroundImage: ARTIFACT_GLOW[activeArtifact] }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-[#C9A24B]/18">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold-gradient font-semibold">
                Interactive 3D Preview
              </p>
              <h3 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-[#EDE6D6]">
                Explore Every Tool in 3D
              </h3>
            </div>

            {/* Segmented Apple Tab Rail */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[#C9A24B]/22 bg-[#000000] p-1">
              {STUDIO_ARTIFACTS.map((item) => {
                const active = item.key === activeArtifact;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveArtifact(item.key)}
                    className={cn(
                      'relative px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors',
                      active ? 'text-[#000000] font-semibold' : 'text-[#9A968C] hover:text-[#EDE6D6]'
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId={studioTabId}
                        transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                        className="absolute inset-0 rounded-lg bg-gold-gradient"
                      />
                    )}
                    <span className="relative z-10">{item.tabLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 rounded-2xl border border-[#C9A24B]/18 bg-[#000000] p-3">
              <Suspense
                fallback={
                  <div className="h-[320px] sm:h-[380px] flex items-center justify-center font-mono text-xs text-[#C9A24B]">
                    Loading Interactive 3D Artifact...
                  </div>
                }
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeArtifact}
                    initial={reducedMotion ? false : { opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reducedMotion ? undefined : { opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.3, ease: APPLE_EASE }}
                  >
                    {renderArtifactScene()}
                  </motion.div>
                </AnimatePresence>
              </Suspense>
            </div>

            <div className="lg:col-span-5 space-y-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentArtifact.key}
                  initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.32, ease: APPLE_EASE }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#22C58B]">
                    <ShieldCheck className="h-4 w-4 text-[#F0D58A]" />
                    <span>{currentArtifact.code}</span>
                  </div>

                  <h4 className="font-display text-2xl sm:text-3xl font-bold text-[#EDE6D6] leading-tight">
                    {currentArtifact.title}
                  </h4>

                  <p className="text-sm sm:text-base text-[#9A968C] leading-relaxed">
                    {currentArtifact.subtitle}
                  </p>

                  <div className="border-y border-[#C9A24B]/18 py-3 font-mono text-xs text-[#F0D58A]">
                    {currentArtifact.spec}
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <Button to={currentArtifact.href} variant="primary" size="md">
                      {currentArtifact.cta}
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                    <span className="font-mono text-[11px] text-[#9A968C]">
                      Move cursor over object to tilt
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </EditorialReveal>
    </Section>
  );
};
