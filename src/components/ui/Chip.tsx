'use client';

import React from 'react';

interface ChipProps {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

export function Chip({ active = false, onClick, children, size = 'md' }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`chip${active ? ' active' : ''}`}
      style={{ fontSize: size === 'sm' ? 12 : 14 }}
    >
      {children}
    </button>
  );
}
