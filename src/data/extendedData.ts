export interface InvestmentProgramSpec {
  id: string;
  name: string;
  rankTitle: string;
  subtitleTag: string;
  strategyType: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  minEquityValue: number;
  maxEquityValue: number | null;
  equityRange: string;
  onboardingFee: string;
  duration: string;
  withdrawalTerms: string;
  managerTier: string;
  drawdownGuardrail: string;
  whoItIsFor: string;
  strategicPositioning: string;
  accessLevel: string;
  progressionMeaning: string;
  ctaLabel: string;
  popular?: boolean;
  isCustomQuote?: boolean;
  summary: string;
  highlights: string[];
}

export const INVESTMENT_PROGRAMS: InvestmentProgramSpec[] = [
  {
    id: 'lite-phase',
    name: 'Starter Plan',
    rankTitle: 'Tier 1 · Starter — Build Steady Habits',
    subtitleTag: 'Starter Tier · $900 – $1,400 Balance',
    strategyType: 'Steady Major Currency Trading',
    riskLevel: 'Low',
    minEquityValue: 900,
    maxEquityValue: 1400,
    equityRange: '$900 – $1,400 (Confirmed on setup)',
    onboardingFee: '$55.00 / One Time Fee',
    duration: 'Monthly / Quarterly Review',
    withdrawalTerms: 'You control withdrawals · Monthly window',
    managerTier: 'Assigned Account Trader manages your account',
    drawdownGuardrail: 'Strict safety loss limit · Profits not guaranteed',
    whoItIsFor: 'First-time managed account clients starting with a modest, comfortable balance.',
    strategicPositioning: 'Focuses on protecting your starting funds while building steady results.',
    accessLevel: 'Live tracking dashboard, direct trader chat, $900–$1,400 balance range',
    progressionMeaning: 'Sets a safe, simple foundation with full ownership of your broker account.',
    ctaLabel: 'Choose Starter Plan',
    summary:
      'Start with $900 to $1,400 inside your own broker account—with live balance tracking, direct chat with your trader, and strict safety stops.',
    highlights: [
      'Min Balance: $900 in your broker account',
      'Max Balance: Up to $1,400 for steady growth',
      'Live Dashboard: Watch balance and open trades anytime',
      'Direct Chat: Message your account trader inside your portal',
    ],
  },
  {
    id: 'pro-phase',
    name: 'Growth Plan',
    rankTitle: 'Tier 2 · Growth — Balanced Scaling',
    subtitleTag: 'Most Popular · $1,500 – $5,000 Balance',
    strategyType: 'Major Currencies + Gold (XAU/USD)',
    riskLevel: 'Medium',
    minEquityValue: 1500,
    maxEquityValue: 5000,
    equityRange: '$1,500 – $5,000 (Confirmed on setup)',
    onboardingFee: '$100.00 / One Time Fee',
    duration: 'Quarterly Cycle',
    withdrawalTerms: 'Monthly / Quarterly withdrawal window',
    managerTier: 'Assigned Account Trader manages your account',
    drawdownGuardrail: 'Multi-step safety cap & weekly check-in',
    whoItIsFor: 'Clients ready to grow a balanced Forex and Gold portfolio under strict safety rules.',
    strategicPositioning: 'Balances steady currency and Gold trades with clear weekly risk checks.',
    accessLevel: '$1,500–$5,000 balance range, weekly risk reviews, priority trader chat',
    progressionMeaning: 'Opens balanced currency and Gold trading with higher growth capacity.',
    ctaLabel: 'Choose Growth Plan',
    popular: true,
    summary:
      'Trade $1,500 to $5,000 safely inside your own broker account—complete with live tracking, priority trader chat, and clear loss limits.',
    highlights: [
      'Min Balance: $1,500 in your broker account',
      'Max Balance: Up to $5,000 for balanced growth',
      'Live Dashboard: Watch balance and open trades anytime',
      'Priority Chat: Fast direct replies from your trader',
    ],
  },
  {
    id: 'geant-phase',
    name: 'Pro Plan',
    rankTitle: 'Tier 3 · Pro — Senior Trader Oversight',
    subtitleTag: 'Pro Tier · $6,000 – $9,000 Balance',
    strategyType: 'Major Currencies, Gold & Capped Synthetics',
    riskLevel: 'Medium',
    minEquityValue: 6000,
    maxEquityValue: 9000,
    equityRange: '$6,000 – $9,000 (Confirmed on setup)',
    onboardingFee: '$300.00 / One Time Fee',
    duration: 'Quarterly / 6-Month Plan',
    withdrawalTerms: 'Flexible scheduled withdrawal windows',
    managerTier: 'Senior Bullish Titan Lead Trader manages your account',
    drawdownGuardrail: 'Tight loss protection & smart trade limits',
    whoItIsFor: 'Clients seeking senior trader care across Forex, Gold, and risk-capped Synthetic Indices.',
    strategicPositioning: 'Places your account with our senior team under extra safety checks.',
    accessLevel: 'Senior Lead Trader oversight, monthly PDF summary, 10% $5,000+ goodwill rule',
    progressionMeaning: 'Unlocks senior trader management and eligibility for our $5,000+ goodwill buffer.',
    ctaLabel: 'Choose Pro Plan',
    summary:
      'Put $6,000 to $9,000 under our Senior Lead Trader—combining Forex, Gold, and safe-sized Synthetic Indices with monthly PDF statements.',
    highlights: [
      'Min Balance: $6,000 in your broker account',
      'Max Balance: Up to $9,000 under Senior Lead care',
      'Monthly Reports: Live tracking plus downloadable PDF statements',
      'Extra Protection: Qualifies for the 10% goodwill loss rule ($5,000+)',
    ],
  },
  {
    id: 'grande-phase',
    name: 'Private VIP Plan',
    rankTitle: 'Tier 4 · Private VIP — Custom Account Care',
    subtitleTag: 'Private VIP · $10,000+ Balance',
    strategyType: 'Custom Multi-Market Portfolio',
    riskLevel: 'High',
    minEquityValue: 10000,
    maxEquityValue: null,
    equityRange: '$10,000+ Custom Plan',
    onboardingFee: 'Price: Contact Us',
    duration: 'Custom Schedule',
    withdrawalTerms: 'Custom withdrawal schedule you set',
    managerTier: 'Executive Desk Director directly oversees your account',
    drawdownGuardrail: 'Custom maximum loss cap & market filters',
    whoItIsFor: 'Larger account holders who want custom risk limits and personal executive updates.',
    strategicPositioning: 'Our highest level of personal care, custom safety rules, and direct support.',
    accessLevel: 'Executive Director care, custom withdrawal timing, 10% goodwill rule, full reporting',
    progressionMeaning: 'Gives you bespoke portfolio rules, personal updates, and direct leadership access.',
    ctaLabel: 'Request VIP Briefing',
    isCustomQuote: true,
    summary:
      'Tailored management for $10,000+ accounts with custom profit goals, custom safety limits, and direct executive updates.',
    highlights: [
      'Min Balance: $10,000+ in your broker account',
      'Custom Plan: Risk limits and goals built around you',
      'Full Reports: Live tracking and detailed monthly summaries',
      'Leadership Care: Overseen directly by our Executive Director',
    ],
  },
];

export interface TermCategory {
  id: 'ownership' | 'governance' | 'reporting';
  label: string;
  items: { title: string; summary: string; note: string }[];
}

export const INVESTMENT_TERMS_TABS: TermCategory[] = [
  {
    id: 'ownership',
    label: '1. Your Money Stays Yours',
    items: [
      {
        title: '1. Trade-Only Access & Full Ownership',
        summary:
          'You only give Bullish Titan permission to place trades. Your broker account always stays in your own legal name and under your full control.',
        note: 'Rule 01 · Trade access only',
      },
      {
        title: '2. Your Money Never Leaves Your Broker',
        summary:
          'You deposit funds straight into your own regulated broker account. Bullish Titan Academy cannot touch or withdraw a single dollar.',
        note: 'Rule 02 · Zero withdrawal access',
      },
      {
        title: '8. Strict Privacy & ID Protection',
        summary:
          'All ID checks, account details, and trading records stay 100% private and are never shared with outsiders.',
        note: 'Rule 08 · Complete privacy',
      },
    ],
  },
  {
    id: 'governance',
    label: '2. 50/50 Split & Safety Rules',
    items: [
      {
        title: '3. Fair 50% / 50% Profit Share',
        summary:
          'When we hit or pass the cycle profit goal, profits are shared 50% to you and 50% to Bullish Titan Academy. If you don’t earn, we don’t earn.',
        note: 'Rule 03 · Shared profits only',
      },
      {
        title: '5 & 6. Clear Strategy & Honest Risk',
        summary:
          'We trade using real analysis across Forex and Synthetic Indices—never gambling. Please keep manual trades out of the managed account. Trading always carries risk of loss.',
        note: 'Rules 05 & 06 · Honest risk disclosure',
      },
      {
        title: '9. Extra 10% Protection for $5,000+ Accounts',
        summary:
          'In the rare case of a full account loss, accounts that started with over $5,000 qualify for a 10% initial-deposit goodwill refund (not insurance). Accounts under $5,000 are not covered.',
        note: 'Rule 09 · Over $5,000 goodwill rule',
      },
    ],
  },
  {
    id: 'reporting',
    label: '3. Withdrawals & Stopping Anytime',
    items: [
      {
        title: '4. Easy Coordinated Withdrawals',
        summary:
          'Because your funds sit inside your own broker account, you withdraw cleanly on schedule as soon as each cycle profit target is reached.',
        note: 'Rule 04 · Smooth withdrawals',
      },
      {
        title: '7. Stop Anytime With Prior Notice',
        summary:
          'Either you or Bullish Titan can end the agreement anytime with notice. Open trades are closed neatly and any earned profits are settled fairly.',
        note: 'Rule 07 · No lock-in contracts',
      },
      {
        title: 'Live Dashboard & Monthly PDF Reports',
        summary:
          'Watch your live balance, open trades, and monthly PDF summaries anytime—just avoid placing separate manual trades in the linked account.',
        note: 'Full day-by-day visibility',
      },
    ],
  },
];

export const INVESTMENT_ONBOARDING_STEPS = [
  {
    step: '01',
    title: 'Pick Your Plan & Apply',
    detail:
      'Fill out the short form below, pick the tier that matches your balance, and hop on a quick ID check call with our team.',
  },
  {
    step: '02',
    title: 'Review Clear Rules & Meet Your Trader',
    detail:
      'Read our plain-English 9-rule agreement, agree on your safety loss limit, meet your assigned trader, and pay the one-time setup fee.',
  },
  {
    step: '03',
    title: 'Fund Your Own Broker & Watch Live',
    detail:
      'Deposit into your own regulated broker account (only you can withdraw), connect trade-only access, and watch your live dashboard.',
  },
];

export const INVESTOR_DEMO_REPORTING = [
  { month: 'Jun', equity: 100.0, drawdown: 0.0, statementId: 'ST-2026-06' },
  { month: 'Jul', equity: 101.4, drawdown: -0.9, statementId: 'ST-2026-07' },
  { month: 'Aug', equity: 100.6, drawdown: -1.8, statementId: 'ST-2026-08' },
  { month: 'Sep', equity: 102.9, drawdown: -0.7, statementId: 'ST-2026-09' },
  { month: 'Oct', equity: 104.2, drawdown: -1.2, statementId: 'ST-2026-10' },
  { month: 'Nov', equity: 105.6, drawdown: -0.5, statementId: 'ST-2026-11' },
];

export interface ManagedAccountAudit {
  id: string;
  phase: 'Starter Plan' | 'Growth Plan' | 'Pro Plan' | 'Private VIP Plan';
  marketGroup: 'Forex & Gold' | 'Synthetic Indices';
  title: string;
  horizon: string;
  instrumentFocus: string;
  demoReturn: string;
  maxDrawdown: string;
  custodyNote: string;
  summary: string;
  rulesApplied: string[];
  imageKey: 'deskHero' | 'heroFloor' | 'courseFoundations' | 'courseLiquidity' | 'mentorshipRoom' | 'signalsHub';
}

export const MANAGED_ACCOUNT_AUDITS: ManagedAccountAudit[] = [
  {
    id: 'audit-pro-fx-q3',
    phase: 'Growth Plan',
    marketGroup: 'Forex & Gold',
    title: 'Major Currencies & Gold Core Account',
    horizon: '90-Day Cycle · Sample Record',
    instrumentFocus: 'EUR/USD · GBP/USD · XAU/USD',
    demoReturn: '+6.8% Sample',
    maxDrawdown: '-1.9% Max Dip',
    custodyNote: 'Client-owned broker account · Zero withdrawal access',
    summary:
      'Calm London and New York trading capped at 0.5% risk per trade, moving safety stops to break-even once target 1 hits.',
    rulesApplied: [
      'Strict 0.5% risk limit on every single trade',
      'Smart cap on overlapping US Dollar trades',
      'Client avoided manual trades all 90 days',
    ],
    imageKey: 'heroFloor',
  },
  {
    id: 'audit-geant-synth-v75',
    phase: 'Pro Plan',
    marketGroup: 'Synthetic Indices',
    title: 'Volatility 75 & Boom 500 Controlled Account',
    horizon: '60-Day Cycle · Sample Record',
    instrumentFocus: 'Volatility 75 · Boom 500',
    demoReturn: '+8.4% Sample',
    maxDrawdown: '-2.4% Max Dip',
    custodyNote: 'Senior Lead Trader care · Monthly PDF report',
    summary:
      'Safe-sized 24/7 synthetic index trading with tight safety stops and step-by-step profit taking.',
    rulesApplied: [
      'Smaller trade sizes when price swings fast',
      'Eligible for $5,000+ 10% goodwill safety rule',
      '50/50 profit split calculated cleanly at month end',
    ],
    imageKey: 'signalsHub',
  },
  {
    id: 'audit-lite-fx-starter',
    phase: 'Starter Plan',
    marketGroup: 'Forex & Gold',
    title: 'Capital Protection & Steady FX Starter',
    horizon: '30-Day Cycle · Sample Record',
    instrumentFocus: 'EUR/USD · USD/JPY',
    demoReturn: '+3.1% Sample',
    maxDrawdown: '-1.1% Max Dip',
    custodyNote: '$900–$1,400 Starter range · Direct trader chat',
    summary:
      'Gentle starter plan focused on protecting principal with tight daily safety limits instead of rushing trades.',
    rulesApplied: [
      'Never more than 2 open trades at a time',
      'Automatic 2.0% weekly safety pause rule',
      'Client kept full broker withdrawal rights',
    ],
    imageKey: 'courseFoundations',
  },
  {
    id: 'audit-grande-multi',
    phase: 'Private VIP Plan',
    marketGroup: 'Forex & Gold',
    title: 'Executive Multi-Session FX & Gold Portfolio',
    horizon: 'Custom Cycle · Sample Record',
    instrumentFocus: 'XAU/USD · EUR/USD · GBP/JPY',
    demoReturn: '+7.6% Sample',
    maxDrawdown: '-1.5% Max Dip',
    custodyNote: 'Executive Director care · Custom schedule',
    summary:
      'Custom larger-account plan pairing clear economic trends with strict loss ceilings and weekly updates.',
    rulesApplied: [
      'Custom 3.5% hard maximum loss ceiling',
      'Weekly personal video and PDF progress report',
      'Zero manual interference in linked account',
    ],
    imageKey: 'mentorshipRoom',
  },
  {
    id: 'audit-pro-synth-crash',
    phase: 'Growth Plan',
    marketGroup: 'Synthetic Indices',
    title: 'V100 & Crash 1000 Steady Pullback Plan',
    horizon: '45-Day Review · Sample Record',
    instrumentFocus: 'Volatility 100 · Crash 1000',
    demoReturn: '+5.2% Sample',
    maxDrawdown: '-1.7% Max Dip',
    custodyNote: 'Assigned Account Trader · Live Dashboard',
    summary:
      'Clean pullback entries on synthetic indices while stepping aside before quiet, sideways market hours.',
    rulesApplied: [
      'Safety stop-loss placed on every single trade',
      'No overnight stacking on related synthetic pairs',
      'Live tracking dashboard updated continuously',
    ],
    imageKey: 'courseLiquidity',
  },
  {
    id: 'audit-geant-balanced',
    phase: 'Pro Plan',
    marketGroup: 'Forex & Gold',
    title: 'Multi-Day Gold & Currency Swing Plan',
    horizon: '90-Day Cycle · Sample Record',
    instrumentFocus: 'XAU/USD · EUR/USD',
    demoReturn: '+6.1% Sample',
    maxDrawdown: '-1.6% Max Dip',
    custodyNote: 'Senior Bullish Titan Lead · Scheduled payouts',
    summary:
      'Patient swing trades held across key weekly levels with strict pre-news spread filters.',
    rulesApplied: [
      '50/50 split only paid on brand-new profit highs',
      'No risky trades right before major bank news',
      'Clear PDF report sent at end of cycle',
    ],
    imageKey: 'deskHero',
  },
];

export interface PricingPlanColumn {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyMonthlyEquivalent: number;
  popular?: boolean;
  ctaLabel: string;
  features: Record<string, boolean | string>;
}

export const PRICING_FEATURE_ROWS = [
  { key: 'courses', label: 'All Trading Courses (86 Video Lessons)' },
  { key: 'playbooks', label: 'Printable Checklists & Safety Spreadsheets' },
  { key: 'signals', label: 'Daily FX, Gold & Synthetic Trade Signals' },
  { key: 'calculator', label: 'Easy Lot-Size & Risk Calculator' },
  { key: 'groupCalls', label: 'Weekly Live Group Chart Classes' },
  { key: 'oneOnOne', label: 'Private 1-on-1 Coaching Chart Reviews' },
  { key: 'investorBriefs', label: 'Quarterly Managed Account Check-Ins' },
];

export const PRICING_COLUMNS: PricingPlanColumn[] = [
  {
    id: 'training-pass',
    name: 'Courses Only',
    tagline: 'Learn step-by-step at your own pace',
    monthlyPrice: 99,
    yearlyMonthlyEquivalent: 79,
    ctaLabel: 'Start Courses',
    features: {
      courses: true,
      playbooks: true,
      signals: false,
      calculator: true,
      groupCalls: 'Monthly Q&A',
      oneOnOne: false,
      investorBriefs: false,
    },
  },
  {
    id: 'signals-desk',
    name: 'Daily Trade Signals',
    tagline: 'Ready-to-follow trade alerts daily',
    monthlyPrice: 149,
    yearlyMonthlyEquivalent: 104,
    ctaLabel: 'Get Trade Signals',
    features: {
      courses: false,
      playbooks: 'Signal Guides',
      signals: true,
      calculator: true,
      groupCalls: 'Weekly Review',
      oneOnOne: false,
      investorBriefs: false,
    },
  },
  {
    id: 'academy-signals-bundle',
    name: 'Courses + Signals Bundle',
    tagline: 'Learn the rules while seeing live alerts',
    monthlyPrice: 199,
    yearlyMonthlyEquivalent: 149,
    popular: true,
    ctaLabel: 'Choose Bundle',
    features: {
      courses: true,
      playbooks: true,
      signals: true,
      calculator: true,
      groupCalls: true,
      oneOnOne: false,
      investorBriefs: false,
    },
  },
  {
    id: 'mentorship-pro',
    name: '1-on-1 Coaching',
    tagline: '12-week personal mentor & weekly calls',
    monthlyPrice: 649,
    yearlyMonthlyEquivalent: 520,
    ctaLabel: 'Join 1-on-1 Coaching',
    features: {
      courses: true,
      playbooks: true,
      signals: true,
      calculator: true,
      groupCalls: true,
      oneOnOne: 'Weekly 45m',
      investorBriefs: false,
    },
  },
  {
    id: 'full-access',
    name: 'All-Access VIP',
    tagline: 'Everything in Bullish Titan unlocked',
    monthlyPrice: 890,
    yearlyMonthlyEquivalent: 695,
    ctaLabel: 'Go All-Access VIP',
    features: {
      courses: true,
      playbooks: true,
      signals: true,
      calculator: true,
      groupCalls: true,
      oneOnOne: '2x Weekly',
      investorBriefs: true,
    },
  },
];

export const EXTENDED_BLOG_POSTS = [
  {
    slug: 'liquidity-sweeps-explained',
    category: 'Market Basics',
    date: 'Nov 12, 2026',
    readTime: '6 min read',
    featured: true,
    title: 'Why Obvious Support Lines Break Right Before Big Market Moves',
    excerpt:
      'How stop orders stack up above clear highs and lows—and why waiting for a fake spike protects your trade.',
    sections: [
      {
        heading: 'Why Prices Spike Past Clear Lines',
        body: 'Most traders place their safety stops right above or below obvious tops and bottoms. When prices poke slightly past those lines, thousands of stops trigger at once—giving big buyers or sellers the fuel to push price in the real direction.',
      },
      {
        heading: 'Waiting for the Real Move',
        body: 'Instead of guessing the exact top or bottom, calm traders wait for the spike to finish and a strong candle to confirm the new direction. That one habit removes most premature losing trades.',
      },
    ],
  },
  {
    slug: 'position-sizing-drawdown-math',
    category: 'Money Safety',
    date: 'Nov 05, 2026',
    readTime: '5 min read',
    featured: false,
    title: 'Why Small Losses Are the Secret to Staying in the Game',
    excerpt:
      'How risking only 0.5% to 1.0% per trade lets you survive 10 bad trades in a row without stress.',
    sections: [
      {
        heading: 'The Math of Bouncing Back',
        body: 'A 10% account dip only takes an 11.1% gain to recover. A 50% dip takes a 100% gain just to break even. Keeping losses tiny on bad weeks matters far more than hitting one lucky home run.',
      },
      {
        heading: 'Pick Your Trade Size Before You Click',
        body: 'By calculating exact lot size from your stop-loss distance ahead of time, every single trade risks the exact same safe percentage of your account.',
      },
    ],
  },
  {
    slug: 'macro-fx-volatility-regimes',
    category: 'FX & Synthetics',
    date: 'Oct 28, 2026',
    readTime: '7 min read',
    featured: false,
    title: 'How Synthetic Indices (V75, Boom & Crash) Differ From Regular Forex',
    excerpt:
      'Understanding 24/7 algorithmic charts versus news-driven currencies—and how to size trades safely on both.',
    sections: [
      {
        heading: '24/7 Charts vs Bank News Hours',
        body: 'Major currencies react quickly to central bank news, US Dollar shifts, and London or New York hours. Synthetic indices run 24/7 on steady volatility formulas with no surprise economic announcements.',
      },
      {
        heading: 'Matching Stop Distance to Speed',
        body: 'Measuring each market’s average daily swing ensures your 0.5% to 1.0% safety budget stays just as safe on Volatility 75 as on EUR/USD.',
      },
    ],
  },
  {
    slug: 'journaling-100-sample-protocol',
    category: 'Trading Mindset',
    date: 'Oct 14, 2026',
    readTime: '6 min read',
    featured: false,
    title: 'The 100-Trade Practice Rule: Stop Switching Strategies',
    excerpt:
      'How testing one simple setup across 100 charts builds calm confidence you can trust.',
    sections: [
      {
        heading: 'Breaking the Two-Loss Quit Habit',
        body: 'Most beginners quit a good plan after two or three normal losses. Once you test 100 sample trades and see how winning and losing streaks naturally balance out, a normal loss never rattles you.',
      },
    ],
  },
];

export const GROUPED_FAQS = [
  {
    group: 'Trading Courses',
    items: [
      {
        q: 'How are the trading courses organized?',
        a: 'Lessons step gently from Beginner to Intermediate to Advanced, with printable checklists and live weekly Q&A classes.',
      },
      {
        q: 'Do I need expensive charting tools?',
        a: 'No. A free TradingView account and our simple risk spreadsheets are all you need for every lesson.',
      },
    ],
  },
  {
    group: '1-on-1 Coaching & Mentorship',
    items: [
      {
        q: 'How do 1-on-1 coaching calls work?',
        a: 'Private 45-minute video calls booked in your timezone where your coach checks your charts, trade journal, and habits.',
      },
      {
        q: 'How many hours a week do I need?',
        a: 'We suggest 5 to 8 hours per week for live classes, chart practice, and reviewing setups.',
      },
    ],
  },
  {
    group: 'Daily Trade Signals',
    items: [
      {
        q: 'Which markets do Daily Trade Signals cover?',
        a: 'Major Forex pairs (EUR/USD, GBP/USD, USD/JPY), Gold (XAU/USD), and Synthetic Indices (Volatility 75, V100, Boom 500, Crash 1000).',
      },
      {
        q: 'Do alerts always include a stop-loss?',
        a: 'Yes. Every alert shows the exact entry zone, hard safety stop-loss, three profit targets, and reward-to-risk ratio.',
      },
    ],
  },
  {
    group: 'Managed Accounts & Safety Rules',
    items: [
      {
        q: 'Are any profits guaranteed?',
        a: 'No. Every form of trading involves real risk of loss, and past or sample results never guarantee future profits.',
      },
    ],
  },
];

export const LEGAL_DOCUMENTS: Record<
  string,
  {
    title: string;
    updated: string;
    summary: string;
    sections: { id: string; title: string; body: string }[];
  }
> = {
  'risk-disclosure': {
    title: 'Risk Disclosure Statement',
    updated: 'November 2026',
    summary: 'Important risk notice regarding Forex, CFD, and Synthetic Indices trading.',
    sections: [
      {
        id: 'capital-at-risk',
        title: '1. Money at Risk',
        body: 'Trading foreign exchange, contracts for difference, and synthetic indices on margin carries high risk and may not suit everyone. You could lose part or all of your deposited money.',
      },
      {
        id: 'educational-only',
        title: '2. Strictly Educational Content',
        body: 'All courses, coaching sessions, trade alerts, and sample records published by Bullish Titan Academy are for educational and informational purposes only and are not personalized financial advice.',
      },
      {
        id: 'hypothetical-demo',
        title: '3. Sample & Demo Results Notice',
        body: 'Charts, signal cards, and reports labeled "Demo" or "Sample" are illustrative examples and do not represent live client account profits.',
      },
    ],
  },
  terms: {
    title: 'Terms of Service & Membership Rules',
    updated: 'November 2026',
    summary: 'Clear rules covering Bullish Titan Academy courses, coaching, trade signals, and tools.',
    sections: [
      {
        id: 'account-license',
        title: '1. Single-Person Membership',
        body: 'Each course and membership plan covers one person. Sharing login details or reselling trade alerts outside the member portal is not permitted.',
      },
      {
        id: 'billing-cycles',
        title: '2. Plans & Easy Cancellation',
        body: 'Recurring plans renew on your chosen weekly, monthly, or yearly schedule and can be cancelled anytime before renewal inside Account Settings.',
      },
      {
        id: 'compliance',
        title: '3. Age & Local Rules',
        body: 'Members must be at least 18 years old and follow the financial rules in their own country.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    updated: 'November 2026',
    summary: 'How Bullish Titan Academy collects and protects your personal information.',
    sections: [
      {
        id: 'data-collected',
        title: '1. Information We Collect',
        body: 'We collect your name, email address, chosen plan, and course progress solely to run your learning dashboard and support.',
      },
      {
        id: 'data-security',
        title: '2. Safe Payment Processing',
        body: 'Payments are handled by secure, certified payment processors (such as Stripe, Paystack, or Flutterwave). Bullish Titan Academy never stores your raw card numbers.',
      },
      {
        id: 'member-rights',
        title: '3. Your Data Rights',
        body: 'You can ask to view, export, or delete your account information anytime through our Help & Contact page.',
      },
    ],
  },
};

export const MILESTONES = [
  { year: '2019', title: 'First Trading Rulebooks', detail: 'Built simple price-chart and safety checklists for London and New York traders.' },
  { year: '2021', title: 'Online Academy Launch', detail: 'Opened our Beginner, Intermediate, and Advanced courses to students worldwide.' },
  { year: '2023', title: 'Forex & Synthetic Labs', detail: 'Added easy-to-follow sizing guides for Gold, Volatility 75, and Boom & Crash.' },
  { year: '2026', title: '64+ Countries Learning Together', detail: 'Over 14,800 students practicing calm, rule-based trading every week.' },
];
