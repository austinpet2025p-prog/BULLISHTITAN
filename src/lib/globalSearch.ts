import {
  BLOG_POSTS,
  COURSES,
  DEMO_SIGNALS,
  HOME_FAQS,
  MENTORS,
  MENTORSHIP_TIERS,
  TWELVE_WEEK_ROADMAP,
} from '../data/academyData';
import {
  EXTENDED_BLOG_POSTS,
  GROUPED_FAQS,
  INVESTMENT_ONBOARDING_STEPS,
  INVESTMENT_PROGRAMS,
  PRICING_COLUMNS,
} from '../data/extendedData';

export type SearchCategory =
  | 'all'
  | 'training'
  | 'mentorship'
  | 'signals'
  | 'plans'
  | 'guides';

export interface SearchableItem {
  id: string;
  category: Exclude<SearchCategory, 'all'>;
  title: string;
  plainLabel: string;
  spartanTerm?: string;
  description: string;
  meta: string;
  to: string;
  keywords: string[];
}

const STOP_WORDS = new Set([
  'a',
  'an',
  'the',
  'is',
  'are',
  'was',
  'were',
  'be',
  'to',
  'of',
  'in',
  'on',
  'for',
  'with',
  'at',
  'by',
  'from',
  'about',
  'as',
  'into',
  'how',
  'what',
  'where',
  'when',
  'who',
  'which',
  'can',
  'could',
  'would',
  'should',
  'do',
  'does',
  'did',
  'i',
  'me',
  'my',
  'we',
  'our',
  'you',
  'your',
  'show',
  'find',
  'search',
  'get',
  'take',
  'go',
  'want',
  'need',
  'looking',
  'part',
  'please',
  'tell',
  'explain',
]);

// Bidirectional Spartan <-> Plain-Language vocabulary groups
const SYNONYM_GROUPS: string[][] = [
  [
    'forge',
    'training',
    'course',
    'courses',
    'lesson',
    'lessons',
    'module',
    'modules',
    'curriculum',
    'syllabus',
    'class',
    'classes',
    'learn',
    'study',
    'education',
    'academy',
  ],
  ['foundation', 'beginner', 'starter', 'basic', 'basics', 'new', 'entry', 'intro', 'initiation', 'agoge'],
  [
    'strategos',
    'mentorship',
    'mentor',
    'mentors',
    'coach',
    'coaching',
    'tutor',
    'teacher',
    '1-on-1',
    'private',
    'guidance',
    'commander',
    'counsel',
  ],
  [
    'vanguard',
    'signal',
    'signals',
    'alert',
    'alerts',
    'setup',
    'setups',
    'call',
    'calls',
    'trade',
    'trades',
    'telegram',
    'whatsapp',
    'dispatch',
    'dispatches',
    'intelligence',
  ],
  [
    'sovereign',
    'mandate',
    'mandates',
    'investment',
    'invest',
    'investing',
    'investor',
    'managed',
    'management',
    'stewardship',
    'fund',
    'capital',
    'custody',
    'broker',
    'profit',
    'split',
    'archon',
  ],
  ['phalanx', 'group', 'cohort', 'community', 'bundle', 'dual', 'fellows', 'team'],
  [
    'shield',
    'risk',
    'stop',
    'stoploss',
    'drawdown',
    'invalidation',
    'calculator',
    'lot',
    'lots',
    'sizing',
    'position',
    'protection',
    'safe',
    'safety',
    'buffer',
    'goodwill',
  ],
  ['synthetic', 'synthetics', 'v75', 'v100', 'boom', 'crash', 'volatility', 'indices', 'index'],
  ['forex', 'fx', 'currency', 'currencies', 'eurusd', 'gbpusd', 'usdjpy', 'gold', 'xauusd', 'dxy'],
  ['pricing', 'price', 'cost', 'fee', 'fees', 'membership', 'subscription', 'plan', 'plans', 'tier', 'tiers', 'rank', 'ranks', 'order', 'orders'],
  ['ledger', 'results', 'result', 'proof', 'performance', 'track', 'record', 'audit', 'audits', 'verified', 'returns'],
  ['doctrine', 'faq', 'question', 'questions', 'answer', 'answers', 'help', 'rules', 'terms', 'clause', 'charter', 'agreement'],
  ['admissions', 'contact', 'support', 'emergency', 'urgent', 'issue', 'problem', 'desk', 'human', 'talk', 'portal', 'console', 'dashboard', 'login'],
];

const SYNONYM_MAP = new Map<string, Set<string>>();
for (const group of SYNONYM_GROUPS) {
  for (const word of group) {
    const existing = SYNONYM_MAP.get(word) ?? new Set<string>();
    for (const peer of group) {
      if (peer !== word) existing.add(peer);
    }
    SYNONYM_MAP.set(word, existing);
  }
}

function buildSearchIndex(): SearchableItem[] {
  const items: SearchableItem[] = [];

  // 1. Courses & Every Training Module
  for (const course of COURSES) {
    items.push({
      id: `course-${course.id}`,
      category: 'training',
      title: course.title,
      plainLabel: `Trading Course · ${course.marketFocus}`,
      spartanTerm: `${course.level} Track`,
      description: course.summary,
      meta: `${course.duration} · ${course.lessons} Lessons · $${course.price}`,
      to: `/training?course=${course.id}#curriculum`,
      keywords: [
        course.level,
        course.title,
        course.marketFocus,
        'the forge',
        'training',
        'course',
        'lessons',
        'curriculum',
        ...course.outcomes,
      ],
    });

    course.modules.forEach((mod, modIdx) => {
      const lessonNames = mod.lessons.map((l) => l.title);
      items.push({
        id: `module-${course.id}-${modIdx}`,
        category: 'training',
        title: mod.title,
        plainLabel: `Course Module · ${course.title}`,
        spartanTerm: `${course.level} Level`,
        description: `Lessons included: ${lessonNames.join(' • ')}`,
        meta: `${mod.lessons.length} Lessons · ${course.duration}`,
        to: `/training?course=${course.id}#curriculum`,
        keywords: [
          mod.title,
          course.title,
          course.level,
          'module',
          'lesson',
          'training',
          'the forge',
          ...lessonNames,
        ],
      });

      mod.lessons.forEach((lesson, lIdx) => {
        items.push({
          id: `lesson-${course.id}-${modIdx}-${lIdx}`,
          category: 'training',
          title: lesson.title,
          plainLabel: `Lesson in ${mod.title}`,
          spartanTerm: `${course.level} Track`,
          description: `Part of "${course.title}" (${course.marketFocus}). Duration: ${lesson.duration}.`,
          meta: `${lesson.duration} · ${course.level}`,
          to: `/training?course=${course.id}#curriculum`,
          keywords: [lesson.title, mod.title, course.title, course.level, 'lesson', 'class', 'tutorial', 'the forge'],
        });
      });
    });
  }

  // 2. Managed Account Plans
  for (const plan of INVESTMENT_PROGRAMS) {
    items.push({
      id: `mandate-${plan.id}`,
      category: 'plans',
      title: plan.name,
      plainLabel: `Managed Account · ${plan.equityRange}`,
      spartanTerm: plan.rankTitle,
      description: `${plan.summary} ${plan.drawdownGuardrail}.`,
      meta: `${plan.equityRange} · Fee: ${plan.onboardingFee}`,
      to: '/investment#plans',
      keywords: [
        plan.name,
        plan.rankTitle,
        plan.subtitleTag,
        plan.strategyType,
        plan.equityRange,
        plan.onboardingFee,
        'investment',
        'investment plan',
        'managed account',
        'sovereign mandate',
        'agoge',
        'vanguard',
        'strategos',
        'archon',
        'account management',
        'deposit',
        plan.minEquityValue >= 5000 ? 'rule 9 clause 9 5000 buffer goodwill' : 'starter equity',
      ],
    });
  }

  // 3. Mentorship Tiers, Coaches & 12-Week Roadmap
  for (const tier of MENTORSHIP_TIERS) {
    items.push({
      id: `mentor-${tier.id}`,
      category: 'mentorship',
      title: tier.name,
      plainLabel: '1-on-1 Coaching & Mentorship Program',
      spartanTerm: 'Mentorship Desk',
      description: `${tier.summary} Includes: ${tier.features.slice(0, 2).join('; ')}.`,
      meta: `$${tier.monthlyPrice}/month`,
      to: '/mentorship#tiers',
      keywords: [
        tier.name,
        'mentorship',
        'strategos',
        'coaching',
        'mentor',
        '1-on-1',
        'phalanx',
        'archon',
        'group cohort',
        'private coach',
        ...tier.features,
      ],
    });
  }

  for (const phase of TWELVE_WEEK_ROADMAP) {
    items.push({
      id: `roadmap-${phase.phase}`,
      category: 'mentorship',
      title: phase.title,
      plainLabel: `12-Week Coaching Step (${phase.phase})`,
      spartanTerm: '12-Week Learning Plan',
      description: phase.detail,
      meta: phase.phase,
      to: '/mentorship#roadmap',
      keywords: [
        phase.phase,
        phase.title,
        phase.detail,
        'roadmap',
        'mentorship',
        'module',
        'weeks',
        'coaching',
        'strategos',
      ],
    });
  }

  for (const mentor of MENTORS) {
    items.push({
      id: `commander-${mentor.id}`,
      category: 'mentorship',
      title: `${mentor.name} · ${mentor.specialty}`,
      plainLabel: `Lead Coach (${mentor.markets})`,
      spartanTerm: mentor.role,
      description: `${mentor.bio} Focus: ${mentor.focusAreas.join(', ')}.`,
      meta: mentor.experience,
      to: '/mentorship#booking',
      keywords: [
        mentor.name,
        mentor.role,
        mentor.specialty,
        mentor.markets,
        'mentor',
        'coach',
        'instructor',
        'commander',
        'strategos',
        'archon',
        'booking',
        ...mentor.focusAreas,
      ],
    });
  }

  items.push({
    id: 'mentorship-booking-call',
    category: 'mentorship',
    title: 'Book a Free 1-on-1 Coaching Call',
    plainLabel: 'Schedule a Private Intro Call With a Coach',
    spartanTerm: 'Coaching Booking',
    description: 'Pick a time for a private 1-on-1 chat or chart review with Mr Odinaka.',
    meta: 'Mentorship Booking',
    to: '/mentorship#booking',
    keywords: ['book', 'call', 'schedule', 'appointment', '1-on-1', 'coach', 'mentor', 'strategos'],
  });

  // 4. Unified Membership Pricing Columns
  for (const col of PRICING_COLUMNS) {
    items.push({
      id: `pricing-${col.id}`,
      category: 'plans',
      title: col.name,
      plainLabel: `Membership Plan · ${col.tagline}`,
      spartanTerm: 'Membership',
      description: `Monthly: $${col.monthlyPrice}/mo (or $${col.yearlyMonthlyEquivalent}/mo billed yearly). ${col.tagline}.`,
      meta: `$${col.monthlyPrice}/mo · $${col.yearlyMonthlyEquivalent}/mo yearly`,
      to: '/pricing',
      keywords: [
        col.name,
        col.tagline,
        'pricing',
        'plan',
        'membership',
        'cost',
        'subscription',
        'rank order',
      ],
    });
  }

  // 5. Signal Subscription Packages + Live Demo Signals + Calculator
  const signalPlans = [
    {
      id: 'vanguard-fx-core',
      title: 'Forex & Gold Signals',
      plainLabel: 'Weekly Forex & Gold Trade Alerts',
      spartanTerm: 'Daily Signals',
      description: '6–10 clear Forex and Gold (XAU/USD) trade ideas each week with entry, stop-loss, and take-profit prices sent to Telegram & email.',
      meta: '$39/wk · $119/mo · $990/yr',
      to: '/signals#plans',
      keywords: ['vanguard', 'fx core', 'signals', 'forex', 'gold', 'xauusd', 'telegram', 'trade alerts'],
    },
    {
      id: 'vanguard-cross-asset',
      title: 'All-Market Signals (Forex + Synthetics)',
      plainLabel: 'All Forex, Gold & Volatility Index Trade Alerts',
      spartanTerm: 'Full Signal Feed',
      description: 'Complete Forex, Gold, Volatility 75, V100, and Boom/Crash alerts sent live via Telegram, WhatsApp, and your dashboard.',
      meta: '$149/mo · Save 30% Yearly',
      to: '/signals#plans',
      keywords: ['vanguard', 'cross-asset', 'signals', 'synthetics', 'v75', 'boom', 'crash', 'gold', 'whatsapp', 'telegram'],
    },
    {
      id: 'phalanx-dual-order',
      title: 'Courses + Signals Bundle',
      plainLabel: 'Combined Trade Alerts + Video Courses Bundle',
      spartanTerm: 'Bundle Plan',
      description: 'Combines daily all-market trade signals with full access to our Beginner and Intermediate trading courses.',
      meta: '$69/wk · $199/mo · $1,680/yr',
      to: '/signals#plans',
      keywords: ['phalanx', 'dual', 'bundle', 'signals', 'training', 'courses', 'forge'],
    },
    {
      id: 'position-size-calculator',
      title: 'Free Lot Size & Safety Calculator',
      plainLabel: 'Find Your Exact Safe Trade Size in Seconds',
      spartanTerm: 'Risk Tool',
      description: 'Free tool for Forex and Synthetic Indices that tells you the safest lot size based on your account balance and stop-loss.',
      meta: 'Interactive Tool · Free',
      to: '/signals#calculator',
      keywords: ['calculator', 'lot size', 'position size', 'risk shield', 'stop loss', 'pip', 'drawdown'],
    },
  ];
  for (const sp of signalPlans) {
    items.push({ ...sp, category: 'signals' });
  }

  for (const sig of DEMO_SIGNALS) {
    items.push({
      id: `signal-${sig.id}`,
      category: 'signals',
      title: `${sig.pair} (${sig.direction}) · ${sig.status}`,
      plainLabel: `${sig.market} Trade Alert Example`,
      spartanTerm: 'Sample Signal',
      description: `Entry ${sig.entry} | SL ${sig.stopLoss} | TP1 ${sig.tp1} | R:R ${sig.rr}. ${sig.rationale}`,
      meta: `${sig.market} · R:R ${sig.rr}`,
      to: '/signals#past-signals',
      keywords: [sig.pair, sig.market, sig.direction, sig.status, sig.rationale, 'signal', 'setup', 'alert', 'vanguard'],
    });
  }

  // 6. Governance Rules, Onboarding Steps, FAQs, Blog Guides & Support
  items.push(
    {
      id: 'mandate-rules-50-50',
      category: 'guides',
      title: '9 Simple Rules, 50/50 Profit Split & $5,000+ Goodwill Buffer',
      plainLabel: 'Account Rules, Money Safety & Profit Sharing',
      spartanTerm: 'Managed Account Rules',
      description:
        'Your money stays in your own regulated broker account. Profits are split 50/50. Accounts funded above $5,000 qualify for our Rule 9 10% goodwill buffer.',
      meta: '9 Rules · You Hold Custody',
      to: '/investment#terms',
      keywords: ['50/50', 'profit split', 'clause 9', 'rule 9', '5000', 'goodwill', 'custody', 'withdrawal', 'rules', 'terms', 'charter', 'loss coverage', 'termination'],
    },
    {
      id: 'support-admissions-desk',
      category: 'guides',
      title: 'Support & Help Team',
      plainLabel: 'Contact Support, Billing & Urgent Help',
      spartanTerm: 'Help Desk',
      description: 'Reach Bullish Titan support for account questions, urgent help, custom managed account quotes, or coaching inquiries.',
      meta: 'Direct Contact Form',
      to: '/contact',
      keywords: ['contact', 'support', 'emergency', 'urgent', 'help', 'billing', 'admissions', 'archon', 'human', 'customer care'],
    },
    {
      id: 'location-abeokuta-flagship',
      category: 'guides',
      title: 'Abeokuta Office · Bullish Titan, Timeline Bazaar (Google Maps)',
      plainLabel: 'Physical Office Address & Live Directions (Ogun State)',
      spartanTerm: 'Ogun State Office',
      description:
        'Timeline Bazaar, Dayo Sanyaolu Junction, Camp, Abeokuta, Ogun State, Nigeria. Landmark: Beside Peakolam Restaurant / Peakolam Suites along FUNAAB Road. Connected to Google Maps with live directions.',
      meta: 'Abeokuta · On Google Maps',
      to: '/contact#locations',
      keywords: [
        'abeokuta',
        'ogun',
        'ogun state',
        'timeline bazaar',
        'dayo sanyaolu',
        'camp',
        'peakolam',
        'funaab',
        'alabata',
        'nigeria',
        'address',
        'office',
        'location',
        'directions',
        'google maps',
        'branch',
        'visit',
      ],
    },
    {
      id: 'location-abuja-branch',
      category: 'guides',
      title: 'Abuja Office · Federal Capital Territory',
      plainLabel: 'Abuja Office Status (Address Coming Soon)',
      spartanTerm: 'Abuja Office',
      description:
        'Bullish Titan has a regional presence in Abuja; the exact street address will be shared soon.',
      meta: 'Abuja, Nigeria · Address Soon',
      to: '/contact#locations',
      keywords: ['abuja', 'fct', 'branch', 'office', 'location', 'nigeria', 'address', 'coming soon'],
    },
    {
      id: 'operational-ledger-results',
      category: 'guides',
      title: 'Track Record & Sample Results',
      plainLabel: 'Sample Account Growth & Risk Records',
      spartanTerm: 'Results & Proof',
      description: 'Review sample growth curves, strict loss limits, and student progress across Forex and Synthetic Indices.',
      meta: 'Sample & Audited Records',
      to: '/results',
      keywords: ['results', 'ledger', 'track record', 'performance', 'proof', 'audits', 'drawdown', 'equity'],
    }
  );

  for (const step of INVESTMENT_ONBOARDING_STEPS) {
    items.push({
      id: `inv-step-${step.step}`,
      category: 'plans',
      title: `Step ${step.step}: ${step.title}`,
      plainLabel: 'How Managed Accounts Start',
      spartanTerm: 'Setup Steps',
      description: step.detail,
      meta: `Step ${step.step} · Safe Custody`,
      to: '/investment#steps',
      keywords: [step.title, step.detail, 'onboarding', 'kyc', 'how it works', 'investment steps', 'vetting'],
    });
  }

  for (const faq of HOME_FAQS) {
    items.push({
      id: `faq-${faq.id}`,
      category: 'guides',
      title: faq.question,
      plainLabel: `FAQ · ${faq.category}`,
      spartanTerm: 'Common Questions',
      description: faq.answer,
      meta: faq.category,
      to: '/faq',
      keywords: [faq.question, faq.answer, faq.category, 'faq', 'question', 'help', 'doctrine'],
    });
  }

  for (const group of GROUPED_FAQS) {
    group.items.forEach((item, idx) => {
      items.push({
        id: `gfaq-${group.group}-${idx}`,
        category: 'guides',
        title: item.q,
        plainLabel: `FAQ · ${group.group}`,
        spartanTerm: 'Help Guide',
        description: item.a,
        meta: group.group,
        to: '/faq',
        keywords: [item.q, item.a, group.group, 'faq', 'question', 'help'],
      });
    });
  }

  for (const post of EXTENDED_BLOG_POSTS) {
    items.push({
      id: `blog-${post.slug}`,
      category: 'guides',
      title: post.title,
      plainLabel: `Trading Guide · ${post.category}`,
      spartanTerm: 'Article',
      description: post.excerpt,
      meta: `${post.readTime} · ${post.date}`,
      to: `/blog/${post.slug}`,
      keywords: [post.title, post.excerpt, post.category, 'blog', 'article', 'guide', 'dispatch'],
    });
  }

  for (const post of BLOG_POSTS) {
    if (!EXTENDED_BLOG_POSTS.some((e) => e.slug === post.id)) {
      items.push({
        id: `blog-base-${post.id}`,
        category: 'guides',
        title: post.title,
        plainLabel: `Trading Guide · ${post.category}`,
        spartanTerm: 'Article',
        description: post.excerpt,
        meta: `${post.readTime} · ${post.date}`,
        to: `/blog/${post.id}`,
        keywords: [post.title, post.excerpt, post.category, 'blog', 'article', 'guide'],
      });
    }
  }

  return items;
}

export const GLOBAL_SEARCH_ITEMS: SearchableItem[] = buildSearchIndex();

function normalizeText(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9$\s/:-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenizeQuery(rawQuery: string): string[] {
  const normalized = normalizeText(rawQuery);
  if (!normalized) return [];
  const rawTokens = normalized.split(' ').filter(Boolean);
  const meaningful = rawTokens.filter((tok) => !STOP_WORDS.has(tok) && tok.length > 1);
  return meaningful.length > 0 ? meaningful : rawTokens;
}

export function runGlobalSearch(
  query: string,
  categoryFilter: SearchCategory = 'all',
  limit = 16
): SearchableItem[] {
  const pool =
    categoryFilter === 'all'
      ? GLOBAL_SEARCH_ITEMS
      : GLOBAL_SEARCH_ITEMS.filter((item) => item.category === categoryFilter);

  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) {
    // Show a balanced, curated overview across categories when search bar is opened
    const featuredIds = [
      'mandate-pro-phase',
      'mandate-lite-phase',
      'course-foundations-fx-synthetics',
      'course-liquidity-execution-system',
      'vanguard-cross-asset',
      'position-size-calculator',
      'mentor-one-on-one',
      'mandate-rules-50-50',
      'support-admissions-desk',
    ];
    const featured = featuredIds
      .map((id) => pool.find((item) => item.id === id))
      .filter((x): x is SearchableItem => Boolean(x));
    return featured.length > 0 ? featured : pool.slice(0, 8);
  }

  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) return pool.slice(0, limit);

  const scored: { item: SearchableItem; score: number }[] = [];

  for (const item of pool) {
    const titleNorm = normalizeText(item.title);
    const plainNorm = normalizeText(item.plainLabel);
    const spartanNorm = normalizeText(item.spartanTerm ?? '');
    const descNorm = normalizeText(item.description);
    const metaNorm = normalizeText(item.meta);
    const keywordsNorm = normalizeText(item.keywords.join(' '));
    const combinedNorm = `${titleNorm} ${plainNorm} ${spartanNorm} ${keywordsNorm} ${metaNorm} ${descNorm}`;

    let score = 0;

    // Exact phrase boost
    if (titleNorm.includes(normalizedQuery)) score += 32;
    else if (plainNorm.includes(normalizedQuery) || spartanNorm.includes(normalizedQuery)) score += 22;
    else if (combinedNorm.includes(normalizedQuery)) score += 12;

    let matchedTokenCount = 0;

    for (const token of tokens) {
      let tokenMatched = false;

      if (titleNorm.includes(token)) {
        score += 14;
        tokenMatched = true;
      } else if (plainNorm.includes(token) || spartanNorm.includes(token)) {
        score += 11;
        tokenMatched = true;
      } else if (keywordsNorm.includes(token) || metaNorm.includes(token)) {
        score += 8;
        tokenMatched = true;
      } else if (descNorm.includes(token)) {
        score += 5;
        tokenMatched = true;
      }

      // Check Spartan <-> Plain-Language synonym expansion
      if (!tokenMatched) {
        const peers = SYNONYM_MAP.get(token);
        if (peers) {
          for (const syn of peers) {
            if (titleNorm.includes(syn) || plainNorm.includes(syn) || spartanNorm.includes(syn)) {
              score += 7;
              tokenMatched = true;
              break;
            }
            if (keywordsNorm.includes(syn) || descNorm.includes(syn)) {
              score += 4;
              tokenMatched = true;
              break;
            }
          }
        }
      }

      if (tokenMatched) {
        matchedTokenCount += 1;
      }
    }

    if (matchedTokenCount === 0) continue;

    // Reward items covering all or most tokens of the natural language query
    if (matchedTokenCount === tokens.length && tokens.length > 1) {
      score += 15;
    }

    // Slight prioritization so high-level courses/plans appear cleanly before individual sub-lessons unless query specifically targets a lesson
    if (!item.id.startsWith('lesson-')) {
      score += 2;
    }

    scored.push({ item, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((entry) => entry.item);
}
