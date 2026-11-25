import React, { Suspense, lazy, useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Layers,
  Lock,
  Play,
  ShieldCheck,
  SlidersHorizontal,
  UserCheck,
} from 'lucide-react';
import { AnimatePresence, motion, type PanInfo } from 'motion/react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Tabs } from '../components/ui/Tabs';
import { SafeImage } from '../components/ui/SafeImage';
import { RiskDisclaimer } from '../components/ui/RiskDisclaimer';
import { HeroVideoBackdrop } from '../components/ui/HeroVideoBackdrop';
import { SuccessConfetti } from '../components/ui/SuccessConfetti';
import {
  RisingArrowConnector,
  ShieldCrestBadge,
  ShieldFrame,
  ShieldSectionDivider,
  GoldHairlineDivider,
} from '../components/ui/TitanMotifs';
import { CountUpValue } from '../components/ui/CountUpValue';
import { MandateAuditShowcase } from '../components/investment/MandateAuditShowcase';
import { MandateAllocationSimulator } from '../components/investment/MandateAllocationSimulator';
import { MandateAgreementDocument } from '../components/investment/MandateAgreementDocument';
import { ACADEMY_ASSETS, MENTORS } from '../data/academyData';
import {
  INVESTMENT_ONBOARDING_STEPS,
  INVESTMENT_PROGRAMS,
  INVESTMENT_TERMS_TABS,
  INVESTOR_DEMO_REPORTING,
} from '../data/extendedData';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { cn } from '../lib/utils';
import investmentSpartanBg from '../assets/images/investment_spartan_clean_1795625786726.jpg';

const InvestmentScene3D = lazy(() => import('../components/three/InvestmentScene3D'));

const SECTION_ANCHORS = [
  { id: 'home', label: 'Origin' },
  { id: 'about', label: 'Stewardship' },
  { id: 'plans', label: 'Mandate Ranks' },
  { id: 'audits', label: 'Audits' },
  { id: 'terms', label: 'Mandate Rules' },
  { id: 'steps', label: 'Protocol' },
  { id: 'eligibility', label: 'Vetting' },
];

type TermsViewMode = 'agreement' | 'carousel' | 'ownership' | 'governance' | 'reporting';

const ACCOUNT_TERMS_SLIDES = [
  {
    id: 'term-1',
    blocks: [
      {
        heading: '1. Account Access',
        copy: 'You grant trade-execution access strictly for market analysis and order execution. Your account remains permanently in your legal name and under your sole ownership.',
      },
      {
        heading: '2. Capital Requirement',
        copy: 'You fund your brokerage account with the stipulated equity for your chosen phase. Capital stays inside your own regulated account—Bullish Titan Academy never holds withdrawal access.',
      },
      {
        heading: '8. Confidentiality & KYC Vetting',
        copy: 'All KYC documentation, identity verification calls, and trading history remain strictly confidential and are never disclosed to unauthorized third parties.',
      },
    ],
  },
  {
    id: 'term-2',
    blocks: [
      {
        heading: '3. Profit Sharing (50% / 50%)',
        copy: 'Profits are split 50% to you (the Client) and 50% to Bullish Titan Academy once the cycle profit target is reached and/or surpassed. We only earn when you earn.',
      },
      {
        heading: '4. Coordinated Withdrawals',
        copy: 'Withdrawals are coordinated once scheduled upon reaching and/or surpassing the cycle profit target, following transparent profit calculation and settlement.',
      },
      {
        heading: '5. Trading Strategy & Client Role',
        copy: 'We trade strictly using disciplined analysis across Synthetic Indices and Forex—never gambling. Clients agree not to place manual trades inside the linked managed sub-account.',
      },
    ],
  },
  {
    id: 'term-3',
    blocks: [
      {
        heading: '6. Risk Disclaimer',
        copy: 'Forex and Synthetic Indices carry substantial risk and past results never guarantee future performance. Losses may occur from volatility and Bullish Titan Academy is not liable for market losses.',
      },
      {
        heading: '7. Pre-Notice Termination',
        copy: 'Either party may terminate the agreement at any time upon prior notice. Once terminated, all active trades are closed and any outstanding realized profits are settled per the 50/50 split.',
      },
      {
        heading: '9. Loss Coverage Policy ($5,000+ Equity)',
        copy: 'If an account suffers a complete loss, accounts funded with starting equity above $5,000 qualify for a 10% initial-deposit goodwill buffer (not insurance). Accounts below $5,000 are excluded.',
      },
    ],
  },
];

export const InvestmentPage: React.FC = () => {
  const reducedMotion = useReducedMotion();

  const [activeAnchor, setActiveAnchor] = useState<string>('home');
  const [planIndex, setPlanIndex] = useState(0);
  const [planDirection, setPlanDirection] = useState<1 | -1>(1);

  const [termsView, setTermsView] = useState<TermsViewMode>('agreement');
  const [termIndex, setTermIndex] = useState(0);
  const [termDirection, setTermDirection] = useState<1 | -1>(1);

  const [selectedPhaseName, setSelectedPhaseName] = useState(INVESTMENT_PROGRAMS[1].name);
  const [introOpen, setIntroOpen] = useState(false);
  const [termsDocOpen, setTermsDocOpen] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    country: '',
    mandate: INVESTMENT_PROGRAMS[1].name,
    indicativeEquity: '3000',
    preferredManager: MENTORS[0].name,
    ackRisk: false,
    ackTerms: false,
  });
  const [formError, setFormError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Track visible section cleanly for Apple-style anchor highlight
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTION_ANCHORS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveAnchor(id);
            }
          });
        },
        { rootMargin: '-36% 0px -48% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToSection = (id: string) => {
    setActiveAnchor(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  const handleSelectPlan = (phaseName: string) => {
    setSelectedPhaseName(phaseName);
    const matched = INVESTMENT_PROGRAMS.find((p) => p.name === phaseName);
    setForm((prev) => ({
      ...prev,
      mandate: phaseName,
      indicativeEquity: matched ? String(matched.minEquityValue) : prev.indicativeEquity,
    }));
    scrollToSection('eligibility');
  };

  const handleApplySimulation = (phaseName: string, indicativeEquity: number) => {
    setSelectedPhaseName(phaseName);
    setForm((prev) => ({
      ...prev,
      mandate: phaseName,
      indicativeEquity: String(indicativeEquity),
    }));
    scrollToSection('eligibility');
  };

  const handleAcceptMandateTerms = () => {
    setForm((prev) => ({ ...prev, ackTerms: true }));
    setTermsDocOpen(false);
    scrollToSection('eligibility');
  };

  const goPlan = (nextIdx: number, dir: 1 | -1) => {
    setPlanDirection(dir);
    setPlanIndex((nextIdx + INVESTMENT_PROGRAMS.length) % INVESTMENT_PROGRAMS.length);
  };

  const handlePlanDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -45 || info.velocity.x < -300) {
      goPlan(planIndex + 1, 1);
    } else if (info.offset.x > 45 || info.velocity.x > 300) {
      goPlan(planIndex - 1, -1);
    }
  };

  const goTerm = (nextIdx: number, dir: 1 | -1) => {
    setTermDirection(dir);
    setTermIndex((nextIdx + ACCOUNT_TERMS_SLIDES.length) % ACCOUNT_TERMS_SLIDES.length);
  };

  const handleTermDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -45 || info.velocity.x < -300) {
      goTerm(termIndex + 1, 1);
    } else if (info.offset.x > 45 || info.velocity.x > 300) {
      goTerm(termIndex - 1, -1);
    }
  };

  const visiblePlans = [
    INVESTMENT_PROGRAMS[planIndex % INVESTMENT_PROGRAMS.length],
    INVESTMENT_PROGRAMS[(planIndex + 1) % INVESTMENT_PROGRAMS.length],
  ];

  const visibleTerms = [
    ACCOUNT_TERMS_SLIDES[termIndex % ACCOUNT_TERMS_SLIDES.length],
    ACCOUNT_TERMS_SLIDES[(termIndex + 1) % ACCOUNT_TERMS_SLIDES.length],
  ];

  const selectedTermCategory = INVESTMENT_TERMS_TABS.find((t) => t.id === termsView);

  const handleEligibilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.fullName.trim().length < 2) {
      setFormError('Please enter your full legal name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (form.country.trim().length < 2) {
      setFormError('Please enter your country of residence.');
      return;
    }
    if (!form.ackRisk || !form.ackTerms) {
      setFormError('You must confirm both the Risk Disclosure and Mandate Terms acknowledgements.');
      return;
    }
    setFormError('');
    setSubmitted(true);
  };

  return (
    <div className="relative isolate bg-[#000000] overflow-x-clip">
      {/* Spartan Battle Background Layer (watermark removed, 100% image preserved, 22% opacity) */}
      <div
        aria-hidden="true"
        className="pointer-events-none sticky top-0 z-0 -mb-[100vh] h-screen w-full overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 72% 78% at 50% 45%, rgba(201, 162, 75, 0.09), rgba(30, 58, 138, 0.1) 52%, rgba(0, 0, 0, 0.94) 92%)',
          }}
        />
        <div className="relative flex h-full w-full items-center justify-center">
          <img
            src={investmentSpartanBg}
            alt=""
            referrerPolicy="no-referrer"
            className="h-full w-full object-contain object-center opacity-[0.22] mix-blend-lighten select-none"
            style={{
              maskImage:
                'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.45) 4%, black 10%, black 90%, rgba(0,0,0,0.45) 96%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 6%, black 92%, transparent 100%)',
              maskComposite: 'intersect',
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.45) 4%, black 10%, black 90%, rgba(0,0,0,0.45) 96%, transparent 100%)',
            }}
          />
        </div>
        {/* Seamless obsidian & sapphire perimeter blend */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 68% 82% at 50% 48%, transparent 32%, rgba(2, 5, 13, 0.48) 70%, #000000 96%), linear-gradient(to bottom, rgba(0, 0, 0, 0.42) 0%, transparent 14%, transparent 82%, #000000 100%)',
          }}
        />
      </div>

      <div className="relative z-10 pt-20">
      {/* 1. Reference Banner Section (#home) */}
      <section
        id="home"
        className="relative min-h-[560px] sm:min-h-[620px] flex items-center py-20 sm:py-28 border-b border-[#C9A24B]/18 overflow-hidden"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70 mix-blend-screen">
          <HeroVideoBackdrop />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <motion.div
              className="lg:col-span-7"
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8 bg-gold-gradient" aria-hidden="true" />
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold text-gold-gradient">
                  Sovereign Mandates · Bullish Titan Academy
                </p>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[60px] font-bold text-[#EDE6D6] leading-[1.06] tracking-tight text-balance">
                Your Custody, Our Discipline,{' '}
                <span className="italic font-semibold text-gold-gradient">
                  Forged Through Command
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-base sm:text-lg text-[#9A968C] leading-relaxed">
                Disciplined Forex and Synthetic Indices capital stewardship where equity remains locked inside your own regulated broker custody—governed by hard drawdown shields, clear rank progression, and real-time Command Console tracking.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button variant="primary" size="lg" onClick={() => scrollToSection('plans')}>
                  Explore Mandate Ranks &amp; Simulator
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="lg" onClick={() => scrollToSection('audits')}>
                  Inspect Audited Ledgers
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="lg:col-span-5"
              initial={reducedMotion ? false : { opacity: 0, scale: 0.97 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: reducedMotion ? 0 : 0.1, ease: [0.16, 1, 0.36, 1] }}
            >
              <ShieldFrame variant="crest" bright caption="PLATE I — MULTI-NODE ALLOCATION CORE">
                <Suspense
                  fallback={
                    <div className="h-[340px] flex items-center justify-center text-xs font-mono text-[#9A968C]">
                      Loading 3D Capital Network...
                    </div>
                  }
                >
                  <InvestmentScene3D />
                </Suspense>
              </ShieldFrame>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Scroll-Aware Quick Navigation Bar (Sticky on desktop md+, in-flow on mobile to satisfy 15% sticky height cap) */}
      <div className="md:sticky md:top-20 z-30 border-b border-[#C9A24B]/18 bg-[#0B0B0C]/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Account management quick navigation"
            className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar"
          >
            {SECTION_ANCHORS.map((item) => {
              const isActive = activeAnchor === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    'relative whitespace-nowrap shrink-0 rounded-md border px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors',
                    isActive
                      ? 'border-[#F0D58A]/70 text-[#000000] font-semibold'
                      : 'border-[#C9A24B]/22 bg-[#000000] text-[#9A968C] hover:border-[#F0D58A]/55 hover:text-[#F0D58A]'
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="inv-anchor-active"
                      transition={
                        reducedMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 360, damping: 32, mass: 0.85 }
                      }
                      aria-hidden="true"
                      className="absolute inset-0 rounded-[5px] bg-gold-gradient"
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 2. Reference About Section (#about) */}
      <Section
        id="about"
        romanIndex="01"
        kicker="Sovereign Capital Governance"
        title="Capital Stewardship &amp; Mandate Architecture"
        subtitle="Structured, transparent rank stewardship calibrated to diverse equity brackets across Forex and Synthetic Indices."
      >
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <p className="text-sm sm:text-base text-[#9A968C] leading-relaxed">
              Our ranked progression matches each custody bracket with proportional oversight, strict risk shields, and live ledger visibility—without ever surrendering ownership or withdrawal authority.
            </p>

            <div className="border-y border-[#C9A24B]/22 divide-y divide-[#C9A24B]/16">
              {[
                {
                  icon: ShieldCheck,
                  title: 'Governed Mandate Execution',
                  desc: 'Disciplined models aligned with your equity tier, drawdown ceiling, and capital horizon.',
                },
                {
                  icon: FileText,
                  title: 'Unbroken Transparency',
                  desc: 'Direct clarity from KYC vetting through Clause 9 protections and monthly PDF audit ledgers.',
                },
                {
                  icon: SlidersHorizontal,
                  title: 'Four Earned Stewardship Ranks',
                  desc: 'Progress deliberately from Agoge ($900) through Vanguard, Strategos, and Sovereign Archon ($10,000+).',
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                    whileInView={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{
                      duration: 0.35,
                      delay: reducedMotion ? 0 : idx * 0.08,
                      ease: [0.16, 1, 0.36, 1],
                    }}
                    className="py-4 flex items-start gap-4"
                  >
                    <ShieldCrestBadge className="h-10 w-9 shrink-0 mt-0.5">
                      <Icon className="h-4 w-4 text-[#F0D58A]" />
                    </ShieldCrestBadge>
                    <div>
                      <h3 className="font-display text-lg font-bold text-[#EDE6D6]">{item.title}</h3>
                      <p className="mt-1 text-xs sm:text-sm text-[#9A968C]">{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="pt-1 flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-[#9A968C]">
              <Layers className="h-4 w-4 text-[#C9A24B]" />
              <span>Bullish Titan Academy · Sovereign Mandate Desk Authorization</span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <ShieldFrame
              variant="landscape"
              bright
              innerClassName="aspect-[16/10] w-full"
              caption="PLATE II — CUSTODY & DESK EXECUTION OVERVIEW"
            >
              <SafeImage
                src={ACADEMY_ASSETS.mentorshipRoom}
                alt="Bullish Titan Academy Sovereign Mandate Desk"
                width={1280}
                height={800}
                className="h-full w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-[#000000]/20 to-transparent"
              />
              <button
                type="button"
                onClick={() => setIntroOpen(true)}
                aria-label="Open Sovereign Mandate architecture overview"
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 group"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#F0D58A]/70 bg-[#000000]/85 text-[#F0D58A] transition-transform duration-200 group-hover:scale-110">
                  <Play className="h-6 w-6 fill-[#C9A24B] ml-0.5" />
                </span>
                <span className="rounded-md border border-[#C9A24B]/35 bg-[#000000]/85 backdrop-blur-md px-4 py-1.5 font-mono text-xs font-semibold text-[#EDE6D6]">
                  Inspect Stewardship Overview
                </span>
              </button>
            </ShieldFrame>
          </div>
        </div>
      </Section>

      {/* 3. Reference Plans Section + Interactive Simulator (#plans) */}
      <section
        id="plans"
        className="relative py-20 sm:py-28 border-y border-[#C9A24B]/18 bg-aurora-obsidian"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 items-start">
            <div className="lg:col-span-4 space-y-5">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold text-sapphire-gold mb-2">
                  Capital Stewardship Ranks
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#EDE6D6] leading-tight text-balance">
                  Ascend the Ranks <br />
                  Select Your Mandate
                </h2>
              </div>

              <p className="text-sm text-[#A39E93] leading-relaxed">
                Each Mandate Rank corresponds to the capital committed inside your regulated brokerage custody. One-time onboarding fees activate Command Console telemetry, audited reporting, and dedicated Strategist oversight.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => goPlan(planIndex - 1, -1)}
                  aria-label="Previous mandate rank"
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-[#60A5FA]/35 bg-[#09101E] text-[#EDE6D6] hover:border-[#F0D58A] hover:text-[#F0D58A] transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => goPlan(planIndex + 1, 1)}
                  aria-label="Next mandate rank"
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-[#60A5FA]/35 bg-[#09101E] text-[#EDE6D6] hover:border-[#F0D58A] hover:text-[#F0D58A] transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2 ml-2">
                  {INVESTMENT_PROGRAMS.map((p, idx) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => goPlan(idx, idx > planIndex ? 1 : -1)}
                      aria-label={`View ${p.name}`}
                      className={cn(
                        'h-1.5 transition-all',
                        planIndex === idx ? 'w-6 bg-gold-gradient' : 'w-2 bg-[#60A5FA]/35 hover:bg-[#F0D58A]/70'
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#C9A24B]/18">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-[#9A968C] mb-2">
                  Inspect Any Stewardship Rank
                </span>
                <div className="flex flex-wrap gap-2">
                  {INVESTMENT_PROGRAMS.map((p, idx) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => goPlan(idx, idx > planIndex ? 1 : -1)}
                      className={cn(
                        'rounded-md border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0',
                        planIndex === idx
                          ? 'border-[#F0D58A] bg-[#C9A24B]/18 text-[#F0D58A]'
                          : 'border-[#60A5FA]/25 bg-[#09101E] text-[#A39E93] hover:text-[#EDE6D6]'
                      )}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 overflow-hidden">
              <AnimatePresence mode="wait" custom={planDirection}>
                <motion.div
                  key={planIndex}
                  custom={planDirection}
                  initial={
                    reducedMotion
                      ? false
                      : { opacity: 0, x: planDirection > 0 ? 28 : -28 }
                  }
                  animate={reducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                  exit={
                    reducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, x: planDirection > 0 ? -28 : 28 }
                  }
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.36, 1] }}
                  drag={reducedMotion ? false : 'x'}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.14}
                  onDragEnd={handlePlanDragEnd}
                  className="grid gap-6 md:grid-cols-2"
                >
                  {visiblePlans.map((plan, idx) => {
                    const isSelected = selectedPhaseName === plan.name;
                    const phaseSurface =
                      plan.id === 'lite-phase'
                        ? 'hairline-sapphire'
                        : plan.id === 'pro-phase'
                          ? 'hairline-emerald'
                          : plan.id === 'geant-phase'
                            ? 'hairline-amethyst'
                            : 'hairline-bronze';
                    const phaseTagColor =
                      plan.id === 'lite-phase'
                        ? 'text-[#60A5FA]'
                        : plan.id === 'pro-phase'
                          ? 'text-[#34D399]'
                          : plan.id === 'geant-phase'
                            ? 'text-[#C084FC]'
                            : 'text-[#FBBF24]';

                    return (
                      <Card
                        key={`${plan.id}-${planIndex}-${idx}`}
                        featured={isSelected || plan.popular}
                        className={cn(
                          'h-full flex flex-col justify-between p-6 sm:p-7 transition-transform duration-200 hover:-translate-y-0.5',
                          phaseSurface,
                          idx === 1 && 'hidden md:flex'
                        )}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div>
                              <p className={cn('font-mono text-[10px] uppercase tracking-[0.18em] mb-1', phaseTagColor)}>
                                {plan.rankTitle}
                              </p>
                              <h3 className="font-display text-2xl font-bold text-[#EDE6D6]">
                                {plan.name}
                              </h3>
                              <p className="mt-1 font-mono text-xs text-[#9A968C]">
                                {plan.riskLevel} Risk · {plan.strategyType}
                              </p>
                              <p className="mt-1.5 font-mono text-sm font-semibold text-gold-gradient tabular-nums">
                                {plan.onboardingFee}
                              </p>
                            </div>
                            {plan.popular && (
                              <span className="font-mono text-[10px] uppercase tracking-wider font-semibold text-[#34D399]">
                                Vanguard Core
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-[#EDE6D6]/85 leading-relaxed mb-3">
                            {plan.strategicPositioning}
                          </p>

                          <div className="mb-4 rounded-md border border-[#C9A24B]/18 bg-[#000000]/65 px-3 py-2.5 text-[11px] text-[#9A968C] space-y-1">
                            <p>
                              <strong className="text-[#EDE6D6]">Profile:</strong> {plan.whoItIsFor}
                            </p>
                            <p>
                              <strong className="text-[#F0D58A]">Progression:</strong> {plan.progressionMeaning}
                            </p>
                          </div>

                          <ul className="space-y-2.5 text-xs sm:text-sm text-[#EDE6D6]/90 border-t border-[#C9A24B]/18 pt-4">
                            {plan.highlights.map((bullet) => (
                              <li key={bullet} className="flex items-start gap-2.5 leading-relaxed">
                                <Check className={cn('h-4 w-4 shrink-0 mt-0.5', phaseTagColor)} />
                                <span>{bullet}</span>
                              </li>
                            ))}
                            <li className="flex items-start gap-2.5 leading-relaxed">
                              <Check className="h-4 w-4 shrink-0 text-[#F0D58A] mt-0.5" />
                              <span>
                                <strong className="text-[#EDE6D6]">Governance:</strong>{' '}
                                {plan.drawdownGuardrail}
                              </span>
                            </li>
                          </ul>
                        </div>

                        <div className="mt-6 pt-5 border-t border-[#C9A24B]/18">
                          <Button
                            fullWidth
                            variant={isSelected ? 'primary' : 'secondary'}
                            onClick={() => handleSelectPlan(plan.name)}
                          >
                            {plan.ctaLabel}
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <MandateAllocationSimulator onApplyConfiguration={handleApplySimulation} />
        </div>
      </section>

      {/* 4. Signature Blended Showcase: Managed Mandate Case Audits (#audits) */}
      <Section
        id="audits"
        romanIndex="02"
        kicker="Mandate Records · Demo Showcase"
        title="Audited Mandate Records &amp; Governance Cases"
        subtitle="Inspect illustrative Forex and Synthetic Indices custody cycles—complete with risk shields, broker custody rules, and drawdown verification."
      >
        <MandateAuditShowcase onSelectPhaseForKyc={handleSelectPlan} />
      </Section>

      <GoldHairlineDivider />

      {/* 5. Account Terms, Rules & Accommodations (#terms) */}
      <Section
        id="terms"
        romanIndex="03"
        kicker="Official 9-Clause Charter"
        title="Mandate Terms &amp; Custody Covenant"
        subtitle="Inspect all nine governing clauses covering execution access, sole capital ownership, 50/50 profit sharing, settlement, termination, confidentiality, and the $5,000+ goodwill loss-coverage policy."
      >
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Tabs<TermsViewMode>
            value={termsView}
            onChange={setTermsView}
            options={[
              { value: 'agreement', label: 'Official 9-Clause Mandate' },
              { value: 'carousel', label: 'Guided Slide Deck' },
              { value: 'ownership', label: '1. Custody & Vetting' },
              { value: 'governance', label: '2. Profit Share & Risk Shield' },
              { value: 'reporting', label: '3. Settlement & Exit' },
            ]}
          />

          <Button variant="secondary" size="sm" onClick={() => setTermsDocOpen(true)}>
            <FileText className="h-4 w-4" />
            Open Full Mandate Modal
          </Button>
        </div>

        {termsView === 'agreement' ? (
          <MandateAgreementDocument
            accepted={form.ackTerms}
            onAccept={handleAcceptMandateTerms}
          />
        ) : termsView === 'carousel' ? (
          <>
            <div className="overflow-hidden mb-6">
              <AnimatePresence mode="wait" custom={termDirection}>
                <motion.div
                  key={termIndex}
                  custom={termDirection}
                  initial={
                    reducedMotion
                      ? false
                      : { opacity: 0, x: termDirection > 0 ? 28 : -28 }
                  }
                  animate={reducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                  exit={
                    reducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, x: termDirection > 0 ? -28 : 28 }
                  }
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.36, 1] }}
                  drag={reducedMotion ? false : 'x'}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.14}
                  onDragEnd={handleTermDragEnd}
                  className="grid gap-6 md:grid-cols-2"
                >
                  {visibleTerms.map((slide, idx) => (
                    <div
                      key={`${slide.id}-${termIndex}-${idx}`}
                      className={idx === 1 ? 'hidden md:block' : ''}
                    >
                      <Card className="h-full p-6 sm:p-8 space-y-5">
                        {slide.blocks.map((block, bIdx) => (
                          <div
                            key={block.heading}
                            className={bIdx > 0 ? 'pt-4 border-t border-[#C9A24B]/16' : ''}
                          >
                            <h3 className="font-display text-lg font-bold text-gold-gradient mb-1.5">
                              {block.heading}
                            </h3>
                            <p className="text-sm text-[#9A968C] leading-relaxed">{block.copy}</p>
                          </div>
                        ))}
                      </Card>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => goTerm(termIndex - 1, -1)}
                  aria-label="Previous terms slide"
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-[#C9A24B]/24 bg-[#0B0B0C] text-[#EDE6D6] hover:border-[#F0D58A]/60 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2">
                  {ACCOUNT_TERMS_SLIDES.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => goTerm(idx, idx > termIndex ? 1 : -1)}
                      aria-label={`View terms group ${idx + 1}`}
                      className={cn(
                        'h-1.5 transition-all',
                        termIndex === idx ? 'w-6 bg-gold-gradient' : 'w-2 bg-[#C9A24B]/30 hover:bg-[#C9A24B]/60'
                      )}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => goTerm(termIndex + 1, 1)}
                  aria-label="Next terms slide"
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-[#C9A24B]/24 bg-[#0B0B0C] text-[#EDE6D6] hover:border-[#F0D58A]/60 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <Button variant="primary" size="lg" onClick={() => setTermsDocOpen(true)}>
                <FileText className="h-4 w-4" />
                View Terms Document
              </Button>
            </div>
          </>
        ) : (
          selectedTermCategory && (
            <motion.div
              key={selectedTermCategory.id}
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.36, 1] }}
              className="grid gap-6 md:grid-cols-3"
            >
              {selectedTermCategory.items.map((item) => (
                <Card key={item.title} className="p-6 flex flex-col justify-between">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#F0D58A] mb-2">
                      {item.note}
                    </p>
                    <h3 className="font-display text-lg font-bold text-[#EDE6D6] mb-2.5">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#9A968C] leading-relaxed">{item.summary}</p>
                  </div>
                </Card>
              ))}
            </motion.div>
          )
        )}
      </Section>

      {/* 6. Reference Funfact Counter Band (Counts up smoothly once visible) */}
      <section className="py-14 border-b border-[#C9A24B]/22 bg-aurora-obsidian">
        <GoldHairlineDivider className="-mt-14 mb-14" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3 text-center">
            <div className="py-4">
              <p className="font-display text-4xl sm:text-5xl font-bold text-gold-gradient tabular-nums">
                <CountUpValue end={10} duration={1450} suffix="+" />
              </p>
              <p className="mt-2 font-mono text-xs uppercase tracking-wider text-[#A39E93]">
                Strategos &amp; Desk Command Leads
              </p>
            </div>
            <div className="py-4 md:border-x md:border-[#60A5FA]/22">
              <p className="font-display text-4xl sm:text-5xl font-bold text-sapphire-gold tabular-nums">
                <CountUpValue end={4} duration={1250} suffix=" Ranks" />
              </p>
              <p className="mt-2 font-mono text-xs uppercase tracking-wider text-[#A39E93]">
                Stewardship Ranks (Agoge – Archon)
              </p>
            </div>
            <div className="py-4">
              <p className="font-display text-4xl sm:text-5xl font-bold text-emerald-gold tabular-nums">
                <CountUpValue end={300} duration={1750} suffix="+" />
              </p>
              <p className="mt-2 font-mono text-xs uppercase tracking-wider text-[#A39E93]">
                Mandate &amp; Fellow Demo Audits
              </p>
            </div>
          </div>
        </div>
      </section>

      <RisingArrowConnector align="center" className="pt-8" />

      {/* 7. Reference 3 Easy Steps (#steps) */}
      <Section
        id="steps"
        romanIndex="04"
        kicker="Ascension Protocol"
        title="Three Steps to Command Readiness"
        subtitle="Move from initial KYC vetting to your live Command Console link in three disciplined stages."
      >
        <div className="grid gap-8 md:grid-cols-3 border-t border-[#C9A24B]/25 pt-8">
          {INVESTMENT_ONBOARDING_STEPS.map((item, idx) => (
            <motion.div
              key={item.step}
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.35,
                delay: reducedMotion ? 0 : idx * 0.09,
                ease: [0.16, 1, 0.36, 1],
              }}
              className="space-y-2.5"
            >
              <p className="font-display italic text-3xl font-bold text-gold-gradient tabular-nums">
                {item.step}{' '}
                <span className="font-mono not-italic text-xs uppercase tracking-widest text-[#9A968C]">
                  Stage
                </span>
              </p>
              <h3 className="font-display text-xl font-bold text-[#EDE6D6]">{item.title}</h3>
              <p className="text-sm text-[#9A968C] leading-relaxed">{item.detail}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      <ShieldSectionDivider label="Vetting & Command Console" />

      {/* 8. Client Dashboard Reporting Preview + Eligibility KYC Form (#eligibility) */}
      <Section
        id="eligibility"
        romanIndex="05"
        kicker="Stage 01 · Vetting & Telemetry Preview"
        title="Submit Mandate Vetting &amp; Inspect Telemetry"
        subtitle="Examine how Command Console equity and drawdown ledgers render (Demo Data), then submit your KYC eligibility brief below."
      >
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Left: Reporting Preview (Emerald strictly for profit index, red for drawdown) */}
          <Card className="lg:col-span-6 space-y-5">
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#C9A24B]/18">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-gold-gradient">
                  Command Console Preview · Demo Data
                </p>
                <h3 className="mt-1 font-display text-xl font-bold text-[#EDE6D6]">
                  Live Equity &amp; Drawdown Telemetry
                </h3>
              </div>
              <span className="font-mono text-xs text-[#9A968C]">Demo Only</span>
            </div>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={INVESTOR_DEMO_REPORTING}>
                  <defs>
                    <linearGradient id="invEmerald" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1F9D6B" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#1F9D6B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(201,162,75,0.08)" vertical={false} />
                  <XAxis dataKey="month" stroke="#9A968C" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis domain={[98, 108]} stroke="#9A968C" fontSize={11} tickLine={false} axisLine={false} width={36} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0B0B0C',
                      borderColor: 'rgba(201,162,75,0.35)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#EDE6D6',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="equity"
                    name="Demo Equity Growth"
                    stroke="#1F9D6B"
                    strokeWidth={2.2}
                    fill="url(#invEmerald)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={INVESTOR_DEMO_REPORTING}>
                  <CartesianGrid stroke="rgba(201,162,75,0.08)" vertical={false} />
                  <XAxis dataKey="month" stroke="#9A968C" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis domain={[-3, 0]} stroke="#9A968C" fontSize={11} tickLine={false} axisLine={false} width={36} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0B0B0C',
                      borderColor: 'rgba(239,68,68,0.35)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#EDE6D6',
                    }}
                  />
                  <Bar dataKey="drawdown" name="Demo Drawdown (%)" fill="#EF4444" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <RiskDisclaimer compact />
          </Card>

          {/* Right: KYC Eligibility Intake Form */}
          <Card className="lg:col-span-6">
            {submitted ? (
                <div className="py-8 text-center space-y-3">
                <SuccessConfetti active={submitted} />
                <CheckCircle2 className="mx-auto h-10 w-10 text-[#C9A24B]" />
                <h3 className="font-display text-2xl font-bold text-[#EDE6D6]">
                  Vetting &amp; Mandate Dossier Logged
                </h3>
                <p className="text-sm text-[#9A968C] leading-relaxed">
                  Confirmed, <strong className="text-[#EDE6D6]">{form.fullName}</strong>. Our Desk Admissions team will dispatch KYC verification steps and mandate documents for{' '}
                  <strong className="text-[#F0D58A]">{form.mandate}</strong> (Indicative Equity: ${Number(form.indicativeEquity || 0).toLocaleString()} · Preferred Strategist:{' '}
                  <strong className="text-[#EDE6D6]">{form.preferredManager}</strong>) to{' '}
                  <strong className="text-[#EDE6D6]">{form.email}</strong>.
                </p>
                <Button size="sm" onClick={() => setSubmitted(false)}>
                  Submit Another Dossier
                </Button>
              </div>
            ) : (
              <form onSubmit={handleEligibilitySubmit} className="space-y-4" noValidate>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-gold-gradient">
                    KYC Vetting Request
                  </p>
                  <h3 className="mt-1 font-display text-2xl font-bold text-[#EDE6D6]">
                    Apply for Sovereign Mandate Access
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="inv-name" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
                      Full Legal Name
                    </label>
                    <input
                      id="inv-name"
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="Jordan Taylor"
                      className="h-11 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] px-3.5 text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="inv-email" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="inv-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="jordan@domain.com"
                      className="h-11 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] px-3.5 text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="inv-country" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
                      Country
                    </label>
                    <input
                      id="inv-country"
                      type="text"
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      placeholder="United Kingdom"
                      className="h-11 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] px-3.5 text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="inv-equity" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
                      Indicative Equity (USD)
                    </label>
                    <input
                      id="inv-equity"
                      type="number"
                      min={900}
                      value={form.indicativeEquity}
                      onChange={(e) => setForm({ ...form, indicativeEquity: e.target.value })}
                      className="h-11 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] px-3.5 font-mono text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none tabular-nums"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="inv-mandate" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
                      Selected Mandate Rank
                    </label>
                    <select
                      id="inv-mandate"
                      value={form.mandate}
                      onChange={(e) => {
                        setSelectedPhaseName(e.target.value);
                        setForm({ ...form, mandate: e.target.value });
                      }}
                      className="h-11 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] px-3 text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none"
                    >
                      {INVESTMENT_PROGRAMS.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="inv-manager" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
                      Preferred Desk Strategist
                    </label>
                    <select
                      id="inv-manager"
                      value={form.preferredManager}
                      onChange={(e) => setForm({ ...form, preferredManager: e.target.value })}
                      className="h-11 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] px-3 text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none"
                    >
                      {MENTORS.map((m) => (
                        <option key={m.id} value={m.name}>
                          {m.name}
                        </option>
                      ))}
                      <option value="Assign Desk Strategist">Assign Desk Strategist</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-[#C9A24B]/18">
                  <label className="flex items-start gap-2.5 text-xs text-[#9A968C] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.ackRisk}
                      onChange={(e) => setForm({ ...form, ackRisk: e.target.checked })}
                      className="mt-0.5 h-4 w-4 rounded accent-[#C9A24B]"
                    />
                    <span>
                      I acknowledge that capital allocated to Forex and Synthetic Indices is at risk, returns are never guaranteed, and past performance does not predict future results.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 text-xs text-[#9A968C] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.ackTerms}
                      onChange={(e) => setForm({ ...form, ackTerms: e.target.checked })}
                      className="mt-0.5 h-4 w-4 rounded accent-[#C9A24B]"
                    />
                    <span>
                      I understand all indicative mandate deposits, targets, and fee terms are marked &ldquo;To be confirmed&rdquo; subject to formal KYC verification and written charter approval.
                    </span>
                  </label>
                </div>

                {formError && (
                  <p className="text-xs text-[#EF4444]" role="alert">
                    {formError}
                  </p>
                )}

                <Button type="submit" variant="primary" size="lg" fullWidth>
                  Submit Vetting &amp; Mandate Request
                </Button>
              </form>
            )}
          </Card>
        </div>

        <div className="mt-10">
          <RiskDisclaimer />
        </div>
      </Section>

      {/* Intro Modal */}
      <Modal
        isOpen={introOpen}
        onClose={() => setIntroOpen(false)}
        title="Bullish Titan Academy · Sovereign Mandate Overview"
        subtitle="How ranked capital stewardship keeps custody strictly in your hands."
        size="lg"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: UserCheck,
              title: '01. KYC & Briefing Verification',
              desc: 'Complete eligibility vetting and ratify terms directly with our Desk Admissions officers.',
            },
            {
              icon: Lock,
              title: '02. Sovereign Custody',
              desc: 'Fund your regulated broker account directly—Bullish Titan never holds withdrawal rights.',
            },
            {
              icon: FileText,
              title: '03. Command Console Telemetry',
              desc: 'Track positions live, message your strategist, and download monthly audit ledgers.',
            },
          ].map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="rounded-md border border-[#C9A24B]/24 bg-[#000000] p-4 space-y-2"
              >
                <Icon className="h-5 w-5 text-[#F0D58A]" />
                <h4 className="font-display text-sm font-bold text-[#EDE6D6]">{step.title}</h4>
                <p className="text-xs text-[#9A968C] leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </Modal>

      {/* Terms Modal */}
      <Modal
        isOpen={termsDocOpen}
        onClose={() => setTermsDocOpen(false)}
        title="Bullish Titan Academy · Sovereign Mandate Terms & Covenant"
        subtitle="Complete 9-clause charter governing execution access, 50/50 profit sharing, settlement, and $5,000+ goodwill loss coverage."
        size="xl"
      >
        <MandateAgreementDocument
          accepted={form.ackTerms}
          onAccept={handleAcceptMandateTerms}
          compact
        />
      </Modal>
      </div>
    </div>
  );
};

export default InvestmentPage;
