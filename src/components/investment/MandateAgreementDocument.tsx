import React from 'react';
import { ArrowRight, CheckCircle2, FileCheck2, Lock, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';
import { RiskDisclaimer } from '../ui/RiskDisclaimer';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';

export interface MandateClause {
  number: number;
  title: string;
  body: string;
  emphasis?: string;
}

export const ACCOUNT_MANAGEMENT_CLAUSES: MandateClause[] = [
  {
    number: 1,
    title: 'Account Access',
    body: 'You provide Bullish Titan Academy with trade-execution access to your designated brokerage account. This access is used strictly for market analysis and order execution. Your account remains permanently in your legal name and under your sole ownership.',
  },
  {
    number: 2,
    title: 'Capital Requirement',
    body: 'You fund your trading account with the stipulated equity required for your selected mandate rank. All capital remains inside your own brokerage custody, and Bullish Titan Academy holds zero authorization or technical ability to withdraw funds.',
  },
  {
    number: 3,
    title: 'Profit Sharing',
    body: 'Account management operates on a 50% / 50% performance-sharing structure: 50% to you (the Client), and 50% to Bullish Titan Academy. Profits are calculated and shared once the cycle profit target is reached and/or surpassed.',
    emphasis: 'We only earn when you earn.',
  },
  {
    number: 4,
    title: 'Withdrawals',
    body: 'Client withdrawals are processed cleanly once initiated per schedule upon reaching and/or surpassing the agreed profit target, following transparent profit calculation and 50/50 distribution.',
  },
  {
    number: 5,
    title: 'Trading Strategy & Client Non-Interference',
    body: 'Execution is governed strictly by structured market analysis—never gambling—across Synthetic Indices and Forex instruments. To keep automated position sizing and risk caps intact, clients agree not to place manual trades inside the linked managed sub-account.',
  },
  {
    number: 6,
    title: 'Risk Disclaimer',
    body: 'Foreign exchange and Synthetic Indices trading involves substantial risk of loss, and past performance never guarantees future results. While accounts are managed with institutional discipline and strict risk limits, losses may occur due to market volatility, and Bullish Titan Academy is not liable for trading losses incurred during active management.',
  },
  {
    number: 7,
    title: 'Termination',
    body: 'This agreement may be terminated at any time by either party upon prior notice. Once notice is executed, all active positions are closed in orderly fashion and any outstanding realized profits are calculated and shared per Clause 3.',
  },
  {
    number: 8,
    title: 'Confidentiality',
    body: 'All identity documents, credentials, and financial telemetry shared between both parties remain strictly confidential. Bullish Titan Academy never discloses client account details or trading history to unauthorized third parties.',
  },
  {
    number: 9,
    title: 'Loss Coverage Policy ($5,000+ Equity)',
    body: 'While every discipline is applied to preserve capital and trade responsibly, market conditions can be unpredictable. In the unlikely event an account suffers a complete loss, Bullish Titan Academy extends a discretionary goodwill loss-coverage provision of 10% of the initial deposit strictly to accounts funded with starting equity above $5,000. Accounts funded with less than $5,000 are not eligible for this provision.',
    emphasis: 'Discretionary goodwill gesture—not an insurance policy—subject to formal written mandate.',
  },
];

interface MandateAgreementDocumentProps {
  accepted: boolean;
  onAccept: () => void;
  compact?: boolean;
}

export const MandateAgreementDocument: React.FC<MandateAgreementDocumentProps> = ({
  accepted,
  onAccept,
  compact = false,
}) => {
  const reducedMotion = useReducedMotion();

  return (
    <article className="relative overflow-hidden rounded-xl hairline-gold-bright bg-[#050506] text-[#EDE6D6]">
      {/* Subtle Architectural Crest Watermark (Low-contrast graphic seal, not text) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03]"
      >
        <img
          src="/assets/aistudio/WhatsApp_Image_2026-11-15_at_11.43.04_PM_dff4afd1.jpeg"
          alt=""
          className="h-80 w-80 object-contain grayscale"
        />
      </div>

      {/* Top Metallic Gold Twin Rules (Adapted cleanly from reference PDF top rules) */}
      <div aria-hidden="true" className="w-full">
        <div className="h-[3px] w-full bg-gold-gradient" />
        <div className="mt-1 h-[1px] w-3/5 bg-[#C9A24B]/55" />
      </div>

      <div className={cn('relative z-10', compact ? 'p-5 sm:p-7' : 'p-6 sm:p-10')}>
        {/* Letterhead Masthead */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#C9A24B]/22">
          <div className="flex items-center gap-3.5">
            <img
              src="/assets/aistudio/WhatsApp_Image_2026-11-15_at_11.43.04_PM_dff4afd1.jpeg"
              alt="Bullish Titan Academy Crest"
              width={48}
              height={48}
              className="h-12 w-12 object-contain mix-blend-lighten shrink-0"
            />
            <div>
              <p className="font-display text-base sm:text-lg font-bold tracking-tight text-[#EDE6D6]">
                Bullish Titan Academy
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-gradient">
                Sovereign Mandate &amp; Stewardship Desk
              </p>
            </div>
          </div>

          <div className="font-mono text-[11px] text-[#9A968C] sm:text-right space-y-0.5">
            <p className="text-[#F0D58A]">Mandate Ref · BTA-AM-09</p>
            <p>Forex &amp; Synthetic Indices · Segregated Custody</p>
          </div>
        </header>

        {/* Document Heading & Intro */}
        <div className="py-7 text-center max-w-2xl mx-auto space-y-3 border-b border-[#C9A24B]/16">
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#EDE6D6] tracking-tight text-balance">
            Sovereign Mandate Terms &amp; Covenant
          </h3>
          <p className="text-xs sm:text-sm text-[#9A968C] leading-relaxed">
            Thank you for entrusting Bullish Titan Academy with execution stewardship over your trading account. This covenant outlines the exact rules, rank protections, and boundaries under which your mandate operates—ensuring complete clarity and institutional discipline throughout our partnership.
          </p>
        </div>

        {/* 9 Numbered Clauses */}
        <ol className="divide-y divide-[#C9A24B]/14">
          {ACCOUNT_MANAGEMENT_CLAUSES.map((clause, idx) => (
            <motion.li
              key={clause.number}
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              whileInView={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.25,
                delay: reducedMotion ? 0 : Math.min(idx * 0.03, 0.2),
                ease: [0.16, 1, 0.36, 1],
              }}
              className="py-5 sm:py-6"
            >
              <div className="flex items-baseline gap-3 mb-1.5">
                <span className="font-mono text-sm font-bold text-gold-gradient tabular-nums shrink-0">
                  {clause.number}.
                </span>
                <h4 className="font-display text-base sm:text-lg font-bold text-[#EDE6D6]">
                  {clause.title}
                </h4>
              </div>
              <div className="pl-7 space-y-2">
                <p className="text-xs sm:text-sm text-[#9A968C] leading-relaxed">
                  {clause.body}
                </p>
                {clause.emphasis && (
                  <p className="font-mono text-xs font-semibold text-[#F0D58A]">
                    {clause.emphasis}
                  </p>
                )}
              </div>
            </motion.li>
          ))}
        </ol>

        {/* Sign-off & Interactive Acceptance Bar */}
        <footer className="mt-4 pt-6 border-t border-[#C9A24B]/24 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs text-[#9A968C]">
                If you agree to the nine clauses above, confirm below to apply these terms to your KYC eligibility request.
              </p>
              <p className="font-display italic text-sm text-[#EDE6D6]">
                Issued by Bullish Titan Academy · Portfolio &amp; Account Management Desk
              </p>
            </div>

            <Button
              type="button"
              variant={accepted ? 'secondary' : 'primary'}
              size="lg"
              onClick={onAccept}
              className="shrink-0"
            >
              {accepted ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-[#1F9D6B]" />
                  Terms Accepted · Proceed to KYC
                </>
              ) : (
                <>
                  <FileCheck2 className="h-4 w-4" />
                  Accept Mandate Terms
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#C9A24B]/14 font-mono text-[11px] text-[#9A968C]">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-[#C9A24B]" />
              Client-Owned Custody · Zero Withdrawal Access
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#C9A24B]" />
              50% / 50% Profit Share · $5,000+ Goodwill Loss Coverage
            </span>
          </div>

          <RiskDisclaimer compact />
        </footer>
      </div>

      {/* Bottom Metallic Gold Architectural Rule */}
      <div aria-hidden="true" className="h-[3px] w-full bg-gold-gradient" />
    </article>
  );
};
