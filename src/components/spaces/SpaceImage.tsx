'use client';

import { useState } from 'react';

type SpaceImageProps = { src?: string | null; alt: string; className?: string };

export function SpaceImage({ src, alt, className = '' }: SpaceImageProps) {
  const [failed, setFailed] = useState(!src || src.includes('...'));

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-[radial-gradient(ellipse_at_68%_30%,#f7efe5_0%,#d7c3ad_45%,#b58a78_100%)] text-4xl text-white ${className}`}
      >
        <span aria-hidden="true">☀</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src ?? ''} alt={alt} onError={() => setFailed(true)} className={className} />
  );
}
