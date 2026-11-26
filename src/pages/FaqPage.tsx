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
        kicker="Help &amp; Guides"
        title="Frequently Asked Questions"
        subtitle="Filter by program or search any keyword across Trading Courses, 1-on-1 Coaching, Daily Signals, and Managed Accounts."
      >
        <div className="max-w-4xl">
          <FaqSearchFilter
            items={allFaqs}
            enableGlobalShortcut
            placeholder="Search any question (press / to type · e.g., risk, signals, coaching, safety)..."
          />
        </div>
      </Section>
    </div>
  );
};

export default FaqPage;
