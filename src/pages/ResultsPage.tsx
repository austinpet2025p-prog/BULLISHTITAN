import React, { Suspense, lazy, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Globe, ShieldCheck, Users } from 'lucide-react';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { RiskDisclaimer } from '../components/ui/RiskDisclaimer';
import { ShieldFrame, ShieldSectionDivider, GoldHairlineDivider } from '../components/ui/TitanMotifs';
import { CountUpValue } from '../components/ui/CountUpValue';
import { DEMO_EQUITY_CURVE } from '../data/academyData';
import { TestimonialsSection } from '../sections/TestimonialsSection';

const RiskVaultScene3D = lazy(() => import('../components/three/RiskVaultScene3D'));

const VERIFIED_WALL_TEMPLATES = [
  {
    id: 'wall-1',
    trader: 'Journal Template · 01',
    pair: 'EUR/USD · London Session',
    metric: '+2.8R Setup Example',
    note: 'Placeholder slot reserved for audited student trade breakdown with verified chart before/after screenshot.',
  },
  {
    id: 'wall-2',
    trader: 'Journal Template · 02',
    pair: 'XAU/USD · NY Overlap',
    metric: '0.75% Risk Cap Example',
    note: 'Placeholder slot demonstrating disciplined partial profit scaling and pre-planned stop placement.',
  },
  {
    id: 'wall-3',
    trader: 'Journal Template · 03',
    pair: 'V75 Index · 4H Structure',
    metric: '100-Trade Backtest Log',
    note: 'Placeholder slot illustrating systematic sample completion prior to live execution.',
  },
];

export const ResultsPage: React.FC = () => {
  const [range, setRange] = useState<'30D' | '90D' | '1Y'>('90D');

  return (
    <div className="pt-20 bg-[#000000]">
      <Section
        romanIndex="01"
        kicker="The Phalanx · Operational Proof"
        title="Risk-Normalized Metrics &amp; Desk Transparency"
        subtitle="We record disciplined execution journals, drawdown shields, and verified member progress ledgers rather than unsubstantiated profit claims."
      >
        {/* Ruled Telemetry Ledger Strip (Counts up when visible) */}
        <GoldHairlineDivider />
        <div className="py-8 mb-14 border-b border-[#C9A24B]/25 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:pr-6">
            <div className="flex items-center gap-2 text-[#C9A24B] mb-2">
              <Users className="h-4 w-4" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9A968C]">
                Active Members
              </span>
            </div>
            <p className="font-display text-3xl font-bold text-[#EDE6D6] tabular-nums">
              <CountUpValue end={14800} duration={1850} suffix="+" />
            </p>
            <p className="mt-1 text-xs text-[#9A968C]">Across all 4 divisions</p>
          </div>

          <div className="lg:pl-6 lg:border-l lg:border-[#C9A24B]/18">
            <div className="flex items-center gap-2 text-[#C9A24B] mb-2">
              <Globe className="h-4 w-4" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9A968C]">
                Nations Represented
              </span>
            </div>
            <p className="font-display text-3xl font-bold text-[#EDE6D6] tabular-nums">
              <CountUpValue end={64} duration={1550} suffix="+" />
            </p>
            <p className="mt-1 text-xs text-[#9A968C]">Global Phalanx network</p>
          </div>

          <div className="lg:pl-6 lg:border-l lg:border-[#C9A24B]/18">
            <div className="flex items-center gap-2 text-[#C9A24B] mb-2">
              <ShieldCheck className="h-4 w-4" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9A968C]">
                Risk Shield Standard
              </span>
            </div>
            <p className="font-display text-3xl font-bold text-[#EDE6D6] tabular-nums">
              <CountUpValue end={1} decimals={1} duration={1350} suffix="% Max" />
            </p>
            <p className="mt-1 text-xs text-[#9A968C]">Enforced per position</p>
          </div>

          <div className="lg:pl-6 lg:border-l lg:border-[#C9A24B]/18">
            <div className="flex items-center gap-2 text-[#C9A24B] mb-2">
              <ShieldCheck className="h-4 w-4" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9A968C]">
                Sample Dataset
              </span>
            </div>
            <p className="font-display text-3xl font-bold text-[#EDE6D6] tabular-nums">
              Demo Only
            </p>
            <p className="mt-1 text-xs text-[#9A968C]">Placeholder educational curves</p>
          </div>
        </div>

        {/* Recharts Sample Curve + Shield-Framed 3D Risk Governance Core */}
        <div className="grid gap-8 lg:grid-cols-12 items-start mb-16">
          <Card className="lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#C9A24B]/18">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-gold-gradient">
                  Demo Template Dataset · Illustrative Only
                </p>
                <h3 className="mt-1 font-display text-2xl font-bold text-[#EDE6D6]">
                  Risk-Normalized Equity Index ({range})
                </h3>
              </div>
              <Tabs
                value={range}
                onChange={setRange}
                options={[
                  { value: '30D', label: '30D' },
                  { value: '90D', label: '90D' },
                  { value: '1Y', label: '1Y' },
                ]}
              />
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DEMO_EQUITY_CURVE[range]}>
                  <defs>
                    <linearGradient id="resultsEmerald" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#resultsEmerald)"
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
          </Card>

          <div className="lg:col-span-5 space-y-5">
            <ShieldFrame variant="crest" bright caption="PLATE I — MULTI-AXIS DRAWDOWN SHIELD">
              <Suspense
                fallback={
                  <div className="h-[260px] flex items-center justify-center text-xs font-mono text-[#9A968C]">
                    Loading 3D Risk Vault...
                  </div>
                }
              >
                <RiskVaultScene3D />
              </Suspense>
            </ShieldFrame>
            <div className="border-t border-[#C9A24B]/22 pt-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-gradient">
                Risk Vault Model
              </p>
              <h3 className="mt-1 font-display text-xl font-bold text-[#EDE6D6]">
                Multi-Axis Drawdown Control
              </h3>
              <p className="mt-1.5 text-xs text-[#9A968C] leading-relaxed">
                Every logged setup enforces fixed-fractional sizing, hard stop invalidation, and correlation ceilings.
              </p>
            </div>
          </div>
        </div>

        <ShieldSectionDivider label="Verified Ledger Archive" className="mb-12" />

        {/* Verified Results Wall Template — Editorial List */}
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#EDE6D6] mb-6">
          Verified Ledger Wall (Template Slots)
        </h3>
        <div className="border-y border-[#C9A24B]/22 divide-y divide-[#C9A24B]/16 mb-8">
          {VERIFIED_WALL_TEMPLATES.map((item) => (
            <div key={item.id} className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-[#C9A24B]">
                  {item.trader} · {item.pair}
                </p>
                <h4 className="mt-1 font-display text-xl font-bold text-[#1F9D6B]">{item.metric}</h4>
              </div>
              <p className="text-xs sm:text-sm text-[#9A968C] max-w-xl leading-relaxed">
                {item.note}
              </p>
            </div>
          ))}
        </div>

        <RiskDisclaimer />
      </Section>

      <TestimonialsSection />
    </div>
  );
};

export default ResultsPage;
