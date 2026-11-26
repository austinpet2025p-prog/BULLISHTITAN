import React, { Suspense, lazy, useState } from 'react';
import { Calendar, CheckCircle2, Clock, ShieldCheck, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PricingCard } from '../components/ui/PricingCard';
import { MentorCard } from '../components/ui/MentorCard';
import { Modal } from '../components/ui/Modal';
import { Accordion } from '../components/ui/Accordion';
import { AmbientMeshCanvas } from '../components/ui/AmbientMeshCanvas';
import { SuccessConfetti } from '../components/ui/SuccessConfetti';
import { SafeImage } from '../components/ui/SafeImage';
import {
  RisingArrowConnector,
  ShieldFrame,
  ShieldSectionDivider,
} from '../components/ui/TitanMotifs';
import {
  ACADEMY_ASSETS,
  MENTORS,
  MENTORSHIP_TIERS,
  TWELVE_WEEK_ROADMAP,
  type MentorProfile,
} from '../data/academyData';
import { cn } from '../lib/utils';
import { useReducedMotion } from '../hooks/useReducedMotion';
import mentorshipSpartanBg from '../assets/images/mentorship_spartan_widescreen_1795618871053.jpg';

const MentorshipScene3D = lazy(() => import('../components/three/MentorshipScene3D'));

const TIME_SLOTS = ['09:00', '11:30', '14:00', '16:30', '19:00'];
const TIMEZONES = ['UTC (London)', 'EST (New York)', 'CET (Frankfurt)', 'GST (Dubai)', 'SGT (Singapore)'];
const ROMAN = ['I', 'II', 'III', 'IV'];

export const MentorshipPage: React.FC = () => {
  const reducedMotion = useReducedMotion();

  const [selectedMentor, setSelectedMentor] = useState<MentorProfile>(MENTORS[0]);
  const [bookingDate, setBookingDate] = useState('2026-11-24');
  const [bookingTime, setBookingTime] = useState('14:00');
  const [bookingTz, setBookingTz] = useState('EST (New York)');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const [appForm, setAppForm] = useState({
    fullName: '',
    email: '',
    experience: '6–24 Months Live/Demo',
    capitalRange: '$5,000 – $25,000',
    preferredMarket: 'Forex Majors & Gold',
    goals: '',
  });
  const [appErrors, setAppErrors] = useState<Record<string, string>>({});
  const [appSuccess, setAppSuccess] = useState(false);

  const handleBookFromCard = (mentor: MentorProfile) => {
    setSelectedMentor(mentor);
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (appForm.fullName.trim().length < 2) errs.fullName = 'Full name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(appForm.email.trim())) {
      errs.email = 'Valid email address is required.';
    }
    if (appForm.goals.trim().length < 15) {
      errs.goals = 'Please share a brief summary of your trading goals (min 15 characters).';
    }
    setAppErrors(errs);
    if (Object.keys(errs).length === 0) {
      setAppSuccess(true);
    }
  };

  return (
    <div className="relative isolate bg-[#000000] overflow-x-clip">
      {/* Full-Bleed Recreated Spartan Commander Background Layer (100% figure preserved, 22% opacity) */}
      <div
        aria-hidden="true"
        className="pointer-events-none sticky top-0 z-0 -mb-[100vh] h-screen w-full overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 68% 72% at 50% 46%, rgba(201, 162, 75, 0.08), rgba(30, 58, 138, 0.08) 56%, rgba(0, 0, 0, 0.92) 92%)',
          }}
        />
        <img
          src={mentorshipSpartanBg}
          alt=""
          referrerPolicy="no-referrer"
          className="relative h-full w-full object-cover object-center opacity-[0.22] mix-blend-lighten select-none"
        />
        {/* Seamless obsidian & sapphire perimeter blend */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 78% 84% at 50% 48%, transparent 38%, rgba(2, 5, 13, 0.42) 74%, #000000 98%), linear-gradient(to bottom, rgba(0, 0, 0, 0.42) 0%, transparent 14%, transparent 82%, #000000 100%)',
          }}
        />
      </div>

      <div className="relative z-10 pt-20">
      {/* Hero */}
      <section className="relative py-20 sm:py-28 border-b border-[#C9A24B]/18 overflow-hidden">
        <AmbientMeshCanvas />
        {!reducedMotion && (
          <video
            src="/videos/bullish-titan-mentorship-scene.mp4"
            poster={ACADEMY_ASSETS.mentorshipRoom}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-screen"
          />
        )}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#000000]/58 via-[#02050D]/28 to-[#000000]/45"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8 bg-gold-gradient" aria-hidden="true" />
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold text-gold-gradient">
                  02 · 1-on-1 Coaching &amp; Mentorship
                </p>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#EDE6D6] leading-[1.06]">
                Learn Directly Beside{' '}
                <span className="italic font-semibold text-gold-gradient">
                  Senior Trading Coaches
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-base text-[#9A968C] leading-relaxed">
                Work directly with experienced Forex and Synthetic Indices coaches over a clear 12-week program—reviewing your charts, trade sizes, and calm decision-making every single week.
              </p>
              <div className="mt-8 flex flex-wrap gap-3.5">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Apply for Coaching
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => document.getElementById('tiers')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Compare Plans
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <ShieldFrame variant="crest" bright caption="PLATE I — DIRECT COACHING NETWORK">
                <Suspense
                  fallback={
                    <div className="h-[340px] flex items-center justify-center text-xs font-mono text-[#9A968C]">
                      Loading 3D Network...
                    </div>
                  }
                >
                  <MentorshipScene3D />
                </Suspense>
              </ShieldFrame>
            </div>
          </div>
        </div>
      </section>

      <RisingArrowConnector align="right" className="pt-6" />

      {/* Program Tiers Comparison */}
      <Section
        id="tiers"
        romanIndex="01"
        kicker="Coaching Options"
        title="Three Simple Coaching Plans"
        subtitle="Choose small-group classes, private 1-on-1 coaching calls, or VIP full-access mentorship."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {MENTORSHIP_TIERS.map((tier) => (
            <PricingCard
              key={tier.id}
              title={tier.name}
              subtitle={tier.summary}
              price={tier.monthlyPrice}
              periodLabel="/ month"
              features={tier.features}
              featured={tier.featured}
              metaTag={tier.featured ? 'Most Popular' : undefined}
              ctaLabel={`Choose ${tier.name}`}
              onSelect={() => document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })}
            />
          ))}
        </div>
      </Section>

      <ShieldSectionDivider label="Meet Your Coaches" />

      {/* Mentor Profile Cards + Desk Environment Showcase */}
      <Section
        romanIndex="02"
        kicker="Your Coaching Team"
        title="Meet Your Senior Trading Coaches"
        subtitle="Flip any card to see each coach's experience, favorite markets, and teaching style."
      >
        <div className="mb-12 grid gap-10 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7">
            <ShieldFrame
              variant="landscape"
              bright
              innerClassName="aspect-[16/9] w-full"
              caption="PLATE II — LIVE COACHING CLASSROOM · SESSION PREVIEW"
            >
              {reducedMotion ? (
                <SafeImage
                  src={ACADEMY_ASSETS.mentorshipRoom}
                  alt="Bullish Titan live coaching classroom"
                  width={1280}
                  height={720}
                  className="h-full w-full object-cover"
                />
              ) : (
                <video
                  src="/videos/bullish-titan-mentorship-scene.mp4"
                  poster={ACADEMY_ASSETS.mentorshipRoom}
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label="Live coaching classroom session preview"
                  className="h-full w-full object-cover"
                />
              )}
            </ShieldFrame>
          </div>
          <div className="lg:col-span-5 border-t border-[#C9A24B]/28 pt-6 space-y-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-gold-gradient">
              Small-Group &amp; Private Support
            </p>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#EDE6D6]">
              Live Chart Reviews &amp; Honest Feedback
            </h3>
            <p className="text-sm text-[#9A968C] leading-relaxed">
              Every student gets clear weekly chart reviews covering EUR/USD, GBP/USD, Gold, Volatility 75, and Boom/Crash—replacing guesswork with simple checklists you can follow calmly.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {MENTORS.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} onBook={handleBookFromCard} />
          ))}
        </div>
      </Section>

      {/* Your 12-Week Roadmap (Ascending Stepped Editorial) */}
      <Section
        id="roadmap"
        romanIndex="03"
        kicker="12-Week Plan"
        title="Your 12-Week Learning Path"
        subtitle="Four simple steps that replace random screen time with clear weekly milestones."
      >
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 items-start pt-4">
          {TWELVE_WEEK_ROADMAP.map((item, idx) => (
            <motion.div
              key={item.phase}
              initial={reducedMotion ? undefined : { opacity: 0, y: 14 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: idx * 0.08, duration: 0.38 }}
              className="border-t border-[#C9A24B]/35 pt-6"
            >
              <div className="flex items-baseline justify-between gap-2 mb-4">
                <span className="font-display italic text-3xl font-bold text-gold-gradient">
                  {ROMAN[idx]}.
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#9A968C]">
                  {item.phase}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-[#EDE6D6]">
                {item.title}
              </h3>
              <p className="mt-2.5 text-sm text-[#9A968C] leading-relaxed">
                {item.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      <ShieldSectionDivider label="Book a Call" />

      {/* Session Booking UI + Application Form */}
      <Section
        id="booking"
        romanIndex="04"
        kicker="Get Started"
        title="Book a Quick Call &amp; Apply"
        subtitle="Pick a free intro call time or send your short coaching application below."
      >
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          <Card className="lg:col-span-5 space-y-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-gold-gradient">
                Front-End Demo Scheduler
              </p>
              <h3 className="mt-1 font-display text-2xl font-bold text-[#EDE6D6]">
                Book a Mentor Discovery Call
              </h3>
            </div>

            <div>
              <label htmlFor="mentor-select" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
                Preferred Mentor
              </label>
              <select
                id="mentor-select"
                value={selectedMentor.id}
                onChange={(e) => {
                  const found = MENTORS.find((m) => m.id === e.target.value);
                  if (found) setSelectedMentor(found);
                }}
                className="h-11 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] px-3.5 text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none"
              >
                {MENTORS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} — {m.specialty}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="booking-date" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
                  Select Date
                </label>
                <div className="relative">
                  <Calendar className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#9A968C]" />
                  <input
                    id="booking-date"
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="h-11 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] pl-10 pr-3 text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="booking-tz" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
                  Timezone
                </label>
                <select
                  id="booking-tz"
                  value={bookingTz}
                  onChange={(e) => setBookingTz(e.target.value)}
                  className="h-11 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] px-3 text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none"
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz}>{tz}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <span className="block text-xs font-medium text-[#EDE6D6] mb-2">
                Available Time Slots
              </span>
              <div className="flex flex-wrap gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setBookingTime(slot)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-md border px-3 py-2 font-mono text-xs transition-colors',
                      bookingTime === slot
                        ? 'border-[#F0D58A] bg-[#C9A24B]/18 text-[#F0D58A]'
                        : 'border-[#C9A24B]/22 bg-[#000000] text-[#9A968C] hover:text-[#EDE6D6]'
                    )}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <Button fullWidth variant="primary" onClick={() => setBookingModalOpen(true)}>
              Confirm Discovery Slot
            </Button>
          </Card>

          <Card id="application" className="lg:col-span-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-gold-gradient">
              Admissions Intake
            </p>
            <h3 className="mt-1 font-display text-2xl font-bold text-[#EDE6D6] mb-5">
              Mentorship Application Form
            </h3>

            {appSuccess ? (
              <div className="rounded-lg border border-[#C9A24B]/40 bg-[#141414] p-6 text-center">
                <SuccessConfetti active={appSuccess} />
                <CheckCircle2 className="mx-auto h-10 w-10 text-[#C9A24B] mb-3" />
                <h4 className="font-display text-xl font-bold text-[#EDE6D6]">
                  Application Received
                </h4>
                <p className="mt-1.5 text-sm text-[#9A968C]">
                  Thank you, {appForm.fullName}. Our desk coordinator will review your {appForm.preferredMarket} objectives and respond within 24 business hours.
                </p>
                <Button className="mt-5" size="sm" onClick={() => setAppSuccess(false)}>
                  Submit Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleApplicationSubmit} className="space-y-4" noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="app-name" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
                      Full Name
                    </label>
                    <input
                      id="app-name"
                      type="text"
                      value={appForm.fullName}
                      onChange={(e) => setAppForm({ ...appForm, fullName: e.target.value })}
                      placeholder="Jordan Taylor"
                      className="h-11 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] px-3.5 text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none"
                    />
                    {appErrors.fullName && (
                      <p className="mt-1 text-xs text-[#EF4444]">{appErrors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="app-email" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="app-email"
                      type="email"
                      value={appForm.email}
                      onChange={(e) => setAppForm({ ...appForm, email: e.target.value })}
                      placeholder="jordan@domain.com"
                      className="h-11 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] px-3.5 text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none"
                    />
                    {appErrors.email && (
                      <p className="mt-1 text-xs text-[#EF4444]">{appErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor="app-exp" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
                      Experience Level
                    </label>
                    <select
                      id="app-exp"
                      value={appForm.experience}
                      onChange={(e) => setAppForm({ ...appForm, experience: e.target.value })}
                      className="h-11 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] px-3 text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none"
                    >
                      <option>Under 6 Months</option>
                      <option>6–24 Months Live/Demo</option>
                      <option>2+ Years Active Trader</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="app-cap" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
                      Capital Range
                    </label>
                    <select
                      id="app-cap"
                      value={appForm.capitalRange}
                      onChange={(e) => setAppForm({ ...appForm, capitalRange: e.target.value })}
                      className="h-11 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] px-3 text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none"
                    >
                      <option>Under $5,000 (Demo Focus)</option>
                      <option>$5,000 – $25,000</option>
                      <option>$25,000 – $100,000+</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="app-mkt" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
                      Preferred Market
                    </label>
                    <select
                      id="app-mkt"
                      value={appForm.preferredMarket}
                      onChange={(e) => setAppForm({ ...appForm, preferredMarket: e.target.value })}
                      className="h-11 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] px-3 text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none"
                    >
                      <option>Forex Majors &amp; Gold</option>
                      <option>Synthetic Indices (V75 / Boom &amp; Crash)</option>
                      <option>Cross-Asset FX + Synthetics</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="app-goals" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
                    Primary 12-Week Goals &amp; Current Bottlenecks
                  </label>
                  <textarea
                    id="app-goals"
                    rows={3}
                    value={appForm.goals}
                    onChange={(e) => setAppForm({ ...appForm, goals: e.target.value })}
                    placeholder="Describe your trading schedule, current strategy struggles, and what consistency looks like for you..."
                    className="w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] p-3.5 text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none"
                  />
                  {appErrors.goals && (
                    <p className="mt-1 text-xs text-[#EF4444]">{appErrors.goals}</p>
                  )}
                </div>

                <Button type="submit" variant="primary" size="lg" fullWidth>
                  Send Coaching Application
                </Button>
              </form>
            )}
          </Card>
        </div>
      </Section>

      {/* Expectations Section */}
      <Section
        romanIndex="05"
        kicker="Alignment & Ethics"
        title="What Mentorship Is—And What It Is Not"
        subtitle="Transparency ensures every cohort member joins with realistic expectations."
      >
        <div className="grid gap-8 md:grid-cols-2">
          <div className="border-t border-[#C9A24B]/40 pt-6">
            <div className="flex items-center gap-2.5 text-[#F0D58A] font-display text-xl font-bold mb-4">
              <ShieldCheck className="h-5 w-5 text-[#C9A24B]" />
              <span>What Mentorship Is</span>
            </div>
            <ul className="space-y-3 text-sm text-[#EDE6D6]/90">
              <li>• Structured 12-week feedback on your personal chart markups and trade journal.</li>
              <li>• Strict risk-management coaching centered on drawdown survival.</li>
              <li>• Live walkthroughs of London and New York market structure mechanics.</li>
              <li>• Behavioral accountability to eliminate revenge trading and over-leveraging.</li>
            </ul>
          </div>

          <div className="border-t border-[#EF4444]/40 pt-6">
            <div className="flex items-center gap-2.5 text-[#EF4444] font-display text-xl font-bold mb-4">
              <XCircle className="h-5 w-5" />
              <span>What Mentorship Is Not</span>
            </div>
            <ul className="space-y-3 text-sm text-[#9A968C]">
              <li>• Not a get-rich-quick scheme or guaranteed monthly return contract.</li>
              <li>• Not automated account management or blind copy-trading without context.</li>
              <li>• Not personalized financial or tax advice tailored as an investment fiduciary.</li>
              <li>• Not suitable for capital you cannot afford to place at market risk.</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Mentorship FAQ */}
      <Section romanIndex="06" kicker="Mentorship FAQ" title="Common Admissions Questions">
        <div className="max-w-3xl">
          <Accordion
            items={[
              {
                title: 'Which timezone are live mentorship workshops hosted in?',
                content:
                  'Group workshops run during early New York overlap (08:30 EST / 13:30 UTC) and are recorded in HD. 1-on-1 calls are scheduled in your preferred timezone.',
              },
              {
                title: 'Do I need a large trading account before applying?',
                content:
                  'No. During Weeks 1–9 we strongly encourage practicing execution rules in a demo account until your journal demonstrates rule adherence.',
              },
              {
                title: 'Can I pause or switch mentorship tiers month-to-month?',
                content:
                  'Yes, memberships operate on transparent monthly cycles with no long-term lock-in contracts.',
              },
            ]}
          />
        </div>
      </Section>

      <Modal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        title="Discovery Session Reserved (Demo)"
        subtitle="Ready for calendar API integration (Calendly / Cal.com)."
      >
        <div className="space-y-4">
          <div className="rounded-md border border-[#C9A24B]/24 bg-[#000000] p-4 space-y-2 text-sm">
            <p className="text-[#9A968C]">
              Mentor: <strong className="text-[#EDE6D6]">{selectedMentor.name}</strong>
            </p>
            <p className="text-[#9A968C]">
              Date: <strong className="font-mono text-[#EDE6D6]">{bookingDate}</strong>
            </p>
            <p className="text-[#9A968C]">
              Time: <strong className="font-mono text-[#F0D58A]">{bookingTime} · {bookingTz}</strong>
            </p>
          </div>
          <Button fullWidth onClick={() => setBookingModalOpen(false)}>
            Done
          </Button>
        </div>
      </Modal>
      </div>
    </div>
  );
};

export default MentorshipPage;
