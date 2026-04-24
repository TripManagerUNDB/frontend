import React from 'react';

type BadgeVariant = 'planejada' | 'concluida' | 'ativo' | 'gratuito' | 'premium';

const styles: Record<BadgeVariant, React.CSSProperties> = {
  planejada: {
    background: 'rgba(234,153,64,0.15)',
    border: '1px solid rgba(234,153,64,0.3)',
    color: 'var(--gold)',
  },
  concluida: {
    background: 'rgba(48,112,130,0.15)',
    border: '1px solid rgba(48,112,130,0.35)',
    color: '#307082',
  },
  ativo: {
    background: 'var(--gold-dim)',
    border: '1px solid rgba(200,169,110,0.3)',
    color: 'var(--gold)',
  },
  gratuito: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border-light)',
    color: 'var(--text-muted)',
  },
  premium: {
    background: 'rgba(200,169,110,0.08)',
    border: '1px solid rgba(200,169,110,0.2)',
    color: 'var(--gold)',
  },
};

const labels: Record<BadgeVariant, string> = {
  planejada: 'Planejada',
  concluida: 'Concluída',
  ativo:     'Ativo',
  gratuito:  'Gratuito',
  premium:   'Premium',
};

interface BadgeProps {
  variant: BadgeVariant;
  children?: React.ReactNode;
}

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 100, fontWeight: 600, display: 'inline-block', ...styles[variant] }}>
      {children ?? labels[variant]}
    </span>
  );
}
