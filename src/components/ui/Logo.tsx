import React from 'react';

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="12" stroke="var(--gold)" strokeWidth="1.2" />
      <circle cx="14" cy="14" r="1.5" fill="var(--gold)" />
      <path d="M14 4 L15.2 12.8 L14 14 L12.8 12.8 Z" fill="var(--gold)" />
      <path d="M14 24 L12.8 15.2 L14 14 L15.2 15.2 Z" fill="var(--text-muted)" opacity="0.5" />
      <path d="M4 14 L12.8 12.8 L14 14 L12.8 15.2 Z" fill="var(--text-muted)" opacity="0.5" />
      <path d="M24 14 L15.2 15.2 L14 14 L15.2 12.8 Z" fill="var(--text-muted)" opacity="0.5" />
    </svg>
  );
}
