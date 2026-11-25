import React from 'react';
import { ArrowDownRight, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import { Card } from './Card';
import { Badge } from './Badge';
import { type DemoSignal } from '../../data/academyData';
import { cn } from '../../lib/utils';

export interface SignalCardProps {
  signal: DemoSignal;
  className?: string;
}

export const SignalCard: React.FC<SignalCardProps> = ({ signal, className }) => {
  const isBuy = signal.direction === 'BUY';

  const statusVariant =
    signal.status === 'TP1 Reached'
      ? 'success'
      : signal.status === 'Active' || signal.status === 'Pending'
      ? 'gold'
      : 'neutral';

  return (
    <Card className={cn('p-5 sm:p-6', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#C9A24B]/18">
        <div>
          <p className="text-[11px] font-medium text-[#9A968C]">
            {signal.market} · {signal.timestamp}
          </p>
          <div className="mt-1 flex items-center gap-2.5">
            <h4 className="font-display text-lg font-semibold text-[#EDE6D6] tabular-nums">
              {signal.pair}
            </h4>
            <Badge variant={isBuy ? 'success' : 'danger'}>
              {isBuy ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {signal.direction}
            </Badge>
          </div>
        </div>

        <Badge variant={statusVariant}>
          {signal.status === 'TP1 Reached' ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : (
            <Clock className="h-3.5 w-3.5" />
          )}
          {signal.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-4 border-b border-[#C9A24B]/18">
        <div>
          <span className="block text-[11px] text-[#9A968C]">Entry Zone</span>
          <span className="font-mono text-sm font-medium text-[#EDE6D6] tabular-nums">
            {signal.entry}
          </span>
        </div>
        <div>
          <span className="block text-[11px] text-[#9A968C]">Stop Loss</span>
          <span className="font-mono text-sm font-medium text-[#EF4444] tabular-nums">
            {signal.stopLoss}
          </span>
        </div>
        <div>
          <span className="block text-[11px] text-[#9A968C]">Risk / Reward</span>
          <span className="font-mono text-sm font-semibold text-gold-gradient tabular-nums">
            {signal.rr}
          </span>
        </div>
        <div>
          <span className="block text-[11px] text-[#9A968C]">Take Profit 1</span>
          <span className="font-mono text-sm font-medium text-[#1F9D6B] tabular-nums">
            {signal.tp1}
          </span>
        </div>
        <div>
          <span className="block text-[11px] text-[#9A968C]">Take Profit 2</span>
          <span className="font-mono text-sm font-medium text-[#1F9D6B] tabular-nums">
            {signal.tp2}
          </span>
        </div>
        <div>
          <span className="block text-[11px] text-[#9A968C]">Take Profit 3</span>
          <span className="font-mono text-sm font-medium text-[#1F9D6B] tabular-nums">
            {signal.tp3}
          </span>
        </div>
      </div>

      <p className="mt-3.5 text-xs text-[#9A968C] leading-relaxed">
        {signal.rationale}
      </p>
    </Card>
  );
};
