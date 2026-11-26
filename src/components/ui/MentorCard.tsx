import React, { useState } from 'react';
import { RotateCw } from 'lucide-react';
import { type MentorProfile } from '../../data/academyData';
import { SafeImage } from './SafeImage';
import { Button } from './Button';
import { ShieldFrame } from './TitanMotifs';
import { cn } from '../../lib/utils';

export interface MentorCardProps {
  mentor: MentorProfile;
  onBook?: (mentor: MentorProfile) => void;
}

export const MentorCard: React.FC<MentorCardProps> = ({ mentor, onBook }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="group relative h-[468px] [perspective:1200px]">
      <div
        className={cn(
          'relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]',
          flipped && '[transform:rotateY(180deg)]'
        )}
      >
        {/* Front Face */}
        <div className="absolute inset-0 rounded-lg hairline-gold overflow-hidden flex flex-col p-4 [backface-visibility:hidden]">
          <ShieldFrame variant="landscape" bright innerClassName="h-60 w-full">
            <SafeImage
              src={mentor.image}
              alt={`${mentor.name} — ${mentor.role}`}
              className="h-full w-full object-cover object-[52%_35%] brightness-[0.97] contrast-[1.05] saturate-[0.94] transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0B0C]/80 via-[#0B0B0C]/10 to-[#0B0B0C]/25"
            />
          </ShieldFrame>

          <div className="flex flex-1 flex-col justify-between pt-4 px-1">
            <div>
              <p className="font-mono text-[11px] font-semibold tracking-wider text-gold-gradient">
                {mentor.experience}
              </p>
              <h3 className="mt-1 font-display text-xl font-bold text-[#EDE6D6]">
                {mentor.name}
              </h3>
              <p className="text-xs text-[#9A968C]">{mentor.role}</p>
              <p className="mt-2 font-mono text-[11px] text-[#EDE6D6]/80">
                {mentor.markets}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#C9A24B]/15">
              <button
                type="button"
                onClick={() => setFlipped(true)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#9A968C] hover:text-[#F0D58A] transition-colors"
              >
                <RotateCw className="h-3.5 w-3.5" />
                Desk Bio &amp; Focus
              </button>
              {onBook && (
                <Button size="sm" variant="secondary" onClick={() => onBook(mentor)}>
                  Book Session
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 rounded-lg hairline-gold-bright p-6 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div>
            <p className="font-mono text-[11px] font-semibold tracking-wider text-gold-gradient">
              {mentor.specialty}
            </p>
            <h3 className="mt-1 font-display text-2xl font-bold text-[#EDE6D6]">
              {mentor.name}
            </h3>
            <p className="mt-3 text-sm text-[#9A968C] leading-relaxed">{mentor.bio}</p>

            <div className="mt-5 pt-4 border-t border-[#C9A24B]/18">
              <p className="text-xs font-medium text-[#EDE6D6] mb-2.5">Coaching Focus</p>
              <ul className="space-y-2">
                {mentor.focusAreas.map((area) => (
                  <li key={area} className="text-xs text-[#9A968C] flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rotate-45 bg-gold-gradient shrink-0" aria-hidden="true" />
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-4 border-t border-[#C9A24B]/18">
            <button
              type="button"
              onClick={() => setFlipped(false)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#9A968C] hover:text-[#EDE6D6] transition-colors"
            >
              <RotateCw className="h-3.5 w-3.5" />
              Back to Profile
            </button>
            {onBook && (
              <Button size="sm" variant="primary" onClick={() => onBook(mentor)}>
                Book Session
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
