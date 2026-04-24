'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContourBg } from '@/components/ui/ContourBg';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatItem } from '@/components/ui/StatItem';
import { PlanFeature } from '@/components/ui/PlanFeature';
import type { SavedTrip } from '@/types/trip';

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
  const [tripPhotos, setTripPhotos] = useState<Record<number, string>>({});

  const shown = filter === 'Todas' ? SAVED_TRIPS : SAVED_TRIPS.filter(t => t.status === filter);

  const handlePhotoChange = (id: number, url: string | undefined) => {
    setTripPhotos(prev => {
      const next = { ...prev };
      if (url) next[id] = url;
      else delete next[id];
      return next;
    });
  };

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
                { n: SAVED_TRIPS.length,                                                      l: 'Viagens'       },
                { n: SAVED_TRIPS.reduce((a, t) => a + t.days, 0),                            l: 'Dias viajados' },
                { n: 'R$ ' + (SAVED_TRIPS.reduce((a, t) => a + t.cost, 0) / 1000).toFixed(0) + 'k', l: 'Investido' },
              ].map(({ n, l }) => (
                <StatItem key={l} value={n} label={l} color="text" fontSize={24} align="center" />
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
              <Button variant="primary" size="md" onClick={() => router.push('/wizard')}>
                + Nova viagem
              </Button>
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {shown.map(trip => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  photo={tripPhotos[trip.id] ?? trip.photo}
                  onClick={() => router.push('/dashboard')}
                  onPhotoChange={(url) => handlePhotoChange(trip.id, url)}
                />
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
                <PlanFeature key={f}>{f}</PlanFeature>
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
                  <PlanFeature key={f} highlighted>{f}</PlanFeature>
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

function TripCard({
  trip,
  photo,
  onClick,
  onPhotoChange,
}: {
  trip: SavedTrip;
  photo?: string;
  onClick: () => void;
  onPhotoChange: (url: string | undefined) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [inputUrl, setInputUrl] = useState('');

  const rgb = trip.color === '#EA9940' ? '234,153,64' : trip.color === '#307082' ? '48,112,130' : '108,163,162';

  const handleSave = () => {
    const url = inputUrl.trim();
    if (url) onPhotoChange(url);
    setEditing(false);
    setInputUrl('');
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPhotoChange(undefined);
    setEditing(false);
    setInputUrl('');
  };

  const openEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputUrl(photo ?? '');
    setEditing(true);
  };

  return (
    <div
      className="card"
      onClick={editing ? undefined : onClick}
      style={{ cursor: editing ? 'default' : 'pointer', overflow: 'hidden', position: 'relative' }}
    >
      {/* Image area */}
      <div
        style={{
          height: 140,
          position: 'relative',
          overflow: 'hidden',
          background: photo
            ? '#0e1f2c'
            : `linear-gradient(135deg, rgba(${rgb},0.2) 0%, rgba(18,33,46,0.95) 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); }}
      >
        {/* Photo or gradient fallback */}
        {photo ? (
          <img
            src={photo}
            alt={trip.dest}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
        ) : (
          <>
            <ContourBg opacity={0.06} />
            <span style={{ fontSize: 48, position: 'relative', zIndex: 1 }}>{trip.emoji}</span>
          </>
        )}

        {/* Status badge */}
        <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 3 }}>
          <Badge variant={trip.status === 'Planejada' ? 'planejada' : 'concluida'} />
        </div>

        {/* Hover overlay */}
        {(hovered || editing) && !editing && (
          <div
            style={{
              position: 'absolute', inset: 0, zIndex: 2,
              background: 'rgba(0,0,0,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <button
              onClick={openEdit}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: 'rgba(18,33,46,0.9)',
                border: '1px solid rgba(200,169,110,0.3)',
                borderRadius: 8, padding: '8px 16px',
                color: 'var(--gold)', fontSize: 12, fontWeight: 500,
                cursor: 'pointer', backdropFilter: 'blur(4px)',
              }}
            >
              <CameraIcon />
              {photo ? 'Alterar foto' : 'Adicionar foto'}
            </button>
          </div>
        )}

        {/* Inline URL editor (overlays the image) */}
        {editing && (
          <div
            style={{
              position: 'absolute', inset: 0, zIndex: 4,
              background: 'rgba(13,20,28,0.97)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '0 18px',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, letterSpacing: '0.04em' }}>
              Cole a URL da imagem
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                autoFocus
                className="inp"
                placeholder="https://..."
                value={inputUrl}
                onChange={e => setInputUrl(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') { setEditing(false); setInputUrl(''); }
                }}
                style={{ fontSize: 12, flex: 1 }}
              />
              <button
                onClick={handleSave}
                className="btn-primary"
                style={{ fontSize: 11, padding: '0 12px', minWidth: 'unset' }}
              >
                OK
              </button>
              <button
                onClick={e => { e.stopPropagation(); setEditing(false); setInputUrl(''); }}
                className="btn-ghost"
                style={{ fontSize: 14, padding: '0 10px', lineHeight: 1 }}
              >
                ✕
              </button>
            </div>
            {photo && (
              <button
                onClick={handleRemove}
                style={{
                  marginTop: 10, fontSize: 11, color: 'var(--text-dim)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left', padding: 0, textDecoration: 'underline',
                }}
              >
                Remover foto
              </button>
            )}
          </div>
        )}
      </div>

      {/* Card body */}
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

function CameraIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}
