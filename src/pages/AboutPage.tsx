import React from 'react';
import { Compass, ShieldCheck, Target } from 'lucide-react';
import { Section } from '../components/ui/Section';
import { MentorCard } from '../components/ui/MentorCard';
import { SafeImage } from '../components/ui/SafeImage';
import { Button } from '../components/ui/Button';
import {
  RisingArrowConnector,
  ShieldCrestBadge,
  ShieldFrame,
  ShieldSectionDivider,
} from '../components/ui/TitanMotifs';
import { ACADEMY_ASSETS, MENTORS } from '../data/academyData';
import { MILESTONES } from '../data/extendedData';

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Capital Survival First',
    desc: 'Every lesson begins with invalidation placement and fixed-fractional risk before entry triggers.',
  },
  {
    icon: Compass,
    title: 'Radical Transparency',
    desc: 'Demo metrics are clearly labeled, expectations are realistic, and no exaggerated claims are published.',
  },
  {
    icon: Target,
    title: 'Process Over Outcome',
    desc: 'Judge every trading week by rule adherence and journal precision rather than random short-term variance.',
  },
];

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-20 bg-[#000000]">
      <Section
        romanIndex="01"
        kicker="The House · Bullish Titan"
        title="Built to Replace Market Noise With Disciplined Command"
        subtitle="Our founding doctrine, capital-shield principles, senior commanders, and seven-year institutional chronicle."
      >
        {/* Asymmetric Founder Story & Shield-Framed Desk Photo */}
        <div className="grid gap-12 lg:grid-cols-12 items-center mb-20">
          <div className="lg:col-span-6">
            <ShieldFrame
              variant="landscape"
              bright
              innerClassName="aspect-[16/10] w-full"
              caption="PLATE I — BULLISH TITAN DESK LOUNGE"
            >
              <SafeImage
                src={ACADEMY_ASSETS.deskHero}
                alt="Bullish Titan Academy institutional briefing lounge"
                className="h-full w-full object-cover"
              />
            </ShieldFrame>
          </div>
          <div className="lg:col-span-6 border-t border-[#C9A24B]/30 pt-6 space-y-5">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-gold-gradient">
                Founder Story &amp; Mission
              </p>
              <h3 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#EDE6D6]">
                Why We Built Bullish Titan
              </h3>
            </div>
            <p className="text-sm sm:text-base text-[#9A968C] leading-relaxed">
              After years executing institutional FX flows and advising active synthetic-indices traders, Marcus Vance and the founding strategists recognized a glaring gap: retail learners were drowning in indicator clutter while lacking structured risk governance.
            </p>
            <p className="text-sm sm:text-base text-[#9A968C] leading-relaxed">
              Our mission is straightforward—equip dedicated students worldwide with clean liquidity mechanics, honest statistical journaling, and direct mentor accountability.
            </p>
            <div className="pt-2 flex flex-wrap gap-3.5">
              <Button to="/training" variant="primary">
                Enter The Forge
              </Button>
              <Button to="/contact" variant="outline">
                Speak With Desk Admissions
              </Button>
            </div>
          </div>
        </div>

        {/* Operating Values — Ruled 3-Column Editorial Strip */}
        <div className="grid gap-8 md:grid-cols-3 border-y border-[#C9A24B]/22 py-10 mb-20">
          {VALUES.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={val.title}
                className={idx > 0 ? 'md:pl-8 md:border-l md:border-[#C9A24B]/18' : ''}
              >
                <ShieldCrestBadge className="h-10 w-9 mb-4">
                  <Icon className="h-4 w-4 text-[#F0D58A]" />
                </ShieldCrestBadge>
                <h3 className="font-display text-xl font-bold text-[#EDE6D6]">{val.title}</h3>
                <p className="mt-2 text-sm text-[#9A968C] leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Team Grid */}
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#EDE6D6] mb-8">
          House Leadership &amp; Strategos Commanders
        </h3>
        <div className="grid gap-6 md:grid-cols-3 mb-20">
          {MENTORS.map((m) => (
            <MentorCard key={m.id} mentor={m} />
          ))}
        </div>

        <ShieldSectionDivider label="Chronicle" className="mb-14" />

        {/* Milestones Timeline — Stepped Ruled Ledger */}
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#EDE6D6] mb-8">
          House Chronicle (2019–2026)
        </h3>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 border-t border-[#C9A24B]/25 pt-8">
          {MILESTONES.map((ms) => (
            <div key={ms.year}>
              <span className="font-display italic text-2xl font-bold text-gold-gradient">
                {ms.year}
              </span>
              <h4 className="mt-2 font-display text-lg font-bold text-[#EDE6D6]">{ms.title}</h4>
              <p className="mt-2 text-xs sm:text-sm text-[#9A968C] leading-relaxed">
                {ms.detail}
              </p>
            </div>
          ))}
        </div>

        <RisingArrowConnector align="center" className="mt-8" />
      </Section>
    </div>
  );
};

export default AboutPage;
