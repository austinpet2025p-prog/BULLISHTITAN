import React, { useMemo } from 'react';
import { Section } from '../components/ui/Section';
import { FaqSearchFilter, type FaqEntry } from '../components/ui/FaqSearchFilter';
import { GROUPED_FAQS } from '../data/extendedData';

export const FaqPage: React.FC = () => {
  const allFaqs = useMemo<FaqEntry[]>(
    () =>
      GROUPED_FAQS.flatMap((grp) =>
        grp.items.map((item, idx) => ({
          id: `${grp.group}-${idx}`,
          category: grp.group,
          question: item.q,
          answer: item.a,
        }))
      ),
    []
  );

  return (
    <div className="pt-20 bg-[#000000]">
      <Section
        romanIndex="01"
        kicker="Doctrine &amp; Knowledge Base"
        title="Frequently Asked Questions"
        subtitle="Filter by division or search any keyword across The Forge, Strategos Mentorship, Vanguard Intelligence, and Capital Mandates."
      >
        <div className="max-w-4xl">
          <FaqSearchFilter
            items={allFaqs}
            enableGlobalShortcut
            placeholder="Search doctrine (press / to focus · e.g., risk, vanguard, strategos, custody)..."
          />
        </div>
      </Section>
    </div>
  );
};

export default FaqPage;
