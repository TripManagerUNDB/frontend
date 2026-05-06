'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ContourBg } from '@/components/ui/ContourBg';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { InfoBox } from '@/components/ui/InfoBox';
import { useTrip } from '@/context/TripContext';
import type { Activity, ItineraryDay, MapPin } from '@/types/trip';
import { formatDateBR } from '@/lib/utils';
import { INTEREST_ICONS, ACTIVITY_TYPE_ICONS } from '@/lib/icons';

const LeafletMap = dynamic(
  () => import('@/components/ui/LeafletMap').then(m => m.LeafletMap),
  { ssr: false, loading: () => <div style={{ width: '100%', height: '100%', background: '#0e1f2c' }} /> },
);

interface CostItem {
  label: string;
  value: number;
  color: string;
  pct: number;
}

const DAYS: ItineraryDay[] = [
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
  { label: 'Passeios & Ingressos', value: 3360, color: '#EA9940', pct: 40 },
  { label: 'Alimentação',          value: 2520, color: '#6CA3A2', pct: 30 },
  { label: 'Transporte local',     value: 1260, color: '#307082', pct: 15 },
  { label: 'Compras',              value: 840,  color: '#ECE7DC', pct: 10 },
  { label: 'Imprevistos',          value: 420,  color: '#243545', pct: 5  },
];

const MAP_PINS: MapPin[] = [
  { coordinates: { lat: 48.8584, lng: 2.2945 }, activity: 'Torre Eiffel',       location: 'Champ de Mars',        day: 1, time: '09:00', type: 'passeio'     },
  { coordinates: { lat: 48.8539, lng: 2.3321 }, activity: 'Café de Flore',       location: 'Saint-Germain-des-Prés', day: 1, time: '12:30', type: 'restaurante' },
  { coordinates: { lat: 48.8606, lng: 2.3376 }, activity: 'Musée du Louvre',    location: 'Rue de Rivoli',         day: 1, time: '15:00', type: 'passeio'     },
  { coordinates: { lat: 48.8544, lng: 2.3344 }, activity: 'Le Comptoir',        location: 'Saint-Germain',         day: 1, time: '20:00', type: 'restaurante' },
  { coordinates: { lat: 48.8566, lng: 2.3522 }, activity: 'Marais District',    location: 'Le Marais',             day: 2, time: '10:00', type: 'passeio'     },
  { coordinates: { lat: 48.8607, lng: 2.3521 }, activity: 'Centre Pompidou',    location: 'Beaubourg',             day: 2, time: '14:00', type: 'passeio'     },
  { coordinates: { lat: 48.8631, lng: 2.3620 }, activity: 'Rue de Bretagne',    location: 'Haut-Marais',           day: 2, time: '19:00', type: 'restaurante' },
  { coordinates: { lat: 48.8049, lng: 2.1203 }, activity: 'Versalhes',          location: 'Versailles',            day: 3, time: '09:30', type: 'passeio'     },
  { coordinates: { lat: 48.8530, lng: 2.3319 }, activity: 'Brasserie Lipp',     location: 'Saint-Germain',         day: 3, time: '20:30', type: 'restaurante' },
  { coordinates: { lat: 48.8867, lng: 2.3431 }, activity: 'Montmartre',         location: '18ème arrondissement',  day: 4, time: '10:00', type: 'passeio'     },
  { coordinates: { lat: 48.8870, lng: 2.3435 }, activity: 'Sacré-Cœur',        location: 'Montmartre',            day: 4, time: '13:30', type: 'passeio'     },
  { coordinates: { lat: 48.8738, lng: 2.3318 }, activity: 'Galeries Lafayette', location: 'Opéra',                 day: 4, time: '16:00', type: 'passeio'     },
];

export default function DashboardPage() {
  const router = useRouter();
  const { tripData, tripResponse } = useTrip();
  const [openDay, setOpenDay] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [chartVisible, setChartVisible] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const dest     = tripData?.destination || 'Paris, França';
  const checkIn  = tripData?.checkIn  ? formatDateBR(tripData.checkIn)  : '15 Jun';
  const checkOut = tripData?.checkOut ? formatDateBR(tripData.checkOut) : '22 Jun';

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setChartVisible(true); }, { threshold: 0.3 });
    if (chartRef.current) obs.observe(chartRef.current);
    return () => obs.disconnect();
  }, []);

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
            {(tripData?.interests || ['cultura', 'gastro']).slice(0, 3).map(id => {
              const Icon = INTEREST_ICONS[id as keyof typeof INTEREST_ICONS];
              return (
                <span key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', background: 'var(--gold-dim)', border: '1px solid rgba(200,169,110,0.2)', borderRadius: 100, color: 'var(--gold)' }}>
                  {Icon ? <Icon size={12} weight="fill" /> : null}
                </span>
              );
            })}
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
            <SectionLabel>Roteiro · {DAYS.length} dias</SectionLabel>
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
          <LeafletMap
            pins={tripResponse?.map_pins ?? MAP_PINS}
            activeDay={openDay >= 0 ? DAYS[openDay].day : undefined}
          />
        </div>

        {/* COL 3: Cost Panel */}
        <div ref={chartRef} style={{ borderLeft: '1px solid var(--border-light)', overflowY: 'auto', padding: '24px 20px' }}>
          <div style={{ textAlign: 'center', padding: '24px 0 20px', borderBottom: '1px solid var(--border-light)', marginBottom: 24 }}>
            <SectionLabel style={{ marginBottom: 10 }}>Total estimado</SectionLabel>
            <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 36, color: 'var(--gold)', fontWeight: 500, lineHeight: 1 }}>R$ 8.400</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>por pessoa · 4 dias</div>
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

          <InfoBox variant="blue" title="Dica da IA" style={{ marginTop: 16 }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Viajando em junho, os preços de hotel são ~22% mais baixos que em julho. Considere reservar com 45+ dias de antecedência.
            </p>
          </InfoBox>
        </div>
      </div>

      {selectedActivity && (
        <AttractionModal activity={selectedActivity} onClose={() => setSelectedActivity(null)} />
      )}
    </div>
  );
}

function DayAccordion({ day, open, onToggle, onSelectActivity }: {
  day: ItineraryDay;
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
              <span style={{ flexShrink: 0, marginTop: 1, color: 'var(--gold)', display: 'flex' }}>
                {(() => { const Icon = ACTIVITY_TYPE_ICONS[act.type]; return Icon ? <Icon size={16} weight="duotone" /> : null; })()}
              </span>
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

          <InfoBox variant="blue" title="Dica local" style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{activity.desc}</p>
          </InfoBox>

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
