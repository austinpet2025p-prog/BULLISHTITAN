import { useEffect } from 'react';

interface PageMetaConfig {
  title: string;
  description: string;
}

const ROUTE_META: Record<string, PageMetaConfig> = {
  '/': {
    title: 'Bullish Titan Academy — Disciplined FX & Synthetic Capital Command',
    description:
      'Forge precision in Forex and Synthetic Indices market structure, Strategos mentorship, Vanguard intelligence, and Sovereign Mandates at Bullish Titan.',
  },
  '/training': {
    title: 'The Forge Training Academy — Foundation to Strategos | Bullish Titan',
    description:
      'Ascend through Foundation Rank, Vanguard Tier, and Strategos Mastery in Forex & Synthetic Indices with war-room briefings and playbooks.',
  },
  '/mentorship': {
    title: '12-Week Strategos Mentorship | Bullish Titan Academy',
    description:
      'Operate alongside senior FX and Synthetic Indices strategists with weekly chart audits, Phalanx labs, and 1-on-1 desk command.',
  },
  '/signals': {
    title: 'Vanguard Intelligence — FX & Synthetic Setups | Bullish Titan Academy',
    description:
      'Vetted FX, Gold, and Synthetic Indices briefings with entry zones, invalidation shields, and built-in lot sizing.',
  },
  '/investment': {
    title: 'Sovereign Capital Mandates | Bullish Titan Academy',
    description:
      'Progress across Agoge, Vanguard, Strategos, and Sovereign Archon custody mandates with transparent governance and risk disclosures.',
  },
  '/pricing': {
    title: 'Rank Orders & Enrollment Access | Bullish Titan Academy',
    description:
      'Compare Forge Initiate, Vanguard Intelligence, Phalanx Dual Order, Strategos Desk, and Sovereign Titan memberships.',
  },
  '/results': {
    title: 'Operational Ledger & The Phalanx | Bullish Titan Academy',
    description:
      'Inspect audited journal metrics, Phalanx cohort milestones, and risk-first capital discipline.',
  },
  '/about': {
    title: 'About the House — Ethos, Mission & Strategos Faculty | Bullish Titan',
    description:
      'Meet the senior strategists behind Bullish Titan Academy and explore our seven-year institutional lineage.',
  },
  '/blog': {
    title: 'Desk Dispatches & Research Briefs | Bullish Titan Academy',
    description:
      'Read analytical essays on liquidity sweeps, drawdown math, macro DXY flows, and execution endurance.',
  },
  '/faq': {
    title: 'Doctrine & Frequently Asked Questions | Bullish Titan Academy',
    description:
      'Search answers across The Forge, Strategos Mentorship, Vanguard Intelligence, Sovereign Mandates, and governance.',
  },
  '/contact': {
    title: 'Admissions & Command Desk | Bullish Titan Academy',
    description:
      'Reach the Bullish Titan Admissions Desk via inquiry briefing, Telegram, or WhatsApp support.',
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
