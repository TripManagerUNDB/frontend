'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContourBg } from '@/components/ui/ContourBg';

interface SavedTrip {
  id: number;
  dest: string;
  dates: string;
  status: 'Planejada' | 'Concluída';
  days: number;
  cost: number;
  emoji: string;
  color: string;
}

const SAVED_TRIPS: SavedTrip[] = [
  { id: 1, dest: 'Paris, França',           dates: 'Jun 15–22, 2026',  status: 'Planejada',  days: 7,  cost: 8400,  emoji: '🗼', color: '#EA9940' },
  { id: 2, dest: 'Tóquio, Japão',           dates: 'Mar 2–12, 2026',   status: 'Concluída',  days: 10, cost: 12600, emoji: '⛩️', color: '#307082' },
  { id: 3, dest: 'Islândia',                dates: 'Jan 5–12, 2026',   status: 'Concluída',  days: 7,  cost: 9800,  emoji: '🌋', color: '#6CA3A2' },
  { id: 4, dest: 'Marrocos',                dates: 'Nov 10–18, 2025',  status: 'Concluída',  days: 8,  cost: 6200,  emoji: '🕌', color: '#EA9940' },
  { id: 5, dest: 'Buenos Aires, Argentina', dates: 'Set 20–27, 2025',  status: 'Concluída',  days: 7,  cost: 5100,  emoji: '🥩', color: '#307082' },
  { id: 6, dest: 'Lisboa, Portugal',        dates: 'Ago 1–7, 2025',    status: 'Concluída',  days: 6,  cost: 4800,  emoji: '🏰', color: '#6CA3A2' },
];

const PLAN_FEATURES = {
  free:    ['3 roteiros por mês', 'Exportação básica', 'Mapa interativo'],
  premium: ['Roteiros ilimitados', 'Exportação PDF/Excel', 'Reservas integradas', 'IA avançada', 'Suporte prioritário'],
};

const FILTERS = ['Todas', 'Planejada', 'Concluída'] as const;

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'viagens' | 'plano'>('viagens');
  const [filter, setFilter] = useState<typeof FILTERS[number]>('Todas');

  const shown = filter === 'Todas' ? SAVED_TRIPS : SAVED_TRIPS.filter(t => t.status === filter);

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)' }}>
      {/* Profile header */}
      <div style={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--border-light)', padding: '48px 48px 36px' }}>
        <ContourBg opacity={0.04} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {/* Avatar */}
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold-dim), rgba(74,127,165,0.2))', border: '2px solid rgba(200,169,110,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--ff-display)', fontSize: 28, color: 'var(--gold)' }}>A</span>
            </div>

            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: 28, fontWeight: 500, marginBottom: 4 }}>Ana Lima</h1>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>ana@email.com · Membro desde Jan 2025</div>
            </div>

            {/* Plan badge */}
            <div style={{ background: '#1a2d3a', border: '1px solid var(--border-light)', borderRadius: 10, padding: '16px 24px', textAlign: 'center', minWidth: 180 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>Plano atual</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.2)', borderRadius: 100, padding: '4px 14px', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600 }}>Gratuito</span>
              </div>
              <button className="btn-primary" style={{ display: 'block', width: '100%', justifyContent: 'center', fontSize: 12, padding: '9px 0', textAlign: 'center' }}>
                Upgrade → Premium
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 28 }}>
              {[
                { n: SAVED_TRIPS.length,                                                     l: 'Viagens'       },
                { n: SAVED_TRIPS.reduce((a, t) => a + t.days, 0),                           l: 'Dias viajados' },
                { n: 'R$ ' + (SAVED_TRIPS.reduce((a, t) => a + t.cost, 0) / 1000).toFixed(0) + 'k', l: 'Investido' },
              ].map(({ n, l }) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 24, color: 'var(--text)', fontWeight: 500 }}>{n}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0, marginTop: 32, borderBottom: '1px solid var(--border-light)', marginLeft: -48, paddingLeft: 48, marginRight: -48 }}>
            {(['viagens', 'plano'] as const).map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{ padding: '10px 20px', fontSize: 13, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', color: activeTab === t ? 'var(--gold)' : 'var(--text-muted)', borderBottom: activeTab === t ? '2px solid var(--gold)' : '2px solid transparent', marginBottom: -1, textTransform: 'capitalize', transition: 'color 0.2s' }}
              >
                {t === 'viagens' ? 'Minhas Viagens' : 'Plano & Assinatura'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 48px' }}>
        {activeTab === 'viagens' && (
          <>
            {/* Filter + new trip */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {FILTERS.map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={filter === f ? 'chip active' : 'chip'}
                    style={{ fontSize: 12, padding: '6px 14px' }}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <button className="btn-primary" onClick={() => router.push('/wizard')} style={{ fontSize: 13, padding: '10px 22px' }}>
                + Nova viagem
              </button>
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {shown.map(trip => (
                <TripCard key={trip.id} trip={trip} onClick={() => router.push('/dashboard')} />
              ))}
              <div
                onClick={() => router.push('/wizard')}
                style={{ border: '1.5px dashed var(--border)', borderRadius: 10, padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s', minHeight: 220 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(200,169,110,0.4)'; e.currentTarget.style.background = 'rgba(200,169,110,0.03)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--gold-dim)', border: '1px solid rgba(200,169,110,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 3v12M3 9h12" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Planejar nova viagem</span>
              </div>
            </div>
          </>
        )}

        {activeTab === 'plano' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 780 }}>
            {/* Free plan */}
            <div className="card" style={{ padding: 32, position: 'relative' }}>
              <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16, fontWeight: 600 }}>Gratuito</div>
              <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 36, color: 'var(--text)', marginBottom: 4 }}>R$ 0</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>para sempre</div>
              <div style={{ position: 'absolute', top: 16, right: 16, background: 'var(--gold-dim)', border: '1px solid rgba(200,169,110,0.3)', borderRadius: 100, padding: '3px 10px', fontSize: 11, color: 'var(--gold)' }}>Ativo</div>
              {PLAN_FEATURES.free.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, fontSize: 13, color: 'var(--text-muted)' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7l4 4 6-6" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {f}
                </div>
              ))}
            </div>

            {/* Premium plan */}
            <div style={{ padding: 32, borderRadius: 10, background: 'linear-gradient(135deg, rgba(200,169,110,0.08) 0%, rgba(74,127,165,0.06) 100%)', border: '1px solid rgba(200,169,110,0.25)', boxShadow: '0 0 40px rgba(200,169,110,0.06)', position: 'relative', overflow: 'hidden' }}>
              <ContourBg opacity={0.05} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16, fontWeight: 600 }}>Premium</div>
                <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 36, color: 'var(--text)', marginBottom: 4 }}>R$ 29</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>por mês · cancele quando quiser</div>
                {PLAN_FEATURES.premium.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, fontSize: 13, color: 'var(--text)' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7l4 4 6-6" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </div>
                ))}
                <button className="btn-primary" style={{ marginTop: 20, width: '100%', justifyContent: 'center', fontSize: 14 }}>Assinar Premium</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TripCard({ trip, onClick }: { trip: SavedTrip; onClick: () => void }) {
  const rgb = trip.color === '#EA9940' ? '234,153,64' : trip.color === '#307082' ? '48,112,130' : '108,163,162';

  return (
    <div className="card" onClick={onClick} style={{ cursor: 'pointer', overflow: 'hidden', position: 'relative' }}>
      <div style={{ height: 130, background: `linear-gradient(135deg, rgba(${rgb},0.2) 0%, rgba(18,33,46,0.95) 100%)`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ContourBg opacity={0.06} />
        <span style={{ fontSize: 48, position: 'relative', zIndex: 1 }}>{trip.emoji}</span>
        <div style={{ position: 'absolute', top: 12, right: 12 }}>
          <span style={{
            fontSize: 10, padding: '3px 8px', borderRadius: 100, fontWeight: 600,
            background: trip.status === 'Planejada' ? 'rgba(234,153,64,0.15)' : 'rgba(48,112,130,0.15)',
            border: `1px solid ${trip.status === 'Planejada' ? 'rgba(234,153,64,0.3)' : 'rgba(48,112,130,0.35)'}`,
            color: trip.status === 'Planejada' ? 'var(--gold)' : '#307082',
          }}>
            {trip.status}
          </span>
        </div>
      </div>

      <div style={{ padding: '18px 20px 20px' }}>
        <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: 17, fontWeight: 500, marginBottom: 4, color: 'var(--text)' }}>{trip.dest}</h3>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>{trip.dates}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--ff-mono)' }}>{trip.days} dias</span>
          <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 13, color: 'var(--gold)' }}>R$ {trip.cost.toLocaleString('pt-BR')}</span>
        </div>
      </div>
    </div>
  );
}
