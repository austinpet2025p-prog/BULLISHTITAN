import img01 from '../assets/images/academy_trading_desk_1794780446372.jpg';
import img02 from '../assets/images/course_foundations_desk_1794784254092.jpg';
import img03 from '../assets/images/course_foundations_desk_1794784712124.jpg';
import img04 from '../assets/images/course_liquidity_terminal_1794784256358.jpg';
import img05 from '../assets/images/course_liquidity_terminal_1794784712022.jpg';
import img06 from '../assets/images/hero_trading_floor_1794784253685.jpg';
import img07 from '../assets/images/hero_trading_floor_1794784711615.jpg';
import img08 from '../assets/images/mentor_david_okafor_1794780446216.jpg';
import img09 from '../assets/images/mentor_elena_rostova_1794780444734.jpg';
import img10 from '../assets/images/mentor_marcus_vance_1794780444928.jpg';
import img11 from '../assets/images/mentorship_war_room_1794784254497.jpg';
import img12 from '../assets/images/mentorship_war_room_1794784714120.jpg';
import img13 from '../assets/images/signals_intelligence_hub_1794784256647.jpg';
import img14 from '../assets/images/signals_intelligence_hub_1794784713053.jpg';

export interface FooterTestimonialItem {
  id: string;
  slot: string;
  image: string;
  imageAlt: string;
  name: string;
  role: string;
  quote: string;
}

/**
 * 15-slot testimonial image set for the footer self-scrolling marquee.
 * Replace img01..img14 / slot image imports above with your 15 cat images anytime.
 */
export const FOOTER_TESTIMONIALS: FooterTestimonialItem[] = [
  {
    id: 'ft-01',
    slot: '01',
    image: img01,
    imageAlt: 'Fellow ledger portrait 01',
    name: 'Daniel K. Mensah',
    role: 'Vanguard FX Fellow · London',
    quote:
      'Hard invalidation rules and calm London open preparation completely ended my mid-session overtrading.',
  },
  {
    id: 'ft-02',
    slot: '02',
    image: img02,
    imageAlt: 'Fellow ledger portrait 02',
    name: 'Tunde Adeyemi',
    role: 'Synthetics Desk Fellow · Lagos',
    quote:
      'Weekly chart audits broke my habit of chasing Volatility 75 spikes and steadied my weekly risk.',
  },
  {
    id: 'ft-03',
    slot: '03',
    image: img03,
    imageAlt: 'Fellow ledger portrait 03',
    name: 'Nadia Al-Rashid',
    role: 'Cross-Asset Cohort · Dubai',
    quote:
      'Pre-sized levels and clear risk context made balancing full-time work and Gold setups effortless.',
  },
  {
    id: 'ft-04',
    slot: '04',
    image: img04,
    imageAlt: 'Fellow ledger portrait 04',
    name: 'Sibusiso Mokoena',
    role: 'Archon Council Graduate · Johannesburg',
    quote:
      'Understanding synthetic cycles turned 24/7 volatility into a calm, repeatable execution checklist.',
  },
  {
    id: 'ft-05',
    slot: '05',
    image: img05,
    imageAlt: 'Fellow ledger portrait 05',
    name: 'Elena Chen',
    role: 'Strategos Cohort · New York',
    quote:
      'Building a 100-trade sample log before scaling gave me real statistical confidence in my entries.',
  },
  {
    id: 'ft-06',
    slot: '06',
    image: img06,
    imageAlt: 'Fellow ledger portrait 06',
    name: 'Marcus Patel',
    role: 'Mandate Principal · Toronto',
    quote:
      'Volatility-adjusted position sizing smoothed out equity swings across G10 currencies and indices.',
  },
  {
    id: 'ft-07',
    slot: '07',
    image: img07,
    imageAlt: 'Fellow ledger portrait 07',
    name: 'Claire Beaumont',
    role: 'Mentorship Alumni · Paris',
    quote:
      'Dropping messy indicators in favor of clean multi-timeframe structure simplified every single chart.',
  },
  {
    id: 'ft-08',
    slot: '08',
    image: img08,
    imageAlt: 'Fellow ledger portrait 08',
    name: 'Samuel Osei',
    role: 'Phalanx Desk Fellow · Accra',
    quote:
      'Patience waiting for liquidity sweeps turned impulsive losses into patient, high-probability setups.',
  },
  {
    id: 'ft-09',
    slot: '09',
    image: img09,
    imageAlt: 'Fellow ledger portrait 09',
    name: 'Hana Takahashi',
    role: 'Session Analyst · Tokyo',
    quote:
      'Direct Strategos critiques highlighted blind spots in my stop placement within the very first two weeks.',
  },
  {
    id: 'ft-10',
    slot: '10',
    image: img10,
    imageAlt: 'Fellow ledger portrait 10',
    name: 'Lucas Lindholm',
    role: 'Forge Graduate · Stockholm',
    quote:
      'The structured rank progression built discipline around risk before chasing expansive targets.',
  },
  {
    id: 'ft-11',
    slot: '11',
    image: img11,
    imageAlt: 'Fellow ledger portrait 11',
    name: 'Amara Nwosu',
    role: 'Synthetics Phalanx · Abuja',
    quote:
      'Strict 1% drawdown shields preserved my account through choppy weeks until clean trend legs arrived.',
  },
  {
    id: 'ft-12',
    slot: '12',
    image: img12,
    imageAlt: 'Fellow ledger portrait 12',
    name: 'Mateo Silva',
    role: 'Vanguard Briefings · São Paulo',
    quote:
      'Every desk dispatch comes with clean structural reasoning so I actually learn while executing live.',
  },
  {
    id: 'ft-13',
    slot: '13',
    image: img13,
    imageAlt: 'Fellow ledger portrait 13',
    name: 'Priya Nair',
    role: 'Macro FX Rank · Singapore',
    quote:
      'Aligning higher-timeframe dollar flow with lower-timeframe triggers sharpened my entire execution.',
  },
  {
    id: 'ft-14',
    slot: '14',
    image: img14,
    imageAlt: 'Fellow ledger portrait 14',
    name: 'Kieran Gallagher',
    role: 'Forge Graduate · Dublin',
    quote:
      'Weekly ledger reviews held me accountable to my playbook instead of letting emotions dictate size.',
  },
  {
    id: 'ft-15',
    slot: '15',
    image: img01,
    imageAlt: 'Fellow ledger portrait 15',
    name: 'Zainab Farooq',
    role: 'Gold & FX Cohort · Manchester',
    quote:
      'Zero hype, honest risk math, and a serious peer environment focused purely on disciplined execution.',
  },
];
