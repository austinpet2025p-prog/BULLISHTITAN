import React from 'react';
import { Check } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { formatCurrency } from '../../lib/utils';

export interface PricingCardProps {
  title: string;
  subtitle: string;
  price: number;
  periodLabel?: string;
  features: string[];
  featured?: boolean;
  ctaLabel?: string;
  onSelect?: () => void;
  to?: string;
  metaTag?: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  subtitle,
  price,
  periodLabel = '/ month',
  features,
  featured = false,
  ctaLabel = 'Claim This Rank',
  onSelect,
  to,
  metaTag,
}) => {
  return (
    <Card featured={featured} hoverLift className="flex flex-col h-full">
      <div className="mb-5">
        {metaTag && (
          <p className="text-xs font-semibold text-gold-gradient mb-1.5">{metaTag}</p>
        )}
        <h3 className="text-xl font-semibold text-[#EDE6D6]">{title}</h3>
        <p className="mt-1.5 text-sm text-[#9A968C] leading-relaxed">{subtitle}</p>
      </div>

      <div className="mb-6 pb-6 border-b border-[#C9A24B]/18 flex items-baseline gap-2">
        <span className="font-mono text-3xl sm:text-4xl font-semibold text-[#EDE6D6] tabular-nums">
          {formatCurrency(price)}
        </span>
        <span className="text-xs text-[#9A968C]">{periodLabel}</span>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feat, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-sm text-[#EDE6D6]/90">
            <Check className="h-4 w-4 shrink-0 text-[#C9A24B] mt-0.5" />
            <span>{feat}</span>
          </li>
        ))}
      </ul>

      <Button
        variant={featured ? 'primary' : 'secondary'}
        fullWidth
        onClick={onSelect}
        to={to}
      >
        {ctaLabel}
      </Button>
    </Card>
  );
};
