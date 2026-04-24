'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ContourBg } from '@/components/ui/ContourBg';
import { useTrip } from '@/context/TripContext';

interface Activity {
  time: string;
  name: string;
  type: string;
  icon: string;
  dur: string;
  cost: number;
  desc: string;
}

interface Day {
  day: number;
  date: string;
  activities: Activity[];
}

interface CostItem {
  label: string;
  value: number;
  color: string;
  pct: number;
}

interface Pin {
  x: number;
  y: number;
  label: number;
  name: string;
}

const DAYS: Day[] = [
  {
    day: 1, date: 'Seg, 15 Jun',
    activities: [
      { time: '09:00', name: 'Torre Eiffel',   type: 'Monumento',   icon: '🗼', dur: '2h', cost: 120, desc: 'Vista panorâmica da cidade. Chegue cedo para evitar filas.' },
      { time: '12:30', name: 'Café de Flore',  type: 'Restaurante', icon: '☕', dur: '1h', cost: 85,  desc: 'Café histórico no coração de Saint-Germain.' },
      { time: '15:00', name: 'Musée du Louvre',type: 'Museu',       icon: '🎨', dur: '3h', cost: 95,  desc: 'Reserve ingresso online. Foque em ala grega e Mona Lisa.' },
      { time: '20:00', name: 'Le Comptoir',    type: 'Restaurante', icon: '🍽️', dur: '2h', cost: 180, desc: 'Bistrô clássico parisiense com menu sazonal.' },
    ],
  },
  {
    day: 2, date: 'Ter, 16 Jun',
    activities: [
      { time: '10:00', name: 'Marais District', type: 'Bairro', icon: '🏛️', dur: '3h', cost: 0,  desc: 'Explore galerias, ateliês e a Place des Vosges.' },
      { time: '14:00', name: 'Centre Pompidou', type: 'Museu',  icon: '🎭', dur: '2h', cost: 75, desc: 'Arte moderna e contemporânea. Vista incrível do terraço.' },
      { time: '19:00', name: 'Rue de Bretagne', type: 'Bairro', icon: '🌆', dur: '2h', cost: 60, desc: 'Mercado coberto e bares naturais locais.' },
    ],
  },
  {
    day: 3, date: 'Qua, 17 Jun',
    activities: [
      { time: '09:30', name: 'Versalhes',        type: 'Palácio',    icon: '🏰', dur: '5h', cost: 240, desc: 'Excursão de dia inteiro. Reserve guia local para Trianon.' },
      { time: '20:30', name: 'Brasserie Lipp',   type: 'Restaurante',icon: '🍷', dur: '2h', cost: 160, desc: 'Jantar em brasserie centenária com especialidades alsacianas.' },
    ],
  },
  {
    day: 4, date: 'Qui, 18 Jun',
    activities: [
      { time: '10:00', name: 'Montmartre',         type: 'Bairro',  icon: '🎨', dur: '3h', cost: 0,   desc: 'Suba a pé e visite ateliês de artistas.' },
      { time: '13:30', name: 'Sacré-Cœur',        type: 'Igreja',  icon: '⛪', dur: '1h', cost: 0,   desc: 'Vista de 360° de Paris. Entrada gratuita.' },
      { time: '16:00', name: 'Galeries Lafayette', type: 'Compras', icon: '🛍️', dur: '2h', cost: 300, desc: 'Dôme art nouveau e rooftop com vista para a Ópera.' },
    ],
  },
];

const COST_BREAKDOWN: CostItem[] = [
  { label: 'Voo',         value: 3200, color: '#EA9940', pct: 38 },
  { label: 'Hotel',       value: 2800, color: '#307082', pct: 33 },
  { label: 'Alimentação', value: 1400, color: '#6CA3A2', pct: 17 },
  { label: 'Transporte',  value: 600,  color: '#ECE7DC', pct: 7  },
  { label: 'Atrações',    value: 400,  color: '#243545', pct: 5  },
];

const PINS: Pin[] = [
  { x: 210, y: 95,  label: 1, name: 'Torre Eiffel' },
  { x: 310, y: 130, label: 2, name: 'Louvre'       },
  { x: 360, y: 100, label: 3, name: 'Marais'       },
  { x: 265, y: 155, label: 4, name: 'Pompidou'     },
  { x: 190, y: 170, label: 5, name: 'Montmartre'   },
];

export default function DashboardPage() {
  const router = useRouter();
  const { tripData } = useTrip();
  const [openDay, setOpenDay] = useState(0);
  const [selectedPin, setSelectedPin] = useState<number | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [pinsVisible, setPinsVisible] = useState(false);
  const [chartVisible, setChartVisible] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const dest     = tripData?.destination || 'Paris, França';
  const checkIn  = tripData?.checkIn  ? new Date(tripData.checkIn).toLocaleDateString('pt-BR',  { day: 'numeric', month: 'short' }) : '15 Jun';
  const checkOut = tripData?.checkOut ? new Date(tripData.checkOut).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }) : '22 Jun';

  useEffect(() => {
    const t = setTimeout(() => setPinsVisible(true), 400);
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setChartVisible(true); }, { threshold: 0.3 });
    if (chartRef.current) obs.observe(chartRef.current);
    return () => { clearTimeout(t); obs.disconnect(); };
  }, []);

  const INTEREST_ICONS: Record<string, string> = { praia: '🏖️', cultura: '🏛️', gastro: '🍽️', natureza: '🌲', noite: '🎭', familia: '👨‍👩‍👧', romance: '💑', solo: '🎒' };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)' }}>
      {/* Sticky header */}
      <div style={{ position: 'sticky', top: 64, zIndex: 100, background: 'rgba(18,33,46,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border-light)', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div>
            <span style={{ fontFamily: 'var(--ff-display)', fontSize: 20, fontWeight: 500, color: 'var(--text)' }}>{dest}</span>
            <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--text-muted)', marginLeft: 12 }}>{checkIn} – {checkOut}</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {(tripData?.interests || ['cultura', 'gastro']).slice(0, 3).map(id => (
              <span key={id} style={{ fontSize: 11, padding: '3px 10px', background: 'var(--gold-dim)', border: '1px solid rgba(200,169,110,0.2)', borderRadius: 100, color: 'var(--gold)' }}>
                {INTEREST_ICONS[id] || '✈️'}
              </span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['Exportar PDF', 'Compartilhar', 'Salvar'].map(l => (
            <button key={l} className="btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }}>{l}</button>
          ))}
          <button className="btn-secondary" onClick={() => router.push('/wizard')} style={{ fontSize: 12, padding: '6px 16px' }}>← Novo roteiro</button>
        </div>
      </div>

      {/* 3-col layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 280px', gap: 0, height: 'calc(100vh - 128px)' }}>

        {/* COL 1: Timeline */}
        <div style={{ borderRight: '1px solid var(--border-light)', overflowY: 'auto', padding: '24px 0' }}>
          <div style={{ padding: '0 20px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Roteiro · {DAYS.length} dias
            </span>
            <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--gold)' }}>
              {DAYS.reduce((a, d) => a + d.activities.length, 0)} atividades
            </span>
          </div>
          {DAYS.map((d, di) => (
            <DayAccordion
              key={d.day}
              day={d}
              open={openDay === di}
              onToggle={() => setOpenDay(openDay === di ? -1 : di)}
              onSelectActivity={setSelectedActivity}
            />
          ))}
        </div>

        {/* COL 2: Map */}
        <div style={{ position: 'relative', background: '#0e1f2c', overflow: 'hidden' }}>
          <DarkMap pins={PINS} visible={pinsVisible} selected={selectedPin} onSelect={setSelectedPin} />
        </div>

        {/* COL 3: Cost Panel */}
        <div ref={chartRef} style={{ borderLeft: '1px solid var(--border-light)', overflowY: 'auto', padding: '24px 20px' }}>
          <div style={{ textAlign: 'center', padding: '24px 0 20px', borderBottom: '1px solid var(--border-light)', marginBottom: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10, fontWeight: 600 }}>Total estimado</div>
            <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 36, color: 'var(--gold)', fontWeight: 500, lineHeight: 1 }}>R$ 8.400</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>por pessoa · 7 noites</div>
          </div>

          <DonutChart data={COST_BREAKDOWN} visible={chartVisible} />

          <div style={{ marginTop: 20 }}>
            {COST_BREAKDOWN.map(c => (
              <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: 'var(--text)', flex: 1 }}>{c.label}</span>
                <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--text-muted)' }}>{c.pct}%</span>
                <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 13, color: 'var(--text)' }}>R$ {c.value.toLocaleString('pt-BR')}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}>Exportar roteiro PDF</button>
            <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}>Compartilhar roteiro</button>
          </div>

          <div style={{ marginTop: 16, padding: 12, background: 'rgba(74,127,165,0.07)', border: '1px solid rgba(74,127,165,0.15)', borderRadius: 6 }}>
            <div style={{ fontSize: 11, color: 'var(--blue)', fontWeight: 600, marginBottom: 4 }}>💡 Dica da IA</div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Viajando em junho, os preços de hotel são ~22% mais baixos que em julho. Considere reservar com 45+ dias de antecedência.
            </p>
          </div>
        </div>
      </div>

      {selectedActivity && (
        <AttractionModal activity={selectedActivity} onClose={() => setSelectedActivity(null)} />
      )}
    </div>
  );
}

function DayAccordion({ day, open, onToggle, onSelectActivity }: {
  day: Day;
  open: boolean;
  onToggle: () => void;
  onSelectActivity: (a: Activity) => void;
}) {
  const totalCost = day.activities.reduce((a, x) => a + x.cost, 0);

  return (
    <div style={{ borderBottom: '1px solid var(--border-light)' }}>
      <button
        onClick={onToggle}
        style={{ width: '100%', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: open ? 'rgba(200,169,110,0.04)' : 'transparent', border: 'none', cursor: 'pointer', transition: 'background 0.2s', color: 'var(--text)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: open ? 'var(--gold)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
            <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 11, color: open ? '#023047' : 'var(--text-muted)', fontWeight: 600 }}>{day.day}</span>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: open ? 'var(--text)' : 'var(--text-muted)' }}>Dia {day.day}</div>
            <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{day.date}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--gold)' }}>R$ {totalCost}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s', color: 'var(--text-muted)' }}>
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {open && (
        <div style={{ animation: 'fadeIn 0.25s ease' }}>
          {day.activities.map((act, ai) => (
            <div
              key={ai}
              onClick={() => onSelectActivity(act)}
              style={{ padding: '12px 20px 12px 32px', display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', borderTop: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 10, color: 'var(--text-dim)', minWidth: 38, paddingTop: 2 }}>{act.time}</span>
              <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{act.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{act.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{act.dur} · {act.type}</div>
              </div>
              {act.cost > 0 && (
                <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 10, color: 'var(--gold)', background: 'var(--gold-dim)', padding: '2px 7px', borderRadius: 3, flexShrink: 0, marginTop: 2 }}>
                  R${act.cost}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DarkMap({ pins, visible, selected, onSelect }: {
  pins: Pin[];
  visible: boolean;
  selected: number | null;
  onSelect: (i: number | null) => void;
}) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <svg width="100%" height="100%" viewBox="0 0 600 500" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <radialGradient id="mapGrad" cx="45%" cy="45%" r="55%">
            <stop offset="0%"   stopColor="#1e3a4a" />
            <stop offset="100%" stopColor="#0e1f2c" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feComposite in="SourceGraphic" in2="b" operator="over" />
          </filter>
        </defs>
        <rect width="600" height="500" fill="url(#mapGrad)" />

        {[60,100,140,180,220,260,300,340,380,420,460,500,540].map(x => (
          <line key={x} x1={x} y1="0" x2={x + 20} y2="500" stroke="#1e3245" strokeWidth="1" />
        ))}
        {[50,90,130,170,210,250,290,330,370,410,450].map(y => (
          <line key={y} x1="0" y1={y} x2="600" y2={y + 10} stroke="#1e3245" strokeWidth="1" />
        ))}

        <path d="M0 180 Q150 170 300 185 Q450 200 600 175" stroke="#1e3a4a" strokeWidth="7" fill="none" />
        <path d="M0 280 Q200 270 350 290 Q500 310 600 280" stroke="#1e3a4a" strokeWidth="7" fill="none" />
        <path d="M180 0 Q190 120 185 250 Q180 380 190 500" stroke="#1e3a4a" strokeWidth="7" fill="none" />
        <path d="M380 0 Q370 150 375 280 Q380 400 370 500" stroke="#1e3a4a" strokeWidth="7" fill="none" />

        <path d="M0 320 Q100 300 200 290 Q300 280 400 260 Q500 240 600 220" stroke="#0d1a24" strokeWidth="28" fill="none" />
        <path d="M0 320 Q100 300 200 290 Q300 280 400 260 Q500 240 600 220" stroke="#162430" strokeWidth="16" fill="none" />
        <path d="M0 320 Q100 300 200 290 Q300 280 400 260 Q500 240 600 220" stroke="rgba(48,112,130,0.45)" strokeWidth="2" fill="none" />

        <path
          d={`M${pins[0].x} ${pins[0].y} Q${(pins[0].x+pins[1].x)/2} ${pins[0].y-30} ${pins[1].x} ${pins[1].y} Q${(pins[1].x+pins[2].x)/2} ${(pins[1].y+pins[2].y)/2-20} ${pins[2].x} ${pins[2].y} Q${(pins[2].x+pins[3].x)/2} ${pins[2].y+15} ${pins[3].x} ${pins[3].y} L${pins[4].x} ${pins[4].y}`}
          stroke="var(--gold)" strokeWidth="1.5" fill="none" strokeDasharray="6 4" opacity="0.6"
          style={{ strokeDashoffset: visible ? 0 : 1000, transition: 'stroke-dashoffset 1.8s ease 0.3s' }}
        />

        {pins.map((p, i) => (
          <g
            key={i}
            style={{ cursor: 'pointer', animation: visible ? `bounce 0.5s ease ${i * 0.12 + 0.2}s both` : 'none' }}
            onClick={() => onSelect(selected === i ? null : i)}
          >
            <circle cx={p.x} cy={p.y} r={selected === i ? 22 : 18} fill="rgba(234,153,64,0.12)" />
            <circle cx={p.x} cy={p.y} r={11} fill={selected === i ? 'var(--gold)' : '#EA9940'} filter={selected === i ? 'url(#glow)' : undefined} />
            <text x={p.x} y={p.y + 4} textAnchor="middle" fill="#12212E" fontSize="9" fontFamily="DM Mono" fontWeight="700">{p.label}</text>
          </g>
        ))}

        {selected !== null && (() => {
          const p = pins[selected];
          const rx = Math.min(p.x + 20, 520);
          const ry = Math.max(p.y - 60, 10);
          return (
            <g>
              <rect x={rx} y={ry} width={160} height={44} rx="5" fill="#1a2d3a" stroke="rgba(234,153,64,0.3)" strokeWidth="1" />
              <text x={rx + 10} y={ry + 16} fill="var(--text)" fontSize="11" fontFamily="DM Sans" fontWeight="600">{p.name}</text>
              <text x={rx + 10} y={ry + 32} fill="var(--text-muted)" fontSize="10" fontFamily="DM Mono">Pin #{p.label}</text>
            </g>
          );
        })()}
      </svg>

      <div style={{ position: 'absolute', bottom: 16, left: 16, fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text-dim)', letterSpacing: '0.06em' }}>
        PARIS · ILE-DE-FRANCE
      </div>
      <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(22,24,32,0.8)', border: '1px solid var(--border-light)', borderRadius: 4, padding: '6px 10px', fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--ff-mono)' }}>
        {pins.length} pontos · {(DAYS.length * 1.4).toFixed(1)} km
      </div>
    </div>
  );
}

function DonutChart({ data, visible }: { data: CostItem[]; visible: boolean }) {
  const r = 70, cx = 100, cy = 100, circ = 2 * Math.PI * r;
  let offset = 0;
  const segments = data.map(d => {
    const dash = (d.pct / 100) * circ;
    const seg = { ...d, dash, offset };
    offset += dash + 2;
    return seg;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1E2030" strokeWidth="22" />
        {segments.map((s, i) => (
          <circle
            key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color} strokeWidth="20"
            strokeDasharray={visible ? `${s.dash - 2} ${circ - s.dash + 2}` : `0 ${circ}`}
            strokeDashoffset={-s.offset}
            style={{ transition: `stroke-dasharray 0.9s ease ${i * 0.15}s`, transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
          />
        ))}
        <text x={cx} y={cy - 6}  textAnchor="middle" fill="var(--gold)"       fontSize="16" fontFamily="DM Mono" fontWeight="500">R$8.400</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="var(--text-muted)" fontSize="9"  fontFamily="DM Sans">total estimado</text>
      </svg>
    </div>
  );
}

function AttractionModal({ activity, onClose }: { activity: Activity; onClose: () => void }) {
  const [added, setAdded] = useState(true);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s ease' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} onClick={onClose} />
      <div style={{ position: 'relative', width: 480, background: 'rgba(18,33,46,0.97)', border: '1px solid rgba(108,163,162,0.12)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.7)' }}>
        <div style={{ height: 180, background: 'linear-gradient(135deg, #1e3a4a 0%, #0e1f2c 100%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ContourBg opacity={0.08} />
          <span style={{ fontSize: 64, position: 'relative', zIndex: 1 }}>{activity.icon}</span>
          <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, zIndex: 2 }}>×</button>
        </div>

        <div style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 24, fontWeight: 500, marginBottom: 4 }}>{activity.name}</h2>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '3px 10px', borderRadius: 100 }}>{activity.type}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', gap: 2, justifyContent: 'flex-end', marginBottom: 4 }}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="12" height="12" viewBox="0 0 12 12">
                    <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9.3,11 6,9.2 2.7,11 3.5,7.5 1,5 4.5,4.5" fill={i < 4 ? 'var(--gold)' : 'var(--border)'} />
                  </svg>
                ))}
              </div>
              <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--text-muted)' }}>4.2 / 5.0</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
            {([['Horário', '09:00 – 18:00'], ['Duração', activity.dur], ['Custo', activity.cost > 0 ? `R$ ${activity.cost}` : 'Gratuito']] as [string, string][]).map(([k, v]) => (
              <div key={k} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 6, border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{k}</div>
                <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 13, color: 'var(--text)' }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--blue)', fontWeight: 600, marginBottom: 8 }}>💡 Dica local</div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{activity.desc}</p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className={added ? 'btn-secondary' : 'btn-primary'}
              onClick={() => setAdded(!added)}
              style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}
            >
              {added ? '✓ No roteiro' : '+ Adicionar ao roteiro'}
            </button>
            <button className="btn-ghost" style={{ fontSize: 13 }}>Ver no mapa</button>
          </div>
        </div>
      </div>
    </div>
  );
}
