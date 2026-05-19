'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContourBg } from '@/components/ui/ContourBg';
import { login, register, saveAuth } from '@/lib/api';
import { Logo } from '@/components/ui/Logo';

export default function LoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });

    const updateForm = (patch: Partial<typeof form>) =>
        setForm(f => ({ ...f, ...patch }));

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            if (mode === 'login') {
                const auth = await login(form.email, form.password);
                saveAuth(auth);
            } else {
                if (!form.name.trim()) {
                    setError('Nome é obrigatório.');
                    setLoading(false);
                    return;
                }
                const auth = await register(form.name, form.email, form.password);
                saveAuth(auth);
            }
            router.push('/');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao autenticar.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSubmit();
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <ContourBg opacity={0.05} />

            {/* Glow */}
            <div style={{
                position: 'absolute',
                top: '30%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 600,
                height: 400,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(200,169,110,0.06) 0%, transparent 65%)',
                pointerEvents: 'none',
            }} />

            <div style={{ width: '100%', maxWidth: 420, padding: '0 24px', position: 'relative', zIndex: 1 }}>

                {/* Logo */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 40 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <Logo size={28} />
                        <span style={{ fontFamily: 'var(--ff-display)', fontSize: 24, fontWeight: 500, color: 'var(--text)' }}>
                            TripManager
                        </span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
                        {mode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta gratuita'}
                    </p>
                </div>

                {/* Card */}
                <div className="card" style={{ padding: '36px 36px 28px' }}>

                    {/* Tabs */}
                    <div style={{
                        display: 'flex',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: 8,
                        padding: 3,
                        marginBottom: 28,
                        border: '1px solid var(--border-light)',
                    }}>
                        {(['login', 'register'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => { setMode(tab); setError(''); }}
                                style={{
                                    flex: 1,
                                    padding: '8px 0',
                                    borderRadius: 6,
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: 13,
                                    fontWeight: 500,
                                    transition: 'all 0.2s',
                                    background: mode === tab ? 'rgba(200,169,110,0.12)' : 'transparent',
                                    color: mode === tab ? 'var(--gold)' : 'var(--text-muted)',
                                    borderColor: mode === tab ? 'rgba(200,169,110,0.2)' : 'transparent',
                                }}
                            >
                                {tab === 'login' ? 'Entrar' : 'Cadastrar'}
                            </button>
                        ))}
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{
                            marginBottom: 20,
                            padding: '10px 14px',
                            background: 'rgba(220,53,69,0.1)',
                            border: '1px solid rgba(220,53,69,0.3)',
                            borderRadius: 6,
                            color: '#ff6b6b',
                            fontSize: 13,
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Fields */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {mode === 'register' && (
                            <div>
                                <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                    Nome
                                </label>
                                <input
                                    className="inp"
                                    placeholder="Seu nome completo"
                                    value={form.name}
                                    onChange={e => updateForm({ name: e.target.value })}
                                    onKeyDown={handleKeyDown}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        )}

                        <div>
                            <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                E-mail
                            </label>
                            <input
                                className="inp"
                                type="email"
                                placeholder="seu@email.com"
                                value={form.email}
                                onChange={e => updateForm({ email: e.target.value })}
                                onKeyDown={handleKeyDown}
                                style={{ width: '100%' }}
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                Senha
                            </label>
                            <input
                                className="inp"
                                type="password"
                                placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : '••••••••'}
                                value={form.password}
                                onChange={e => updateForm({ password: e.target.value })}
                                onKeyDown={handleKeyDown}
                                style={{ width: '100%' }}
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        className="btn-primary"
                        onClick={handleSubmit}
                        disabled={loading || !form.email || !form.password}
                        style={{
                            width: '100%',
                            marginTop: 24,
                            justifyContent: 'center',
                            opacity: loading || !form.email || !form.password ? 0.5 : 1,
                            cursor: loading || !form.email || !form.password ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {loading ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ animation: 'spin 1s linear infinite' }}>
                                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                </svg>
                                {mode === 'login' ? 'Entrando...' : 'Criando conta...'}
                            </span>
                        ) : (
                            mode === 'login' ? 'Entrar' : 'Criar conta'
                        )}
                    </button>
                </div>

                <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 20 }}>
                    {mode === 'login' ? 'Ainda não tem conta?' : 'Já tem uma conta?'}{' '}
                    <button
                        onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                        style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: 12, padding: 0 }}
                    >
                        {mode === 'login' ? 'Cadastre-se' : 'Entrar'}
                    </button>
                </p>
            </div>
        </div>
    );
}
