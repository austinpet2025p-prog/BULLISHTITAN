import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { DEMO_TICKER_ITEMS } from '../data/academyData';
import { cn } from '../lib/utils';

export const MarketTicker: React.FC = () => {
  const repeated = [...DEMO_TICKER_ITEMS, ...DEMO_TICKER_ITEMS];

  return (
    <div
      aria-label="Demo market price ticker"
      className="border-y border-[#C9A24B]/20 bg-[#0B0B0C] py-3 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center gap-4">
        <span className="shrink-0 rounded-md border border-[#C9A24B]/35 bg-[#141414] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#F0D58A] uppercase tracking-wider">
          Demo Feed
        </span>

        <div className="relative flex-1 overflow-hidden">
          <div className="flex w-max items-center gap-8 animate-ticker">
            {repeated.map((item, idx) => (
              <div
                key={`${item.symbol}-${idx}`}
                className="flex items-center gap-2.5 whitespace-nowrap font-mono text-xs tabular-nums"
              >
                <span className="font-semibold text-[#EDE6D6]">{item.symbol}</span>
                <span className="text-[#9A968C]">{item.price}</span>
                <span
                  className={cn(
                    'inline-flex items-center gap-0.5 font-medium',
                    item.isUp ? 'text-[#1F9D6B]' : 'text-[#EF4444]'
                  )}
                >
                  {item.isUp ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  )}
                  {item.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
