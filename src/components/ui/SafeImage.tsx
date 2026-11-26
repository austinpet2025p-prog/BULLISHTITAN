import React, { useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className,
  fallbackTitle,
  ...props
}) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt || fallbackTitle || 'Visual placeholder'}
        className={cn(
          'flex flex-col items-center justify-center bg-gradient-to-br from-[#0B0B0C] via-[#141414] to-[#000000] text-[#9A968C] p-4 text-center',
          className
        )}
      >
        <ImageOff className="h-6 w-6 text-[#C9A24B]/80 mb-2" />
        <span className="text-xs font-medium text-[#EDE6D6]/80">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={props.width ?? 800}
      height={props.height ?? 600}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      {...props}
    />
  );
};
