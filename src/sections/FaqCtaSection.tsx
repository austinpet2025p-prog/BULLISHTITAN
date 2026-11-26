import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FaqSearchFilter } from '../components/ui/FaqSearchFilter';
import { Button } from '../components/ui/Button';
import { ShieldFrame, RisingArrowConnector } from '../components/ui/TitanMotifs';
import { HOME_FAQS } from '../data/academyData';

export const FaqCtaSection: React.FC = () => {
  return (
    <>
      <section id="faq" className="py-20 sm:py-28 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            {/* Left Asymmetric Editorial Heading */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="flex items-center gap-3 mb-3.5">
                <span className="font-display italic text-sm text-[#C9A24B]">08</span>
                <span className="h-px w-8 bg-gold-gradient" aria-hidden="true" />
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-sapphire-gold">
                  Quick Answers
                </p>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#EDE6D6] leading-[1.08]">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#9A968C] leading-relaxed">
                Search for quick answers on our video courses, risk rules, broker safety, and 1-on-1 coaching.
              </p>
              <div className="mt-5">
                <Link
                  to="/faq"
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#C9A24B] hover:text-[var(--color-gold-bright)] transition-colors"
                >
                  See All Questions &amp; Answers
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
              <RisingArrowConnector align="left" className="px-0 mt-6" />
            </div>

            {/* Right Interactive Live-Searchable FAQ Accordion */}
            <div className="lg:col-span-7">
              <FaqSearchFilter items={HOME_FAQS} />
            </div>
          </div>
        </div>
      </section>

      {/* Final Shield-Framed Luxury Editorial Invitation */}
      <section className="pb-24 pt-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ShieldFrame variant="landscape" bright innerClassName="p-8 sm:p-14 lg:p-16 bg-[#0B0B0C]">
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-8">
                <p className="font-mono text-[11px] uppercase font-semibold tracking-[0.22em] text-gold-gradient">
                  Ready When You Are
                </p>
                <h2 className="mt-3 font-display text-3xl sm:text-5xl font-bold text-[#EDE6D6] leading-[1.08]">
                  Start Trading With Calm, Simple Rules
                </h2>
                <p className="mt-4 max-w-xl text-sm sm:text-base text-[#9A968C] leading-relaxed">
                  Watch our step-by-step courses, get help from a personal coach, or follow clear daily trade alerts with Bullish Titan Academy.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3.5 lg:items-end">
                <Button to="/training" variant="primary" size="lg" className="w-full sm:w-auto lg:w-full">
                  Explore Trading Courses
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button to="/contact" variant="outline" size="lg" className="w-full sm:w-auto lg:w-full">
                  Talk to Support
                </Button>
              </div>
            </div>
          </ShieldFrame>
        </div>
      </section>
    </>
  );
};
