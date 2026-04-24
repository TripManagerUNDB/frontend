interface StepHeadingProps {
  title: string;
  subtitle?: string;
}

export function StepHeading({ title, subtitle }: StepHeadingProps) {
  return (
    <>
      <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 26, fontWeight: 500, color: 'var(--text)', marginBottom: subtitle ? 8 : 0 }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{subtitle}</p>
      )}
    </>
  );
}
