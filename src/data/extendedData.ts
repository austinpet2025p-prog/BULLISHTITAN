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
    name: 'Agoge Mandate',
    rankTitle: 'Rank I · Foundation Rank — Entering the Phalanx',
    subtitleTag: 'Entry Mandate · $900 – $1,400 Equity',
    strategyType: 'Disciplined G10 Forex Liquidity Focus',
    riskLevel: 'Low',
    minEquityValue: 900,
    maxEquityValue: 1400,
    equityRange: '$900 – $1,400 (To be confirmed)',
    onboardingFee: '$55.00 / One Time Payment',
    duration: 'Monthly / Quarterly Review (To be confirmed)',
    withdrawalTerms: 'Full broker withdrawal control · Monthly window',
    managerTier: 'An Assigned Desk Strategist is deployed upon activation',
    drawdownGuardrail: 'Structured risk shield · returns not guaranteed',
    whoItIsFor: 'Disciplined entrants initiating capital stewardship and verified custody habits.',
    strategicPositioning: 'Builds foundational preservation discipline before scaling institutional exposure.',
    accessLevel: 'Command Console telemetry, direct Strategist comms, $900–$1,400 custody bracket',
    progressionMeaning: 'Establishes execution restraint and unbroken custody hygiene as your baseline rank.',
    ctaLabel: 'Initiate Agoge Mandate',
    summary:
      'Enter the stewardship ladder with $900 in equity up to $1,400—governed by Command Console telemetry, direct strategist comms, and strict drawdown shields.',
    highlights: [
      'Min Deposit: $900 in equity (To be confirmed)',
      'Max Deposit: Up to $1,400 for controlled capital formation',
      'Console: Real-time Command Console tracking equity & drawdown',
      'Strategist Comms: Direct desk messaging inside your portal',
    ],
  },
  {
    id: 'pro-phase',
    name: 'Vanguard Mandate',
    rankTitle: 'Rank II · Growth Rank — Active Frontline Scaling',
    subtitleTag: 'Most Selected · $1,500 – $5,000 Equity',
    strategyType: 'Balanced G10 FX + XAU/USD Core',
    riskLevel: 'Medium',
    minEquityValue: 1500,
    maxEquityValue: 5000,
    equityRange: '$1,500 – $5,000 (To be confirmed)',
    onboardingFee: '$100.00 / One Time Payment',
    duration: 'Quarterly Cycle (To be confirmed)',
    withdrawalTerms: 'Monthly / Quarterly notice (To be confirmed)',
    managerTier: 'An Assigned Desk Strategist is deployed upon activation',
    drawdownGuardrail: 'Multi-level drawdown shield & weekly desk audit',
    whoItIsFor: 'Committed principals scaling balanced G10 Forex and Gold allocation.',
    strategicPositioning: 'Advances from entry calibration into balanced multi-session risk cadence.',
    accessLevel: 'Expanded $1,500–$5,000 bracket, weekly risk audit, priority Strategist comms',
    progressionMeaning: 'Unlocks multi-session currency & Gold rotation with higher quarterly capacity.',
    ctaLabel: 'Advance to Vanguard',
    popular: true,
    summary:
      'Step forward with $1,500 to $5,000 in segregated equity under structured Vanguard oversight—complete with live telemetry, strategist comms, and written drawdown caps.',
    highlights: [
      'Min Deposit: $1,500 in equity (To be confirmed)',
      'Max Deposit: Up to $5,000 for balanced portfolio scaling',
      'Console: Real-time Command Console tracking equity & drawdown',
      'Strategist Comms: Priority desk messaging inside your portal',
    ],
  },
  {
    id: 'geant-phase',
    name: 'Strategos Mandate',
    rankTitle: 'Rank III · Commander Rank — Senior Desk Oversight',
    subtitleTag: 'Commander Tier · $6,000 – $9,000 Equity',
    strategyType: 'Cross-Asset FX & Capped Synthetic Volatility',
    riskLevel: 'Medium',
    minEquityValue: 6000,
    maxEquityValue: 9000,
    equityRange: '$6,000 – $9,000 (To be confirmed)',
    onboardingFee: '$300.00 / One Time Payment',
    duration: 'Quarterly / 6-Month Mandate (To be confirmed)',
    withdrawalTerms: 'Flexible scheduled liquidity windows',
    managerTier: 'Senior Bullish Titan Lead Strategist commands this rank',
    drawdownGuardrail: 'Enhanced drawdown shield & cross-asset correlation limits',
    whoItIsFor: 'Seasoned capital allocators operating cross-asset FX, Gold, and volatility-capped Synthetics.',
    strategicPositioning: 'Places capital directly under Senior Lead command with multi-asset correlation limits.',
    accessLevel: 'Senior Lead Strategist oversight, monthly PDF ledger, Clause 9 $5,000+ 10% buffer eligibility',
    progressionMeaning: 'Earns Senior Desk stewardship and eligibility under our $5,000+ Clause 9 goodwill framework.',
    ctaLabel: 'Claim Strategos Seat',
    summary:
      'Deploy $6,000 to $9,000 under Senior Bullish Titan Lead Strategist command—combining G10 Forex, Gold, and ATR-capped Synthetic Indices with monthly PDF ledgers.',
    highlights: [
      'Min Deposit: $6,000 in equity (To be confirmed)',
      'Max Deposit: Up to $9,000 under Senior Strategos command',
      'Ledger: Real-time telemetry & monthly audited PDF statements',
      'Buffer Rule: Qualifies for Clause 9 $5,000+ goodwill coverage',
    ],
  },
  {
    id: 'grande-phase',
    name: 'Sovereign Archon Mandate',
    rankTitle: 'Rank IV · Apex Rank — Executive Custody & Governance',
    subtitleTag: 'Apex Mandate · $10,000+ Equity',
    strategyType: 'Tailored Multi-Asset Portfolio Governance',
    riskLevel: 'High',
    minEquityValue: 10000,
    maxEquityValue: null,
    equityRange: '$10,000+ Custom Mandate (To be confirmed)',
    onboardingFee: 'Price: Contact Us',
    duration: 'Custom Horizon (To be confirmed)',
    withdrawalTerms: 'Bespoke custody & liquidity schedule',
    managerTier: 'Executive Bullish Titan Desk Director oversees this rank',
    drawdownGuardrail: 'Bespoke drawdown ceiling & instrument exclusions',
    whoItIsFor: 'High-conviction principals requiring bespoke drawdown ceilings and custom portfolio horizons.',
    strategicPositioning: 'Represents pinnacle mastery, sovereign governance, and maximum desk access.',
    accessLevel: 'Executive Desk Director oversight, tailored liquidity windows, Clause 9 buffer, full executive telemetry',
    progressionMeaning: 'Attains maximum organizational privilege, direct executive briefing, and tailored mandate parameters.',
    ctaLabel: 'Request Archon Briefing',
    isCustomQuote: true,
    summary:
      'Command $10,000+ in segregated equity for custom target structures, tailored drawdown ceilings, and direct Executive Desk governance.',
    highlights: [
      'Min Deposit: $10,000+ in equity (To be confirmed)',
      'Objective: Bespoke risk & horizon profile per mandate',
      'Ledger: Full executive telemetry & monthly reporting',
      'Command: Executive Desk Leadership directly oversees this rank',
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
    label: '1. Custody & Vetting',
    items: [
      {
        title: '1. Account Access & Sole Ownership',
        summary:
          'You grant trade-execution access strictly for market analysis and order placement. The brokerage account remains permanently in your legal name and under your sovereign ownership.',
        note: 'Clause 01 · Execution access only',
      },
      {
        title: '2. Capital Requirement & Zero Withdrawal Access',
        summary:
          'You fund your account with the stipulated equity for your selected rank. Capital stays inside your own regulated broker account—Bullish Titan Academy cannot withdraw funds.',
        note: 'Clause 02 · Client-owned custody',
      },
      {
        title: '8. Strict Confidentiality & KYC Vetting',
        summary:
          'All KYC credentials, custody records, and operational trading history exchanged between both parties remain strictly confidential and are never disclosed to unauthorized third parties.',
        note: 'Clause 08 · Verified KYC confidentiality',
      },
    ],
  },
  {
    id: 'governance',
    label: '2. Profit Share & Risk Shield',
    items: [
      {
        title: '3. 50% / 50% High-Watermark Profit Split',
        summary:
          'Profits realized once the cycle profit target is reached and/or surpassed are split 50% to you (the Principal) and 50% to Bullish Titan Academy. The House earns only when you earn.',
        note: 'Clause 03 · High-watermark target split',
      },
      {
        title: '5 & 6. Strategic Focus & Risk Disclosure',
        summary:
          'Execution relies strictly on disciplined Synthetic Indices and Forex analysis—never gambling—with zero unauthorized manual interference. Losses can occur and Bullish Titan Academy is not liable for market losses.',
        note: 'Clauses 05 & 06 · Capital at risk',
      },
      {
        title: '9. $5,000+ Goodwill Loss Coverage Policy',
        summary:
          'In the unlikely event of a complete account loss, mandates funded with starting equity above $5,000 qualify for a 10% initial-deposit goodwill gesture (not insurance). Accounts below $5,000 are excluded.',
        note: 'Clause 09 · Over $5,000 eligibility rule',
      },
    ],
  },
  {
    id: 'reporting',
    label: '3. Settlement & Exit',
    items: [
      {
        title: '4. Coordinated Profit Withdrawals',
        summary:
          'Because funds remain inside your own brokerage account, coordinated profit withdrawals are initiated upon request once the cycle profit target is reached and/or surpassed.',
        note: 'Clause 04 · Target settlement schedule',
      },
      {
        title: '7. Pre-Notice Termination Protocol',
        summary:
          'Either party may terminate the mandate agreement at any time with prior notice. Upon termination, all open positions are closed and any outstanding realized profits are settled.',
        note: 'Clause 07 · Clean exit settlement',
      },
      {
        title: 'Command Console & Monthly Audit Statements',
        summary:
          'Inspect open positions, live equity, drawdown shields, and monthly PDF audit statements anytime without placing conflicting manual orders inside the linked sub-account.',
        note: 'Real-time operational transparency',
      },
    ],
  },
];

export const INVESTMENT_ONBOARDING_STEPS = [
  {
    step: '01',
    title: 'Submit Vetting & Rank Selection',
    detail:
      'Complete your eligibility profile below, select your Mandate Rank, and schedule a brief KYC verification call with our Desk Admissions officers.',
  },
  {
    step: '02',
    title: 'Ratify Mandate Terms & Assign Strategist',
    detail:
      'Review the plain-language Mandate Agreement, lock your drawdown ceiling, confirm your strategist tier, and settle the one-time onboarding fee.',
  },
  {
    step: '03',
    title: 'Fund Segregated Custody & Monitor Live',
    detail:
      'Deposit equity inside your own regulated broker account (retaining sole withdrawal authority), link execution access, and monitor live Command Console ledgers.',
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
  phase: 'Agoge Mandate' | 'Vanguard Mandate' | 'Strategos Mandate' | 'Sovereign Archon Mandate';
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
    phase: 'Vanguard Mandate',
    marketGroup: 'Forex & Gold',
    title: 'G10 Liquidity & XAU/USD Core Mandate',
    horizon: '90-Day Quarterly Cycle · Demo Audit',
    instrumentFocus: 'EUR/USD · GBP/USD · XAU/USD',
    demoReturn: '+6.8% Illustrative',
    maxDrawdown: '-1.9% Max DD',
    custodyNote: 'Segregated client broker custody · Zero withdrawal access',
    summary:
      'Disciplined London and New York session execution capped at 0.5% risk per position with automated break-even scaling at TP1.',
    rulesApplied: [
      'Strict 0.5% per-trade fixed fractional sizing',
      'Weekly DXY correlation cap across USD pairs',
      'Client non-interference rule upheld all 90 days',
    ],
    imageKey: 'heroFloor',
  },
  {
    id: 'audit-geant-synth-v75',
    phase: 'Strategos Mandate',
    marketGroup: 'Synthetic Indices',
    title: 'Volatility 75 & Boom 500 Volatility-Capped Mandate',
    horizon: '60-Day Cycle · Demo Audit',
    instrumentFocus: 'Volatility 75 · Boom 500',
    demoReturn: '+8.4% Illustrative',
    maxDrawdown: '-2.4% Max DD',
    custodyNote: 'Senior Lead Strategos oversight · Monthly PDF ledger',
    summary:
      'ATR-calibrated lot sizing inside 24/7 synthetic volatility regimes, pairing tight structural invalidation with partial profit sweeps.',
    rulesApplied: [
      'ATR volatility throttle during expansion spikes',
      'Qualifying $5,000+ high-equity drawdown buffer active',
      'High-watermark settlement recorded at month end',
    ],
    imageKey: 'signalsHub',
  },
  {
    id: 'audit-lite-fx-starter',
    phase: 'Agoge Mandate',
    marketGroup: 'Forex & Gold',
    title: 'Foundation Capital Preservation & Slow-Drift FX',
    horizon: '30-Day Monthly Cycle · Demo Audit',
    instrumentFocus: 'EUR/USD · USD/JPY',
    demoReturn: '+3.1% Illustrative',
    maxDrawdown: '-1.1% Max DD',
    custodyNote: 'Agoge $900–$1,400 bracket · Direct strategist comms',
    summary:
      'Measured foundation mandate engineered for disciplined equity acclimatization, prioritizing tight daily drawdown shields over frequency.',
    rulesApplied: [
      'Maximum 2 concurrent open positions',
      'Hard 2.0% weekly drawdown pause circuit breaker',
      'Principal retained full broker withdrawal rights',
    ],
    imageKey: 'courseFoundations',
  },
  {
    id: 'audit-grande-multi',
    phase: 'Sovereign Archon Mandate',
    marketGroup: 'Forex & Gold',
    title: 'Executive Multi-Session FX & Gold Portfolio',
    horizon: 'Quarterly Bespoke Cycle · Demo Audit',
    instrumentFocus: 'XAU/USD · EUR/USD · GBP/JPY',
    demoReturn: '+7.6% Illustrative',
    maxDrawdown: '-1.5% Max DD',
    custodyNote: 'Executive Desk Director · Bespoke liquidity window',
    summary:
      'Tailored executive mandate combining macro rate-differential directional bias with strict asymmetric drawdown ceilings.',
    rulesApplied: [
      'Bespoke 3.5% hard mandate drawdown ceiling',
      'Executive weekly video & PDF risk attribution',
      'Zero manual interference across linked sub-account',
    ],
    imageKey: 'mentorshipRoom',
  },
  {
    id: 'audit-pro-synth-crash',
    phase: 'Vanguard Mandate',
    marketGroup: 'Synthetic Indices',
    title: 'V100 & Crash 1000 Mean-Reversion Framework',
    horizon: '45-Day Review · Demo Audit',
    instrumentFocus: 'Volatility 100 · Crash 1000',
    demoReturn: '+5.2% Illustrative',
    maxDrawdown: '-1.7% Max DD',
    custodyNote: 'Assigned Desk Strategist · Live Command Console',
    summary:
      'Structured synthetic index execution isolating clean impulse pullbacks while shutting down exposure ahead of range compression.',
    rulesApplied: [
      'Hard stop-loss enforced on every execution',
      'No overnight stacking on correlated synthetic feeds',
      'Real-time telemetry synced every 60 seconds',
    ],
    imageKey: 'courseLiquidity',
  },
  {
    id: 'audit-geant-balanced',
    phase: 'Strategos Mandate',
    marketGroup: 'Forex & Gold',
    title: 'Cross-Session Gold & FX Macro Swing',
    horizon: '90-Day Quarterly Cycle · Demo Audit',
    instrumentFocus: 'XAU/USD · EUR/USD',
    demoReturn: '+6.1% Illustrative',
    maxDrawdown: '-1.6% Max DD',
    custodyNote: 'Senior Bullish Titan Lead · Scheduled liquidity window',
    summary:
      'Patience-driven swing allocation holding institutional fair-value imbalances across weekly macro closes.',
    rulesApplied: [
      '50/50 high-watermark split strictly on new equity highs',
      'Pre-news spread filter prior to tier-1 rate releases',
      'Downloadable audit ledger issued at cycle close',
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
  { key: 'courses', label: 'The Forge Curriculum Vault (86 Lessons)' },
  { key: 'playbooks', label: 'Field Playbooks & Risk Shield Templates' },
  { key: 'signals', label: 'Vanguard FX, Gold & Synthetic Intelligence' },
  { key: 'calculator', label: 'Integrated Position-Size & Drawdown Tools' },
  { key: 'groupCalls', label: 'Weekly Phalanx War-Room Breakdowns' },
  { key: 'oneOnOne', label: 'Private 1-on-1 Strategos Chart Audits' },
  { key: 'investorBriefs', label: 'Quarterly Sovereign Mandate Briefings' },
];

export const PRICING_COLUMNS: PricingPlanColumn[] = [
  {
    id: 'training-pass',
    name: 'Forge Initiate',
    tagline: 'Self-paced structural formation',
    monthlyPrice: 99,
    yearlyMonthlyEquivalent: 79,
    ctaLabel: 'Enter The Forge',
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
    name: 'Vanguard Intelligence',
    tagline: 'Daily vetted desk setups',
    monthlyPrice: 149,
    yearlyMonthlyEquivalent: 104,
    ctaLabel: 'Unlock Vanguard Desk',
    features: {
      courses: false,
      playbooks: 'Briefing Guides',
      signals: true,
      calculator: true,
      groupCalls: 'Weekly Briefing',
      oneOnOne: false,
      investorBriefs: false,
    },
  },
  {
    id: 'academy-signals-bundle',
    name: 'Phalanx Dual Order',
    tagline: 'Master structure while executing live intel',
    monthlyPrice: 199,
    yearlyMonthlyEquivalent: 149,
    popular: true,
    ctaLabel: 'Claim Phalanx Rank',
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
    name: 'Strategos Desk',
    tagline: '12-week guided command accountability',
    monthlyPrice: 649,
    yearlyMonthlyEquivalent: 520,
    ctaLabel: 'Ascend to Strategos',
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
    name: 'Sovereign Titan Order',
    tagline: 'All 4 core divisions unified',
    monthlyPrice: 890,
    yearlyMonthlyEquivalent: 695,
    ctaLabel: 'Claim Sovereign Access',
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
    category: 'Market Structure',
    date: 'Nov 12, 2026',
    readTime: '6 min read',
    featured: true,
    title: 'Why Retail Support Lines Break Before Real Institutional Moves Begin',
    excerpt:
      'Understanding stop-cluster mechanics around obvious equal highs and lows—and how patience after a sweep protects your risk-to-reward ratio.',
    sections: [
      {
        heading: 'The Anatomy of Liquidity Clustering',
        body: 'Retail technical analysis teaches traders to place protective stop-losses just beyond obvious double tops or double bottoms. Because thousands of participants cluster orders in the exact same price zone, large liquidity providers frequently use those pools to fill institutional size.',
      },
      {
        heading: 'Waiting for Structural Displacement',
        body: 'Rather than predicting the exact wick tip, disciplined price-action traders wait for a decisive sweep followed by a sharp displacement candle breaking an internal swing structure. This single habit filters out a vast majority of premature counter-trend entries.',
      },
    ],
  },
  {
    slug: 'position-sizing-drawdown-math',
    category: 'Risk Management',
    date: 'Nov 05, 2026',
    readTime: '5 min read',
    featured: false,
    title: 'The Asymmetric Math of Drawdown Recovery in Forex and Synthetics',
    excerpt:
      'Why capping single-trade risk at 0.5% to 1.0% keeps variance survivable across 10-trade losing streaks.',
    sections: [
      {
        heading: 'Why Drawdown Recovery Is Non-Linear',
        body: 'A 10% drawdown requires an 11.1% gain just to reach break-even. A 50% drawdown demands a 100% return. Protecting principal during cold streaks is mathematically far more impactful than chasing high leverage on winning days.',
      },
      {
        heading: 'Fixed-Fractional Sizing Before Every Order',
        body: 'By computing exact standard, mini, or micro lots from your stop-loss distance prior to clicking buy or sell, every trade carries identical dollar variance regardless of volatility.',
      },
    ],
  },
  {
    slug: 'macro-fx-volatility-regimes',
    category: 'FX & Synthetics',
    date: 'Oct 28, 2026',
    readTime: '7 min read',
    featured: false,
    title: 'Understanding Volatility 75, Boom & Crash Mechanics Alongside FX Liquidity',
    excerpt:
      'How algorithmic synthetic volatility differs from news-driven Forex sessions—and how to adapt stop-loss sizing across both.',
    sections: [
      {
        heading: 'Session Liquidity vs Continuous Synthetic Volatility',
        body: 'G10 Forex pairs respond sharply to central bank rate differentials, US Dollar Index (DXY) levels, and London/New York session opens. Synthetic indices operate continuously 24/7 using uniform volatility distributions free from unexpected macro news spikes.',
      },
      {
        heading: 'Adapting ATR & Invalidation Widths',
        body: 'Mapping weekly DXY levels alongside each synthetic index’s Average True Range ensures your fixed 0.5%–1.0% risk budget scales accurately across both EUR/USD and Volatility 75.',
      },
    ],
  },
  {
    slug: 'journaling-100-sample-protocol',
    category: 'Trading Psychology',
    date: 'Oct 14, 2026',
    readTime: '6 min read',
    featured: false,
    title: 'The 100-Sample Playbook Protocol: Ending Strategy Hopping',
    excerpt:
      'How logging one setup across 100 historical and demo occurrences builds genuine statistical conviction.',
    sections: [
      {
        heading: 'Escaping the Two-Loss Abandonment Loop',
        body: 'Most developing traders abandon valid frameworks after three consecutive losses. Without a documented 100-trade sample showing normal losing-streak distributions, every variance dip feels like a broken strategy.',
      },
    ],
  },
];

export const GROUPED_FAQS = [
  {
    group: 'The Forge · Training Academy',
    items: [
      {
        q: 'How is The Forge curriculum structured?',
        a: 'Lessons advance across three earned ranks—Foundation Rank, Vanguard Tier, and Strategos Mastery—paired with field checklists and live weekly war-room Q&A sessions.',
      },
      {
        q: 'Do I need paid charting software?',
        a: 'No. A free TradingView account and our downloadable risk shield spreadsheets are sufficient for every module.',
      },
    ],
  },
  {
    group: 'Strategos Mentorship',
    items: [
      {
        q: 'How are 1-on-1 Strategos briefings conducted?',
        a: 'Private 45-minute video briefings scheduled in your timezone to audit your annotated charts, ledger metrics, and execution endurance.',
      },
      {
        q: 'What is the minimum weekly discipline commitment?',
        a: 'We recommend dedicating 5–8 hours per week across live war-room calls, forging labs, and pre-market preparation.',
      },
    ],
  },
  {
    group: 'Vanguard Intelligence',
    items: [
      {
        q: 'What markets does Vanguard Intelligence cover?',
        a: 'Major G10 Forex pairs (EUR/USD, GBP/USD, USD/JPY), Gold (XAU/USD), and Synthetic Indices (Volatility 75, V100, Boom 500, Crash 1000).',
      },
      {
        q: 'Are stop-loss shields always included?',
        a: 'Yes. Every desk dispatch specifies entry zone, hard stop-loss invalidation, TP1/TP2/TP3 targets, and risk-reward ratio.',
      },
    ],
  },
  {
    group: 'Sovereign Mandates & Governance',
    items: [
      {
        q: 'Are any investment returns guaranteed?',
        a: 'No. All trading and capital mandates carry risk of capital loss, and past or illustrative audits never guarantee future outcomes.',
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
    summary: 'Mandatory disclosure regarding leveraged Forex, CFD, and Synthetic Indices trading risks.',
    sections: [
      {
        id: 'capital-at-risk',
        title: '1. Capital at Risk',
        body: 'Trading foreign exchange, contracts for difference, and synthetic indices on margin carries a high level of risk and may not be suitable for all individuals. You could sustain a loss of some or all of your initial capital.',
      },
      {
        id: 'educational-only',
        title: '2. Strictly Educational Content',
        body: 'All Forge courses, Strategos briefings, Vanguard Intelligence breakdowns, and sample ledgers published by Bullish Titan Academy are provided strictly for educational and informational purposes. Nothing constitutes personalized investment advice.',
      },
      {
        id: 'hypothetical-demo',
        title: '3. Hypothetical & Demo Data Notice',
        body: 'Charts, briefing cards, and reporting metrics marked "Demo" or "Illustrative" are modeled records. Hypothetical performance has inherent limitations and does not reflect actual live trading execution.',
      },
    ],
  },
  terms: {
    title: 'Terms of Enrollment & Governance',
    updated: 'November 2026',
    summary: 'Terms governing access to Bullish Titan Academy ranks, mentorship councils, signals intelligence, and tools.',
    sections: [
      {
        id: 'account-license',
        title: '1. Single-Member Rank License',
        body: 'Memberships and rank enrollments grant a non-transferable, single-user license. Sharing login credentials or redistributing proprietary Vanguard Intelligence briefs is prohibited.',
      },
      {
        id: 'billing-cycles',
        title: '2. Subscriptions & Cancellations',
        body: 'Recurring ranks renew automatically per your selected weekly, monthly, or annual cycle unless cancelled prior to the next billing date inside Command Console Settings.',
      },
      {
        id: 'compliance',
        title: '3. Eligibility & Conduct',
        body: 'Fellows must be at least 18 years old and comply with all applicable local financial regulations in their jurisdiction.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    updated: 'November 2026',
    summary: 'How Bullish Titan Academy collects, stores, and safeguards member information.',
    sections: [
      {
        id: 'data-collected',
        title: '1. Information Collected',
        body: 'We collect account registration details (name, email), rank preferences, and lesson completion progress strictly to deliver educational and command portal services.',
      },
      {
        id: 'data-security',
        title: '2. Payment & Credential Security',
        body: 'Payment processing is delegated to PCI-compliant processors (e.g., Stripe, Paystack, Flutterwave). Bullish Titan Academy never stores raw card numbers on its servers.',
      },
      {
        id: 'member-rights',
        title: '3. Access & Deletion Requests',
        body: 'You may request export or deletion of your personal account records at any time through the Admissions & Desk Support channel.',
      },
    ],
  },
};

export const MILESTONES = [
  { year: '2019', title: 'Founding Desk Protocols', detail: 'Internal liquidity & risk shield checklists forged for London/NY FX strategists.' },
  { year: '2021', title: 'The Forge Academy Launch', detail: 'Three-rank curriculum from Foundation Formation to Strategos Mastery released globally.' },
  { year: '2023', title: 'FX & Synthetic Indices Lab', detail: 'Expanded volatility-adjusted education across Volatility 75, Boom/Crash, and Gold.' },
  { year: '2026', title: '64+ Countries in Formation', detail: '14,800+ enrolled fellows practicing disciplined capital governance.' },
];
