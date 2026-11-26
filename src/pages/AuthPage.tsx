import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Lock, Mail, User } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BrandMark } from '../components/layout/Navbar';
import { useAuth, type PlanTier } from '../lib/authContext';

export interface AuthPageProps {
  initialMode: 'login' | 'signup' | 'forgot';
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode }) => {
  const { loginWithEmail, signUpWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState<PlanTier>('academy');
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (mode === 'forgot') {
      setResetSent(true);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'signup') {
      if (name.trim().length < 2) {
        setError('Please enter your full name.');
        return;
      }
      await signUpWithEmail(name, email, password, plan);
    } else {
      await loginWithEmail(email, password);
    }

    navigate('/dashboard');
  };

  const handleGoogle = async () => {
    await loginWithGoogle();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4 bg-[#000000]">
      <div className="w-full max-w-md">
        <div className="mb-7 text-center">
          <Link to="/" className="inline-flex items-center gap-3">
            <BrandMark />
            <span className="font-display text-2xl font-bold text-[#EDE6D6]">
              Student Portal
            </span>
          </Link>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-[#9A968C]">
            Bullish Titan Access · Demo Sign-In
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          <div className="grid grid-cols-3 gap-1 rounded-md border border-[#C9A24B]/22 bg-[#000000] p-1 mb-6">
            {(
              [
                { id: 'login', label: 'Sign In' },
                { id: 'signup', label: 'Sign Up' },
                { id: 'forgot', label: 'Reset' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setMode(tab.id);
                  setError('');
                  setResetSent(false);
                }}
                className={`py-2 text-xs font-medium rounded-sm transition-colors ${
                  mode === tab.id
                    ? 'bg-gold-gradient text-[#000000] font-semibold'
                    : 'text-[#9A968C] hover:text-[#EDE6D6]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {mode === 'forgot' && resetSent ? (
                <div className="py-4 text-center space-y-3">
                  <CheckCircle2 className="mx-auto h-9 w-9 text-[#C9A24B]" />
                  <h2 className="font-display text-xl font-bold text-[#EDE6D6]">Reset Link Queued</h2>
                  <p className="text-xs text-[#9A968C]">
                    If an account exists for {email}, password reset instructions have been prepared (demo mode).
                  </p>
                  <Button size="sm" onClick={() => setMode('login')}>
                    Back to Sign In
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {mode === 'signup' && (
                    <div>
                      <label htmlFor="auth-full-name" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#9A968C]" />
                        <input
                          id="auth-full-name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Alex Morgan"
                          className="h-11 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] pl-10 pr-3.5 text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="auth-page-email" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#9A968C]" />
                      <input
                        id="auth-page-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="trader@domain.com"
                        className="h-11 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] pl-10 pr-3.5 text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none"
                      />
                    </div>
                  </div>

                  {mode !== 'forgot' && (
                    <div>
                      <label htmlFor="auth-page-pw" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#9A968C]" />
                        <input
                          id="auth-page-pw"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          className="h-11 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] pl-10 pr-3.5 text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {mode === 'signup' && (
                    <div>
                      <label htmlFor="auth-plan-tier" className="block text-xs font-medium text-[#EDE6D6] mb-1.5">
                        Choose a Plan (Switchable Anytime in Settings)
                      </label>
                      <select
                        id="auth-plan-tier"
                        value={plan}
                        onChange={(e) => setPlan(e.target.value as PlanTier)}
                        className="h-11 w-full rounded-md border border-[#C9A24B]/24 bg-[#000000] px-3.5 text-sm text-[#EDE6D6] focus:border-[#F0D58A] focus:outline-none"
                      >
                        <option value="free">Free Preview</option>
                        <option value="academy">Trading Courses</option>
                        <option value="signals">Daily Trade Signals</option>
                        <option value="mentorship">1-on-1 Coaching</option>
                        <option value="full-access">All-Access VIP</option>
                        <option value="investor">Managed Account</option>
                      </select>
                    </div>
                  )}

                  {error && (
                    <p className="text-xs text-[#EF4444]" role="alert">
                      {error}
                    </p>
                  )}

                  <Button type="submit" fullWidth variant="primary" size="lg">
                    {mode === 'login'
                      ? 'Sign In'
                      : mode === 'signup'
                      ? 'Create Account'
                      : 'Send Reset Link'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#C9A24B]/20" />
            <span className="text-[11px] text-[#9A968C]">or</span>
            <div className="h-px flex-1 bg-[#C9A24B]/20" />
          </div>

          <Button type="button" variant="secondary" fullWidth onClick={handleGoogle}>
            Continue With Google (Demo)
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
