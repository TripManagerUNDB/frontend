'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ContourBg } from '@/components/ui/ContourBg';
import { StatItem } from '@/components/ui/StatItem';
import { PlanFeature } from '@/components/ui/PlanFeature';
import { listTrips, getUserInfo, clearAuth, updateTripStatus, deleteTrip } from '@/lib/api';
import type { TripResponse } from '@/lib/api';

const PLAN_FEATURES = {
  free: ['3 roteiros por mês', 'Exportação básica', 'Mapa interativo'],
  premium: ['Roteiros ilimitados', 'Exportação PDF/Excel', 'Reservas integradas', 'IA avançada', 'Suporte prioritário'],
};

const FILTERS = ['Todas', 'PLANEJADA', 'CONCLUIDA'] as const;
const FILTER_LABELS: Record<string, string> = { Todas: 'Todas', PLANEJADA: 'Planejada', CONCLUIDA: 'Concluída' };

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'viagens' | 'plano'>('viagens');
  const [filter, setFilter] = useState<typeof FILTERS[number]>('Todas');
  const [trips, setTrips] = useState<TripResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const user = getUserInfo();

  useEffect(() => {
    const status = filter === 'Todas' ? undefined : filter;
    listTrips(status)
      .then(data => { setTrips(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [filter]);

  const totalDays = trips.reduce((s, t) => s + t.days, 0);

  const formatDates = (t: TripResponse) => {
    const ci = t.checkIn ? new Date(t.checkIn).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : '';
    const co = t.checkOut ? new Date(t.checkOut).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
    return ci && co ? `${ci} – ${co}` : '';
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/');
  };

  const handleToggleStatus = async (e: React.MouseEvent, trip: TripResponse) => {
    e.stopPropagation();
    const newStatus = trip.status === 'PLANEJADA' ? 'CONCLUIDA' : 'PLANEJADA';
    try {
      const updated = await updateTripStatus(trip.id, newStatus);
      setTrips(prev => prev.map(t => t.id === trip.id ? updated : t));
    } catch {
      // silencia erro
    }
  };

  const handleDelete = async (e: React.MouseEvent, trip: TripResponse) => {
    e.stopPropagation();
    if (!confirm(`Deletar "${trip.destination}"? Esta ação não pode ser desfeita.`)) return;
    setDeletingId(trip.id);
    try {
      await deleteTrip(trip.id);
      setTrips(prev => prev.filter(t => t.id !== trip.id));
    } catch {
      // silencia erro
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)' }}>
      {/* Profile header */}
      <div style={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--border-light)', padding: '48px 48px 36px' }}>
        <ContourBg opacity={0.04} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold-dim), rgba(74,127,165,0.2))', border: '2px solid rgba(200,169,110,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--ff-display)', fontSize: 28, color: 'var(--gold)' }}>
                {user.name?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: 28, fontWeight: 500, marginBottom: 4 }}>{user.name || 'Usuário'}</h1>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{user.email}</div>
            </div>
            <div style={{ background: '#1a2d3a', border: '1px solid var(--border-light)', borderRadius: 10, padding: '16px 24px', textAlign: 'center', minWidth: 180 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>Plano atual</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.2)', borderRadius: 100, padding: '4px 14px', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600 }}>
                  {user.plan === 'PREMIUM' ? 'Premium' : 'Gratuito'}
                </span>
              </div>
              <button className="btn-primary" style={{ display: 'block', width: '100%', justifyContent: 'center', fontSize: 12, padding: '9px 0', textAlign: 'center' }}>
                Upgrade → Premium
              </button>
            </div>
            <div style={{ display: 'flex', gap: 28 }}>
              {[{ n: trips.length, l: 'Viagens' }, { n: totalDays, l: 'Dias viajados' }].map(({ n, l }) => (
                <StatItem key={l} value={n} label={l} color="text" fontSize={24} align="center" />
              ))}
            </div>
            <button onClick={handleLogout} style={{ fontSize: 12, color: 'var(--text-muted)', background: 'none', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: 6, cursor: 'pointer' }}>
              Sair
            </button>
          </div>

          <div style={{ display: 'flex', gap: 0, marginTop: 32, borderBottom: '1px solid var(--border-light)', marginLeft: -48, paddingLeft: 48 }}>
            {(['viagens', 'plano'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '10px 20px', fontSize: 13, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', color: activeTab === tab ? 'var(--gold)' : 'var(--text-muted)', borderBottom: activeTab === tab ? '2px solid var(--gold)' : '2px solid transparent', marginBottom: -1, textTransform: 'capitalize' }}>
                {tab === 'viagens' ? 'Minhas Viagens' : 'Plano & Assinatura'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 48px' }}>
        {activeTab === 'viagens' ? (
          <>
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 14px', borderRadius: 100, fontSize: 12, cursor: 'pointer', border: filter === f ? '1px solid var(--gold)' : '1px solid var(--border)', background: filter === f ? 'var(--gold-dim)' : 'transparent', color: filter === f ? 'var(--gold)' : 'var(--text-muted)' }}>
                  {FILTER_LABELS[f]}
                </button>
              ))}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>Carregando viagens...</div>
            ) : trips.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60 }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>✈️</div>
                <div style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 20 }}>Nenhuma viagem encontrada</div>
                <button className="btn-primary" onClick={() => router.push('/wizard')}>Planejar primeira viagem</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
                {trips.map(trip => (
                  <div
                    key={trip.id}
                    onClick={() => {
                      localStorage.setItem('currentTripId', trip.id);
                      localStorage.setItem('currentTripDest', trip.destination);
                      localStorage.setItem('currentTripCheckIn', trip.checkIn);
                      localStorage.setItem('currentTripCheckOut', trip.checkOut);
                      router.push('/dashboard');
                    }}
                    style={{ background: '#1a2d3a', border: '1px solid var(--border-light)', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s', opacity: deletingId === trip.id ? 0.5 : 1 }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(200,169,110,0.3)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; }}
                  >
                    <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${trip.color}22, ${trip.color}11)`, fontSize: 36, position: 'relative' }}>
                      {trip.emoji || '✈️'}
                      <button
                        onClick={e => handleDelete(e, trip)}
                        title="Deletar viagem"
                        style={{ position: 'absolute', top: 8, right: 8, width: 24, height: 24, borderRadius: '50%', background: 'rgba(220,53,69,0.15)', border: '1px solid rgba(220,53,69,0.3)', color: '#ff6b6b', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,53,69,0.3)'; e.currentTarget.style.borderColor = 'rgba(220,53,69,0.6)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,53,69,0.15)'; e.currentTarget.style.borderColor = 'rgba(220,53,69,0.3)'; }}
                      >
                        ×
                      </button>
                    </div>
                    <div style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{trip.destination}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>{formatDates(trip)}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 100, background: trip.status === 'PLANEJADA' ? 'rgba(200,169,110,0.1)' : 'rgba(76,175,80,0.1)', color: trip.status === 'PLANEJADA' ? 'var(--gold)' : '#4caf50', border: `1px solid ${trip.status === 'PLANEJADA' ? 'rgba(200,169,110,0.2)' : 'rgba(48,112,130,0.2)'}` }}>
                          {trip.status === 'PLANEJADA' ? 'Planejada' : 'Concluída'}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--ff-mono)' }}>{trip.days} dias</span>
                      </div>
                      <button
                        onClick={e => handleToggleStatus(e, trip)}
                        onMouseEnter={e => { if (trip.status === 'PLANEJADA') { e.currentTarget.style.background = 'rgba(76,175,80,0.15)'; e.currentTarget.style.borderColor = 'rgba(76,175,80,0.6)'; e.currentTarget.style.color = '#4caf50'; } }}
                        onMouseLeave={e => { e.currentTarget.style.background = trip.status === 'PLANEJADA' ? 'rgba(48,112,130,0.08)' : 'rgba(200,169,110,0.08)'; e.currentTarget.style.borderColor = trip.status === 'PLANEJADA' ? 'rgba(48,112,130,0.4)' : 'rgba(200,169,110,0.4)'; e.currentTarget.style.color = trip.status === 'PLANEJADA' ? 'var(--blue)' : 'var(--gold)'; }}
                        style={{ width: '100%', padding: '6px 0', borderRadius: 6, fontSize: 11, cursor: 'pointer', border: trip.status === 'PLANEJADA' ? '1px solid rgba(48,112,130,0.4)' : '1px solid rgba(200,169,110,0.4)', background: trip.status === 'PLANEJADA' ? 'rgba(48,112,130,0.08)' : 'rgba(200,169,110,0.08)', color: trip.status === 'PLANEJADA' ? 'var(--blue)' : 'var(--gold)' }}
                      >
                        {trip.status === 'PLANEJADA' ? '✓ Marcar como concluída' : '↩ Marcar como planejada'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 600 }}>
            {(['free', 'premium'] as const).map(plan => (
              <div key={plan} style={{ background: '#1a2d3a', border: plan === 'premium' ? '1px solid rgba(200,169,110,0.3)' : '1px solid var(--border-light)', borderRadius: 10, padding: 24, position: 'relative' }}>
                {plan === 'premium' && (
                  <div style={{ position: 'absolute', top: -1, right: 16, background: 'var(--gold)', color: '#0D0E12', fontSize: 9, fontWeight: 700, padding: '3px 10px', borderRadius: '0 0 6px 6px' }}>RECOMENDADO</div>
                )}
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{plan === 'free' ? 'Plano Gratuito' : 'Plano Premium'}</div>
                <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 24, color: plan === 'premium' ? 'var(--gold)' : 'var(--text)', marginBottom: 16 }}>
                  {plan === 'free' ? 'R$ 0/mês' : 'R$ 29/mês'}
                </div>
                {PLAN_FEATURES[plan].map(f => (
                  <PlanFeature key={f} highlighted={plan === 'premium'}>{f}</PlanFeature>
                ))}
                {plan === 'premium' && (
                  <button className="btn-primary" style={{ width: '100%', marginTop: 20, textAlign: 'center' }}>Assinar Premium</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
