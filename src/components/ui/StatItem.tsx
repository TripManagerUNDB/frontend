interface StatItemProps {
  value: string | number;
  label: string;
  color?: 'gold' | 'text';
  fontSize?: number;
  align?: 'left' | 'center';
}

export function StatItem({ value, label, color = 'gold', fontSize = 26, align }: StatItemProps) {
  return (
    <div style={{ textAlign: align }}>
      <div style={{ fontFamily: 'var(--ff-mono)', fontSize, fontWeight: 500, color: color === 'gold' ? 'var(--gold)' : 'var(--text)' }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
        {label}
      </div>
    </div>
  );
}
