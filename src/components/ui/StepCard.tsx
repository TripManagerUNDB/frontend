interface StepCardProps {
  num: string;
  title: string;
  body: string;
}

export function StepCard({ num, title, body }: StepCardProps) {
  return (
    <div className="card p-9 relative overflow-hidden">
      <div className="font-mono text-[64px] font-medium text-gold/10 absolute top-3 right-5 leading-none select-none">
        {num}
      </div>
      <div className="w-10 h-10 rounded-full bg-gold-dim border border-gold/30 flex items-center justify-center mb-6">
        <span className="font-mono text-[13px] text-gold font-medium">{num}</span>
      </div>
      <h3 className="font-display text-[22px] font-medium mb-3 text-foreground">{title}</h3>
      <p className="text-muted leading-relaxed text-[14px]">{body}</p>
    </div>
  );
}
