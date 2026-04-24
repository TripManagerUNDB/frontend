import type { ReactNode, CSSProperties } from 'react';

const VARIANTS = {
  gold:    { bg: 'rgba(200,169,110,0.04)', border: '1px solid rgba(200,169,110,0.15)', titleColor: 'var(--gold)' },
  blue:    { bg: 'rgba(74,127,165,0.07)',  border: '1px solid rgba(74,127,165,0.15)',  titleColor: 'var(--blue)' },
  neutral: { bg: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)',    titleColor: 'var(--text-muted)' },
} as const;

interface InfoBoxProps {
  variant?: keyof typeof VARIANTS;
  title?: string;
  children: ReactNode;
  style?: CSSProperties;
}

export function InfoBox({ variant = 'gold', title, children, style }: InfoBoxProps) {
  const v = VARIANTS[variant];
  return (
    <div style={{ padding: 16, borderRadius: 6, background: v.bg, border: v.border, ...style }}>
      {title && (
        <div style={{ fontSize: 11, color: v.titleColor, fontWeight: 600, marginBottom: 6 }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
