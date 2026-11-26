import React, { useMemo, useState } from 'react';
import { ArrowRight, Calculator, Lock, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { Tabs } from '../ui/Tabs';
import { INVESTMENT_PROGRAMS, type InvestmentProgramSpec } from '../../data/extendedData';

type ReviewCadence = 'monthly' | 'quarterly';

interface MandateAllocationSimulatorProps {
  onApplyConfiguration: (phaseName: string, indicativeEquity: number) => void;
}

function resolveTierForEquity(equity: number): InvestmentProgramSpec {
  if (equity >= 10000) return INVESTMENT_PROGRAMS[3]; // Sovereign Archon Mandate
  if (equity >= 6000) return INVESTMENT_PROGRAMS[2]; // Strategos Mandate
  if (equity >= 1500) return INVESTMENT_PROGRAMS[1]; // Vanguard Mandate
  return INVESTMENT_PROGRAMS[0]; // Agoge Mandate
}

export const MandateAllocationSimulator: React.FC<MandateAllocationSimulatorProps> = ({
  onApplyConfiguration,
}) => {
  const [equity, setEquity] = useState<number>(3000);
  const [cadence, setCadence] = useState<ReviewCadence>('quarterly');

  const matchedTier = useMemo(() => resolveTierForEquity(equity), [equity]);

  const riskBudgetDollars = useMemo(() => {
    const pctCap = equity >= 10000 ? 0.035 : equity >= 6000 ? 0.04 : 0.05;
    return {
      pctLabel: `${(pctCap * 100).toFixed(1)}%`,
      dollars: Math.round(equity * pctCap),
    };
  }, [equity]);

  const lossCoverageEligible = equity > 5000;
  const goodwillBufferAmount = lossCoverageEligible ? Math.round(equity * 0.1) : 0;

  return (
    <div className="mt-12 rounded-xl hairline-gold bg-aurora-obsidian p-6 sm:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#C9A24B]/18">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-sapphire-gold">
            Interactive Account &amp; Profit Split Tool
          </p>
          <h3 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-[#EDE6D6]">
            Plan &amp; Account Size Simulator
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm text-[#9A968C]">
            Slide your starting broker balance to preview the best plan, safety limit math, 50/50 profit split rules, and Rule 9 goodwill buffer eligibility.
          </p>
        </div>

        <Tabs<ReviewCadence>
          value={cadence}
          onChange={setCadence}
          options={[
            { value: 'monthly', label: 'Monthly Review' },
            { value: 'quarterly', label: 'Quarterly Cycle' },
          ]}
        />
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-12 items-center">
        {/* Left Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-baseline justify-between gap-2 mb-3">
              <label
                htmlFor="sim-equity-range"
                className="text-xs sm:text-sm font-medium text-[#EDE6D6]"
              >
                Your Starting Broker Balance (Stays in Your Name)
              </label>
              <span className="font-mono text-2xl font-bold text-gold-gradient tabular-nums">
                ${equity.toLocaleString()}
              </span>
            </div>

            <input
              id="sim-equity-range"
              type="range"
              min={900}
              max={25000}
              step={100}
              value={equity}
              onChange={(e) => setEquity(Number(e.target.value))}
              className="w-full accent-[#C9A24B] cursor-pointer"
            />

            <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-[#9A968C] tabular-nums">
              <span>$900 Starter</span>
              <span>$1,500 Growth</span>
              <span>$6,000 Pro</span>
              <span>$10,000+ Private VIP</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[900, 1500, 3000, 5500, 10000, 15000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setEquity(preset)}
                className={`rounded-md border px-3 py-1.5 font-mono text-xs transition-colors tabular-nums ${
                  equity === preset
                    ? 'border-[#F0D58A] bg-[#C9A24B]/18 text-[#F0D58A] font-semibold'
                    : 'border-[#C9A24B]/22 bg-[#0B0B0C] text-[#9A968C] hover:text-[#EDE6D6]'
                }`}
              >
                ${preset.toLocaleString()}
              </button>
            ))}
          </div>

          <div className="space-y-2.5 pt-2 border-t border-[#C9A24B]/18 text-xs text-[#9A968C]">
            <div className="flex items-start gap-2.5">
              <Lock className="h-4 w-4 shrink-0 text-[#C9A24B] mt-0.5" />
              <span>
                <strong className="text-[#EDE6D6]">Rules 1 &amp; 2 (Your Money, Your Control):</strong> Your funds stay inside your own verified broker account with trade-only access and zero withdrawal rights for Bullish Titan.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 shrink-0 text-[#F0D58A] mt-0.5" />
              <span>
                <strong className="text-[#EDE6D6]">Rules 3 &amp; 9 (Split &amp; Safety Buffer):</strong> 50% You / 50% Bullish Titan once your profit goal is reached; accounts funded above $5,000 qualify for the 10% goodwill buffer.
              </span>
            </div>
          </div>
        </div>

        {/* Right Live Output Specification */}
        <div className="lg:col-span-6 rounded-lg hairline-sapphire p-6 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-2 pb-4 border-b border-[#60A5FA]/20">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#93C5FD]">
                Best Plan for This Balance
              </span>
              <h4 className="mt-1 font-display text-2xl font-bold text-[#EDE6D6]">
                {matchedTier.name}
              </h4>
              <p className="mt-0.5 font-mono text-xs text-emerald-gold font-semibold">
                {matchedTier.onboardingFee}
              </p>
            </div>

            <div className="text-right font-mono">
              <span className="block text-[10px] uppercase tracking-wider text-[#9A968C]">
                Check-In Schedule
              </span>
              <span className="mt-1 block text-xs font-semibold text-[#EDE6D6] capitalize">
                {cadence} Updates
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 font-mono text-xs tabular-nums">
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-[#9A968C]">
                Max Risk Safety Limit
              </span>
              <span className="mt-1 block text-base font-bold text-[#FB7185]">
                -${riskBudgetDollars.dollars.toLocaleString()} ({riskBudgetDollars.pctLabel})
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-[#9A968C]">
                50/50 Profit Split (Rule 3)
              </span>
              <span className="mt-1 block text-base font-bold text-[#34D399]">
                50% You / 50% Bullish Titan
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-[#9A968C]">
                Rule 9 Goodwill Buffer (&gt;$5k)
              </span>
              <span
                className={`mt-1 block text-xs font-semibold ${
                  lossCoverageEligible ? 'text-[#60A5FA]' : 'text-[#EDE6D6]'
                }`}
              >
                {lossCoverageEligible
                  ? `Eligible · $${goodwillBufferAmount.toLocaleString()} (10% Goodwill)`
                  : 'Not Eligible (< $5,000)'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-[#9A968C]">
                Dedicated Lead Trader
              </span>
              <span className="mt-1 block text-xs font-semibold text-[#F0D58A]">
                {matchedTier.id === 'grande-phase'
                  ? 'Executive Lead Trader'
                  : matchedTier.id === 'geant-phase'
                    ? 'Senior Lead Trader'
                    : 'Assigned Lead Trader'}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#C9A24B]/18 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#9A968C]">
              <Calculator className="h-3.5 w-3.5 text-[#C9A24B]" />
              <span>Goodwill buffer is not insurance · Subject to signed agreement</span>
            </div>
            <Button
              variant="primary"
              onClick={() => onApplyConfiguration(matchedTier.name, equity)}
            >
              Choose {matchedTier.name}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
