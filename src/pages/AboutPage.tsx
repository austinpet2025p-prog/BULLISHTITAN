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
    title: 'Protect Your Money First',
    desc: 'Every lesson starts with where to place your safety stop-loss and how much to risk before you ever enter a trade.',
  },
  {
    icon: Compass,
    title: 'Complete Honesty',
    desc: 'Sample results are clearly labeled, expectations stay realistic, and we never make fake or exaggerated promises.',
  },
  {
    icon: Target,
    title: 'Good Habits Every Week',
    desc: 'Judge your week by how well you followed your plan and wrote in your journal—not by one lucky or unlucky trade.',
  },
];

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-20 bg-[#000000]">
      <Section
        romanIndex="01"
        kicker="About Bullish Titan"
        title="Built to Replace Market Confusion With Calm Clarity"
        subtitle="Our simple founding rules, money-safety habits, dedicated coaches, and seven-year story."
      >
        {/* Asymmetric Founder Story & Shield-Framed Desk Photo */}
        <div className="grid gap-12 lg:grid-cols-12 items-center mb-20">
          <div className="lg:col-span-6">
            <ShieldFrame
              variant="landscape"
              bright
              innerClassName="aspect-[16/10] w-full"
              caption="PLATE I — BULLISH TITAN LEARNING SPACE"
            >
              <SafeImage
                src={ACADEMY_ASSETS.deskHero}
                alt="Bullish Titan Academy learning lounge"
                className="h-full w-full object-cover"
              />
            </ShieldFrame>
          </div>
          <div className="lg:col-span-6 border-t border-[#C9A24B]/30 pt-6 space-y-5">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-gold-gradient">
                Our Story &amp; Mission
              </p>
              <h3 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#EDE6D6]">
                Why We Started Bullish Titan
              </h3>
            </div>
            <p className="text-sm sm:text-base text-[#9A968C] leading-relaxed">
              After years of trading major Forex markets and guiding Synthetic Indices traders, Mr Odinaka and our lead coaches noticed a big problem: beginners were overwhelmed by messy indicators and had nobody teaching them how to protect their money first.
            </p>
            <p className="text-sm sm:text-base text-[#9A968C] leading-relaxed">
              Our goal is simple—teach dedicated students everywhere how to read charts clearly, track their trades honestly, and grow with patient coaching support.
            </p>
            <div className="pt-2 flex flex-wrap gap-3.5">
              <Button to="/training" variant="primary">
                Explore Courses
              </Button>
              <Button to="/contact" variant="outline">
                Contact Support
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
          Meet Our Team &amp; Coaches
        </h3>
        <div className="grid gap-6 md:grid-cols-3 mb-20">
          {MENTORS.map((m) => (
            <MentorCard key={m.id} mentor={m} />
          ))}
        </div>

        <ShieldSectionDivider label="Our Story" className="mb-14" />

        {/* Milestones Timeline — Stepped Ruled Ledger */}
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#EDE6D6] mb-8">
          Our Story So Far (2019–2026)
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
