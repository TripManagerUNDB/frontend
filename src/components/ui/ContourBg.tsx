import React from 'react';

export function ContourBg({ opacity = 0.06 }: { opacity?: number }) {
  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none" 
      viewBox="0 0 1200 700" 
      preserveAspectRatio="xMidYMid slice"
    >
      {[...Array(8)].map((_, i) => (
        <ellipse 
          key={`e1-${i}`} 
          cx={400 + i * 30} 
          cy={350} 
          rx={180 + i * 55} 
          ry={90 + i * 38}
          fill="none" 
          stroke="var(--gold)" 
          strokeWidth="0.8" 
          opacity={opacity - i * 0.005} 
        />
      ))}
      {[...Array(6)].map((_, i) => (
        <ellipse 
          key={`e2-${i}`} 
          cx={900} 
          cy={200} 
          rx={100 + i * 40} 
          ry={60 + i * 28}
          fill="none" 
          stroke="var(--gold)" 
          strokeWidth="0.6" 
          opacity={opacity - i * 0.006} 
        />
      ))}
      <path d="M0 350 Q300 280 600 350 Q900 420 1200 330" fill="none" stroke="var(--gold)" strokeWidth="0.5" opacity={opacity * 0.8} />
      <path d="M0 400 Q300 330 600 400 Q900 470 1200 380" fill="none" stroke="var(--gold)" strokeWidth="0.5" opacity={opacity * 0.6} />
      <path d="M100 0 Q200 180 300 250 Q400 320 450 500" fill="none" stroke="var(--gold)" strokeWidth="0.5" opacity={opacity * 0.7} />
      <path d="M800 0 Q750 150 720 300 Q690 450 700 700" fill="none" stroke="var(--gold)" strokeWidth="0.5" opacity={opacity * 0.7} />
    </svg>
  );
}
