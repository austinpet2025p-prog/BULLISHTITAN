import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';
import { LEGAL_DOCUMENTS } from '../data/extendedData';
import { cn } from '../lib/utils';

const LEGAL_NAV = [
  { slug: 'risk-disclosure', label: 'Risk Disclosure' },
  { slug: 'terms', label: 'Terms of Enrollment' },
  { slug: 'privacy', label: 'Privacy Policy' },
];

export const LegalPage: React.FC = () => {
  const { doc = 'risk-disclosure' } = useParams();
  const activeDoc = LEGAL_DOCUMENTS[doc] || LEGAL_DOCUMENTS['risk-disclosure'];

  return (
    <div className="pt-20 bg-[#000000]">
      <Section
        romanIndex="01"
        kicker="Compliance & Governance Templates"
        title={activeDoc.title}
        subtitle={`Template Document · Last Updated: ${activeDoc.updated}`}
      >
        <div className="flex flex-wrap gap-2 mb-10">
          {LEGAL_NAV.map((item) => (
            <Link
              key={item.slug}
              to={`/legal/${item.slug}`}
              className={cn(
                'rounded-md border px-4 py-2 text-xs font-medium transition-colors',
                doc === item.slug
                  ? 'border-[#F0D58A] bg-gold-gradient text-[#000000] font-semibold'
                  : 'border-[#C9A24B]/24 bg-[#0B0B0C] text-[#9A968C] hover:text-[#EDE6D6]'
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          <Card className="lg:col-span-4 lg:sticky lg:top-24">
            <h2 className="font-display text-base font-bold text-[#EDE6D6] mb-3">
              Table of Contents
            </h2>
            <nav className="space-y-2.5">
              {activeDoc.sections.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="block text-xs text-[#9A968C] hover:text-[#F0D58A] transition-colors"
                >
                  {sec.title}
                </a>
              ))}
            </nav>
          </Card>

          <Card className="lg:col-span-8 space-y-8">
            <p className="text-sm text-[#9A968C] leading-relaxed border-b border-[#C9A24B]/18 pb-5">
              {activeDoc.summary}
            </p>
            {activeDoc.sections.map((sec) => (
              <section key={sec.id} id={sec.id} className="scroll-mt-24">
                <h3 className="font-display text-xl font-bold text-[#EDE6D6] mb-2">
                  {sec.title}
                </h3>
                <p className="text-sm text-[#9A968C] leading-relaxed">{sec.body}</p>
              </section>
            ))}
          </Card>
        </div>
      </Section>
    </div>
  );
};

export default LegalPage;
