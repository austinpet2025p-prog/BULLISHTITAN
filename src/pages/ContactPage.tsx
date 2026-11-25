import React, { useState } from 'react';
import { Building2, CheckCircle2, Clock, Mail, MapPin, MessageCircle, Send } from 'lucide-react';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RiskDisclaimer } from '../components/ui/RiskDisclaimer';
import { SuccessConfetti } from '../components/ui/SuccessConfetti';
import { SocialLinks } from '../components/ui/SocialLinks';
import { ShieldCrestBadge } from '../components/ui/TitanMotifs';
import { TitanLocationIntelligence } from '../components/contact/TitanLocationIntelligence';
import { VoiceTranscribeButton } from '../components/ui/VoiceTranscribeButton';

export const ContactPage: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    topic: 'The Forge · Training Division',
    message: '',
  });
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2) {
      setError('Please enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (form.message.trim().length < 10) {
      setError('Please enter a short message (at least 10 characters).');
      return;
    }
    setError('');
    setSent(true);
  };

  return (
    <div className="pt-20 bg-[#000000]">
      <Section
        romanIndex="01"
        kicker="Admissions & Support"
        title="Contact the Bullish Titan Desk"
        subtitle="Reach out via inquiry form, Telegram, WhatsApp, or visit our flagship Abeokuta branch at Timeline Bazaar, Camp."
      >
        <div className="grid gap-10 lg:grid-cols-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <Card className="space-y-5">
              <div className="flex items-start gap-3.5">
                <ShieldCrestBadge className="h-10 w-9 shrink-0">
                  <Mail className="h-4 w-4 text-[#F0D58A]" />
                </ShieldCrestBadge>
                <div>
                  <p className="text-sm font-semibold text-[#EDE6D6]">Admissions Email</p>
                  <a
                    href="mailto:bullishtitan@gmail.com"
                    className="text-xs text-[#F0D58A] hover:underline"
                  >
                    bullishtitan@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <ShieldCrestBadge className="h-10 w-9 shrink-0">
                  <Clock className="h-4 w-4 text-[#F0D58A]" />
                </ShieldCrestBadge>
                <div>
                  <p className="text-sm font-semibold text-[#EDE6D6]">Global Desk Hours</p>
                  <p className="text-xs text-[#9A968C]">Monday – Friday · 07:00 – 19:00 UTC</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#C9A24B]/18">
                <a
                  href="#telegram-support"
                  onClick={(e) => {
                    e.preventDefault();
                    setForm((f) => ({ ...f, topic: 'Telegram Desk Channel' }));
                  }}
                  className="flex items-center justify-center gap-2 rounded-md border border-[#C9A24B]/35 bg-[#141414] py-2.5 text-xs font-semibold text-[#EDE6D6] hover:border-[#F0D58A] hover:text-[#F0D58A] transition-colors"
                >
                  <Send className="h-3.5 w-3.5 text-[#C9A24B]" />
                  Telegram Desk
                </a>
                <a
                  href="#whatsapp-support"
                  onClick={(e) => {
                    e.preventDefault();
                    setForm((f) => ({ ...f, topic: 'WhatsApp Admissions' }));
                  }}
                  className="flex items-center justify-center gap-2 rounded-md border border-[#C9A24B]/35 bg-[#141414] py-2.5 text-xs font-semibold text-[#EDE6D6] hover:border-[#F0D58A] hover:text-[#F0D58A] transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-[#C9A24B]" />
                  WhatsApp Desk
                </a>
              </div>

              <div className="pt-4 border-t border-[#C9A24B]/18 space-y-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#C9A24B] font-semibold">
                  Official Social Channels
                </p>
                <SocialLinks variant="cards" />
              </div>
            </Card>

            {/* Physical Branches Overview Card */}
            <Card className="space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCrestBadge className="h-10 w-9 shrink-0">
                  <MapPin className="h-4 w-4 text-[#F0D58A]" />
                </ShieldCrestBadge>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-[#EDE6D6]">
                      Abeokuta Flagship · Bullish Titan, Timeline Bazaar
                    </p>
                    <span className="rounded bg-[#10B981]/15 px-1.5 py-0.5 font-mono text-[10px] text-[#34D399]">
                      Live on Google Maps
                    </span>
                  </div>
                  <p className="text-xs text-[#C8C2B6] leading-relaxed">
                    Timeline Bazaar, Dayo Sanyaolu Junction, Camp, Abeokuta, Ogun State, Nigeria.
                  </p>
                  <p className="text-[11px] text-[#9A968C] leading-relaxed">
                    <strong className="text-[#F0D58A]">Landmark:</strong> Beside Peakolam Restaurant / Peakolam Suites, along the FUNAAB Road (Alabata Road) axis.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-[#C9A24B]/18">
                <ShieldCrestBadge className="h-10 w-9 shrink-0">
                  <Building2 className="h-4 w-4 text-[#C9A24B]" />
                </ShieldCrestBadge>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-[#EDE6D6]">Abuja Branch (FCT)</p>
                    <span className="rounded bg-[#C9A24B]/15 px-1.5 py-0.5 font-mono text-[10px] text-[#F0D58A]">
                      Address Not Yet Specified
                    </span>
                  </div>
                  <p className="text-xs text-[#9A968C] leading-relaxed">
                    Abuja regional office suite address is not yet specified. Remote consultations remain active daily.
                  </p>
                </div>
              </div>

              <a
                href="#locations"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F0D58A] hover:underline"
              >
                <MapPin className="h-3.5 w-3.5" />
                Launch Interactive Google Maps &amp; Route Planner Below
              </a>
            </Card>

            <RiskDisclaimer compact />
          </div>

          <Card className="lg:col-span-7">
            {sent ? (
              <div className="py-8 text-center space-y-3">
                <SuccessConfetti active={sent} />
                <CheckCircle2 className="mx-auto h-10 w-10 text-[#C9A24B]" />
                <h3 className="font-display text-2xl font-bold text-[#EDE6D6]">Message Received</h3>
                <p className="text-sm text-[#9A968C]">
                  Thank you, {form.name}. Our admissions team will follow up at {form.email}.
                </p>
                <Button size="sm" onClick={() => setSent(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="c-name" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
                      Full Name
                    </label>
                    <input
                      id="c-name"
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="h-11 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] px-3.5 text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="c-email" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="c-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="h-11 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] px-3.5 text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="c-topic" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
                    Inquiry Topic
                  </label>
                  <select
                    id="c-topic"
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    className="h-11 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] px-3.5 text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none"
                  >
                    <option>The Forge · Training Division</option>
                    <option>Strategos Mentorship</option>
                    <option>Vanguard Intelligence</option>
                    <option>Sovereign Mandates</option>
                    <option>Abeokuta Branch Walk-In Visit</option>
                    <option>Abuja Branch Inquiry</option>
                    <option>Telegram Desk Channel</option>
                    <option>WhatsApp Admissions</option>
                    <option>General Desk Inquiry</option>
                  </select>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <label htmlFor="c-msg" className="block text-xs font-medium text-[#EDE6D6]">
                      Message
                    </label>
                    <VoiceTranscribeButton
                      label="Dictate with Mic"
                      onTranscript={(spoken) => {
                        setError('');
                        setForm((prev) => ({
                          ...prev,
                          message: prev.message.trim()
                            ? `${prev.message.trim()} ${spoken}`
                            : spoken,
                        }));
                      }}
                      onError={(msg) => setError(msg)}
                    />
                  </div>
                  <textarea
                    id="c-msg"
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] p-3.5 text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none"
                  />
                </div>

                {error && <p className="text-xs text-[#EF4444]">{error}</p>}

                <Button type="submit" variant="primary" size="lg" fullWidth>
                  Send Message
                </Button>
              </form>
            )}
          </Card>
        </div>
      </Section>

      <Section
        id="locations"
        romanIndex="02"
        kicker="Google Maps & Location Intelligence"
        title="Find Bullish Titan · Abeokuta & Abuja"
        subtitle="Explore our verified Ogun State flagship at Timeline Bazaar (beside Peakolam Restaurant / Suites along FUNAAB Road), plan your route from any landmark, or track Abuja branch updates."
      >
        <TitanLocationIntelligence />
      </Section>
    </div>
  );
};

export default ContactPage;
