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
    title: 'Account Access (Stays in Your Name)',
    body: 'You give Bullish Titan Academy trade-only access to your personal broker account. This access is used strictly to read the market and place trades. Your account stays permanently in your legal name under your sole ownership.',
  },
  {
    number: 2,
    title: 'You Keep Control of Your Money',
    body: 'You fund your broker account with the starting balance for your chosen plan. All money stays safely inside your own regulated broker account, and Bullish Titan Academy has zero permission or ability to withdraw your funds.',
  },
  {
    number: 3,
    title: 'Fair 50/50 Profit Split',
    body: 'Account management uses a 50% / 50% profit-sharing rule: 50% goes to you, and 50% goes to Bullish Titan Academy. Profits are calculated and shared only after your cycle profit goal is reached or surpassed.',
    emphasis: 'We only earn when you earn.',
  },
  {
    number: 4,
    title: 'Coordinated Withdrawals',
    body: 'Your profit withdrawals are processed smoothly on schedule as soon as the profit target is reached, following clear accounting and the 50/50 profit split.',
  },
  {
    number: 5,
    title: 'Calm Strategy & Please Do Not Self-Trade',
    body: 'Trades are guided strictly by careful market analysis—never guesswork or gambling—across Forex and Synthetic Indices. To keep trade sizes and safety limits accurate, please do not place manual trades inside your managed sub-account.',
  },
  {
    number: 6,
    title: 'Honest Risk Notice',
    body: 'Trading Forex and Synthetic Indices carries real risk of loss, and past results never guarantee future returns. While every account is traded with strict care and safety limits, losses can still happen when markets move sharply, and Bullish Titan Academy is not liable for trading losses during active management.',
  },
  {
    number: 7,
    title: 'Stop Anytime With Notice',
    body: 'Either side can end this agreement at any time with advance notice. Once notice is given, all open trades are closed safely and any realized profits are shared under Rule 3.',
  },
  {
    number: 8,
    title: 'Strict Privacy & ID Check',
    body: 'All identity records, logins, and account reports shared between us stay strictly private. Bullish Titan Academy never shares your account details or trading history with outsiders.',
  },
  {
    number: 9,
    title: '10% Goodwill Buffer (Accounts Above $5,000 Only)',
    body: 'While we apply strict care to protect your balance, markets can still be unpredictable. In the unlikely case an account suffers a complete loss, Bullish Titan Academy offers a voluntary 10% goodwill refund of your initial deposit strictly for accounts funded above $5,000. Accounts funded with less than $5,000 are not eligible for this offer.',
    emphasis: 'Voluntary goodwill gesture—not an insurance policy—subject to a signed written agreement.',
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
          referrerPolicy="no-referrer"
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
              referrerPolicy="no-referrer"
              className="h-12 w-12 object-contain mix-blend-lighten shrink-0"
            />
            <div>
              <p className="font-display text-base sm:text-lg font-bold tracking-tight text-[#EDE6D6]">
                Bullish Titan Academy
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-gradient">
                Managed Accounts Support
              </p>
            </div>
          </div>

          <div className="font-mono text-[11px] text-[#9A968C] sm:text-right space-y-0.5">
            <p className="text-[#F0D58A]">Agreement Ref · BTA-AM-09</p>
            <p>Forex &amp; Synthetic Indices · Kept in Your Name</p>
          </div>
        </header>

        {/* Document Heading & Intro */}
        <div className="py-7 text-center max-w-2xl mx-auto space-y-3 border-b border-[#C9A24B]/16">
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#EDE6D6] tracking-tight text-balance">
            9-Rule Managed Account Agreement
          </h3>
          <p className="text-xs sm:text-sm text-[#9A968C] leading-relaxed">
            Thank you for trusting Bullish Titan Academy to manage trades on your broker account. These 9 plain rules explain how your money stays safe in your name, how profits are split, and how both sides work together smoothly.
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
                If you agree to the nine rules above, click confirm below to include them with your application.
              </p>
              <p className="font-display italic text-sm text-[#EDE6D6]">
                Issued by Bullish Titan Academy · Managed Accounts Team
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
                  Rules Accepted · Continue
                </>
              ) : (
                <>
                  <FileCheck2 className="h-4 w-4" />
                  Accept 9 Rules &amp; Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#C9A24B]/14 font-mono text-[11px] text-[#9A968C]">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-[#C9A24B]" />
              Money Stays in Your Name · Zero Withdrawal Access
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#C9A24B]" />
              50% / 50% Profit Split · 10% Goodwill Buffer ($5,000+ Accounts)
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
