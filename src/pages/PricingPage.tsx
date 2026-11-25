import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, CheckCircle2, CreditCard, Lock, Minus, Tag } from 'lucide-react';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { Modal } from '../components/ui/Modal';
import { Accordion } from '../components/ui/Accordion';
import { RiskDisclaimer } from '../components/ui/RiskDisclaimer';
import { SuccessConfetti } from '../components/ui/SuccessConfetti';
import { ShieldSectionDivider } from '../components/ui/TitanMotifs';
import {
  PRICING_COLUMNS,
  PRICING_FEATURE_ROWS,
  type PricingPlanColumn,
} from '../data/extendedData';
import { cn, formatCurrency } from '../lib/utils';

type BillingPeriod = 'monthly' | 'yearly';
type Gateway = 'Stripe' | 'Paystack' | 'Flutterwave';

export const PricingPage: React.FC = () => {
  const [billing, setBilling] = useState<BillingPeriod>('yearly');
  const [couponInput, setCouponInput] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState('');

  const [checkoutPlan, setCheckoutPlan] = useState<PricingPlanColumn | null>(null);
  const [gateway, setGateway] = useState<Gateway>('Stripe');
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (code === 'TITAN10' || code === 'DEMO10') {
      setCouponApplied(true);
      setCouponMessage('10% demo discount applied across all plans.');
    } else {
      setCouponApplied(false);
      setCouponMessage('Try demo code TITAN10 for a 10% tuition preview discount.');
    }
  };

  const getPrice = (col: PricingPlanColumn) => {
    const base = billing === 'monthly' ? col.monthlyPrice : col.yearlyMonthlyEquivalent;
    return couponApplied ? Math.round(base * 0.9) : base;
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (buyerName.trim().length < 2) {
      setCheckoutError('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail.trim())) {
      setCheckoutError('Please enter a valid billing email.');
      return;
    }
    setCheckoutError('');
    setCheckoutSuccess(true);
  };

  return (
    <div className="pt-20 bg-[#000000]">
      <Section
        romanIndex="01"
        kicker="Rank Orders &amp; Access"
        title="Transparent Commitment Across Every Order"
        subtitle="Compare individual division orders or unlock full-house Sovereign Titan status. Switch to annual billing for sustained commitment savings."
      >
        {/* Billing Toggle + Coupon Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-[#C9A24B]/18">
          <div className="flex items-center gap-3">
            <Tabs
              value={billing}
              onChange={setBilling}
              options={[
                { value: 'monthly', label: 'Monthly Billing' },
                { value: 'yearly', label: 'Yearly (Save ~25%)' },
              ]}
            />
          </div>

          <form onSubmit={applyCoupon} className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Tag className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-[#9A968C]" />
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Coupon code (try TITAN10)"
                aria-label="Coupon code"
                className="h-10 w-52 rounded-md border border-[#C9A24B]/24 bg-[#0B0B0C] pl-9 pr-3 text-xs text-[#EDE6D6] placeholder:text-[#9A968C]/70 focus:border-[#F0D58A] focus:outline-none"
              />
            </div>
            <Button type="submit" variant="secondary" size="sm">
              Apply Code
            </Button>
            {couponMessage && (
              <span
                className={cn(
                  'text-xs',
                  couponApplied ? 'text-[#F0D58A]' : 'text-[#9A968C]'
                )}
              >
                {couponMessage}
              </span>
            )}
          </form>
        </div>

        {/* 5 Plan Columns */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-16">
          {PRICING_COLUMNS.map((col) => {
            const unitPrice = getPrice(col);
            return (
              <Card
                key={col.id}
                featured={col.popular}
                hoverLift
                className="flex flex-col justify-between p-5"
              >
                <div>
                  {col.popular && (
                    <p className="font-mono text-[10px] uppercase tracking-wider font-semibold text-gold-gradient mb-1.5">
                      Highest Demand Order
                    </p>
                  )}
                  <h3 className="font-display text-xl font-bold text-[#EDE6D6]">{col.name}</h3>
                  <p className="mt-1.5 text-xs text-[#9A968C] min-h-[32px]">{col.tagline}</p>

                  <div className="my-5 py-4 border-y border-[#C9A24B]/18">
                    <motion.div
                      key={`${col.id}-${billing}-${couponApplied}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-baseline gap-1.5"
                    >
                      <span className="font-mono text-3xl font-bold text-[#EDE6D6] tabular-nums">
                        {formatCurrency(unitPrice)}
                      </span>
                      <span className="text-xs text-[#9A968C]">/ mo</span>
                    </motion.div>
                    {billing === 'yearly' && (
                      <p className="mt-1 font-mono text-[11px] text-[#C9A24B] tabular-nums">
                        Billed {formatCurrency(unitPrice * 12)} annually
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  variant={col.popular ? 'primary' : 'secondary'}
                  size="sm"
                  fullWidth
                  onClick={() => {
                    setCheckoutPlan(col);
                    setCheckoutSuccess(false);
                    setCheckoutError('');
                  }}
                >
                  {col.ctaLabel}
                </Button>
              </Card>
            );
          })}
        </div>

        <ShieldSectionDivider label="Capability Ledger" className="mb-14" />

        {/* Feature Comparison Matrix */}
        <div className="mb-16">
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#EDE6D6] mb-6">
            Side-by-Side Feature Comparison
          </h3>
          <div className="overflow-x-auto rounded-lg hairline-gold">
            <table className="w-full min-w-[780px] text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-[#0B0B0C] border-b border-[#C9A24B]/22">
                <tr>
                  <th className="py-4 px-5 font-mono text-[11px] uppercase tracking-wider font-semibold text-[#9A968C]">
                    Order Capability
                  </th>
                  {PRICING_COLUMNS.map((col) => (
                    <th
                      key={col.id}
                      className={cn(
                        'py-4 px-4 text-xs font-semibold text-center',
                        col.popular ? 'text-gold-gradient' : 'text-[#EDE6D6]'
                      )}
                    >
                      {col.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C9A24B]/14">
                {PRICING_FEATURE_ROWS.map((row) => (
                  <tr key={row.key} className="hover:bg-[#141414]/60 transition-colors">
                    <td className="py-3.5 px-5 text-xs sm:text-sm text-[#EDE6D6]">
                      {row.label}
                    </td>
                    {PRICING_COLUMNS.map((col) => {
                      const val = col.features[row.key];
                      return (
                        <td key={col.id} className="py-3.5 px-4 text-center">
                          {val === true ? (
                            <motion.span
                              initial={{ scale: 0.8, opacity: 0 }}
                              whileInView={{ scale: 1, opacity: 1 }}
                              viewport={{ once: true }}
                              className="inline-flex h-6 w-6 items-center justify-center border border-[#C9A24B]/40 bg-[#141414] text-[#F0D58A]"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </motion.span>
                          ) : val === false ? (
                            <Minus className="mx-auto h-4 w-4 text-[#9A968C]/35" />
                          ) : (
                            <span className="font-mono text-[11px] font-medium text-[#F0D58A]">
                              {val}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Encrypted Payment Gateways */}
        <div className="mb-12">
          <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5 text-[#EDE6D6] font-display text-lg font-bold mb-2">
                <Lock className="h-5 w-5 text-[#C9A24B]" />
                <span>Encrypted Payment Gateways</span>
              </div>
              <p className="text-sm text-[#9A968C]">
                Checkout architecture structured for Stripe, Paystack, and Flutterwave merchant hooks.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 font-mono text-[11px] text-[#EDE6D6]">
              <span className="border border-[#C9A24B]/24 bg-[#000000] px-3 py-1.5">STRIPE</span>
              <span className="border border-[#C9A24B]/24 bg-[#000000] px-3 py-1.5">PAYSTACK</span>
              <span className="border border-[#C9A24B]/24 bg-[#000000] px-3 py-1.5">FLUTTERWAVE</span>
              <span className="border border-[#C9A24B]/24 bg-[#000000] px-3 py-1.5">BANK TRANSFER</span>
            </div>
          </Card>
        </div>

        <RiskDisclaimer compact className="mb-12" />

        <div className="max-w-3xl">
          <h3 className="font-display text-2xl font-bold text-[#EDE6D6] mb-5">Order &amp; Rank FAQ</h3>
          <Accordion
            items={[
              {
                title: 'Can I ascend from Phalanx Dual Order to Strategos Mentorship later?',
                content:
                  'Yes. Active members can ascend or adjust ranks anytime from Command Console Settings with prorated adjustments.',
              },
              {
                title: 'Are taxes or gateway fees included?',
                content:
                  'Applicable VAT or regional sales tax is calculated cleanly inside the production Stripe/Paystack checkout session.',
              },
            ]}
          />
        </div>
      </Section>

      {/* Checkout Modal Flow */}
      <Modal
        isOpen={Boolean(checkoutPlan)}
        onClose={() => setCheckoutPlan(null)}
        title={checkoutPlan ? `Checkout · ${checkoutPlan.name}` : 'Checkout'}
        subtitle="Structured front-end flow ready for Stripe / Paystack / Flutterwave SDKs."
        size="md"
      >
        {checkoutPlan &&
          (checkoutSuccess ? (
            <div className="py-4 text-center space-y-3">
              <SuccessConfetti active={checkoutSuccess} />
              <CheckCircle2 className="mx-auto h-10 w-10 text-[#C9A24B]" />
              <h4 className="font-display text-lg font-bold text-[#EDE6D6]">
                {gateway} Session Initialized (Demo)
              </h4>
              <p className="text-xs text-[#9A968C] leading-relaxed">
                Plan: {checkoutPlan.name} ({billing === 'yearly' ? 'Annual' : 'Monthly'}) ·{' '}
                {formatCurrency(
                  billing === 'yearly' ? getPrice(checkoutPlan) * 12 : getPrice(checkoutPlan)
                )}
                . Ready to hand off to your server-side {gateway} checkout endpoint.
              </p>
              <Button fullWidth onClick={() => setCheckoutPlan(null)}>
                Close Preview
              </Button>
            </div>
          ) : (
            <form onSubmit={handleCheckoutSubmit} className="space-y-4" noValidate>
              <div className="rounded-md border border-[#C9A24B]/24 bg-[#000000] p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#EDE6D6]">{checkoutPlan.name}</p>
                  <p className="text-xs text-[#9A968C]">
                    {billing === 'yearly' ? 'Annual Billing' : 'Monthly Billing'}
                    {couponApplied ? ' · TITAN10 (-10%)' : ''}
                  </p>
                </div>
                <span className="font-mono text-xl font-bold text-gold-gradient tabular-nums">
                  {formatCurrency(
                    billing === 'yearly' ? getPrice(checkoutPlan) * 12 : getPrice(checkoutPlan)
                  )}
                </span>
              </div>

              <div>
                <label htmlFor="chk-name" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
                  Full Name
                </label>
                <input
                  id="chk-name"
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Alex Morgan"
                  className="h-11 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] px-3.5 text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="chk-email" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
                  Billing Email
                </label>
                <input
                  id="chk-email"
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder="alex@domain.com"
                  className="h-11 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] px-3.5 text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none"
                />
              </div>

              <div>
                <span className="block text-xs font-medium text-[#EDE6D6] mb-2">
                  Select Payment Provider
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['Stripe', 'Paystack', 'Flutterwave'] as Gateway[]).map((gw) => (
                    <button
                      key={gw}
                      type="button"
                      onClick={() => setGateway(gw)}
                      className={cn(
                        'flex items-center justify-center gap-1.5 rounded-md border py-2.5 text-xs font-medium transition-colors',
                        gateway === gw
                          ? 'border-[#F0D58A] bg-[#C9A24B]/16 text-[#F0D58A]'
                          : 'border-[#C9A24B]/22 bg-[#000000] text-[#9A968C] hover:text-[#EDE6D6]'
                      )}
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      {gw}
                    </button>
                  ))}
                </div>
              </div>

              {checkoutError && (
                <p className="text-xs text-[#EF4444]" role="alert">
                  {checkoutError}
                </p>
              )}

              <Button type="submit" fullWidth variant="primary" size="lg">
                Continue With {gateway}
              </Button>
            </form>
          ))}
      </Modal>
    </div>
  );
};

export default PricingPage;
