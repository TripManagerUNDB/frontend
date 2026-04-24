interface PlanFeatureProps {
  children: string;
  highlighted?: boolean;
}

export function PlanFeature({ children, highlighted = false }: PlanFeatureProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, fontSize: 13, color: highlighted ? 'var(--text)' : 'var(--text-muted)' }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
        <path d="M2 7l4 4 6-6" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {children}
    </div>
  );
}
