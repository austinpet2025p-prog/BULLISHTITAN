import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Compass, RotateCcw } from 'lucide-react';
import { Section } from '../components/ui/Section';
import { Button } from '../components/ui/Button';
import { ShieldCrestBadge, RisingArrowConnector } from '../components/ui/TitanMotifs';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { cn } from '../lib/utils';

type TrackKey = 'training' | 'mentorship' | 'signals' | 'investment';

interface QuizQuestion {
  prompt: string;
  context: string;
  options: { label: string; scores: Record<TrackKey, number> }[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    prompt: 'Where are you starting from today?',
    context: 'Your Experience Level',
    options: [
      {
        label: 'Brand new — I want simple, step-by-step lessons from scratch',
        scores: { training: 3, mentorship: 1, signals: 0, investment: 1 },
      },
      {
        label: 'Some experience — I know the basics, but I still lose money or break rules',
        scores: { training: 1, mentorship: 3, signals: 1, investment: 0 },
      },
      {
        label: 'Busy schedule — I understand trading and just want clear daily trade alerts',
        scores: { training: 0, mentorship: 1, signals: 3, investment: 1 },
      },
      {
        label: 'Hands-free investor — I want pros to trade my account safely for me',
        scores: { training: 0, mentorship: 0, signals: 1, investment: 3 },
      },
    ],
  },
  {
    prompt: 'How much free time do you have each week?',
    context: 'Your Weekly Schedule',
    options: [
      {
        label: '1–2 hours a week (just quick alerts and clear prices)',
        scores: { training: 0, mentorship: 0, signals: 3, investment: 2 },
      },
      {
        label: '3–5 hours a week (watching lessons and practicing calmly)',
        scores: { training: 3, mentorship: 1, signals: 1, investment: 1 },
      },
      {
        label: '6–10 hours a week (live chart classes and 1-on-1 reviews)',
        scores: { training: 1, mentorship: 3, signals: 0, investment: 0 },
      },
      {
        label: 'Almost no free time (monthly check-ins only)',
        scores: { training: 0, mentorship: 0, signals: 0, investment: 3 },
      },
    ],
  },
  {
    prompt: 'Which markets are you most interested in?',
    context: 'Favorite Markets',
    options: [
      {
        label: 'Major Forex pairs (EUR/USD, GBP/USD) and Gold',
        scores: { training: 2, mentorship: 2, signals: 2, investment: 0 },
      },
      {
        label: 'Fast Synthetic Indices (Volatility 75, Boom 500, Crash 1000)',
        scores: { training: 2, mentorship: 2, signals: 3, investment: 1 },
      },
      {
        label: 'Long-term Forex & Gold account growth',
        scores: { training: 1, mentorship: 0, signals: 0, investment: 3 },
      },
      {
        label: 'Both Forex, Gold, and Synthetic Indices together',
        scores: { training: 2, mentorship: 3, signals: 1, investment: 1 },
      },
    ],
  },
  {
    prompt: 'What is your biggest challenge right now?',
    context: 'Main Goal',
    options: [
      {
        label: 'Charts look confusing and I do not have a clear plan yet',
        scores: { training: 3, mentorship: 1, signals: 0, investment: 0 },
      },
      {
        label: 'Getting nervous, jumping in too early, or moving my stop loss',
        scores: { training: 1, mentorship: 3, signals: 0, investment: 0 },
      },
      {
        label: 'Missing good trades while I am at my job or with family',
        scores: { training: 0, mentorship: 0, signals: 3, investment: 1 },
      },
      {
        label: 'Growing larger savings carefully with strict safety rules',
        scores: { training: 0, mentorship: 0, signals: 0, investment: 3 },
      },
    ],
  },
  {
    prompt: 'How do you learn or grow best?',
    context: 'Preferred Style',
    options: [
      {
        label: 'Clear, self-paced video lessons with simple checklists',
        scores: { training: 3, mentorship: 1, signals: 0, investment: 0 },
      },
      {
        label: 'Having a personal coach check my trades every week',
        scores: { training: 0, mentorship: 3, signals: 0, investment: 0 },
      },
      {
        label: 'Ready-to-read trade alerts with exact Stop Loss & Target prices',
        scores: { training: 0, mentorship: 0, signals: 3, investment: 0 },
      },
      {
        label: 'A managed account where my money stays in my own broker',
        scores: { training: 0, mentorship: 0, signals: 0, investment: 3 },
      },
    ],
  },
];

const RECOMMENDATIONS: Record<
  TrackKey,
  {
    title: string;
    label: string;
    accentColor: string;
    summary: string;
    deliverable: string;
    cta: string;
    to: string;
  }
> = {
  training: {
    title: 'Step-by-Step Trading Courses',
    label: '01 · Best Match: Training Courses',
    accentColor: '#F0D58A',
    summary:
      'Start with our friendly video lessons to understand charts, timing, and money safety at your own comfortable pace.',
    deliverable: '3 Clear Levels · 86 Video Lessons · Free Lot Size Calculator',
    cta: 'View Trading Courses',
    to: '/training',
  },
  mentorship: {
    title: '12-Week 1-on-1 Coaching',
    label: '02 · Best Match: Personal Coaching',
    accentColor: '#22C58B',
    summary:
      'You already know the basics—what helps most now is a real coach checking your trades every week so you stay calm and consistent.',
    deliverable: '12 Weeks · Live Chart Classes · Weekly 1-on-1 Reviews',
    cta: 'Meet Your Coaches',
    to: '/mentorship',
  },
  signals: {
    title: 'Daily Trade Signals',
    label: '03 · Best Match: Live Signals',
    accentColor: '#22C58B',
    summary:
      'Made for busy people: get checked Forex, Gold, and Synthetic trade ideas with exact entry, stop-loss, and target prices sent to your phone.',
    deliverable: 'Forex Majors · Gold · V75 / Boom / Crash Alerts',
    cta: 'View Signal Plans',
    to: '/signals',
  },
  investment: {
    title: 'Managed Accounts',
    label: '04 · Best Match: Managed Accounts',
    accentColor: '#E08A3C',
    summary:
      'Let our senior traders manage trades inside your own regulated broker account—starting from the $900 Starter Plan up to Private VIP.',
    deliverable: 'Starter to VIP Plans · 50/50 Profit Split · Strict Loss Limits',
    cta: 'See Managed Accounts',
    to: '/investment',
  },
};

const TRACK_LABELS: Record<TrackKey, string> = {
  training: 'Trading Courses',
  mentorship: '1-on-1 Coaching',
  signals: 'Daily Signals',
  investment: 'Managed Accounts',
};

const TRACK_BAR_STYLE: Record<TrackKey, string> = {
  training: 'bg-gradient-to-r from-[#2563EB] via-[#60A5FA] to-[#93C5FD]',
  mentorship: 'bg-gradient-to-r from-[#9333EA] via-[#C084FC] to-[#F0D58A]',
  signals: 'bg-gradient-to-r from-[#059669] via-[#34D399] to-[#F0D58A]',
  investment: 'bg-gradient-to-r from-[#B45309] via-[#F59E0B] to-[#F9E5A7]',
};

const TRACK_JEWEL_SURFACE: Record<TrackKey, string> = {
  training: 'hairline-sapphire text-[#93C5FD]',
  mentorship: 'hairline-amethyst text-[#E9D5FF]',
  signals: 'hairline-emerald text-[#6EE7B7]',
  investment: 'hairline-bronze text-[#FCD34D]',
};

const APPLE_EASE = [0.16, 1, 0.3, 1] as const;

const questionSlideVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir >= 0 ? 36 : -36,
    scale: 0.985,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir >= 0 ? -36 : 36,
    scale: 0.985,
  }),
};

export const FindYourPathQuiz: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const stepperLayoutId = useId();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<number[]>([]);
  const [pendingOption, setPendingOption] = useState<number | null>(null);
  const advanceTimerRef = useRef<number | null>(null);

  const isDone = answers.length === QUESTIONS.length && pendingOption === null;

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) {
        window.clearTimeout(advanceTimerRef.current);
      }
    };
  }, []);

  const selectOption = (optIdx: number) => {
    if (pendingOption !== null) return;
    const next = [...answers];
    next[step] = optIdx;
    setAnswers(next);

    if (reducedMotion || step === QUESTIONS.length - 1) {
      if (step < QUESTIONS.length - 1) {
        setDirection(1);
        setStep(step + 1);
      }
      return;
    }

    // Brief 230ms visual confirmation pulse before smooth directional advance
    setPendingOption(optIdx);
    advanceTimerRef.current = window.setTimeout(() => {
      setPendingOption(null);
      setDirection(1);
      setStep((s) => Math.min(QUESTIONS.length - 1, s + 1));
    }, 230);
  };

  const goToStep = (targetIdx: number) => {
    if (pendingOption !== null || targetIdx > answers.length) return;
    setDirection(targetIdx >= step ? 1 : -1);
    setStep(targetIdx);
  };

  const reset = () => {
    if (advanceTimerRef.current) {
      window.clearTimeout(advanceTimerRef.current);
    }
    setPendingOption(null);
    setDirection(-1);
    setAnswers([]);
    setStep(0);
  };

  // Compute live affinity scores across all 4 divisions
  const totals: Record<TrackKey, number> = {
    training: 0,
    mentorship: 0,
    signals: 0,
    investment: 0,
  };
  answers.forEach((optIdx, qIdx) => {
    const scores = QUESTIONS[qIdx]?.options[optIdx]?.scores;
    if (!scores) return;
    (Object.keys(totals) as TrackKey[]).forEach((k) => {
      totals[k] += scores[k];
    });
  });

  const totalPoints = Math.max(
    1,
    totals.training + totals.mentorship + totals.signals + totals.investment
  );
  const sortedTracks = (Object.keys(totals) as TrackKey[]).sort(
    (a, b) => totals[b] - totals[a]
  );
  const recommendedKey = sortedTracks[0];
  const result = RECOMMENDATIONS[recommendedKey];
  const topMatchPct =
    answers.length === 0
      ? 0
      : Math.min(99, Math.max(42, Math.round((totals[recommendedKey] / (answers.length * 3)) * 100)));

  const progressPct = isDone
    ? 100
    : Math.round(((step + (answers[step] !== undefined ? 1 : 0)) / QUESTIONS.length) * 100);

  return (
    <Section
      id="quiz"
      romanIndex="05"
      kicker="Quick Path Finder"
      title="Find Your Best Starting Point"
      subtitle="Answer five quick questions and we will point you straight to the program that fits your time, skill level, and goals."
    >
      <div className="grid gap-10 lg:grid-cols-12 items-start">
        {/* Left Editorial Brief + Live Spring-Animated Track Affinity Bars */}
        <div className="lg:col-span-5 space-y-6 border-t border-[#C9A24B]/28 pt-6">
          <div className="flex items-center gap-3.5">
            <ShieldCrestBadge>
              <Compass className="h-4 w-4 text-[#F0D58A]" />
            </ShieldCrestBadge>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C9A24B]">
                Live Match Finder
              </p>
              <p className="font-display text-xl font-bold text-[#EDE6D6]">
                {isDone ? 'Your Best Match Is Ready' : `Question 0${step + 1} of 0${QUESTIONS.length}`}
              </p>
            </div>
          </div>

          <p className="text-sm text-[#9A968C] leading-relaxed">
            Every answer updates your match scores in real time so you never waste time or money on the wrong program.
          </p>

          {/* Animated Liquid Gold Completion Meter */}
          <div className="pt-1">
            <div className="flex justify-between font-mono text-[11px] text-[#9A968C] mb-2 tabular-nums">
              <span>QUIZ PROGRESS</span>
              <span className="text-gold-gradient font-semibold">{progressPct}%</span>
            </div>
            <div className="h-[3px] w-full rounded-full bg-[#141414] overflow-hidden">
              <motion.div
                className="h-full bg-gold-gradient origin-left"
                initial={false}
                animate={{ scaleX: progressPct / 100 }}
                transition={reducedMotion ? { duration: 0 } : { duration: 0.5, ease: APPLE_EASE }}
              />
            </div>
          </div>

          {/* Live Compatibility Bars */}
          <div className="rounded-xl hairline-sapphire p-5 space-y-3.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#93C5FD]">
              Live Program Match
            </p>
            {(Object.keys(TRACK_LABELS) as TrackKey[]).map((track) => {
              const rawShare =
                answers.length === 0 ? 12 : Math.round((totals[track] / totalPoints) * 100);
              const isLeading = answers.length > 0 && track === recommendedKey;
              return (
                <div key={track} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs tabular-nums">
                    <span className={cn('font-medium', isLeading ? 'text-[#F0D58A]' : 'text-[#EDE6D6]/85')}>
                      {TRACK_LABELS[track]}
                    </span>
                    <span className={cn('font-mono text-[11px]', isLeading ? 'text-[#34D399]' : 'text-[#9A968C]')}>
                      {answers.length === 0 ? '—' : `${rawShare}%`}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#141824] overflow-hidden">
                    <motion.div
                      className={cn(
                        'h-full rounded-full origin-left',
                        isLeading ? TRACK_BAR_STYLE[track] : 'bg-[#60A5FA]/28'
                      )}
                      initial={false}
                      animate={{ scaleX: Math.max(0.06, rawShare / 100) }}
                      transition={
                        reducedMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 170, damping: 24 }
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <RisingArrowConnector align="left" className="px-0 pt-1" />
        </div>

        {/* Right Sleek Apple Interactive Question / Result Card */}
        <div className="lg:col-span-7 hairline-gold-bright rounded-2xl p-6 sm:p-10 overflow-hidden bg-aurora-obsidian">
          {/* Interactive Stepper Bar */}
          <div className="flex items-center justify-between gap-3 pb-6 mb-7 border-b border-[#C9A24B]/18">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {QUESTIONS.map((_, i) => {
                const answered = answers[i] !== undefined;
                const current = !isDone && step === i;
                const reachable = i <= answers.length;
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={!reachable}
                    onClick={() => goToStep(i)}
                    className={cn(
                      'relative px-3 py-1.5 rounded-lg font-mono text-[11px] tabular-nums transition-colors whitespace-nowrap shrink-0',
                      current
                        ? 'text-[#000000] font-semibold'
                        : answered
                          ? 'text-[#22C58B] hover:text-[#F0D58A]'
                          : 'text-[#9A968C]/55 cursor-not-allowed'
                    )}
                  >
                    {current && (
                      <motion.span
                        layoutId={stepperLayoutId}
                        transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                        className="absolute inset-0 rounded-lg bg-gold-gradient"
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1">
                      {answered && !current && <Check className="h-3 w-3" />}
                      0{i + 1}
                    </span>
                  </button>
                );
              })}
            </div>
            {answers.length > 0 && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#9A968C] hover:text-[#F0D58A] transition-colors whitespace-nowrap shrink-0"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            {isDone ? (
              <motion.div
                key="quiz-result"
                initial={reducedMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.55, ease: APPLE_EASE }}
                className="space-y-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-[11px] font-semibold text-gold-gradient uppercase tracking-[0.2em]">
                      {result.label}
                    </p>
                    <h3 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#EDE6D6]">
                      {result.title}
                    </h3>
                  </div>

                  <div
                    className={cn(
                      'rounded-xl px-4 py-2.5 text-right tabular-nums',
                      TRACK_JEWEL_SURFACE[recommendedKey]
                    )}
                  >
                    <span className="block font-mono text-[10px] uppercase tracking-wider text-[#9A968C]">
                      Match Score
                    </span>
                    <span className="font-display text-2xl font-bold">
                      {topMatchPct}%
                    </span>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-[#9A968C] leading-relaxed max-w-2xl">
                  {result.summary}
                </p>

                <div className="rounded-xl hairline-sapphire px-4 py-3.5 font-mono text-xs text-[#EDE6D6]">
                  {result.deliverable}
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Button to={result.to} variant="primary" size="lg">
                    {result.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="lg" onClick={reset}>
                    <RotateCcw className="h-4 w-4" />
                    Start Over
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`step-${step}`}
                custom={direction}
                variants={reducedMotion ? undefined : questionSlideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.36, ease: APPLE_EASE }}
              >
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#C9A24B] mb-2.5">
                  <span>Step 0{step + 1}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#9A968C]">{QUESTIONS[step].context}</span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#EDE6D6] mb-7 leading-snug">
                  {QUESTIONS[step].prompt}
                </h3>

                <div className="space-y-3">
                  {QUESTIONS[step].options.map((opt, idx) => {
                    const chosen = answers[step] === idx || pendingOption === idx;
                    return (
                      <motion.button
                        key={opt.label}
                        type="button"
                        onClick={() => selectOption(idx)}
                        whileHover={reducedMotion ? undefined : { x: 4 }}
                        whileTap={reducedMotion ? undefined : { scale: 0.985 }}
                        transition={{ duration: 0.16, ease: APPLE_EASE }}
                        className={cn(
                          'w-full rounded-xl border p-4 text-left text-sm transition-colors duration-200 flex items-center justify-between gap-4',
                          chosen
                            ? 'border-[#F0D58A]/70 bg-[#141414] text-[#F0D58A]'
                            : 'border-[#C9A24B]/18 bg-[#000000]/80 text-[#EDE6D6]/85 hover:border-[#C9A24B]/45 hover:bg-[#141414]/65 hover:text-[#EDE6D6]'
                        )}
                      >
                        <span className="flex items-center gap-3.5">
                          <span
                            className={cn(
                              'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-[11px] border transition-colors',
                              chosen
                                ? 'border-[#22C58B]/60 bg-[#22C58B]/15 text-[#22C58B]'
                                : 'border-[#C9A24B]/24 bg-[#0B0B0C] text-[#C9A24B]'
                            )}
                          >
                            0{idx + 1}
                          </span>
                          <span className="leading-snug">{opt.label}</span>
                        </span>

                        {chosen ? (
                          <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-[#22C58B]" />
                        ) : (
                          <ArrowRight className="h-4 w-4 shrink-0 text-[#C9A24B]/70" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {step > 0 && (
                  <div className="mt-6 flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDirection(-1);
                        setStep((s) => Math.max(0, s - 1));
                      }}
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Previous Question
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
};
