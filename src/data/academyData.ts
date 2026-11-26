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
    title: 'Trading Courses',
    kicker: '01. Step-by-Step Training',
    benefit: 'Learn how prices move, how to protect your money, and how to follow simple rules that work.',
    description:
      'Three clear levels—Beginner, Intermediate, and Advanced—with short video lessons and easy checklists.',
    href: '/training',
    metricLabel: '3 Levels · 86 Lessons',
  },
  {
    id: 'mentorship',
    title: '1-on-1 Coaching & Mentorship',
    kicker: '02. Personal Coaching',
    benefit: 'Learn side-by-side with experienced coaches who review your charts every week and guide every step.',
    description:
      'A guided 12-week program with weekly group classes, private 1-on-1 chart reviews, and calm, steady habit building.',
    href: '/mentorship',
    metricLabel: '12 Weeks · Weekly Reviews',
  },
  {
    id: 'signals',
    title: 'Daily Trade Signals',
    kicker: '03. Live Trade Alerts',
    benefit: 'Get clear Forex and Synthetic Indices trade ideas with exact entry prices, safety stops, and profit goals.',
    description:
      'Easy-to-follow trade alerts sent straight to Telegram, WhatsApp, email, and your member dashboard with automatic lot sizing.',
    href: '/signals',
    metricLabel: 'FX & Synthetics · Safety First',
  },
  {
    id: 'investment',
    title: 'Managed Accounts',
    kicker: '04. Account Management',
    benefit: 'Let our expert team trade inside your own broker account while you keep 100% control of your money.',
    description:
      'Four clear plans—Starter, Growth, Pro, and Private VIP—built with strict daily loss limits and open reporting.',
    href: '/investment',
    metricLabel: '4 Clear Tiers · Protected',
  },
];

export interface CourseItem {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
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
    title: 'Market Basics & Money Safety',
    level: 'Beginner',
    duration: '6 Weeks',
    lessons: 24,
    price: 390,
    marketFocus: 'Forex & Synthetic Indices',
    image: courseFoundationsImg,
    summary:
      'Start from zero. Learn how to read price charts, pick the safest times to trade, place clean orders, and never risk too much on one trade.',
    outcomes: [
      'Read any price chart with calm clarity',
      'Pick the right trade size before clicking buy or sell',
      'Follow a simple checklist before every session',
    ],
    modules: [
      {
        title: 'Module 01 · How Markets Work & Best Trading Hours',
        lessons: [
          { title: 'Why Prices Move Up and Down (FX & Synthetics)', duration: '18 min' },
          { title: 'London, New York & 24/7 Synthetic Market Hours', duration: '22 min' },
          { title: 'Understanding Spreads, Fees & Placing Orders', duration: '16 min' },
        ],
      },
      {
        title: 'Module 02 · Reading Trends & Key Price Zones',
        lessons: [
          { title: 'Spotting Uptrends, Downtrends & Turning Points', duration: '24 min' },
          { title: 'Where Buyers and Sellers Step In (Key Zones)', duration: '28 min' },
          { title: 'Checking Big Charts Before Small Charts', duration: '26 min' },
        ],
      },
      {
        title: 'Module 03 · Simple Money Safety Rules',
        lessons: [
          { title: 'The 1% Rule: Keeping Losses Small', duration: '21 min' },
          { title: 'Choosing Safe Trade Sizes for Every Account', duration: '19 min' },
          { title: 'Keeping Your First Simple Trade Journal', duration: '20 min' },
        ],
      },
    ],
  },
  {
    id: 'liquidity-execution-system',
    title: 'Smart Entries & Clear Exits',
    level: 'Intermediate',
    duration: '8 Weeks',
    lessons: 32,
    price: 690,
    marketFocus: 'FX Majors, Gold & Volatility 75',
    image: courseLiquidityImg,
    summary:
      'Turn market knowledge into real consistency. Spot fake breakouts, time entries cleanly, protect every trade with a safety stop, and lock in gains.',
    outcomes: [
      'Spot fake price spikes and wait for real moves',
      'Aim for 2.5x reward compared to your risk',
      'Stop jumping into messy, low-quality trades',
    ],
    modules: [
      {
        title: 'Module 01 · Avoiding Price Traps & Fake Moves',
        lessons: [
          { title: 'Why Obvious Lines Break Before Real Moves', duration: '27 min' },
          { title: 'Confirming Strong Price Momentum', duration: '23 min' },
          { title: 'Timing London Opens & Boom/Crash Spikes', duration: '29 min' },
        ],
      },
      {
        title: 'Module 02 · Entering & Managing Open Trades',
        lessons: [
          { title: 'Limit Orders vs Instant Entries', duration: '25 min' },
          { title: 'Moving Your Safety Stop & Taking Partial Profits', duration: '22 min' },
          { title: 'Avoiding Double Risk on Related Pairs', duration: '24 min' },
        ],
      },
      {
        title: 'Module 03 · Testing Your Strategy Before Going Live',
        lessons: [
          { title: 'The 100-Trade Practice Testing Method', duration: '34 min' },
          { title: 'Tracking Win Rate, Average Gain & Losing Streaks', duration: '26 min' },
        ],
      },
    ],
  },
  {
    id: 'macro-systematic-desk',
    title: 'Big-Picture Markets & Pro Rules',
    level: 'Advanced',
    duration: '10 Weeks',
    lessons: 30,
    price: 1190,
    marketFocus: 'Cross-Asset FX & Synthetic Indices',
    image: signalsHubImg,
    summary:
      'Connect big economic news, interest rates, and US Dollar trends with calm synthetic index sizing and multi-account money protection.',
    outcomes: [
      'Line up charts with interest-rate and news trends',
      'Shrink or grow trade size when markets speed up',
      'Run a calm, rule-based routine across larger accounts',
    ],
    modules: [
      {
        title: 'Module 01 · Big Economic Drivers & Market Mood',
        lessons: [
          { title: 'How Central Banks, Inflation & Rates Move Currencies', duration: '31 min' },
          { title: 'Reading US Dollar Strength & Quiet vs Fast Markets', duration: '28 min' },
          { title: 'Spotting Safe vs Risky Market Days', duration: '25 min' },
        ],
      },
      {
        title: 'Module 02 · Pro Portfolio Sizing & Scaling',
        lessons: [
          { title: 'Adjusting Trade Size to Daily Price Swings', duration: '29 min' },
          { title: 'Protecting Gains & Limiting Weekly Losses', duration: '24 min' },
          { title: 'Building Your Complete Personal Rulebook', duration: '27 min' },
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
    role: 'Head Coach · Forex & Big-Picture Strategy',
    specialty: 'Major Currencies & Gold',
    experience: '11 Years Experience',
    markets: 'EUR/USD · GBP/USD · XAU/USD',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-25_at_8.12.58_PM_e8881ef2.jpeg',
    bio: 'Former London currency trader who helps students read market trends simply, stay patient during peak sessions, and trade with clear rules.',
    focusAreas: ['Economic Trends', 'Peak Trading Hours', 'Calm Discipline'],
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
    rationale: 'Price dipped below yesterday’s low, bounced strongly upward, and retested a clean support zone.',
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
    timestamp: 'Demo · 24/7 Synthetic Alert',
    rationale: '4-hour chart formed a higher low right above a strong buyer support level.',
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
    timestamp: 'Demo · Pre-New York Alert',
    rationale: 'Waiting for price to tap an upper seller zone before triggering a clean sell order.',
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
    timestamp: 'Demo · Past Example',
    rationale: 'Price rejected a weekly ceiling while the US Dollar bounced higher from support.',
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
    name: 'Group Coaching',
    monthlyPrice: 249,
    summary: 'Learn with a small group in live weekly classes where coaches mark up charts and answer every question.',
    features: [
      '2 live London & New York group chart sessions every week',
      'Shared trade journal feedback from coaches',
      'Full access to all 86 video course lessons',
      'Private student community chat',
    ],
  },
  {
    id: 'one-on-one',
    name: '1-on-1 Private Coaching',
    monthlyPrice: 649,
    summary: 'Your own dedicated coach reviewing every trade you take, fixing bad habits, and helping you grow steadily.',
    featured: true,
    features: [
      'Weekly 45-minute private 1-on-1 video call with your coach',
      'Line-by-line review of your personal trade journal',
      'Custom trading plan built around your daily schedule',
      'Includes all group classes + Daily Trade Signals',
    ],
  },
  {
    id: 'vip-elite',
    name: 'VIP Executive Coaching',
    monthlyPrice: 1290,
    summary: 'Maximum personal attention with twice-weekly private calls, direct chat access, and every academy tool included.',
    features: [
      'Two private 1-on-1 coaching sessions every week',
      'Direct message line to your coach during trading hours',
      'Full portfolio & risk reviews across FX and Synthetics',
      'Includes every course, trade alert, and managed account review',
    ],
  },
];

export const TWELVE_WEEK_ROADMAP = [
  {
    phase: 'Weeks 01–03',
    title: 'Step 1 · Clean Setup & Safety Rules',
    detail: 'Fix old trading habits, set up clean charts, lock in safe per-trade loss limits, and build a calm morning routine.',
  },
  {
    phase: 'Weeks 04–06',
    title: 'Step 2 · Building & Testing Your Plan',
    detail: 'Pick 1 or 2 clear trade setups for London or New York hours and practice them across 50+ sample charts with your coach.',
  },
  {
    phase: 'Weeks 07–09',
    title: 'Step 3 · Guided Practice in Live Markets',
    detail: 'Trade live market prices on a safe practice account while checking every entry and stop-loss with your mentor.',
  },
  {
    phase: 'Weeks 10–12',
    title: 'Step 4 · Confident, Independent Trading',
    detail: 'Step up to real, steady trading with weekly journal check-ins, clear profit goals, and complete peace of mind.',
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
    location: 'London · FX Student',
    focusAsset: 'EUR/USD & GBP/USD',
    marketCategory: 'Forex & Gold',
    role: 'Intermediate Graduate',
    program: 'Trading Courses · Intermediate',
    metricValue: '1 : 2.8',
    metricLabel: 'Avg Reward vs Risk',
    timeframe: '6 Months Tracked',
    riskCap: '0.8% / Trade',
    sampleSize: '142 Logged Trades',
    consistencyDelta: '-64% Rushed Trades',
    quote:
      'Waiting for clean London open setups and keeping every loss under 1% stopped my overtrading and brought real consistency to my results.',
    outcomeNote: '0.8% Avg Risk / Trade · Verified Journal',
  },
  {
    id: 't2',
    initials: 'TA',
    name: 'Tunde Adeyemi',
    location: 'Lagos · Synthetic Trader',
    focusAsset: 'V75 & V100 Index',
    marketCategory: 'Synthetic Indices',
    role: '1-on-1 Coaching Student',
    program: '1-on-1 Private Coaching · 12 Weeks',
    metricValue: '≤ 2.4%',
    metricLabel: 'Max Weekly Dip',
    timeframe: '12-Week Program',
    riskCap: '0.5% / Trade',
    sampleSize: '88 Reviewed Trades',
    consistencyDelta: '0 Revenge Trades',
    quote:
      'Weekly 1-on-1 chart reviews with my coach broke my habit of chasing Volatility 75 spikes. My sizing stayed calm even during slow weeks.',
    outcomeNote: 'Zero Revenge Trades · Weekly Review',
  },
  {
    id: 't3',
    initials: 'NR',
    name: 'Nadia Al-Rashid',
    location: 'Dubai · Gold & FX',
    focusAsset: 'XAU/USD & Boom 500',
    marketCategory: 'Forex & Gold',
    role: 'Working Professional',
    program: 'Daily Trade Signals',
    metricValue: '+18.6%',
    metricLabel: 'Practice Growth',
    timeframe: '90-Day Review',
    riskCap: '1.0% Max Stop',
    sampleSize: '64 Clear Alerts',
    consistencyDelta: '94% Rule Consistency',
    quote:
      'With a busy job, I used to miss New York moves. Getting clear trade alerts with exact stop prices and sizing changed how I trade Gold.',
    outcomeNote: 'Pre-Sized Alerts · Steady Trade Log',
  },
  {
    id: 't4',
    initials: 'SM',
    name: 'Sibusiso Mokoena',
    location: 'Johannesburg · VIP Alumni',
    focusAsset: 'Crash 1000 & Boom 1000',
    marketCategory: 'Synthetic Indices',
    role: 'VIP Coaching Graduate',
    program: 'VIP Executive Coaching · Synthetics',
    metricValue: '68%',
    metricLabel: 'Rule-Following Wins',
    timeframe: '4 Months Tracked',
    riskCap: '0.75% / Trade',
    sampleSize: '115 Spike Setups',
    consistencyDelta: '+1 : 2.4 Avg Gain',
    quote:
      'Learning how Boom and Crash spikes actually behave turned 24/7 synthetic indices from stressful guesswork into a calm daily routine.',
    outcomeNote: 'Simple Checklist · 1% Safety Stop',
  },
  {
    id: 't5',
    initials: 'EC',
    name: 'Elena Chen',
    location: 'New York · FX Student',
    focusAsset: 'USD/JPY & US Dollar',
    marketCategory: 'Forex & Gold',
    role: 'Systematic Trader',
    program: 'Trading Courses · Advanced',
    metricValue: '100+',
    metricLabel: 'Practice Trades Tested',
    timeframe: '16-Week Review',
    riskCap: '0.6% Fixed Risk',
    sampleSize: '124 Test Trades',
    consistencyDelta: '1 : 2.6 Avg Setup',
    quote:
      'Testing 100 sample charts inside the Bullish Titan course gave me real numbers and quiet confidence before trading New York hours live.',
    outcomeNote: '1 : 2.6 Avg Setup · Clear Rulebook',
  },
  {
    id: 't6',
    initials: 'MP',
    name: 'Marcus Patel',
    location: 'Toronto · Managed Client',
    focusAsset: 'Major FX & Volatility Indices',
    marketCategory: 'Synthetic Indices',
    role: 'Account Holder',
    program: 'Managed Accounts · Growth',
    metricValue: '0.5%',
    metricLabel: 'Risk Per Trade',
    timeframe: '2 Quarters Tracked',
    riskCap: '0.5% Volatility Cap',
    sampleSize: '190 Portfolio Trades',
    consistencyDelta: '≤ 3.1% Quarter Dip',
    quote:
      'Moving from guessing trades to calm, risk-capped sizing kept account dips tiny while my capital stayed safely inside my own broker.',
    outcomeNote: 'Full Client Custody · Hard Loss Limits',
  },
];

export interface HomeFaqItem {
  id: string;
  category: 'Trading Courses' | '1-on-1 Coaching' | 'Trade Signals' | 'Managed Accounts';
  question: string;
  answer: string;
}

export const HOME_FAQS: HomeFaqItem[] = [
  {
    id: 'faq-experience',
    category: 'Trading Courses',
    question: 'Do I need any trading experience before starting at Bullish Titan?',
    answer:
      'Not at all. Our Beginner course starts from step one—teaching you how charts work, how to place safe orders, and how to protect your money in plain, simple English.',
  },
  {
    id: 'faq-returns',
    category: 'Managed Accounts',
    question: 'Are profits ever guaranteed on Trade Signals or Managed Accounts?',
    answer:
      'Never. Trading Forex and synthetic indices always carries real risk of losing money. We focus on strict safety stops, small losses, and honest math rather than fake promises.',
  },
  {
    id: 'faq-signals-vs-mentorship',
    category: '1-on-1 Coaching',
    question: 'What is the difference between Daily Trade Signals and 1-on-1 Coaching?',
    answer:
      'Daily Trade Signals send you ready-to-read trade ideas with exact entry, stop-loss, and profit levels. 1-on-1 Coaching pairs you with a personal coach for 12 weeks so you master trading on your own.',
  },
  {
    id: 'faq-synthetics',
    category: 'Trade Signals',
    question: 'How do you keep trades safe on fast 24/7 Synthetic Indices like Volatility 75?',
    answer:
      'Every alert calculates a safe lot size based on how fast the market is moving and puts a strict 0.5% to 1.0% safety stop on every trade before entering.',
  },
  {
    id: 'faq-custody',
    category: 'Managed Accounts',
    question: 'Who holds my money and controls withdrawals in Managed Accounts?',
    answer:
      'You do. Your money stays 100% inside your own regulated broker account in your own name, and only you can withdraw it. We only place trades and split profits 50/50 when targets are met.',
  },
  {
    id: 'faq-switching',
    category: 'Trading Courses',
    question: 'Can I upgrade my plan or add coaching as I improve?',
    answer:
      'Yes. Many students begin with our Beginner course, add Daily Trade Signals for live examples, and move into Group or 1-on-1 Coaching whenever they want personal feedback.',
  },
];

export const BLOG_POSTS = [
  {
    id: 'liquidity-sweeps-explained',
    category: 'Market Basics',
    date: 'Nov 2026',
    readTime: '6 min read',
    title: 'Why Obvious Support Lines Break Right Before Big Market Moves',
    excerpt:
      'How stop orders stack up above clear highs and lows—and why waiting for a fake spike protects your trade.',
    body: 'Most beginners put their safety stops right above or below obvious chart lines. When prices dip just past those lines, those stops trigger—giving bigger players room to move the price cleanly in the real direction. Waiting for that dip to finish keeps you out of common traps.',
  },
  {
    id: 'position-sizing-drawdown-math',
    category: 'Money Safety',
    date: 'Nov 2026',
    readTime: '5 min read',
    title: 'Why Small Losses Are the Secret to Staying in the Game',
    excerpt:
      'How risking only 0.5% to 1.0% per trade lets you survive 10 bad trades in a row without stress.',
    body: 'If you lose 10% of an account, you only need an 11.1% gain to bounce back. If you lose 50%, you need a 100% gain just to get even. Keeping every single loss small is what keeps your account alive long enough for good trades to add up.',
  },
  {
    id: 'macro-fx-volatility-regimes',
    category: 'FX & Synthetics',
    date: 'Oct 2026',
    readTime: '7 min read',
    title: 'How Synthetic Indices (V75, Boom & Crash) Differ From Regular Forex',
    excerpt:
      'Understanding 24/7 algorithmic charts versus news-driven currencies—and how to size trades safely on both.',
    body: 'Synthetic indices run 24/7 with steady programmed swings and no surprise bank news, while currencies like EUR/USD react sharply to interest-rate news and London or New York hours. Matching your trade size to each market keeps your risk steady everywhere.',
  },
];
