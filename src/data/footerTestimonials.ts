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
    imageAlt: 'Student story portrait 01',
    name: 'Daniel K. Mensah',
    role: 'Forex Student · London',
    quote:
      'Clear stop-loss rules and calm morning prep completely ended my mid-session overtrading.',
  },
  {
    id: 'ft-02',
    slot: '02',
    image: img02,
    imageAlt: 'Student story portrait 02',
    name: 'Tunde Adeyemi',
    role: 'Synthetics Student · Lagos',
    quote:
      'Weekly chart reviews broke my habit of chasing Volatility 75 spikes and kept my risk steady.',
  },
  {
    id: 'ft-03',
    slot: '03',
    image: img03,
    imageAlt: 'Student story portrait 03',
    name: 'Nadia Al-Rashid',
    role: 'Trading Student · Dubai',
    quote:
      'Pre-sized levels and clear risk steps made balancing full-time work and Gold setups effortless.',
  },
  {
    id: 'ft-04',
    slot: '04',
    image: img04,
    imageAlt: 'Student story portrait 04',
    name: 'Sibusiso Mokoena',
    role: 'VIP Coaching Graduate · Johannesburg',
    quote:
      'Learning how synthetic cycles move turned 24/7 charts into a calm, repeatable daily checklist.',
  },
  {
    id: 'ft-05',
    slot: '05',
    image: img05,
    imageAlt: 'Student story portrait 05',
    name: 'Elena Chen',
    role: '1-on-1 Coaching Student · New York',
    quote:
      'Tracking 100 practice trades in my journal before sizing up gave me real confidence in my entries.',
  },
  {
    id: 'ft-06',
    slot: '06',
    image: img06,
    imageAlt: 'Student story portrait 06',
    name: 'Marcus Patel',
    role: 'Managed Account Client · Toronto',
    quote:
      'Smart, volatility-adjusted trade sizes kept my balance steady across major currencies and Gold.',
  },
  {
    id: 'ft-07',
    slot: '07',
    image: img07,
    imageAlt: 'Student story portrait 07',
    name: 'Claire Beaumont',
    role: 'Coaching Graduate · Paris',
    quote:
      'Dropping messy indicators for simple price structure made every chart clear in seconds.',
  },
  {
    id: 'ft-08',
    slot: '08',
    image: img08,
    imageAlt: 'Student story portrait 08',
    name: 'Samuel Osei',
    role: 'Trading Student · Accra',
    quote:
      'Waiting patiently for clean price sweeps turned rushed losses into calm, well-planned trades.',
  },
  {
    id: 'ft-09',
    slot: '09',
    image: img09,
    imageAlt: 'Student story portrait 09',
    name: 'Hana Takahashi',
    role: 'Market Student · Tokyo',
    quote:
      'Direct feedback from my coach spotted blind spots in my stop placement in the first two weeks.',
  },
  {
    id: 'ft-10',
    slot: '10',
    image: img10,
    imageAlt: 'Student story portrait 10',
    name: 'Lucas Lindholm',
    role: 'Course Graduate · Stockholm',
    quote:
      'Step-by-step lessons taught me how to protect my balance first before aiming for bigger targets.',
  },
  {
    id: 'ft-11',
    slot: '11',
    image: img11,
    imageAlt: 'Student story portrait 11',
    name: 'Amara Nwosu',
    role: 'Synthetics Trader · Abuja',
    quote:
      'Strict 1% safety limits protected my account during choppy weeks until clean trends arrived.',
  },
  {
    id: 'ft-12',
    slot: '12',
    image: img12,
    imageAlt: 'Student story portrait 12',
    name: 'Mateo Silva',
    role: 'Signals Member · São Paulo',
    quote:
      'Every daily signal explains the exact reason behind the trade so I actually learn while following.',
  },
  {
    id: 'ft-13',
    slot: '13',
    image: img13,
    imageAlt: 'Student story portrait 13',
    name: 'Priya Nair',
    role: 'Forex Trader · Singapore',
    quote:
      'Checking the bigger daily trend before picking my entry sharpened my timing right away.',
  },
  {
    id: 'ft-14',
    slot: '14',
    image: img14,
    imageAlt: 'Student story portrait 14',
    name: 'Kieran Gallagher',
    role: 'Course Graduate · Dublin',
    quote:
      'Weekly journal reviews kept me sticking to my plan instead of letting emotions drive trade size.',
  },
  {
    id: 'ft-15',
    slot: '15',
    image: img01,
    imageAlt: 'Student story portrait 15',
    name: 'Zainab Farooq',
    role: 'Gold & FX Student · Manchester',
    quote:
      'Zero hype, honest risk math, and a helpful community focused on steady, patient trading.',
  },
];
