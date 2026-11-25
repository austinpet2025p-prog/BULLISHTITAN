import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, CheckCircle2, Lock } from 'lucide-react';
import { Section } from '../components/ui/Section';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { EditorialReveal, GoldHairlineDivider } from '../components/ui/TitanMotifs';
import { PRICING_COLUMNS, type PricingPlanColumn } from '../data/extendedData';
import { cn, formatCurrency } from '../lib/utils';

type BillingPeriod = 'monthly' | 'yearly';

const FEATURED_PLANS = PRICING_COLUMNS.slice(0, 4);

const PLAN_JEWEL_CLASS = [
  'hairline-sapphire',
  'hairline-amethyst',
  'hairline-emerald',
  'hairline-bronze',
] as const;

export const PricingEnrollmentSection: React.FC = () => {
  const [billing, setBilling] = useState<BillingPeriod>('yearly');
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    FEATURED_PLANS[FEATURED_PLANS.length - 1]?.id ?? FEATURED_PLANS[0].id
  );
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [marketFocus, setMarketFocus] = useState('Forex Majors & Synthetic Indices');
  const [agreedRisk, setAgreedRisk] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const selectedPlan: PricingPlanColumn =
    FEATURED_PLANS.find((p) => p.id === selectedPlanId) ?? FEATURED_PLANS[0];

  const getUnitPrice = (plan: PricingPlanColumn) =>
    billing === 'monthly' ? plan.monthlyPrice : plan.yearlyMonthlyEquivalent;

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim().length < 2) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!agreedRisk) {
      setErrorMsg('Please confirm the educational & risk disclosure acknowledgement.');
      return;
    }
    setErrorMsg('');
    setSubmitted(true);
  };

  return (
    <Section
      id="pricing-enrollment"
      romanIndex="07"
      kicker="Rank Tuition & Initiation"
      title="Select Your Rank & Initiate Access"
      subtitle="Transparent monthly or annual commitment across every Bullish Titan order. Select your rank below to prepare your initiation dossier."
    >
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 border-b border-[#C9A24B]/18">
        <Tabs
          value={billing}
          onChange={setBilling}
          options={[
            { value: 'monthly', label: 'Monthly Billing' },
            { value: 'yearly', label: 'Annual (Save ~25%)' },
          ]}
        />
        <Link
          to="/pricing"
          className="font-mono text-xs uppercase tracking-wider text-[#C9A24B] hover:text-[#F0D58A] transition-colors"
        >
          View Full Matrix Comparison →
        </Link>
      </div>

      <div className="grid gap-10 lg:grid-cols-12 items-start">
        {/* Left: 4 Concise Plan Panels */}
        <div className="lg:col-span-7 grid gap-5 sm:grid-cols-2">
          {FEATURED_PLANS.map((plan, idx) => {
            const active = plan.id === selectedPlan.id;
            const unitPrice = getUnitPrice(plan);

            return (
              <EditorialReveal key={plan.id} delay={idx * 0.08}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setSelectedPlanId(plan.id);
                    setSubmitted(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedPlanId(plan.id);
                      setSubmitted(false);
                    }
                  }}
                  className={cn(
                    'flex h-full flex-col justify-between rounded-lg p-6 transition-all duration-300 cursor-pointer',
                    active
                      ? 'hairline-gold-bright shadow-[0_14px_38px_rgba(201,162,75,0.16)] scale-[1.01]'
                      : cn(PLAN_JEWEL_CLASS[idx % PLAN_JEWEL_CLASS.length], 'hover:brightness-110')
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C9A24B]">
                        0{idx + 1} · {plan.popular ? 'Highest Demand' : 'Rank Order'}
                      </span>
                      {active && <Check className="h-4 w-4 text-[#F0D58A]" />}
                    </div>

                    <h3 className="font-display text-2xl font-bold text-[#EDE6D6]">
                      {plan.name}
                    </h3>
                    <p className="mt-1.5 text-xs text-[#9A968C] leading-relaxed">
                      {plan.tagline}
                    </p>

                    <GoldHairlineDivider className="my-5" />

                    <div className="flex items-baseline gap-1.5 tabular-nums">
                      <span className="font-display text-4xl font-bold text-gold-gradient">
                        {formatCurrency(unitPrice)}
                      </span>
                      <span className="font-mono text-xs text-[#9A968C]">/ mo</span>
                    </div>
                    {billing === 'yearly' && (
                      <p className="mt-1 font-mono text-[11px] text-[#9A968C] tabular-nums">
                        {formatCurrency(unitPrice * 12)} billed annually
                      </p>
                    )}
                  </div>

                  <div className="mt-6">
                    <Button
                      type="button"
                      variant={active ? 'primary' : 'secondary'}
                      size="sm"
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlanId(plan.id);
                        setSubmitted(false);
                        document.getElementById('enrollment-form-card')?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'nearest',
                        });
                      }}
                    >
                      {active ? 'Selected Rank' : 'Claim This Rank'}
                    </Button>
                  </div>
                </div>
              </EditorialReveal>
            );
          })}
        </div>

        {/* Right: Clean Mobile-Ready Enrollment Form */}
        <EditorialReveal delay={0.14} className="lg:col-span-5">
          <div
            id="enrollment-form-card"
            className="hairline-gold-bright bg-aurora-obsidian rounded-lg p-6 sm:p-8"
          >
            {submitted ? (
              <div className="py-6 text-center space-y-4">
                <CheckCircle2 className="h-12 w-12 text-[#F0D58A] mx-auto" />
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#C9A24B]">
                    Rank Reserved · Demo Initiation
                  </p>
                  <h3 className="font-display text-2xl font-bold text-[#EDE6D6]">
                    Initiation Dossier Received
                  </h3>
                  <p className="text-sm text-[#9A968C] leading-relaxed">
                    Initiate: <strong className="text-[#EDE6D6]">{fullName}</strong> · Rank Order:{' '}
                    <strong className="text-[#F0D58A]">{selectedPlan.name}</strong> (
                    {formatCurrency(getUnitPrice(selectedPlan))}/mo · {billing}). Command onboarding instructions have been queued for {email}.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    fullWidth
                    onClick={() => setSubmitted(false)}
                  >
                    Revise Dossier
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleEnrollSubmit} className="space-y-4" noValidate>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-gold-gradient">
                      Direct Initiation
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-bold text-[#EDE6D6]">
                      Initiate {selectedPlan.name}
                    </h3>
                    <p className="mt-1 text-xs text-[#9A968C]">
                      Enter your credentials below to receive rank onboarding syllabus access and tuition confirmation.
                    </p>
                  </div>

                <div>
                  <label
                    htmlFor="enroll-name"
                    className="block text-xs font-medium text-[#EDE6D6] mb-1.5"
                  >
                    Full Legal Name
                  </label>
                  <input
                    id="enroll-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="h-12 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] px-4 text-sm text-[#EDE6D6] placeholder:text-[#9A968C]/50 focus:border-[#F0D58A] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="enroll-email"
                    className="block text-xs font-medium text-[#EDE6D6] mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="enroll-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="trader@domain.com"
                    className="h-12 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] px-4 text-sm text-[#EDE6D6] placeholder:text-[#9A968C]/50 focus:border-[#F0D58A] focus:outline-none"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="enroll-tier"
                      className="block text-xs font-medium text-[#EDE6D6] mb-1.5"
                    >
                      Rank Order
                    </label>
                    <select
                      id="enroll-tier"
                      value={selectedPlan.id}
                      onChange={(e) => setSelectedPlanId(e.target.value)}
                      className="h-12 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] px-3 text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none"
                    >
                      {FEATURED_PLANS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({formatCurrency(getUnitPrice(p))}/mo)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="enroll-market"
                      className="block text-xs font-medium text-[#EDE6D6] mb-1.5"
                    >
                      Market Focus
                    </label>
                    <select
                      id="enroll-market"
                      value={marketFocus}
                      onChange={(e) => setMarketFocus(e.target.value)}
                      className="h-12 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] px-3 text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none"
                    >
                      <option>Forex Majors &amp; Gold</option>
                      <option>Synthetic Indices (V75 / Boom)</option>
                      <option>Forex Majors &amp; Synthetic Indices</option>
                    </select>
                  </div>
                </div>

                <label className="flex items-start gap-2.5 pt-1 text-xs text-[#9A968C] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedRisk}
                    onChange={(e) => setAgreedRisk(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-[#C9A24B]/40 bg-[#000000] accent-[#C9A24B]"
                  />
                  <span>
                    I understand Forex and Synthetic Indices trading carries substantial risk of loss and enrollment is strictly educational.
                  </span>
                </label>

                {errorMsg && (
                  <p className="text-xs text-[#EF4444]" role="alert">
                    {errorMsg}
                  </p>
                )}

                <Button type="submit" variant="primary" size="lg" fullWidth className="min-h-[48px]">
                  Confirm Rank Initiation
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <p className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-[#9A968C]">
                  <Lock className="h-3.5 w-3.5 text-[#C9A24B]" />
                  Encrypted admissions · No broker lock-in
                </p>
              </form>
            )}
          </div>
        </EditorialReveal>
      </div>
    </Section>
  );
};
