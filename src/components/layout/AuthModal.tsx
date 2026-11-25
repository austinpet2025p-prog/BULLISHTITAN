import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Tabs } from '../ui/Tabs';
import { Button } from '../ui/Button';

export interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  mode,
  onModeChange,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [program, setProgram] = useState('The Forge · Training Academy');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup' && name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetAndClose}
      title={mode === 'login' ? 'Command Console Access' : 'Initiate Your Rank Ascension'}
      subtitle="Front-end command portal preview — ready for authentication integration."
    >
      <div className="mb-5">
        <Tabs
          value={mode}
          onChange={(v) => {
            onModeChange(v);
            setSubmitted(false);
            setError('');
          }}
          options={[
            { value: 'signup', label: 'Enlist Rank' },
            { value: 'login', label: 'Fellow Sign In' },
          ]}
        />
      </div>

      {submitted ? (
        <div className="rounded-2xl hairline-gold-bright p-5 text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-[#F0D58A] mb-2" />
          <h4 className="text-base font-semibold text-[#EDE6D6]">
            {mode === 'login' ? 'Command Console Ready' : 'Initiation Briefing Logged'}
          </h4>
          <p className="mt-1.5 text-xs text-[#9A968C] leading-relaxed">
            {mode === 'login'
              ? `Demo command session prepared for ${email}. Connect your backend authentication provider to enable live console access.`
              : `Confirmed${name ? `, ${name}` : ''}. Your initiation dossier for ${program} is queued.`}
          </p>
          <Button className="mt-4" size="sm" onClick={resetAndClose}>
            Return to House
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {mode === 'signup' && (
            <div>
              <label htmlFor="auth-name" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
                Full Name
              </label>
              <input
                id="auth-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="h-11 w-full rounded-xl border border-[#C9A24B]/24 bg-[#141414] px-3.5 text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none"
              />
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
              Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="trader@domain.com"
              className="h-11 w-full rounded-xl border border-[#C9A24B]/24 bg-[#141414] px-3.5 text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none"
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label htmlFor="auth-program" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
                Primary Division Interest
              </label>
              <select
                id="auth-program"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="h-11 w-full rounded-xl border border-[#C9A24B]/24 bg-[#141414] px-3.5 text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none"
              >
                <option>The Forge · Training Academy</option>
                <option>Strategos Mentorship</option>
                <option>Vanguard Intelligence</option>
                <option>Sovereign Mandates</option>
              </select>
            </div>
          )}

          {error && (
            <p className="text-xs text-[#EF4444]" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" fullWidth>
            {mode === 'login' ? 'Enter Command Console' : 'Request Initiation Access'}
          </Button>
        </form>
      )}
    </Modal>
  );
};
