import React from 'react';

export const SignalAnatomyIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 420 220"
    className={`w-full h-auto rounded-2xl border border-[#C9A24B]/24 bg-[#000000] ${className}`}
    aria-label="Annotated Forex and Synthetic Indices trade setup anatomy diagram showing stop loss, entry zone, and take profit targets"
  >
    <defs>
      <linearGradient id="anatomyGoldGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#8C6A1F" />
        <stop offset="50%" stopColor="#C9A24B" />
        <stop offset="100%" stopColor="#F0D58A" />
      </linearGradient>
    </defs>

    {/* Subtle target & invalidation lines */}
    <line x1="20" y1="45" x2="400" y2="45" stroke="#1F9D6B" strokeOpacity="0.32" strokeDasharray="4 4" />
    <line x1="20" y1="80" x2="400" y2="80" stroke="#1F9D6B" strokeOpacity="0.32" strokeDasharray="4 4" />
    <line x1="20" y1="145" x2="400" y2="145" stroke="url(#anatomyGoldGrad)" strokeOpacity="0.6" strokeWidth="1.2" />
    <line x1="20" y1="185" x2="400" y2="185" stroke="#EF4444" strokeOpacity="0.5" strokeWidth="1.2" />

    {/* Target & Risk shaded bands */}
    <rect x="195" y="45" width="190" height="100" fill="#1F9D6B" fillOpacity="0.08" />
    <rect x="195" y="145" width="190" height="40" fill="#EF4444" fillOpacity="0.08" />

    {/* Candlesticks leading into liquidity sweep & entry */}
    <rect x="44" y="102" width="12" height="32" rx="2" fill="#8C6A1F" />
    <line x1="50" y1="92" x2="50" y2="142" stroke="#8C6A1F" strokeWidth="1.5" />

    <rect x="74" y="118" width="12" height="26" rx="2" fill="#8C6A1F" />
    <line x1="80" y1="110" x2="80" y2="152" stroke="#8C6A1F" strokeWidth="1.5" />

    <rect x="104" y="132" width="12" height="34" rx="2" fill="#8C6A1F" />
    <line x1="110" y1="126" x2="110" y2="176" stroke="#8C6A1F" strokeWidth="1.5" />

    {/* Sweep & bullish displacement */}
    <rect x="134" y="128" width="12" height="30" rx="2" fill="#C9A24B" />
    <line x1="140" y1="120" x2="140" y2="168" stroke="#C9A24B" strokeWidth="1.5" />

    <rect x="164" y="106" width="12" height="34" rx="2" fill="#C9A24B" />
    <line x1="170" y1="98" x2="170" y2="145" stroke="#C9A24B" strokeWidth="1.5" />

    {/* Entry confirmation candle */}
    <rect x="198" y="114" width="12" height="28" rx="2" fill="#F0D58A" />
    <line x1="204" y1="108" x2="204" y2="148" stroke="#F0D58A" strokeWidth="1.5" />

    <rect x="234" y="84" width="12" height="36" rx="2" fill="#1F9D6B" />
    <line x1="240" y1="76" x2="240" y2="128" stroke="#1F9D6B" strokeWidth="1.5" />

    <rect x="270" y="54" width="12" height="38" rx="2" fill="#1F9D6B" />
    <line x1="276" y1="42" x2="276" y2="100" stroke="#1F9D6B" strokeWidth="1.5" />

    {/* Labels */}
    <text x="305" y="40" fill="#1F9D6B" fontSize="10" fontFamily="JetBrains Mono, monospace">
      TP2 / TP3 TARGETS
    </text>
    <text x="305" y="75" fill="#1F9D6B" fontSize="10" fontFamily="JetBrains Mono, monospace">
      TP1 PARTIAL (1:1.5)
    </text>
    <text x="305" y="140" fill="#F0D58A" fontSize="10" fontFamily="JetBrains Mono, monospace">
      ENTRY ZONE
    </text>
    <text x="305" y="180" fill="#EF4444" fontSize="10" fontFamily="JetBrains Mono, monospace">
      STOP LOSS (SAFETY)
    </text>
  </svg>
);

export const LiquidityCycleIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 320 160"
    className={`w-full h-auto ${className}`}
    aria-label="Bullish Titan metallic gold liquidity cycle trajectory diagram"
  >
    <defs>
      <linearGradient id="titanMetallicGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#8C6A1F" />
        <stop offset="52%" stopColor="#C9A24B" />
        <stop offset="100%" stopColor="#F0D58A" />
      </linearGradient>
    </defs>
    <rect
      x="8"
      y="8"
      width="304"
      height="144"
      rx="18"
      fill="#0B0B0C"
      stroke="url(#titanMetallicGrad)"
      strokeOpacity="0.4"
      strokeWidth="1"
    />
    <path
      d="M36 116 L84 96 L124 108 L174 62 L214 78 L278 36"
      fill="none"
      stroke="url(#titanMetallicGrad)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {[
      { x: 84, y: 96, c: '#8C6A1F' },
      { x: 174, y: 62, c: '#C9A24B' },
      { x: 278, y: 36, c: '#F0D58A' },
    ].map((pt, i) => (
      <circle key={i} cx={pt.x} cy={pt.y} r="5" fill={pt.c} />
    ))}
  </svg>
);
