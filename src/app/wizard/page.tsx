'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContourBg } from '@/components/ui/ContourBg';
import { useTrip } from '@/context/TripContext';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { StepHeading } from '@/components/ui/StepHeading';
import { InfoBox } from '@/components/ui/InfoBox';
import { FormField } from '@/components/ui/FormField';
import { INTEREST_ICONS } from '@/lib/icons';
import type { InterestId, BudgetLevel } from '@/types/trip';

const STEPS = ['Destino', 'Datas', 'Orçamento', 'Estilo'];

const INTERESTS: { id: InterestId; label: string }[] = [
  { id: 'praia',    label: 'Praia'        },
  { id: 'cultura',  label: 'Cultura'      },
  { id: 'gastro',   label: 'Gastronomia'  },
  { id: 'natureza', label: 'Natureza'     },
  { id: 'noite',    label: 'Vida noturna' },
  { id: 'familia',  label: 'Família'      },
  { id: 'romance',  label: 'Romântica'    },
  { id: 'solo',     label: 'Solo'         },
];

const DESTINATIONS = [
  'Paris, França', 'Roma, Itália', 'Tóquio, Japão', 'Nova York, EUA',
  'Lisboa, Portugal', 'Buenos Aires, Argentina', 'Amsterdam, Holanda',
  'Marrocos', 'Bangkok, Tailândia', 'Islândia', 'Bali, Indonésia',
  'Cidade do Cabo, África do Sul',
];

const BUDGET_LABELS = ['Econômico', 'Confortável', 'Luxo'];

interface FormState {
  destination: string;
  destInput: string;
  checkIn: string;
  checkOut: string;
  budget: BudgetLevel;
  interests: InterestId[];
}

export default function WizardPage() {
  const router = useRouter();
  const { setTripData } = useTrip();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [animKey, setAnimKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    destination: '',
    destInput: '',
    checkIn: '',
    checkOut: '',
    budget: 1,
    interests: [],
  });

  const updateForm = (patch: Partial<FormState>) =>
    setForm(f => ({ ...f, ...patch }));

  const goNext = () => {
    if (step < 3) {
      setDirection(1);
      setAnimKey(k => k + 1);
      setStep(s => s + 1);
    } else {
      generate();
    }
  };

  const goPrev = () => {
    if (step > 0) {
      setDirection(-1);
      setAnimKey(k => k + 1);
      setStep(s => s - 1);
    }
  };

  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      setTripData({
        destination: form.destination || 'Paris, França',
        budget: form.budget,
        interests: form.interests,
        checkIn: form.checkIn || '2026-06-15',
        checkOut: form.checkOut || '2026-06-22',
      });
      router.push('/dashboard');
    }, 2600);
  };

  const canProceed = () => {
    if (step === 0) return form.destination.length > 0;
    if (step === 1) return !!(form.checkIn && form.checkOut);
    if (step === 2) return true;
    if (step === 3) return form.interests.length > 0;
    return true;
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <ContourBg opacity={0.05} />
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,127,165,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 600, padding: '0 24px', position: 'relative', zIndex: 1 }}>
        {/* Progress */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : undefined }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 600, fontFamily: 'var(--ff-mono)',
                    background: i < step ? 'var(--gold)' : i === step ? 'var(--gold-dim)' : 'transparent',
                    border: i <= step ? '1.5px solid var(--gold)' : '1.5px solid var(--border)',
                    color: i < step ? '#0D0E12' : i === step ? 'var(--gold)' : 'var(--text-muted)',
                    transition: 'all 0.3s',
                  }}>
                    {i < step
                      ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      : i + 1}
                  </div>
                  <span style={{ fontSize: 11, color: i === step ? 'var(--gold)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 1, margin: '0 10px', marginBottom: 20, background: i < step ? 'var(--gold)' : 'var(--border)', transition: 'background 0.4s' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step card */}
        <div key={animKey} style={{ animation: `slideIn${direction > 0 ? 'Right' : 'Left'} 0.38s cubic-bezier(.4,0,.2,1)` }}>
          <div className="card" style={{ padding: '44px 44px 36px' }}>
            {step === 0 && <Step1 form={form} updateForm={updateForm} />}
            {step === 1 && <Step2 form={form} updateForm={updateForm} />}
            {step === 2 && <Step3 form={form} updateForm={updateForm} />}
            {step === 3 && <Step4 form={form} updateForm={updateForm} />}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
          {step > 0
            ? <Button variant="ghost" size="sm" onClick={goPrev}>← Voltar</Button>
            : <div />}
          <Button
            variant="primary"
            size="md"
            onClick={goNext}
            disabled={!canProceed() || loading}
            style={{ opacity: !canProceed() ? 0.4 : 1, cursor: !canProceed() ? 'not-allowed' : 'pointer', minWidth: 160 }}
          >
            {loading ? <LoadingPlane /> : step < 3 ? 'Continuar →' : 'Gerar Roteiro'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function LoadingPlane() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ animation: 'spin 1s linear infinite' }}>
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
      </svg>
      Planejando...
    </span>
  );
}

function Step1({ form, updateForm }: { form: FormState; updateForm: (p: Partial<FormState>) => void }) {
  const [show, setShow] = useState(false);
  const filtered = DESTINATIONS.filter(
    d => d.toLowerCase().includes(form.destInput.toLowerCase()) && form.destInput.length > 0
  );

  return (
    <div>
      <StepHeading title="Para onde você vai?" subtitle="Informe a cidade, país ou região de destino." />
      <div style={{ position: 'relative', marginTop: 28 }}>
        <div style={{ position: 'relative' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
            <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M10.5 10.5 L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <input
            className="inp"
            placeholder="Ex: Paris, Tokyo, Buenos Aires..."
            value={form.destInput}
            onChange={e => { updateForm({ destInput: e.target.value, destination: e.target.value }); setShow(true); }}
            onFocus={() => setShow(true)}
            onBlur={() => setTimeout(() => setShow(false), 160)}
            style={{ paddingLeft: 42, fontSize: 16 }}
          />
        </div>
        {show && filtered.length > 0 && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: '#1A1C26', border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', zIndex: 100, boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
            {filtered.slice(0, 6).map(d => (
              <div
                key={d}
                onMouseDown={() => { updateForm({ destination: d, destInput: d }); setShow(false); }}
                style={{ padding: '11px 16px', cursor: 'pointer', fontSize: 14, color: 'var(--text)', borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s', display: 'flex', alignItems: 'center', gap: 10 }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,169,110,0.07)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1C5.24 1 3 3.24 3 6c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5C7.17 7.5 6.5 6.83 6.5 6S7.17 4.5 8 4.5 9.5 5.17 9.5 6 8.83 7.5 8 7.5z" fill="var(--text-muted)" />
                </svg>
                {d}
              </div>
            ))}
          </div>
        )}
      </div>
      {form.destination && (
        <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--gold-dim)', border: '1px solid rgba(200,169,110,0.25)', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="var(--gold)"><path d="M8 1C5.24 1 3 3.24 3 6c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5z" /></svg>
          <span style={{ fontSize: 13, color: 'var(--gold)' }}>{form.destination}</span>
        </div>
      )}
    </div>
  );
}

function Step2({ form, updateForm }: { form: FormState; updateForm: (p: Partial<FormState>) => void }) {
  const days = form.checkIn && form.checkOut
    ? Math.round((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000)
    : 0;

  return (
    <div>
      <StepHeading title="Quando você vai viajar?" subtitle="Escolha as datas de ida e volta." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 28 }}>
        <FormField label="Ida">
          <input type="date" className="inp" value={form.checkIn} onChange={e => updateForm({ checkIn: e.target.value })} style={{ colorScheme: 'dark' }} />
        </FormField>
        <FormField label="Volta">
          <input type="date" className="inp" value={form.checkOut} min={form.checkIn} onChange={e => updateForm({ checkOut: e.target.value })} style={{ colorScheme: 'dark' }} />
        </FormField>
      </div>
      {days > 0 && (
        <InfoBox variant="blue" style={{ marginTop: 20, textAlign: 'center' }}>
          <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 28, color: 'var(--blue)' }}>{days}</span>
          <span style={{ fontSize: 14, color: 'var(--text-muted)', display: 'block', marginTop: 4 }}>dias de viagem</span>
        </InfoBox>
      )}
    </div>
  );
}

function Step3({ form, updateForm }: { form: FormState; updateForm: (p: Partial<FormState>) => void }) {
  const budgetDetails = [
    { label: 'Econômico',   desc: 'Hostels, transporte público, restaurantes locais', range: 'R$ 3.000 – 6.000' },
    { label: 'Confortável', desc: 'Hotéis 3–4 estrelas, passeios organizados',         range: 'R$ 6.000 – 15.000' },
    { label: 'Luxo',        desc: 'Hotéis boutique, experiências exclusivas',           range: 'R$ 15.000+' },
  ];
  const gradientPct = (form.budget / 2) * 100;

  return (
    <div>
      <StepHeading title="Qual o seu orçamento?" subtitle="Ajuste para o nível de conforto desejado." />
      <div style={{ marginTop: 36 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          {BUDGET_LABELS.map((l, i) => (
            <span key={l} style={{ fontSize: 12, color: form.budget === i ? 'var(--gold)' : 'var(--text-muted)', transition: 'color 0.2s', fontWeight: form.budget === i ? 600 : 400 }}>{l}</span>
          ))}
        </div>
        <input
          type="range" min={0} max={2} step={1} value={form.budget}
          className="gold-slider"
          onChange={e => updateForm({ budget: Number(e.target.value) as BudgetLevel })}
          style={{ background: `linear-gradient(to right, var(--gold) 0%, var(--gold) ${gradientPct}%, #2E3140 ${gradientPct}%, #2E3140 100%)` }}
        />
        <InfoBox style={{ marginTop: 24, padding: 20 }}>
          <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 20, color: 'var(--gold)', marginBottom: 6 }}>{budgetDetails[form.budget].range}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{budgetDetails[form.budget].desc}</div>
        </InfoBox>
      </div>
    </div>
  );
}

function Step4({ form, updateForm }: { form: FormState; updateForm: (p: Partial<FormState>) => void }) {
  const toggle = (id: InterestId) => {
    const next = form.interests.includes(id)
      ? form.interests.filter(i => i !== id)
      : [...form.interests, id];
    updateForm({ interests: next });
  };

  return (
    <div>
      <StepHeading title="Qual é o seu estilo de viagem?" subtitle="Selecione quantos quiser. Isso personaliza cada detalhe do roteiro." />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 28 }}>
        {INTERESTS.map(({ id, label }) => {
          const Icon = INTEREST_ICONS[id];
          return (
            <Chip key={id} active={form.interests.includes(id)} onClick={() => toggle(id)}>
              <Icon size={15} weight={form.interests.includes(id) ? 'fill' : 'regular'} />
              {label}
            </Chip>
          );
        })}
      </div>
      {form.interests.length > 0 && (
        <div style={{ marginTop: 20, fontSize: 12, color: 'var(--text-muted)' }}>
          {form.interests.length} preferência{form.interests.length > 1 ? 's' : ''} selecionada{form.interests.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
