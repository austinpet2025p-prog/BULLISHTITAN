import React, { useId } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SocialPlatformLink {
  id: 'instagram' | 'x' | 'tiktok' | 'youtube' | 'gmail';
  name: string;
  handle: string;
  href: string;
  external: boolean;
  tileClass: string;
  ariaLabel: string;
}

export const SOCIAL_LINKS: SocialPlatformLink[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@_bullishtitan',
    href: 'https://www.instagram.com/_bullishtitan/',
    external: true,
    tileClass:
      'bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fdf497_5%,#fd5949_45%,#d6249f_60%,#285AEB_90%)] shadow-[0_6px_18px_rgba(214,36,159,0.28)] border border-white/20',
    ariaLabel: 'Bullish Titan on Instagram (@_bullishtitan)',
  },
  {
    id: 'x',
    name: 'X',
    handle: '@bullishtitan',
    href: 'https://x.com/bullishtitan',
    external: true,
    tileClass:
      'bg-[#000000] border border-white/25 hover:border-white/60 shadow-[0_6px_18px_rgba(255,255,255,0.08)]',
    ariaLabel: 'Bullish Titan on X (@bullishtitan)',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    handle: '@bullishtitan',
    href: 'https://www.tiktok.com/@bullishtitan',
    external: true,
    tileClass:
      'bg-[#010101] border border-[#25F4EE]/35 hover:border-[#FE2C55]/70 shadow-[0_6px_18px_rgba(37,244,238,0.16)]',
    ariaLabel: 'Bullish Titan on TikTok (@bullishtitan)',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    handle: '@Bullish_Titan',
    href: 'https://www.youtube.com/@Bullish_Titan',
    external: true,
    tileClass:
      'bg-[#FF0000] border border-white/15 shadow-[0_6px_18px_rgba(255,0,0,0.28)]',
    ariaLabel: 'Bullish Titan on YouTube (@Bullish_Titan)',
  },
  {
    id: 'gmail',
    name: 'Email',
    handle: 'bullishtitan@gmail.com',
    href: 'mailto:bullishtitan@gmail.com',
    external: false,
    tileClass:
      'bg-[#FFFFFF] border border-white/40 shadow-[0_6px_18px_rgba(255,255,255,0.14)]',
    ariaLabel: 'Email Bullish Titan at bullishtitan@gmail.com',
  },
];

const PlatformIcon: React.FC<{ id: SocialPlatformLink['id']; sizeClass?: string }> = ({
  id,
  sizeClass = 'h-5 w-5',
}) => {
  const uid = useId();
  switch (id) {
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={sizeClass} aria-hidden="true">
          <rect
            x="2.75"
            y="2.75"
            width="18.5"
            height="18.5"
            rx="5.25"
            stroke="#FFFFFF"
            strokeWidth="2.1"
          />
          <circle cx="12" cy="12" r="4.2" stroke="#FFFFFF" strokeWidth="2.1" />
          <circle cx="17.4" cy="6.6" r="1.3" fill="#FFFFFF" />
        </svg>
      );
    case 'x':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={sizeClass} aria-hidden="true">
          <path
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
            fill="#FFFFFF"
          />
        </svg>
      );
    case 'tiktok':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={sizeClass} aria-hidden="true">
          {/* Cyan chromatic layer */}
          <path
            d="M15.8 3.2c.4 1.9 1.6 3.3 3.4 3.7v2.6c-1.4-.05-2.6-.5-3.6-1.25v5.45a5.1 5.1 0 1 1-4.4-5.05v2.75a2.4 2.4 0 1 0 1.7 2.3V3.2h2.9z"
            fill="#25F4EE"
            transform="translate(-0.7 -0.5)"
          />
          {/* Magenta chromatic layer */}
          <path
            d="M15.8 3.2c.4 1.9 1.6 3.3 3.4 3.7v2.6c-1.4-.05-2.6-.5-3.6-1.25v5.45a5.1 5.1 0 1 1-4.4-5.05v2.75a2.4 2.4 0 1 0 1.7 2.3V3.2h2.9z"
            fill="#FE2C55"
            transform="translate(0.7 0.5)"
          />
          {/* White foreground note */}
          <path
            d="M15.8 3.2c.4 1.9 1.6 3.3 3.4 3.7v2.6c-1.4-.05-2.6-.5-3.6-1.25v5.45a5.1 5.1 0 1 1-4.4-5.05v2.75a2.4 2.4 0 1 0 1.7 2.3V3.2h2.9z"
            fill="#FFFFFF"
          />
        </svg>
      );
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={sizeClass} aria-hidden="true">
          <path
            d="M9.6 7.8v8.4l7.2-4.2-7.2-4.2z"
            fill="#FFFFFF"
          />
        </svg>
      );
    case 'gmail':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={sizeClass} aria-labelledby={uid}>
          <title id={uid}>Gmail</title>
          {/* Left Blue pillar */}
          <path d="M2.5 7.4V18a1.5 1.5 0 0 0 1.5 1.5h2.7v-8.4L2.5 7.4z" fill="#4285F4" />
          {/* Right Green pillar */}
          <path d="M21.5 7.4V18a1.5 1.5 0 0 1-1.5 1.5h-2.7v-8.4l4.2-3.7z" fill="#34A853" />
          {/* Right Yellow shoulder */}
          <path
            d="M17.3 11.1V5.6l2.3-1.7a1.5 1.5 0 0 1 2.4 1.2v2.3l-4.7 3.7z"
            fill="#FBBC05"
          />
          {/* Center Red M fold */}
          <path
            d="M6.7 11.1V5.6l5.3 4 5.3-4v5.5l-5.3 4-5.3-4z"
            fill="#EA4335"
          />
          {/* Left Dark Red shoulder */}
          <path
            d="M2.5 7.4V5.1a1.5 1.5 0 0 1 2.4-1.2l1.8 1.7v5.5L2.5 7.4z"
            fill="#C5221F"
          />
        </svg>
      );
  }
};

interface SocialLinksProps {
  variant?: 'icons' | 'cards';
  className?: string;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  variant = 'icons',
  className,
}) => {
  if (variant === 'cards') {
    return (
      <div className={cn('grid gap-2.5 sm:grid-cols-2', className)}>
        {SOCIAL_LINKS.map((item) => (
          <a
            key={item.id}
            href={item.href}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
            aria-label={item.ariaLabel}
            className="group flex items-center justify-between gap-3 rounded-xl border border-[#C9A24B]/22 bg-[#0B0B0C] px-3.5 py-2.5 hover:border-[#F0D58A]/55 hover:bg-[#121214] transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105',
                  item.tileClass
                )}
              >
                <PlatformIcon id={item.id} sizeClass="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#EDE6D6] group-hover:text-[#F0D58A] transition-colors">
                  {item.name}
                </p>
                <p className="text-[11px] font-mono text-[#9A968C] truncate">
                  {item.handle}
                </p>
              </div>
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[#9A968C] group-hover:text-[#F0D58A] transition-colors" />
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {SOCIAL_LINKS.map((item) => (
        <a
          key={item.id}
          href={item.href}
          target={item.external ? '_blank' : undefined}
          rel={item.external ? 'noopener noreferrer' : undefined}
          aria-label={item.ariaLabel}
          title={`${item.name}: ${item.handle}`}
          className={cn(
            'group flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-200 hover:-translate-y-0.5 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F0D58A]',
            item.tileClass
          )}
        >
          <PlatformIcon id={item.id} sizeClass="h-5 w-5" />
        </a>
      ))}
    </div>
  );
};
