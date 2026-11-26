import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../components/ui/Section';
import { useReducedMotion } from '../hooks/useReducedMotion';

const STEPS = [
  {
    roman: 'I',
    step: 'Step 01',
    title: 'Pick Your Starting Point',
    detail:
      'Take our quick quiz to match your free time and experience level to the right lessons or plan.',
  },
  {
    roman: 'II',
    step: 'Step 02',
    title: 'Learn Clear Chart Rules',
    detail:
      'Practice reading price trends, timing active market hours, and sizing every trade safely before using real money.',
  },
  {
    roman: 'III',
    step: 'Step 03',
    title: 'Practice & Check With a Coach',
    detail:
      'Log 100 practice trades in your simple journal and review your habits directly with a helpful senior coach.',
  },
  {
    roman: 'IV',
    step: 'Step 04',
    title: 'Trade Calmly With Confidence',
    detail:
      'Follow a simple daily checklist on Forex or Synthetic Indices with strict loss limits and weekly support.',
  },
];

export const HowItWorksSection: React.FC = () => {
  const reducedMotion = useReducedMotion();

  return (
    <Section
      romanIndex="02"
      kicker="Your Simple Roadmap"
      title="Four Clear Steps From Beginner to Confident Trader"
      subtitle="A calm, step-by-step path built around safety, steady practice, and protecting your money."
    >
      <div className="relative pt-4 pb-8">
        {/* Continuous Rising Arrow Trajectory SVG Behind the Ascending Steps */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 180"
          preserveAspectRatio="none"
          className="hidden lg:block pointer-events-none w-full h-32 mb-2 overflow-visible"
          fill="none"
        >
          <motion.path
            d="M 40,152 C 340,148 760,92 1152,18"
            stroke="url(#titan-gold-grad)"
            strokeWidth="1.25"
            strokeOpacity="0.65"
            initial={reducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.45, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.path
            d="M 1134,14 L 1158,16 L 1144,36"
            stroke="url(#titan-gold-grad)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: 1.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>

        {/* Ascending Stepped Stagger — literally climbs upward from Stage I to Stage IV */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 items-start">
          {STEPS.map((item, idx) => {
            const stepOffset = [
              'lg:translate-y-12',
              'lg:translate-y-8',
              'lg:translate-y-4',
              'lg:translate-y-0',
            ][idx];

            return (
              <motion.div
                key={item.step}
                initial={reducedMotion ? undefined : { opacity: 0, y: 22 }}
                whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: idx * 0.16, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                className={`relative pt-6 pb-4 ${stepOffset}`}
              >
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px bg-[#C9A24B]/40 origin-left"
                  initial={reducedMotion ? false : { scaleX: 0 }}
                  whileInView={reducedMotion ? undefined : { scaleX: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: idx * 0.14, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                />
                <div className="flex items-baseline justify-between gap-2 mb-5">
                  <span className="font-display italic text-4xl font-bold text-gold-gradient leading-none">
                    {item.roman}.
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9A968C]">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-[#EDE6D6] leading-snug">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-[#9A968C] leading-relaxed">
                  {item.detail}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
};
