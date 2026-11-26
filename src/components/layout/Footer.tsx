import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, MapPin } from 'lucide-react';
import { BrandMark } from './Navbar';
import { RiskDisclaimer } from '../ui/RiskDisclaimer';
import { Button } from '../ui/Button';
import { SocialLinks } from '../ui/SocialLinks';
import { TestimonialCarousel } from '../ui/TestimonialCarousel';
import { FOOTER_TESTIMONIALS } from '../../data/footerTestimonials';
import { ShieldSectionDivider } from '../ui/TitanMotifs';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setStatus('success');
    setErrorMsg('');
    setEmail('');
  };

  return (
    <footer className="bg-[#000000] pt-8 pb-14">
      {/* Self-Scrolling 15-Image Footer Testimonial Carousel */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-14">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold-gradient font-semibold">
              Student Stories · 15 Member Reviews
            </p>
            <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-[#EDE6D6]">
              Real Stories From Our Students
            </h2>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#9A968C]">
            Auto-Scrolling · Hover or Tap to Pause
          </p>
        </div>

        <TestimonialCarousel
          items={FOOTER_TESTIMONIALS}
          defaultMode="marquee"
          variant="photo"
          marqueeSpeedPxPerSec={38}
        />
      </div>

      <ShieldSectionDivider label="Bullish Titan Academy" className="mb-12" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Row: Brand & Newsletter */}
        <div className="grid gap-10 lg:grid-cols-12 pb-12 border-b border-[#C9A24B]/18">
          <div className="lg:col-span-5">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <BrandMark />
              <span className="font-display text-lg font-semibold text-[#EDE6D6]">
                Bullish Titan Academy
              </span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-[#9A968C] leading-relaxed">
              Clear Forex and Synthetic Indices courses, personal 1-on-1 coaching, and safety-first trade alerts built for everyday learners.
            </p>
            <SocialLinks className="mt-5" />
            <p className="mt-3 text-xs text-[#9A968C]">
              Support Email:{' '}
              <a
                href="mailto:bullishtitan@gmail.com"
                className="font-mono text-[#F0D58A] hover:underline"
              >
                bullishtitan@gmail.com
              </a>
            </p>
            <div className="mt-3 space-y-1 text-xs text-[#9A968C]">
              <p className="flex items-start gap-1.5">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#F0D58A]" />
                <span>
                  <strong className="text-[#EDE6D6]">Abeokuta (Ogun State):</strong> Timeline Bazaar, Dayo Sanyaolu Junction, Camp (beside Peakolam Restaurant / Suites, FUNAAB Rd axis).{' '}
                  <Link to="/contact#locations" className="text-[#F0D58A] hover:underline font-medium">
                    Google Maps &amp; Directions →
                  </Link>
                </span>
              </p>
              <p className="pl-5 text-[11px] text-[#9A968C]/85">
                <strong className="text-[#EDE6D6]">Abuja Branch:</strong> Address coming soon.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 lg:pl-8">
            <div className="rounded-2xl hairline-gold p-6">
              <h3 className="text-base font-semibold text-[#EDE6D6]">
                Free Sunday Market Notes
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-[#9A968C]">
                Get simple weekly notes on Forex and Synthetic Indices charts, money safety tips, and new lessons—zero spam.
              </p>

              <form onSubmit={handleSubscribe} className="mt-4 flex flex-col sm:flex-row gap-3" noValidate>
                <label htmlFor="footer-newsletter" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-newsletter"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== 'idle') setStatus('idle');
                  }}
                  placeholder="you@example.com"
                  className="h-11 flex-1 rounded-xl border border-[#C9A24B]/24 bg-[#141414] px-4 text-sm text-[#EDE6D6] placeholder:text-[#9A968C]/60 focus:border-[#F0D58A] focus:outline-none"
                />
                <Button type="submit" variant="primary" size="md">
                  Subscribe Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

              {status === 'error' && (
                <p className="mt-2 text-xs text-[#EF4444]" role="alert">
                  {errorMsg}
                </p>
              )}
              {status === 'success' && (
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#F0D58A]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#C9A24B]" />
                  Subscribed! Watch your inbox for Sunday’s simple market notes.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 4 Footer Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-12 border-b border-[#C9A24B]/18">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-gradient mb-4">
              Programs &amp; Accounts
            </h4>
            <ul className="space-y-2.5 text-sm text-[#9A968C]">
              <li><Link to="/investment" className="hover:text-[#F0D58A] transition-colors">Managed Accounts</Link></li>
              <li><Link to="/investment#plans" className="hover:text-[#F0D58A] transition-colors">Account Plans &amp; Tiers</Link></li>
              <li><Link to="/training" className="hover:text-[#F0D58A] transition-colors">Training Courses</Link></li>
              <li><Link to="/mentorship" className="hover:text-[#F0D58A] transition-colors">1-on-1 Coaching</Link></li>
              <li><Link to="/signals" className="hover:text-[#F0D58A] transition-colors">Daily Trade Signals</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-gradient mb-4">
              Company &amp; Pricing
            </h4>
            <ul className="space-y-2.5 text-sm text-[#9A968C]">
              <li><Link to="/pricing" className="hover:text-[#F0D58A] transition-colors">Membership Pricing &amp; Plans</Link></li>
              <li><Link to="/results" className="hover:text-[#F0D58A] transition-colors">Student Results &amp; Proof</Link></li>
              <li><Link to="/about" className="hover:text-[#F0D58A] transition-colors">About Us</Link></li>
              <li><Link to="/investment#eligibility" className="hover:text-[#F0D58A] transition-colors">Apply for Managed Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-gradient mb-4">
              Help &amp; Tools
            </h4>
            <ul className="space-y-2.5 text-sm text-[#9A968C]">
              <li><Link to="/contact" className="hover:text-[#F0D58A] transition-colors">Support &amp; Urgent Help</Link></li>
              <li><Link to="/faq" className="hover:text-[#F0D58A] transition-colors">FAQ &amp; Common Questions</Link></li>
              <li><Link to="/signals#calculator" className="hover:text-[#F0D58A] transition-colors">Lot Size Calculator</Link></li>
              <li><Link to="/blog" className="hover:text-[#F0D58A] transition-colors">Trading Guides &amp; Blog</Link></li>
              <li><Link to="/dashboard" className="hover:text-[#F0D58A] transition-colors">Member Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-gradient mb-4">
              Legal &amp; Safety
            </h4>
            <ul className="space-y-2.5 text-sm text-[#9A968C]">
              <li><Link to="/investment#terms" className="hover:text-[#F0D58A] transition-colors">Account Rules &amp; 50/50 Split</Link></li>
              <li><Link to="/legal/risk-disclosure" className="hover:text-[#F0D58A] transition-colors">Risk Disclosure</Link></li>
              <li><Link to="/legal/terms" className="hover:text-[#F0D58A] transition-colors">Terms of Service</Link></li>
              <li><Link to="/legal/privacy" className="hover:text-[#F0D58A] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Risk Disclaimer */}
        <div className="py-8">
          <RiskDisclaimer />
        </div>

        {/* Bottom Legal & Payment Strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 text-xs text-[#9A968C]">
          <p>
            © {new Date().getFullYear()} Bullish Titan Academy. Educational platform only. Not a registered broker-dealer or investment advisor.
          </p>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-[#EDE6D6]/85">
            <span className="rounded-md border border-[#C9A24B]/24 bg-[#0B0B0C] px-2.5 py-1">VISA</span>
            <span className="rounded-md border border-[#C9A24B]/24 bg-[#0B0B0C] px-2.5 py-1">MASTERCARD</span>
            <span className="rounded-md border border-[#C9A24B]/24 bg-[#0B0B0C] px-2.5 py-1">BANK TRANSFER</span>
            <span className="rounded-md border border-[#C9A24B]/24 bg-[#0B0B0C] px-2.5 py-1">SEPA / WIRE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
