'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ContourBg } from '@/components/ui/ContourBg';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { InfoBox } from '@/components/ui/InfoBox';
import { ACTIVITY_TYPE_ICONS } from '@/lib/icons';
import { getItinerary, getCosts, getTip } from '@/lib/api';
import type { ItineraryDayResponse, CostItem } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [days, setDays] = useState<ItineraryDayResponse[]>([]);
  const [costs, setCosts] = useState<CostItem[]>([]);
  const [total, setTotal] = useState(0);
  const [tip, setTip] = useState('');
  const [openDay, setOpenDay] = useState(0);
  const [loading, setLoading] = useState(true);
  const [chartVisible, setChartVisible] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const [tripId, setTripId] = useState('');
  const [dest, setDest] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('currentTripId') || '';
    const d = localStorage.getItem('currentTripDest') || '';
    const ci = localStorage.getItem('currentTripCheckIn') || '';
    const co = localStorage.getItem('currentTripCheckOut') || '';

    setTripId(id);
    setDest(d);
    setCheckIn(ci);
    setCheckOut(co);

    if (!id) { router.push('/wizard'); return; }

    Promise.all([
      getItinerary(id),
      getCosts(id),
      getTip(id),
    ]).then(([itinerary, costData, tipData]) => {
      setDays(itinerary);
      setCosts(costData.breakdown);
      setTotal(costData.total);
      setTip(tipData.tip);
      setLoading(false);
    }).catch(() => setLoading(false));

    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setChartVisible(true); }, { threshold: 0.3 });
    if (chartRef.current) obs.observe(chartRef.current);
    return () => obs.disconnect();
  }, [router]);

  if (loading) {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--gold)" style={{ animation: 'spin 1s linear infinite' }}>
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
        <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Carregando roteiro...</span>
      </div>
    );
  }

  const totalCost = (d: ItineraryDayResponse) =>
    d.activities.reduce((sum, a) => sum + a.cost, 0);

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-light)', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 64, zIndex: 10, backdropFilter: 'blur(12px)', background: 'rgba(13,14,18,0.85)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 20, fontWeight: 500 }}>{dest}</h2>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--ff-mono)', marginTop: 2 }}>
              {checkIn} → {checkOut}
            </div>
          </div>
        </div>
        <button className="btn-ghost" onClick={() => router.push('/wizard')} style={{ fontSize: 13 }}>
          ← Novo roteiro
        </button>
      </div>

      {/* 3-col layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 240px', height: 'calc(100vh - 128px)' }}>

        {/* COL 1 — Timeline */}
        <div style={{ borderRight: '1px solid var(--border-light)', overflowY: 'auto' }}>
          <div style={{ padding: '12px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)' }}>
            <SectionLabel>Roteiro · {days.length} dias</SectionLabel>
            <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 10, color: 'var(--gold)' }}>
              {days.reduce((s, d) => s + d.activities.length, 0)} atividades
            </span>
          </div>

          {days.map((day, di) => {
            const isOpen = openDay === di;
            return (
              <div key={day.id}>
                <button
                  onClick={() => setOpenDay(di)}
                  style={{ width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: isOpen ? 'rgba(200,169,110,0.04)' : 'transparent', border: 'none', borderBottom: '1px solid var(--border-light)', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: isOpen ? 'var(--gold)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontFamily: 'var(--ff-mono)', fontWeight: 700, color: isOpen ? '#0D0E12' : 'var(--text-muted)', flexShrink: 0 }}>
                      {day.dayNumber}
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: isOpen ? 'var(--text)' : 'var(--text-muted)' }}>
                        {day.title || `Dia ${day.dayNumber}`}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>{day.date}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {totalCost(day) > 0 && (
                      <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 10, color: 'var(--gold)' }}>
                        R$ {totalCost(day)}
                      </span>
                    )}
                    <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{isOpen ? '▲' : '▼'}</span>
                  </div>
                </button>

                {isOpen && day.activities.map((act, ai) => {
                  const Icon = ACTIVITY_TYPE_ICONS[act.type] || ACTIVITY_TYPE_ICONS['Passeio'];
                  return (
                    <div key={ai} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 16px 10px 24px', borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer' }}>
                      <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 9, color: 'var(--text-dim)', minWidth: 36, paddingTop: 2 }}>{act.time}</span>
                      <span style={{ fontSize: 14 }}>{act.icon || '📍'}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 500 }}>{act.name}</div>
                        {act.location && (
                          <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 1 }}>{act.location}</div>
                        )}
                        {act.desc && (
                          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.4 }}>{act.desc}</div>
                        )}
                      </div>
                      {act.estimatedCost && act.estimatedCost !== 'Gratuito' && (
                        <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 9, color: 'var(--gold)', background: 'rgba(200,169,110,0.08)', padding: '2px 6px', borderRadius: 3, whiteSpace: 'nowrap' }}>
                          {act.estimatedCost}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* COL 2 — Mapa */}
        <div style={{ background: '#0e1f2c', position: 'relative', overflow: 'hidden' }}>
          <svg width="100%" height="100%" viewBox="0 0 600 500" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <radialGradient id="mg" cx="45%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#1e3a4a" />
                <stop offset="100%" stopColor="#0e1f2c" />
              </radialGradient>
            </defs>
            <rect width="600" height="500" fill="url(#mg)" />
            {[60, 100, 140, 180, 220, 260, 300, 340, 380, 420, 460, 500, 540].map(x => (
              <line key={x} x1={x} y1="0" x2={x + 15} y2="500" stroke="#1e3245" strokeWidth="1" />
            ))}
            {days[openDay]?.mapPins?.map((pin, i) => (
              pin.coordinates && (
                <g key={i}>
                  <circle cx={200 + i * 60} cy={150 + i * 30} r="10" fill="var(--gold)" opacity="0.9" />
                  <text x={200 + i * 60} y={153 + i * 30} textAnchor="middle" fill="#0D0E12" fontSize="8" fontWeight="700">{i + 1}</text>
                  <text x={200 + i * 60} y={175 + i * 30} textAnchor="middle" fill="var(--text-muted)" fontSize="9">{pin.activity?.slice(0, 15)}</text>
                </g>
              )
            ))}
            <text x="12" y="488" fill="#3a5060" fontSize="9" fontFamily="monospace" letterSpacing="0.06em">{dest.toUpperCase()}</text>
          </svg>
        </div>

        {/* COL 3 — Custos */}
        <div ref={chartRef} style={{ borderLeft: '1px solid var(--border-light)', padding: '16px', overflowY: 'auto' }}>
          <div style={{ textAlign: 'center', paddingBottom: 14, borderBottom: '1px solid var(--border-light)', marginBottom: 14 }}>
            <SectionLabel style={{ marginBottom: 6 }}>Total estimado</SectionLabel>
            <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 28, color: 'var(--gold)', fontWeight: 500 }}>
              R$ {total.toLocaleString('pt-BR')}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>estimativa total</div>
          </div>

          {/* Donut */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <svg width="120" height="120" viewBox="0 0 200 200">
              {(() => {
                const r = 70, cx = 100, cy = 100, circ = 2 * Math.PI * r;
                let off = 0;
                return costs.map((c, i) => {
                  const dash = (c.pct / 100) * circ;
                  const el = (
                    <circle
                      key={i}
                      cx={cx} cy={cy} r={r}
                      fill="none"
                      stroke={c.color}
                      strokeWidth={chartVisible ? 20 : 0}
                      strokeDasharray={`${dash - 2} ${circ - dash + 2}`}
                      strokeDashoffset={-off}
                      style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px`, transition: 'stroke-width 0.6s ease' }}
                    />
                  );
                  off += dash;
                  return el;
                });
              })()}
              <text x="100" y="95" textAnchor="middle" fill="var(--gold)" fontSize="13" fontFamily="monospace" fontWeight="500">
                R${Math.round(total / 1000)}k
              </text>
              <text x="100" y="112" textAnchor="middle" fill="var(--text-muted)" fontSize="8">total</text>
            </svg>
          </div>

          {/* Breakdown */}
          {costs.map(c => (
            <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, flex: 1 }}>{c.label}</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--ff-mono)' }}>{c.pct}%</span>
              <span style={{ fontSize: 11, fontFamily: 'var(--ff-mono)' }}>R$ {c.value.toLocaleString('pt-BR')}</span>
            </div>
          ))}

          {/* Dica da IA */}
          {tip && (
            <InfoBox variant="blue" style={{ marginTop: 14 }}>
              <div style={{ fontSize: 10, color: 'var(--blue)', fontWeight: 600, marginBottom: 4 }}>Dica da IA</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.5 }}>{tip}</div>
            </InfoBox>
          )}

          <button
            onClick={() => router.push('/profile')}
            style={{ width: '100%', marginTop: 14, padding: '9px 0', background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer' }}
          >
            Ver minhas viagens
          </button>
        </div>
      </div>
    </div>
  );
}
