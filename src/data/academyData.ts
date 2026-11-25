import nigerianStrategistImg from '../assets/images/mentor_nigerian_strategist_1795612622463.jpg';
import davidOkaforImg from '../assets/images/mentor_david_okafor_1794780446216.jpg';
import academyDeskImg from '../assets/images/academy_trading_desk_1794780446372.jpg';
import heroFloorImg from '../assets/images/hero_trading_floor_1794784711615.jpg';
import courseFoundationsImg from '../assets/images/course_foundations_desk_1794784712124.jpg';
import courseLiquidityImg from '../assets/images/course_liquidity_terminal_1794784712022.jpg';
import mentorshipRoomImg from '../assets/images/mentorship_war_room_1794784714120.jpg';
import signalsHubImg from '../assets/images/signals_intelligence_hub_1794784713053.jpg';

export const ACADEMY_ASSETS = {
  deskHero: academyDeskImg,
  heroFloor: heroFloorImg,
  courseFoundations: courseFoundationsImg,
  courseLiquidity: courseLiquidityImg,
  mentorshipRoom: mentorshipRoomImg,
  signalsHub: signalsHubImg,
};

export interface TickerItem {
  symbol: string;
  price: string;
  change: string;
  isUp: boolean;
}

export const DEMO_TICKER_ITEMS: TickerItem[] = [
  { symbol: 'EUR/USD', price: '1.0842', change: '+0.34%', isUp: true },
  { symbol: 'GBP/USD', price: '1.2695', change: '+0.21%', isUp: true },
  { symbol: 'XAU/USD', price: '2,648.40', change: '+0.78%', isUp: true },
  { symbol: 'USD/JPY', price: '153.82', change: '-0.19%', isUp: false },
  { symbol: 'V75 Index', price: '214,850.00', change: '+1.85%', isUp: true },
  { symbol: 'V100 Index', price: '1,942.60', change: '+1.12%', isUp: true },
  { symbol: 'Boom 500', price: '3,812.40', change: '+0.94%', isUp: true },
  { symbol: 'Crash 1000', price: '6,125.15', change: '-0.68%', isUp: false },
];

export interface ProgramPillar {
  id: 'training' | 'mentorship' | 'signals' | 'investment';
  title: string;
  kicker: string;
  benefit: string;
  description: string;
  href: string;
  metricLabel: string;
}

export const CORE_PROGRAMS: ProgramPillar[] = [
  {
    id: 'training',
    title: 'The Forge · Training Academy',
    kicker: '01. Foundational Formation',
    benefit: 'Forge market structure literacy, liquidity discipline, and repeatable execution protocols from the ground up.',
    description:
      'Three progressive ranks spanning Foundation Formation, Vanguard Execution, and Strategos Institutional Frameworks.',
    href: '/training',
    metricLabel: '3 Ranks · 86 Lessons',
  },
  {
    id: 'mentorship',
    title: 'Strategos Mentorship',
    kicker: '02. Guided Mastery',
    benefit: 'Operate alongside senior desk commanders through weekly chart audits and live execution accountability.',
    description:
      '12-week disciplined progression featuring Phalanx workshops, 1-on-1 Strategos reviews, and behavioral resilience.',
    href: '/mentorship',
    metricLabel: '12 Weeks · Desk Audits',
  },
  {
    id: 'signals',
    title: 'Vanguard Intelligence',
    kicker: '03. Live Desk Intelligence',
    benefit: 'Receive battle-tested Forex and Synthetic Indices setups with exact invalidation thresholds and R:R targets.',
    description:
      'Tactical market setups dispatched across Telegram, WhatsApp, email, and the Command Console with position-sizing telemetry.',
    href: '/signals',
    metricLabel: 'FX & Synthetics · Risk-First',
  },
  {
    id: 'investment',
    title: 'Sovereign Mandates',
    kicker: '04. Capital Stewardship',
    benefit: 'Deploy disciplined Forex & Synthetic Indices mandates built around strict drawdown shields and governance.',
    description:
      'Tiered Agoge-to-Archon stewardship ranks pairing macro FX cycles and volatility-capped synthetics under senior oversight.',
    href: '/investment',
    metricLabel: '4 Stewardship Ranks · Governed',
  },
];

export interface CourseItem {
  id: string;
  title: string;
  level: 'Foundation Rank' | 'Vanguard Tier' | 'Strategos Mastery';
  duration: string;
  lessons: number;
  price: number;
  marketFocus: string;
  image: string;
  summary: string;
  outcomes: string[];
  modules: {
    title: string;
    lessons: { title: string; duration: string }[];
  }[];
}

export const COURSES: CourseItem[] = [
  {
    id: 'foundations-fx-synthetics',
    title: 'Market Mechanics & Risk Formation',
    level: 'Foundation Rank',
    duration: '6 Weeks',
    lessons: 24,
    price: 390,
    marketFocus: 'Forex & Synthetic Indices',
    image: courseFoundationsImg,
    summary:
      'Forge clean chart literacy, session & 24/7 synthetic liquidity timing, order-type execution, and strict per-trade risk math.',
    outcomes: [
      'Read multi-timeframe market structure cleanly',
      'Calculate exact lot sizes before every entry',
      'Build a repeatable pre-session checklist',
    ],
    modules: [
      {
        title: 'Module 01 · Market Architecture & Sessions',
        lessons: [
          { title: 'How FX & Synthetic Liquidity Pools Form', duration: '18 min' },
          { title: 'London, New York & 24/7 Synthetic Sessions', duration: '22 min' },
          { title: 'Spread, Slippage & Order Execution Mechanics', duration: '16 min' },
        ],
      },
      {
        title: 'Module 02 · Trend Structure & Key Levels',
        lessons: [
          { title: 'Swing Highs, Lows & Break of Structure', duration: '24 min' },
          { title: 'Supply, Demand & Fair Value Imbalances', duration: '28 min' },
          { title: 'Multi-Timeframe Top-Down Alignment', duration: '26 min' },
        ],
      },
      {
        title: 'Module 03 · Quantitative Risk Foundations',
        lessons: [
          { title: 'Fixed-Fractional Risk & Drawdown Math', duration: '21 min' },
          { title: 'Position Sizing Across FX & Volatility Indices', duration: '19 min' },
          { title: 'Building Your First Trading Journal', duration: '20 min' },
        ],
      },
    ],
  },
  {
    id: 'liquidity-execution-system',
    title: 'Vanguard Liquidity & Precision Execution',
    level: 'Vanguard Tier',
    duration: '8 Weeks',
    lessons: 32,
    price: 690,
    marketFocus: 'FX Majors, Gold & Volatility 75',
    image: courseLiquidityImg,
    summary:
      'Bridge technical structure with session killzones, synthetic volatility sweeps, invalidation shields, and partial profit scaling.',
    outcomes: [
      'Identify high-probability sweep & displacement setups',
      'Execute 1:2.5+ asymmetric R:R trade plans',
      'Eliminate impulsive mid-range entries',
    ],
    modules: [
      {
        title: 'Module 01 · Liquidity Engineering & Sweeps',
        lessons: [
          { title: 'Equal Highs/Lows & Stop-Run Anatomy', duration: '27 min' },
          { title: 'Displacement Candles & Imbalance Validation', duration: '23 min' },
          { title: 'Asian Range Breakout & Boom/Crash Spike Timing', duration: '29 min' },
        ],
      },
      {
        title: 'Module 02 · Execution & Trade Management',
        lessons: [
          { title: 'Limit vs Market Confirmation Entries', duration: '25 min' },
          { title: 'Trailing Stop Logic & Scaling Partials', duration: '22 min' },
          { title: 'Managing Correlated FX & Synthetic Exposure', duration: '24 min' },
        ],
      },
      {
        title: 'Module 03 · Statistical Backtesting Lab',
        lessons: [
          { title: '100-Sample Playbook Verification Protocol', duration: '34 min' },
          { title: 'Expectancy, Profit Factor & Variance Analysis', duration: '26 min' },
        ],
      },
    ],
  },
  {
    id: 'macro-systematic-desk',
    title: 'Strategos Macro & Systematic Command',
    level: 'Strategos Mastery',
    duration: '10 Weeks',
    lessons: 30,
    price: 1190,
    marketFocus: 'Cross-Asset FX & Synthetic Indices',
    image: signalsHubImg,
    summary:
      'Unify central bank rate expectations, DXY & bond yield intermarket flows, synthetic volatility regimes, and multi-account governance.',
    outcomes: [
      'Align technical setups with macro rate & liquidity cycles',
      'Adapt risk sizing across high and low volatility regimes',
      'Manage multi-strategy portfolios under strict drawdown caps',
    ],
    modules: [
      {
        title: 'Module 01 · Macro Drivers & Volatility Flows',
        lessons: [
          { title: 'Central Bank Policy, CPI & Yield Spreads', duration: '31 min' },
          { title: 'DXY, US10Y & Synthetic Volatility Regimes', duration: '28 min' },
          { title: 'Risk-On vs Risk-Off Regime Classification', duration: '25 min' },
        ],
      },
      {
        title: 'Module 02 · Strategos Portfolio Risk & Scaling',
        lessons: [
          { title: 'Volatility-Adjusted Sizing (ATR Models)', duration: '29 min' },
          { title: 'Drawdown Recovery Curves & Heat Limits', duration: '24 min' },
          { title: 'Designing Rule-Based Execution Checklists', duration: '27 min' },
        ],
      },
    ],
  },
];

export interface MentorProfile {
  id: string;
  name: string;
  role: string;
  specialty: string;
  experience: string;
  markets: string;
  image: string;
  bio: string;
  focusAreas: string[];
}

export const MENTORS: MentorProfile[] = [
  {
    id: 'marcus-vance',
    name: 'Mr Odinaka',
    role: 'Archon · FX & Macro Strategy',
    specialty: 'G10 Forex & Macro Liquidity',
    experience: '11 Years Desk Command',
    markets: 'EUR/USD · GBP/USD · XAU/USD',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-25_at_1.52.55_PM_32d4934f.jpeg',
    bio: 'Former London institutional FX execution strategist specializing in central bank rate differentials and London-NY session liquidity transitions.',
    focusAreas: ['Macro Rate Cycles', 'Session Liquidity', 'Execution Discipline'],
  },
  {
    id: 'elena-rostova',
    name: 'Chinedu Balogun',
    role: 'Lead Strategos · Synthetic Volatility',
    specialty: 'Algorithmic Volatility & Spike Structure',
    experience: '8 Years Market Command',
    markets: 'V75 · V100 · Boom 500 · Crash 1000',
    image: nigerianStrategistImg,
    bio: 'Quantitative strategist focused on synthetic volatility regimes, Boom/Crash spike mechanics, and systematic drawdown shields.',
    focusAreas: ['Synthetic Price Action', 'Volatility Regimes', 'Backtest Auditing'],
  },
  {
    id: 'david-okafor',
    name: 'David Okafor',
    role: 'Commander · Risk & Portfolio Governance',
    specialty: 'Risk Architecture & Capital Scaling',
    experience: '10 Years Institutional Risk',
    markets: 'FX Majors · Gold · Synthetic Indices',
    image: davidOkaforImg,
    bio: 'Dedicated to operational endurance, expectancy modeling, and strict capital preservation frameworks for committed desk fellows.',
    focusAreas: ['Position Sizing', 'Drawdown Shields', 'Behavioral Endurance'],
  },
];

export interface DemoSignal {
  id: string;
  pair: string;
  market: 'Forex' | 'Synthetic Indices' | 'Commodities';
  direction: 'BUY' | 'SELL';
  entry: string;
  stopLoss: string;
  tp1: string;
  tp2: string;
  tp3: string;
  rr: string;
  status: 'Active' | 'TP1 Reached' | 'Closed' | 'Pending';
  timestamp: string;
  rationale: string;
}

export const DEMO_SIGNALS: DemoSignal[] = [
  {
    id: 'sig-1',
    pair: 'EUR/USD',
    market: 'Forex',
    direction: 'BUY',
    entry: '1.0815',
    stopLoss: '1.0785',
    tp1: '1.0860',
    tp2: '1.0905',
    tp3: '1.0950',
    rr: '1 : 3.0',
    status: 'TP1 Reached',
    timestamp: 'Demo · London Session',
    rationale: 'Previous day low liquidity sweep followed by M15 bullish displacement and FVG retest.',
  },
  {
    id: 'sig-2',
    pair: 'V75 Index',
    market: 'Synthetic Indices',
    direction: 'BUY',
    entry: '214,850',
    stopLoss: '211,400',
    tp1: '220,000',
    tp2: '225,500',
    tp3: '231,000',
    rr: '1 : 3.0',
    status: 'Active',
    timestamp: 'Demo · 24/7 Synthetic Desk',
    rationale: 'H4 structural higher low holding above institutional demand shelf after liquidity sweep.',
  },
  {
    id: 'sig-3',
    pair: 'XAU/USD',
    market: 'Commodities',
    direction: 'SELL',
    entry: '2,658.00',
    stopLoss: '2,669.00',
    tp1: '2,641.50',
    tp2: '2,625.00',
    tp3: '2,608.00',
    rr: '1 : 3.0',
    status: 'Pending',
    timestamp: 'Demo · Pre-NY Alert',
    rationale: 'Await sweep of Asian high into H1 bearish order block before limit entry trigger.',
  },
  {
    id: 'sig-4',
    pair: 'GBP/USD',
    market: 'Forex',
    direction: 'SELL',
    entry: '1.2735',
    stopLoss: '1.2770',
    tp1: '1.2680',
    tp2: '1.2630',
    tp3: '1.2580',
    rr: '1 : 2.9',
    status: 'Closed',
    timestamp: 'Demo · Archived Example',
    rationale: 'Weekly resistance rejection aligned with DXY bounce off structural demand.',
  },
];

export const DEMO_EQUITY_CURVE = {
  '30D': [
    { label: 'Wk 1', demoIndex: 100.0, benchmark: 100.0 },
    { label: 'Wk 2', demoIndex: 101.8, benchmark: 100.4 },
    { label: 'Wk 3', demoIndex: 101.2, benchmark: 99.8 },
    { label: 'Wk 4', demoIndex: 103.6, benchmark: 101.1 },
  ],
  '90D': [
    { label: 'Month 1', demoIndex: 100.0, benchmark: 100.0 },
    { label: 'Month 1 Mid', demoIndex: 102.4, benchmark: 100.9 },
    { label: 'Month 2', demoIndex: 101.9, benchmark: 100.2 },
    { label: 'Month 2 Mid', demoIndex: 105.1, benchmark: 101.6 },
    { label: 'Month 3', demoIndex: 106.8, benchmark: 102.4 },
    { label: 'Month 3 End', demoIndex: 108.4, benchmark: 102.9 },
  ],
  '1Y': [
    { label: 'Q1 Start', demoIndex: 100.0, benchmark: 100.0 },
    { label: 'Q1 End', demoIndex: 104.2, benchmark: 101.8 },
    { label: 'Q2 Start', demoIndex: 103.5, benchmark: 100.9 },
    { label: 'Q2 End', demoIndex: 108.9, benchmark: 103.4 },
    { label: 'Q3 Start', demoIndex: 111.2, benchmark: 104.1 },
    { label: 'Q3 End', demoIndex: 110.4, benchmark: 103.6 },
    { label: 'Q4 Start', demoIndex: 114.8, benchmark: 105.9 },
    { label: 'Q4 End', demoIndex: 118.2, benchmark: 106.8 },
  ],
};

export interface MentorshipTier {
  id: string;
  name: string;
  monthlyPrice: number;
  summary: string;
  featured?: boolean;
  features: string[];
}

export const MENTORSHIP_TIERS: MentorshipTier[] = [
  {
    id: 'group-mentorship',
    name: 'Phalanx Cohort',
    monthlyPrice: 249,
    summary: 'Structured cohort formations with live chart markups and collective execution discipline.',
    features: [
      '2 live London/NY war-room breakdown calls weekly',
      'Shared Phalanx execution ledger feedback',
      'Full access to The Forge curriculum library',
      'Private analyst command channels',
    ],
  },
  {
    id: 'one-on-one',
    name: 'Private Strategos Desk',
    monthlyPrice: 649,
    summary: 'Dedicated senior Strategos auditing your exact entries, sizing, and behavioral habits.',
    featured: true,
    features: [
      'Weekly 45-minute 1-on-1 Strategos command sessions',
      'Line-by-line audit of your operational trade ledger',
      'Custom execution protocol & risk rules for your schedule',
      'All Phalanx workshops + Vanguard Intelligence included',
    ],
  },
  {
    id: 'vip-elite',
    name: 'Archon Inner Council',
    monthlyPrice: 1290,
    summary: 'Direct executive desk counsel, priority briefing cadence, and cross-asset allocation reviews.',
    features: [
      'Twice-weekly private 1-on-1 strategy & audit briefings',
      'Direct strategist counsel channel during active sessions',
      'Multi-asset FX & Synthetic Indices stewardship reviews',
      'All Forge, Intelligence, and Mandate briefings included',
    ],
  },
];

export const TWELVE_WEEK_ROADMAP = [
  {
    phase: 'Weeks 01–03',
    title: 'Phase I · Formation & Risk Shield',
    detail: 'Audit prior habits, standardize chart templates, lock fixed-fractional risk shields, and build your pre-market routine.',
  },
  {
    phase: 'Weeks 04–06',
    title: 'Phase II · Playbook & Forging Lab',
    detail: 'Isolate 1–2 high-conviction setups across London or NY sessions and verify 50+ backtest samples under Strategos review.',
  },
  {
    phase: 'Weeks 07–09',
    title: 'Phase III · Vanguard Forward Drills',
    detail: 'Execute live market cadence in a controlled simulated environment, enforcing invalidation discipline without mid-range drift.',
  },
  {
    phase: 'Weeks 10–12',
    title: 'Phase IV · Sovereign Scaling Protocol',
    detail: 'Advance into disciplined live capital execution with weekly expectancy audits, drawdown ceilings, and independent command.',
  },
];

export interface TestimonialTemplate {
  id: string;
  initials: string;
  name: string;
  location: string;
  focusAsset: string;
  marketCategory: 'Forex & Gold' | 'Synthetic Indices';
  role: string;
  program: string;
  metricValue: string;
  metricLabel: string;
  timeframe: string;
  riskCap: string;
  sampleSize: string;
  consistencyDelta: string;
  quote: string;
  outcomeNote: string;
}

export const TESTIMONIAL_TEMPLATES: TestimonialTemplate[] = [
  {
    id: 't1',
    initials: 'DK',
    name: 'Daniel K. Mensah',
    location: 'London · FX Cohort',
    focusAsset: 'EUR/USD & GBP/USD',
    marketCategory: 'Forex & Gold',
    role: 'Vanguard Rank Fellow',
    program: 'The Forge · Vanguard Tier',
    metricValue: '1 : 2.8',
    metricLabel: 'Avg R:R Realized',
    timeframe: '6 Months Tracked',
    riskCap: '0.8% / Trade',
    sampleSize: '142 Logged Trades',
    consistencyDelta: '-64% Impulse Entries',
    quote:
      'Mapping London open liquidity sweeps and enforcing a hard 1% invalidation shield eliminated my mid-session overtrading and brought steady consistency across quarterly logs.',
    outcomeNote: '0.8% Avg Risk / Trade · Verified Ledger',
  },
  {
    id: 't2',
    initials: 'TA',
    name: 'Tunde Adeyemi',
    location: 'Lagos · Synthetic Desk',
    focusAsset: 'V75 & V100 Index',
    marketCategory: 'Synthetic Indices',
    role: 'Synthetic Volatility Fellow',
    program: 'Private Strategos Desk · 12-Week Cohort',
    metricValue: '≤ 2.4%',
    metricLabel: 'Max Weekly Drawdown',
    timeframe: '12-Week Cohort',
    riskCap: '0.5% / Setup',
    sampleSize: '88 Audited Setups',
    consistencyDelta: '0 Revenge Trades',
    quote:
      'Weekly 1-on-1 chart audits with my senior Strategos broke my habit of chasing Volatility 75 spikes. My position sizing stayed uniform even through chop weeks.',
    outcomeNote: 'Zero Revenge Entries · Weekly Desk Audit',
  },
  {
    id: 't3',
    initials: 'NR',
    name: 'Nadia Al-Rashid',
    location: 'Dubai · Cross-Asset Desk',
    focusAsset: 'XAU/USD & Boom 500',
    marketCategory: 'Forex & Gold',
    role: 'Senior Capital Analyst',
    program: 'Vanguard Intelligence & Risk',
    metricValue: '+18.6%',
    metricLabel: 'Demo Capital Index',
    timeframe: '90-Day Audit',
    riskCap: '1.0% Max Shield',
    sampleSize: '64 NY/LDN Setups',
    consistencyDelta: '94% Protocol Adherence',
    quote:
      'Operating a demanding schedule meant missing New York breakouts. Receiving vetted setups with exact invalidation levels and lot-size context transformed how I command Gold exposure.',
    outcomeNote: 'Pre-Sized Setups · Consistent R-Multiple Ledger',
  },
  {
    id: 't4',
    initials: 'SM',
    name: 'Sibusiso Mokoena',
    location: 'Johannesburg · Council Alumni',
    focusAsset: 'Crash 1000 & Boom 1000',
    marketCategory: 'Synthetic Indices',
    role: 'Archon Desk Graduate',
    program: 'Archon Inner Council · Synthetic Volatility',
    metricValue: '68%',
    metricLabel: 'Rule-Aligned Win Rate',
    timeframe: '4 Months Live',
    riskCap: '0.75% / Position',
    sampleSize: '115 Spike Cycles',
    consistencyDelta: '+1 : 2.4 Median R:R',
    quote:
      'Mastering algorithmic spike cycles instead of guessing reversals turned 24/7 synthetic indices from chaotic noise into a calm, rule-bound execution ritual.',
    outcomeNote: 'Strict Pre-Session Filter · 1% Capital Shield',
  },
  {
    id: 't5',
    initials: 'EC',
    name: 'Elena Chen',
    location: 'New York · Systematic Cohort',
    focusAsset: 'USD/JPY & DXY Macro',
    marketCategory: 'Forex & Gold',
    role: 'Quantitative Operations Lead',
    program: 'The Forge · Strategos Mastery',
    metricValue: '100+',
    metricLabel: 'Audited Backtest Trades',
    timeframe: '16-Week Review',
    riskCap: '0.6% Fixed Unit',
    sampleSize: '124 Backtest Samples',
    consistencyDelta: '1 : 2.6 Median Setup',
    quote:
      'Completing a 100-sample backtest inside the Bullish Titan Forge gave me objective expectancy numbers before scaling into New York session liquidity setups.',
    outcomeNote: '1 : 2.6 Median Setup · Zero Protocol Drift',
  },
  {
    id: 't6',
    initials: 'MP',
    name: 'Marcus Patel',
    location: 'Toronto · Mandate Governance',
    focusAsset: 'G10 FX & Volatility Indices',
    marketCategory: 'Synthetic Indices',
    role: 'Private Mandate Principal',
    program: 'Sovereign Mandates & Governance',
    metricValue: '0.5%',
    metricLabel: 'Volatility-Adjusted Unit',
    timeframe: '2 Quarters Tracked',
    riskCap: '0.5% ATR Cap',
    sampleSize: '190 Portfolio Trades',
    consistencyDelta: '≤ 3.1% Quarter DD',
    quote:
      'Shifting from discretionary gut entries to quarterly volatility-adjusted sizing stabilized drawdowns across both G10 currencies and synthetic indices.',
    outcomeNote: 'Multi-Quarter Governance · Fixed Drawdown Ceiling',
  },
];

export interface HomeFaqItem {
  id: string;
  category: 'The Forge Training' | 'Strategos Mentorship' | 'Vanguard Signals' | 'Capital Mandates';
  question: string;
  answer: string;
}

export const HOME_FAQS: HomeFaqItem[] = [
  {
    id: 'faq-experience',
    category: 'The Forge Training',
    question: 'Do I need prior market experience before entering Bullish Titan?',
    answer:
      'No. Our Foundation Rank inside The Forge begins with core chart literacy, order execution, and risk math before advancing to Vanguard and Strategos liquidity structure.',
  },
  {
    id: 'faq-returns',
    category: 'Capital Mandates',
    question: 'Are returns or profits ever guaranteed in Intelligence or Sovereign Mandates?',
    answer:
      'Never. Trading Forex and synthetic indices carries substantial risk of capital loss. Our House enforces probability-based execution, strict drawdown shields, and capital preservation rather than unrealistic promises.',
  },
  {
    id: 'faq-signals-vs-mentorship',
    category: 'Strategos Mentorship',
    question: 'How does Vanguard Intelligence differ from Strategos Mentorship?',
    answer:
      'Vanguard Intelligence dispatches live tactical setup briefings with entry, stop-loss, take-profit tiers, and structural rationale. Strategos Mentorship pairs you directly with a senior desk commander over 12 weeks to build independent execution mastery.',
  },
  {
    id: 'faq-synthetics',
    category: 'Vanguard Signals',
    question: 'How do you govern risk across 24/7 Synthetic Indices like Volatility 75 and Boom 500?',
    answer:
      'Every synthetic index brief calibrates lot size to Average True Range (ATR) and enforces a strict 0.5% to 1.0% per-position invalidation shield prior to order placement.',
  },
  {
    id: 'faq-custody',
    category: 'Capital Mandates',
    question: 'Who holds custody and withdrawal authority inside Sovereign Mandates?',
    answer:
      'You retain 100% legal ownership and sole withdrawal authority inside your own regulated broker account. Bullish Titan receives execution-only analysis access with coordinated 50/50 profit sharing upon reaching cycle targets.',
  },
  {
    id: 'faq-switching',
    category: 'The Forge Training',
    question: 'Can I ascend across ranks and programs as my discipline grows?',
    answer:
      'Yes. Initiates regularly start in The Forge Foundation Rank, layer on Vanguard Intelligence for live market alignment, and ascend into Phalanx or Private Strategos Mentorship when ready for personalized audits.',
  },
];

export const BLOG_POSTS = [
  {
    id: 'liquidity-sweeps-explained',
    category: 'Market Structure',
    date: 'Nov 2026',
    readTime: '6 min read',
    title: 'Why Retail Support Lines Break Before Real Institutional Moves Begin',
    excerpt:
      'Understanding stop-cluster mechanics around obvious equal highs and lows—and how patience after a sweep protects your risk-to-reward ratio.',
    body: 'Institutional liquidity requires counterparties. When price consolidates below an obvious equal high, stop-buy orders from breakout traders and stop-losses from early short sellers cluster tightly above the range. Waiting for the sweep and subsequent structural displacement prevents entering into liquidity traps.',
  },
  {
    id: 'position-sizing-drawdown-math',
    category: 'Risk Management',
    date: 'Nov 2026',
    readTime: '5 min read',
    title: 'The Asymmetric Math of Drawdown Recovery in Forex and Synthetics',
    excerpt:
      'Why capping single-trade risk at 0.5% to 1.0% keeps variance survivable across 10-trade losing streaks.',
    body: 'A 10% account drawdown requires an 11.1% gain to recover. A 50% drawdown requires a 100% gain. Position sizing is not an optional post-script to a strategy—it is the primary mechanism that keeps your edge intact long enough for statistical expectancy to play out.',
  },
  {
    id: 'macro-fx-volatility-regimes',
    category: 'FX & Synthetics',
    date: 'Oct 2026',
    readTime: '7 min read',
    title: 'Understanding Volatility 75, Boom & Crash Mechanics Alongside FX Liquidity',
    excerpt:
      'How algorithmic synthetic volatility differs from news-driven Forex sessions—and how to adapt stop-loss sizing across both.',
    body: 'Synthetic indices simulate continuous volatility 24/7 without central bank news shocks, whereas G10 Forex pairs respond sharply to rate expectations and dollar liquidity (DXY). Adapting ATR-based stop sizing to each instrument preserves consistent percentage risk.',
  },
];
