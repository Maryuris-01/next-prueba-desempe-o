import { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-[#eadbd3] bg-[#fffdfa] p-4 shadow-sm ${className}`}>
      {children}
    </div>
  );
}