import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface RiskDisclaimerProps {
  compact?: boolean;
  className?: string;
}

export const RiskDisclaimer: React.FC<RiskDisclaimerProps> = ({
  compact = false,
  className,
}) => {
  if (compact) {
    return (
      <div
        className={cn(
          'flex items-start gap-2.5 rounded-xl hairline-gold px-4 py-3 text-xs text-[#9A968C] leading-relaxed',
          className
        )}
      >
        <ShieldAlert className="h-4 w-4 shrink-0 text-[#C9A24B] mt-0.5" />
        <p>
          <strong className="font-medium text-[#EDE6D6]">Risk Disclosure:</strong>{' '}
          Demo &amp; placeholder metrics are strictly educational. Past performance does not guarantee future results. Trading Forex and synthetic indices involves substantial risk of capital loss.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-2xl hairline-gold p-5 text-xs text-[#9A968C] leading-relaxed',
        className
      )}
    >
      <div className="flex items-center gap-2 text-[#EDE6D6] font-medium mb-2">
        <ShieldAlert className="h-4 w-4 text-[#C9A24B]" />
        <span>High-Risk Trading &amp; Educational Disclosure</span>
      </div>
      <p>
        Trading foreign exchange (Forex), contracts for difference (CFDs), and synthetic indices on margin carries a high level of risk and may not be suitable for all individuals. Leverage can amplify both gains and losses. Bullish Titan Academy provides structured educational courses, market commentary, and illustrative demo data solely for informational and educational purposes—nothing presented constitutes personalized financial, tax, or investment advice. Any sample setups, charts, or historical backtest figures marked &ldquo;Demo&rdquo; are hypothetical illustrations and past performance is not indicative of future results. Never trade with capital you cannot afford to lose.
      </p>
    </div>
  );
};
