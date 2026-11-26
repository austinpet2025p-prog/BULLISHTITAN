import { useEffect } from 'react';

interface PageMetaConfig {
  title: string;
  description: string;
}

const ROUTE_META: Record<string, PageMetaConfig> = {
  '/': {
    title: 'Bullish Titan Academy — Simple, Disciplined Forex & Synthetic Trading',
    description:
      'Learn Forex and Synthetic Indices step by step with plain-English courses, 1-on-1 coaching, daily trade signals, and managed accounts.',
  },
  '/training': {
    title: 'Trading Courses — Beginner to Advanced | Bullish Titan Academy',
    description:
      'Learn step-by-step across Beginner, Intermediate, and Advanced courses in Forex and Synthetic Indices with clear checklists and video lessons.',
  },
  '/mentorship': {
    title: '12-Week 1-on-1 Coaching & Mentorship | Bullish Titan Academy',
    description:
      'Train alongside experienced Forex and Synthetic Indices coaches with weekly chart reviews, group classes, and personal support.',
  },
  '/signals': {
    title: 'Daily Trade Signals — Forex & Synthetic Alerts | Bullish Titan Academy',
    description:
      'Clear Forex, Gold, and Synthetic Indices trade alerts with exact entries, safety stops, profit goals, and a built-in lot calculator.',
  },
  '/investment': {
    title: 'Managed Accounts — Starter to VIP | Bullish Titan Academy',
    description:
      'Explore Starter, Growth, Pro, and Private VIP managed account plans where 100% of your funds stay inside your own broker account.',
  },
  '/pricing': {
    title: 'Membership Plans & Pricing | Bullish Titan Academy',
    description:
      'Compare Courses Only, Daily Trade Signals, Courses + Signals Bundle, 1-on-1 Coaching, and All-Access VIP plans.',
  },
  '/results': {
    title: 'Student Results & Track Record | Bullish Titan Academy',
    description:
      'See real student milestones, sample trade logs, and risk-first trading results across Forex and Synthetic Indices.',
  },
  '/about': {
    title: 'About Us — Our Story & Coaches | Bullish Titan Academy',
    description:
      'Meet the experienced trading coaches behind Bullish Titan Academy and see how we keep trading clear, honest, and safe.',
  },
  '/blog': {
    title: 'Trading Guides & Articles | Bullish Titan Academy',
    description:
      'Read simple, helpful guides on price action, money safety, US Dollar trends, and building calm trading habits.',
  },
  '/faq': {
    title: 'Frequently Asked Questions | Bullish Titan Academy',
    description:
      'Find clear answers about Trading Courses, 1-on-1 Coaching, Daily Trade Signals, Managed Accounts, and account safety.',
  },
  '/contact': {
    title: 'Help, Admissions & Contact | Bullish Titan Academy',
    description:
      'Message the Bullish Titan support team or visit our office via interactive Google Maps directions, Telegram, or WhatsApp.',
  },
};

export function usePageMeta(pathname: string) {
  useEffect(() => {
    const baseKey = pathname.startsWith('/blog/')
      ? '/blog'
      : pathname.startsWith('/legal/')
      ? '/contact'
      : pathname;

    const meta = ROUTE_META[baseKey] || ROUTE_META['/'];
    document.title = meta.title;

    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', meta.description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', meta.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', meta.description);

    const canonicalUrl = window.location.origin + window.location.pathname;
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = canonicalUrl;
  }, [pathname]);
}
