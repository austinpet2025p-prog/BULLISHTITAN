import React, { Suspense, lazy, useState } from 'react';
import {
  ArrowRight,
  Bell,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Mail,
  MessageCircle,
  Send,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  ZoomIn,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  Area,
  AreaChart,
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
import { SignalCard } from '../components/ui/SignalCard';
import { PricingCard } from '../components/ui/PricingCard';
import { Tabs } from '../components/ui/Tabs';
import { Accordion } from '../components/ui/Accordion';
import { SafeImage } from '../components/ui/SafeImage';
import { RiskDisclaimer } from '../components/ui/RiskDisclaimer';
import { AmbientMeshCanvas } from '../components/ui/AmbientMeshCanvas';
import { SignalAnatomyIllustration } from '../components/ui/TitanIllustrations';
import {
  RisingArrowConnector,
  ShieldCrestBadge,
  ShieldFrame,
  ShieldSectionDivider,
} from '../components/ui/TitanMotifs';
import {
  ACADEMY_ASSETS,
  DEMO_EQUITY_CURVE,
  DEMO_SIGNALS,
  type DemoSignal,
} from '../data/academyData';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { cn } from '../lib/utils';
import signalsSpartanBg from '../assets/images/signals_spartan_widescreen_1795709292440.jpg';

const SignalsRadarScene3D = lazy(() => import('../components/three/SignalsRadarScene3D'));

type BillingCycle = 'weekly' | 'monthly' | 'yearly';
type RangeFilter = '30D' | '90D' | '1Y';

interface PastSignalRecord {
  id: string;
  image: string;
  headline: string;
  caption: string;
  session: string;
  signal: DemoSignal;
}

const PAST_SIGNAL_GALLERY: PastSignalRecord[] = [
  {
    id: 'past-1',
    image: ACADEMY_ASSETS.courseLiquidity,
    headline: 'EUR/USD · +3.0R Demo Liquidity Sweep',
    caption: 'London Session · Previous Day Low Sweep & Displacement',
    session: 'Demo Setup Record · Page 01',
    signal: DEMO_SIGNALS[0],
  },
  {
    id: 'past-2',
    image: ACADEMY_ASSETS.signalsHub,
    headline: 'V75 Index · 1:3.0 Structural Long',
    caption: '24/7 Synthetic Desk · H4 Higher Low Confirmation',
    session: 'Demo Setup Record · Page 01',
    signal: DEMO_SIGNALS[1],
  },
  {
    id: 'past-3',
    image: ACADEMY_ASSETS.courseFoundations,
    headline: 'XAU/USD · Asian High Order Block',
    caption: 'Pre-New York Overlap · Staged TP1–TP3 Targets',
    session: 'Demo Setup Record · Page 01',
    signal: DEMO_SIGNALS[2],
  },
  {
    id: 'past-4',
    image: ACADEMY_ASSETS.heroFloor,
    headline: 'GBP/USD · +2.9R Resistance Rejection',
    caption: 'DXY Structural Alignment · Archived Example',
    session: 'Demo Setup Record · Page 02',
    signal: DEMO_SIGNALS[3],
  },
  {
    id: 'past-5',
    image: ACADEMY_ASSETS.deskHero,
    headline: 'Boom 500 · +2.6R Demand Continuation',
    caption: 'Synthetic Spike Cycle · Safety Stop-Loss Set',
    session: 'Demo Setup Record · Page 02',
    signal: {
      id: 'sig-5',
      pair: 'Boom 500',
      market: 'Synthetic Indices',
      direction: 'BUY',
      entry: '3,812.40',
      stopLoss: '3,774.00',
      tp1: '3,868.00',
      tp2: '3,912.00',
      tp3: '3,955.00',
      rr: '1 : 2.6',
      status: 'Closed',
      timestamp: 'Demo · Synthetic Spike Setup',
      rationale: 'Impulse sweep into M15 institutional order block followed by displacement candle.',
    },
  },
  {
    id: 'past-6',
    image: ACADEMY_ASSETS.mentorshipRoom,
    headline: 'USD/JPY · +2.7R Session Imbalance Fill',
    caption: 'New York Killzone · Yield Differential Confluence',
    session: 'Demo Setup Record · Page 02',
    signal: {
      id: 'sig-6',
      pair: 'USD/JPY',
      market: 'Forex',
      direction: 'BUY',
      entry: '153.20',
      stopLoss: '152.75',
      tp1: '153.85',
      tp2: '154.25',
      tp3: '154.65',
      rr: '1 : 2.7',
      status: 'TP1 Reached',
      timestamp: 'Demo · NY Session Setup',
      rationale: 'Clean bounce off previous week midpoint aligned with US10Y structural support.',
    },
  },
  {
    id: 'past-7',
    image: ACADEMY_ASSETS.signalsHub,
    headline: 'Crash 1000 · +2.8R Supply Shelf Short',
    caption: 'Synthetic Volatility Regime · ATR-Adjusted Risk',
    session: 'Demo Setup Record · Page 03',
    signal: {
      id: 'sig-7',
      pair: 'Crash 1000',
      market: 'Synthetic Indices',
      direction: 'SELL',
      entry: '6,125.15',
      stopLoss: '6,185.00',
      tp1: '6,042.00',
      tp2: '5,990.00',
      tp3: '5,940.00',
      rr: '1 : 2.8',
      status: 'Closed',
      timestamp: 'Demo · Archived Synthetic Record',
      rationale: 'Equal highs sweep into bearish H1 breaker with fixed 0.75% fractional risk.',
    },
  },
  {
    id: 'past-8',
    image: ACADEMY_ASSETS.courseLiquidity,
    headline: 'V100 Index · +3.1R Volatility Expansion',
    caption: '24/7 Synthetic Feed · Pre-Defined Partial Exits',
    session: 'Demo Setup Record · Page 03',
    signal: {
      id: 'sig-8',
      pair: 'V100 Index',
      market: 'Synthetic Indices',
      direction: 'BUY',
      entry: '1,918.40',
      stopLoss: '1,896.00',
      tp1: '1,952.00',
      tp2: '1,978.00',
      tp3: '2,005.00',
      rr: '1 : 3.1',
      status: 'Closed',
      timestamp: 'Demo · Archived Index Setup',
      rationale: 'Break-of-structure pullback into demand imbalance with strict trailing SL at TP1.',
    },
  },
  {
    id: 'past-9',
    image: ACADEMY_ASSETS.courseFoundations,
    headline: 'EUR/JPY · +2.5R Cross-Pair Momentum',
    caption: 'London Open · Multi-Timeframe Confluence',
    session: 'Demo Setup Record · Page 03',
    signal: {
      id: 'sig-9',
      pair: 'EUR/JPY',
      market: 'Forex',
      direction: 'BUY',
      entry: '165.40',
      stopLoss: '164.95',
      tp1: '166.05',
      tp2: '166.45',
      tp3: '166.85',
      rr: '1 : 2.5',
      status: 'Closed',
      timestamp: 'Demo · Cross-Pair Archive',
      rationale: 'Daily bullish order flow continuation after London session opening range retest.',
    },
  },
];

const DELIVERY_CHANNELS = [
  { icon: Send, name: 'Telegram Desk', detail: 'Instant encrypted channel alerts with chart links.' },
  { icon: MessageCircle, name: 'WhatsApp Alerts', detail: 'Direct high-priority setup notifications.' },
  { icon: Smartphone, name: 'In-App Terminal', detail: 'Organized active, pending, and closed setup feed.' },
  { icon: Mail, name: 'Email Digest', detail: 'Daily session summaries and stop-loss updates.' },
  { icon: Bell, name: 'Push Alerts', detail: 'Browser & mobile pings on TP1/SL adjustments.' },
];

export const SignalsPage: React.FC = () => {
  const reducedMotion = useReducedMotion();

  const [galleryPage, setGalleryPage] = useState(0);
  const totalPages = Math.ceil(PAST_SIGNAL_GALLERY.length / 3);
  const [inspectRecord, setInspectRecord] = useState<PastSignalRecord | null>(null);

  const [billing, setBilling] = useState<BillingCycle>('monthly');
  const [chartRange, setChartRange] = useState<RangeFilter>('90D');
  const [accountSize, setAccountSize] = useState('10000');
  const [riskPct, setRiskPct] = useState('1.0');
  const [stopLossPips, setStopLossPips] = useState('25');
  const [pipValuePerLot, setPipValuePerLot] = useState('10');

  const visibleGallery = PAST_SIGNAL_GALLERY.slice(galleryPage * 3, galleryPage * 3 + 3);

  const prevGallery = () => setGalleryPage((p) => (p - 1 + totalPages) % totalPages);
  const nextGallery = () => setGalleryPage((p) => (p + 1) % totalPages);

  const parsedAcct = Math.max(0, Number(accountSize) || 0);
  const parsedRisk = Math.max(0, Math.min(100, Number(riskPct) || 0));
  const parsedSl = Math.max(0.1, Number(stopLossPips) || 0.1);
  const parsedPipVal = Math.max(0.1, Number(pipValuePerLot) || 10);

  const riskDollar = (parsedAcct * parsedRisk) / 100;
  const standardLots = riskDollar / (parsedSl * parsedPipVal);
  const miniLots = standardLots * 10;
  const microLots = standardLots * 100;

  const planPriceMap: Record<BillingCycle, { label: string; price: number; suffix: string }> = {
    weekly: { label: 'Weekly Pass', price: 49, suffix: '/ week' },
    monthly: { label: 'Monthly Desk', price: 149, suffix: '/ month' },
    yearly: { label: 'Annual Desk (Save 30%)', price: 1240, suffix: '/ year' },
  };

  return (
    <div className="relative isolate bg-[#000000] overflow-x-clip">
      {/* Spartan Vanguard Full-Width Background Layer (100% of scene preserved, 22% opacity, blended with site theme) */}
      <div
        aria-hidden="true"
        className="pointer-events-none sticky top-0 z-0 -mb-[100vh] h-screen w-full overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 72% 78% at 50% 46%, rgba(201, 162, 75, 0.08), rgba(30, 58, 138, 0.09) 56%, rgba(0, 0, 0, 0.92) 92%)',
          }}
        />
        <img
          src={signalsSpartanBg}
          alt=""
          referrerPolicy="no-referrer"
          className="relative h-full w-full object-cover object-center opacity-[0.22] mix-blend-lighten select-none"
        />
        {/* Seamless obsidian & sapphire perimeter blend */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 78% 84% at 50% 48%, transparent 38%, rgba(2, 5, 13, 0.44) 74%, #000000 98%), linear-gradient(to bottom, rgba(0, 0, 0, 0.42) 0%, transparent 14%, transparent 82%, #000000 100%)',
          }}
        />
      </div>

      <div className="relative z-10 pt-20">
      {/* 1. Reference Signal Service Intro Section */}
      <section className="relative py-20 sm:py-28 border-b border-[#C9A24B]/18 overflow-hidden">
        <AmbientMeshCanvas />
        {!reducedMotion && (
          <video
            src="/videos/bullish-titan-signals-alert.mp4"
            poster={ACADEMY_ASSETS.signalsHub}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.18] mix-blend-screen"
          />
        )}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#000000]/58 via-[#02060D]/32 to-[#000000]/46"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3.5">
                  <span className="h-px w-8 bg-gold-gradient" aria-hidden="true" />
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold text-gold-gradient">
                    Bullish Titan · Daily Trade Alerts
                  </p>
                </div>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#EDE6D6] leading-[1.06]">
                  Daily Trade{' '}
                  <span className="italic font-semibold text-gold-gradient">
                    Signals
                  </span>
                </h1>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-[#9A968C] leading-relaxed">
                <p>
                  Bullish Titan sends clear Forex and Synthetic Indices trade ideas every day—showing you clean chart setups, simple rules, and exact safety stops.
                </p>
                <p>
                  Every alert gives you the exact entry price, safety stop-loss, profit targets, and a plain-English reason for the trade—so you never have to guess or over-risk.
                </p>
              </div>

              {/* Reference Two Single-Item Feature Blocks */}
              <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-[#C9A24B]/20">
                <div className="flex items-start gap-3.5 pt-4">
                  <ShieldCrestBadge className="h-10 w-9 shrink-0">
                    <ShieldCheck className="h-4 w-4 text-[#F0D58A]" />
                  </ShieldCrestBadge>
                  <div>
                    <h2 className="font-display text-base font-bold text-[#EDE6D6]">
                      Safety-First Trade Sizes
                    </h2>
                    <p className="mt-1 text-xs text-[#9A968C]">
                      Protect your money with clear 1:2.5+ reward-to-risk ratios and our simple lot calculator.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-4">
                  <ShieldCrestBadge className="h-10 w-9 shrink-0">
                    <TrendingUp className="h-4 w-4 text-[#F0D58A]" />
                  </ShieldCrestBadge>
                  <div>
                    <h2 className="font-display text-base font-bold text-[#EDE6D6]">
                      Hand-Picked Daily Setups
                    </h2>
                    <p className="mt-1 text-xs text-[#9A968C]">
                      Carefully checked EUR/USD, Gold, V75, and Boom &amp; Crash alerts sent straight to your phone.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3.5 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Signal Plans
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => document.getElementById('past-signals')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  See Past Trade Examples
                </Button>
              </div>
            </div>

            {/* Right Shield-Framed Signal Console Column */}
            <div className="lg:col-span-6 space-y-4">
              <ShieldFrame
                variant="landscape"
                bright
                innerClassName="aspect-[16/10] w-full"
                caption="PLATE I — MULTI-MARKET SIGNAL ALERT RADAR · LIVE LOOP"
              >
                {reducedMotion ? (
                  <SafeImage
                    src={ACADEMY_ASSETS.signalsHub}
                    alt="Bullish Titan Academy Signal Service Console"
                    width={1280}
                    height={800}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <video
                    src="/videos/bullish-titan-signals-alert.mp4"
                    poster={ACADEMY_ASSETS.signalsHub}
                    autoPlay
                    muted
                    loop
                    playsInline
                    aria-label="Multi-market signals alert radar animation"
                    className="h-full w-full object-cover"
                  />
                )}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-transparent to-transparent"
                />
              </ShieldFrame>

              <div className="rounded-md hairline-gold px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-gold-gradient">
                    LATEST DEMO ALERT EXAMPLE · {DEMO_SIGNALS[0].pair}
                  </p>
                  <p className="font-mono text-xs sm:text-sm font-medium text-[#EDE6D6] mt-0.5 tabular-nums">
                    Entry {DEMO_SIGNALS[0].entry} · SL {DEMO_SIGNALS[0].stopLoss} ·{' '}
                    <span className="text-[#1F9D6B]">TP3 {DEMO_SIGNALS[0].tp3}</span>
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setInspectRecord(PAST_SIGNAL_GALLERY[0])}
                >
                  Inspect Card
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RisingArrowConnector align="right" className="pt-6" />

      {/* 2. Reference "Past Signals" 3-Column Carousel + Numbered Pagination */}
      <Section
        id="past-signals"
        romanIndex="01"
        kicker="Sample Past Trades · Demo Examples"
        title="Past Trade Examples"
        subtitle="Look through sample Forex and Synthetic Indices setups. Click any card to see the exact entry, stop-loss, and targets."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {visibleGallery.map((item) => (
            <motion.article
              key={item.id}
              initial={reducedMotion ? undefined : { opacity: 0, y: 12 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="group relative rounded-lg hairline-gold p-4 flex flex-col justify-between hover:border-[#C9A24B]/50 transition-colors"
            >
              <div>
                <ShieldFrame variant="landscape" innerClassName="aspect-[16/10] w-full">
                  <SafeImage
                    src={item.image}
                    alt={item.headline}
                    width={900}
                    height={560}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-[#000000]/20 to-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setInspectRecord(item)}
                    aria-label={`Inspect ${item.headline}`}
                    className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-md border border-[#C9A24B]/40 bg-[#000000]/85 text-[#F0D58A] hover:border-[#F0D58A] transition-all"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between gap-2 text-[11px] font-mono">
                    <span className="text-[#F0D58A] font-semibold">{item.signal.pair}</span>
                    <span className="text-[#1F9D6B] font-semibold">{item.signal.rr}</span>
                  </div>
                </ShieldFrame>

                <div className="pt-4 px-1">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#9A968C]">
                    {item.session}
                  </p>
                  <h3 className="mt-1.5 font-display text-lg font-bold text-[#EDE6D6] leading-snug">
                    {item.headline}
                  </h3>
                  <p className="mt-1.5 text-xs text-[#9A968C]">{item.caption}</p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#C9A24B]/18 flex items-center justify-between px-1">
                <span className="font-mono text-xs text-[#1F9D6B] font-medium">
                  {item.signal.status}
                </span>
                <button
                  type="button"
                  onClick={() => setInspectRecord(item)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F0D58A] hover:underline"
                >
                  Inspect Record
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Reference Carousel Prev/Next + Numbered Pagination Controls */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={prevGallery}
            aria-label="Previous past signals page"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-[#C9A24B]/24 bg-[#0B0B0C] text-[#EDE6D6] hover:border-[#F0D58A]/60 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <ul className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => setGalleryPage(idx)}
                  aria-current={galleryPage === idx ? 'page' : undefined}
                  className={cn(
                    'flex h-10 min-w-[40px] items-center justify-center rounded-md border font-mono text-xs font-semibold transition-colors',
                    galleryPage === idx
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
            onClick={nextGallery}
            aria-label="Next past signals page"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-[#C9A24B]/24 bg-[#0B0B0C] text-[#EDE6D6] hover:border-[#F0D58A]/60 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <RiskDisclaimer compact className="mt-8" />
      </Section>

      <ShieldSectionDivider label="Signal Plans" />

      {/* 3. Plan Cards with Billing Toggle */}
      <Section
        id="plans"
        romanIndex="02"
        kicker="Choose Your Plan"
        title="Daily Signal Subscriptions"
        subtitle="Pick weekly, monthly, or yearly billing. Every plan includes Telegram, WhatsApp, email alerts, and our easy lot-size calculator."
      >
        <div className="mb-8 flex justify-start">
          <Tabs
            value={billing}
            onChange={setBilling}
            options={[
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly (Save 30%)' },
            ]}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <PricingCard
            title="Forex &amp; Gold Signals"
            subtitle="Clean Forex &amp; Gold trade alerts timed for London and New York hours."
            price={billing === 'weekly' ? 39 : billing === 'monthly' ? 119 : 990}
            periodLabel={planPriceMap[billing].suffix}
            features={[
              '6–10 hand-picked Forex & Gold alerts each week',
              'Clear entry price, safety stop, and profit targets',
              'Sent straight to your Telegram and email',
            ]}
            to="/contact"
            ctaLabel="Choose Forex & Gold"
          />

          <PricingCard
            title="All-Market Signals"
            subtitle="Complete Forex, Gold, Volatility 75, and Boom/Crash real-time trade alerts."
            price={planPriceMap[billing].price}
            periodLabel={planPriceMap[billing].suffix}
            featured
            metaTag="Most Popular"
            features={[
              'All Forex, Gold & Synthetic Indices alerts',
              'Telegram, WhatsApp, Push & Student App alerts',
              'Sunday weekly market outlook & trade plan',
              'Weekly live trade review call',
            ]}
            to="/contact"
            ctaLabel="Choose All-Market"
          />

          <PricingCard
            title="Courses + Signals Bundle"
            subtitle="Get daily trade alerts plus full access to our Beginner &amp; Intermediate video courses."
            price={billing === 'weekly' ? 69 : billing === 'monthly' ? 199 : 1680}
            periodLabel={planPriceMap[billing].suffix}
            features={[
              'Full All-Market Daily Signals access',
              'Beginner & Intermediate video courses included',
              'Printable trade journal & safety calculator sheets',
            ]}
            to="/training"
            ctaLabel="View Bundle"
          />
        </div>
      </Section>

      {/* 4. Multi-Channel Delivery + Shield-Framed 3D Signal Radar */}
      <Section
        romanIndex="03"
        kicker="Multi-Channel Delivery"
        title="How Signals Reach You Instantly"
        subtitle="Receive timely setup briefs across your preferred platforms without refreshing charts all day."
      >
        <div className="grid gap-10 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5">
            <ShieldFrame variant="crest" bright caption="PLATE II — LIVE ALERT RADAR">
              <Suspense
                fallback={
                  <div className="h-[260px] flex items-center justify-center text-xs font-mono text-[#9A968C]">
                    Loading 3D Signal Radar...
                  </div>
                }
              >
                <SignalsRadarScene3D />
              </Suspense>
            </ShieldFrame>
          </div>
          <div className="lg:col-span-7 border-y border-[#C9A24B]/22 divide-y divide-[#C9A24B]/16">
            {DELIVERY_CHANNELS.map((ch) => {
              const Icon = ch.icon;
              return (
                <div key={ch.name} className="py-4 flex items-center gap-4">
                  <ShieldCrestBadge className="h-10 w-9 shrink-0">
                    <Icon className="h-4 w-4 text-[#F0D58A]" />
                  </ShieldCrestBadge>
                  <div>
                    <h3 className="font-display text-base font-bold text-[#EDE6D6]">{ch.name}</h3>
                    <p className="text-xs sm:text-sm text-[#9A968C]">{ch.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* 5. Signal Anatomy & Demo Performance Analytics */}
      <Section
        romanIndex="04"
        kicker="Setup Literacy & Risk Discipline"
        title="Signal Anatomy & Demo R-Multiple Analytics"
        subtitle="Every setup brief is standardized for under-30-second risk validation."
      >
        <div className="grid gap-8 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-5 space-y-5">
            <SignalAnatomyIllustration />
            <Card className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#F0D58A] font-display text-lg font-bold mb-3">
                  <ShieldAlert className="h-5 w-5 text-[#C9A24B]" />
                  <span>Risk Management Rules</span>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#9A968C] leading-relaxed">
                  <li>
                    <strong className="text-[#EDE6D6]">Per-Trade Cap:</strong> Risk 0.5% to 1.0% per setup—never widen a stop-loss.
                  </li>
                  <li>
                    <strong className="text-[#EDE6D6]">Correlation Control:</strong> Split exposure across correlated FX or synthetic assets.
                  </li>
                  <li>
                    <strong className="text-[#EDE6D6]">Break-Even Discipline:</strong> Trail SL to entry only after structural TP1 reaction.
                  </li>
                </ul>
              </div>
            </Card>
          </div>

          <Card className="lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-[#C9A24B]/18">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-gold-gradient">
                  Placeholder Demo Chart · Not Live Fund Results
                </p>
                <h3 className="mt-1 font-display text-xl font-bold text-[#EDE6D6]">
                  Illustrative R-Multiple Index ({chartRange})
                </h3>
              </div>
              <Tabs
                value={chartRange}
                onChange={setChartRange}
                options={[
                  { value: '30D', label: '30D' },
                  { value: '90D', label: '90D' },
                  { value: '1Y', label: '1Y' },
                ]}
              />
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DEMO_EQUITY_CURVE[chartRange]}>
                  <defs>
                    <linearGradient id="signalsEmerald" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1F9D6B" stopOpacity={0.34} />
                      <stop offset="95%" stopColor="#1F9D6B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(201,162,75,0.08)" vertical={false} />
                  <XAxis dataKey="label" stroke="#9A968C" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#9A968C" fontSize={11} tickLine={false} axisLine={false} width={38} />
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
                    dataKey="demoIndex"
                    name="Demo Growth Curve"
                    stroke="#1F9D6B"
                    strokeWidth={2.2}
                    fill="url(#signalsEmerald)"
                  />
                  <Area
                    type="monotone"
                    dataKey="benchmark"
                    name="Demo Baseline"
                    stroke="#C9A24B"
                    strokeWidth={1.6}
                    fill="transparent"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <RiskDisclaimer compact className="mt-5" />
          </Card>
        </div>
      </Section>

      {/* 6. Embedded Position-Size Calculator */}
      <Section
        id="calculator"
        romanIndex="05"
        kicker="Interactive Tool"
        title="Forex, Gold & Synthetic Position-Size Calculator"
        subtitle="Calculate exact lot size before placing any order so every signal honors your fixed risk percentage."
      >
        <Card className="max-w-4xl mx-auto">
          <div className="grid gap-8 md:grid-cols-12 items-center">
            <div className="md:col-span-7 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="calc-acct" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
                  Account Size (USD)
                </label>
                <input
                  id="calc-acct"
                  type="number"
                  min={100}
                  value={accountSize}
                  onChange={(e) => setAccountSize(e.target.value)}
                  className="h-11 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] px-3.5 font-mono text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none tabular-nums"
                />
              </div>

              <div>
                <label htmlFor="calc-risk" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
                  Risk Per Trade (%)
                </label>
                <input
                  id="calc-risk"
                  type="number"
                  step="0.1"
                  min={0.1}
                  max={10}
                  value={riskPct}
                  onChange={(e) => setRiskPct(e.target.value)}
                  className="h-11 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] px-3.5 font-mono text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none tabular-nums"
                />
              </div>

              <div>
                <label htmlFor="calc-sl" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
                  Stop Loss (Pips)
                </label>
                <input
                  id="calc-sl"
                  type="number"
                  step="1"
                  min={1}
                  value={stopLossPips}
                  onChange={(e) => setStopLossPips(e.target.value)}
                  className="h-11 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] px-3.5 font-mono text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none tabular-nums"
                />
              </div>

              <div>
                <label htmlFor="calc-pipval" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
                  Pip Value / Standard Lot ($)
                </label>
                <input
                  id="calc-pipval"
                  type="number"
                  step="0.5"
                  min={1}
                  value={pipValuePerLot}
                  onChange={(e) => setPipValuePerLot(e.target.value)}
                  className="h-11 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] px-3.5 font-mono text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none tabular-nums"
                />
              </div>
            </div>

            <div className="md:col-span-5 rounded-lg hairline-gold-bright p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs text-[#9A968C]">
                <Calculator className="h-4 w-4 text-[#C9A24B]" />
                <span>Recommended Standard Lots</span>
              </div>
              <span className="block font-mono text-3xl font-bold text-gold-gradient tabular-nums">
                {standardLots.toFixed(2)} lots
              </span>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#C9A24B]/20 font-mono text-xs tabular-nums">
                <div>
                  <span className="block text-[10px] text-[#9A968C]">Risk ($)</span>
                  <span className="text-[#EDE6D6] font-semibold">${riskDollar.toFixed(2)}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-[#9A968C]">Mini Lots</span>
                  <span className="text-[#EDE6D6] font-semibold">{miniLots.toFixed(1)}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-[#9A968C]">Micro Lots</span>
                  <span className="text-[#EDE6D6] font-semibold">{microLots.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Section>

      {/* 7. Signals FAQ */}
      <Section romanIndex="06" kicker="Signal Questions" title="Common Questions About Our Signals">
        <div className="max-w-3xl">
          <Accordion
            items={[
              {
                title: 'How many signals are posted in a typical week?',
                content:
                  'Quality takes priority over volume. Expect 6–12 high-conviction FX, Gold, and Synthetic Indices setups per week across active sessions and 24/7 synthetic markets.',
              },
              {
                title: 'Do signals work with any regulated Forex or synthetic indices broker?',
                content:
                  'Yes. Price levels are quoted on standard spot FX and synthetic index feeds so you can execute on your preferred regulated broker.',
              },
              {
                title: 'Are past setup examples and performance charts live audited results?',
                content:
                  'No. Past setup records and equity curves displayed on this page are clearly labeled Demo illustrations for educational demonstration.',
              },
            ]}
          />
        </div>
      </Section>

      <Modal
        isOpen={Boolean(inspectRecord)}
        onClose={() => setInspectRecord(null)}
        title={inspectRecord?.headline || 'Signal Record Inspection'}
        subtitle={inspectRecord?.session}
        size="lg"
      >
        {inspectRecord && (
          <div className="space-y-4">
            <ShieldFrame variant="landscape" innerClassName="aspect-[16/9] w-full">
              <SafeImage
                src={inspectRecord.image}
                alt={inspectRecord.headline}
                width={1000}
                height={560}
                className="h-full w-full object-cover"
              />
            </ShieldFrame>
            <SignalCard signal={inspectRecord.signal} />
            <RiskDisclaimer compact />
          </div>
        )}
      </Modal>
      </div>
    </div>
  );
};

export default SignalsPage;
