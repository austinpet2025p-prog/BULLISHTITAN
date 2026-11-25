import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Section } from '../components/ui/Section';
import { CountUpValue } from '../components/ui/CountUpValue';
import { EditorialReveal, GoldHairlineDivider } from '../components/ui/TitanMotifs';
import { useReducedMotion } from '../hooks/useReducedMotion';

const STATS = [
  {
    end: 14800,
    suffix: '+',
    decimals: 0,
    label: 'Enrolled Fellows',
    note: 'In formation across global desks',
    duration: 1850,
    gold: false,
  },
  {
    end: 64,
    suffix: '+',
    decimals: 0,
    label: 'Countries in Formation',
    note: 'London · NY · Dubai · Lagos · SG',
    duration: 1550,
    gold: true,
  },
  {
    end: 1.0,
    suffix: '% Cap',
    decimals: 1,
    label: 'Drawdown Shield',
    note: 'Hard per-position invalidation rule',
    duration: 1350,
    gold: false,
  },
  {
    end: 7,
    suffix: ' Yrs',
    decimals: 0,
    label: 'Desk Pedigree',
    note: 'Structured FX & Synthetic command',
    duration: 1250,
    gold: true,
  },
];

export const AboutStatsSection: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ['start end', 'end start'],
  });

  const leftParallaxY = useTransform(scrollYProgress, [0, 1], [18, -18]);
  const rightParallaxY = useTransform(scrollYProgress, [0, 1], [-12, 14]);

  return (
    <Section
      id="about"
      romanIndex="01"
      kicker="The House Ethos"
      title="Forged Around Sovereign Discipline, Not Market Noise"
      className="bg-[#000000]"
    >
      <div ref={gridRef} className="grid gap-12 lg:grid-cols-12 items-start">
        <motion.div
          style={reducedMotion ? undefined : { y: leftParallaxY }}
          className="lg:col-span-6"
        >
          <EditorialReveal className="space-y-5">
            <p className="font-display italic text-2xl sm:text-3xl text-[#EDE6D6] leading-snug">
              &ldquo;Command over capital begins before an order is placed—with unyielding drawdown shields and clean liquidity structure.&rdquo;
            </p>
            <p className="text-sm sm:text-base text-[#9A968C] leading-relaxed">
              Bullish Titan Academy trains currency and synthetic-indices operators to strip away indicator clutter and impulsive leverage in favor of repeatable multi-timeframe architecture, iron position sizing, and audited execution ledgers.
            </p>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#F0D58A] hover:underline"
              >
                Read House Charter
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </EditorialReveal>
        </motion.div>

        <motion.div
          style={reducedMotion ? undefined : { y: rightParallaxY }}
          className="lg:col-span-6"
        >
          <GoldHairlineDivider />
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 py-7 border-b border-[#C9A24B]/22">
            {STATS.map((stat, idx) => (
              <EditorialReveal
                key={stat.label}
                delay={idx * 0.1}
                className={idx % 2 === 1 ? 'border-l border-[#C9A24B]/18 pl-5 sm:pl-6' : 'pr-2'}
              >
                <p
                  className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold tabular-nums leading-none ${
                    stat.gold ? 'text-gold-gradient' : 'text-[#EDE6D6]'
                  }`}
                >
                  <CountUpValue
                    end={stat.end}
                    decimals={stat.decimals}
                    suffix={stat.suffix}
                    duration={stat.duration}
                  />
                </p>
                <p className="mt-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#EDE6D6]">
                  {stat.label}
                </p>
                <p className="mt-1 text-xs text-[#9A968C]">{stat.note}</p>
              </EditorialReveal>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
};
