import { ContourBg } from './ContourBg';

interface TestimonialCardProps {
  name: string;
  role: string;
  dest: string;
  text: string;
}

export function TestimonialCard({ name, role, dest, text }: TestimonialCardProps) {
  return (
    <div className="card p-7 relative">
      <div className="relative overflow-hidden">
        <ContourBg opacity={0.04} />
        <div className="text-[32px] text-gold opacity-40 font-serif leading-none mb-4">&quot;</div>
        <p className="text-[14px] text-foreground leading-relaxed mb-6 relative italic">{text}</p>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <div className="font-semibold text-[13px] text-foreground">{name}</div>
          <div className="text-[12px] text-muted mt-0.5">{role}</div>
        </div>
        <div className="text-[11px] font-mono text-gold bg-gold-dim px-2.5 py-1 rounded-full border border-gold/20">{dest}</div>
      </div>
    </div>
  );
}
