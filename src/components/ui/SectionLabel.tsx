import type { ReactNode, CSSProperties } from 'react';

interface SectionLabelProps {
  children: ReactNode;
  color?: 'gold' | 'muted';
  style?: CSSProperties;
}

export function SectionLabel({ children, color = 'muted', style }: SectionLabelProps) {
  return (
    <div style={{
      fontSize: 11,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: color === 'gold' ? 'var(--gold)' : 'var(--text-muted)',
      fontWeight: 600,
      ...style,
    }}>
      {children}
    </div>
  );
}
