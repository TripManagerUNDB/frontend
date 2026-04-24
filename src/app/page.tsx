"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ContourBg } from "@/components/ui/ContourBg";
import { Logo } from "@/components/ui/Logo";
import { StatItem } from "@/components/ui/StatItem";
import { StepCard } from "@/components/ui/StepCard";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { SectionLabel } from "@/components/ui/SectionLabel";

export default function Home() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <ContourBg opacity={0.07} />

        {/* Radial glow */}
        <div className="absolute top-1/5 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(234,153,64,0.08)_0%,transparent_65%)] pointer-events-none" />

        <div className="max-w-[1200px] mx-auto px-12 w-full relative z-10">
          <div className="max-w-[720px]">
            <div
              className={`inline-flex items-center gap-2 mb-7 px-3.5 py-1.5 border border-gold/25 rounded-full bg-gold/5 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"} delay-100`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-custom" />
              <span className="text-[12px] tracking-widest text-gold uppercase font-medium">
                Planejamento com IA
              </span>
            </div>

            <h1
              className={`font-display text-[clamp(52px,6vw,50px)] font-medium leading-[1.08] tracking-tight text-foreground mb-7 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"} delay-200`}
            >
              Sua próxima viagem,
              <br />
              <em className="text-gold not-italic">
                planejada em segundos.
              </em>
            </h1>

            <p
              className={`text-lg text-muted leading-relaxed mb-11 max-w-[520px] transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"} delay-350`}
            >
              TripManager usa inteligência artificial para criar roteiros
              personalizados, otimizar rotas e estimar custos — tudo em tempo
              real, para qualquer destino do mundo.
            </p>

            <div
              className={`flex gap-4 items-center flex-wrap transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"} delay-500`}
            >
              <Link
                href="/wizard"
                className="btn-primary text-[15px] px-9 py-3.5"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="mr-1"
                >
                  <path
                    d="M2 8h12M9 4l5 4-5 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Planejar agora
              </Link>
              <button className="btn-ghost text-[15px]">
                Ver como funciona
              </button>
            </div>

            <div
              className={`flex gap-8 mt-14 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"} delay-650`}
            >
              {[
                ["12k+", "Roteiros criados"],
                ["98%", "Satisfação"],
                ["180+", "Países"],
              ].map(([n, l]) => (
                <StatItem key={l} value={n!} label={l!} />
              ))}
            </div>
          </div>
        </div>

        {/* Hero mockup preview */}
        <div
          className={`hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 w-[420px] transition-all duration-1000 ${visible ? "opacity-100 translate-y-[-50%]" : "opacity-0 translate-y-[-42%]"} delay-400`}
        >
          <HeroMockup />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-12 max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <SectionLabel color="gold" style={{ marginBottom: 16 }}>Como funciona</SectionLabel>
          <h2 className="font-display text-[clamp(32px,4vw,48px)] font-medium text-foreground">
            Três passos para o roteiro perfeito
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { num: "01", title: "Descreva sua viagem",  body: "Informe destino, datas, orçamento e estilo. O processo leva menos de dois minutos." },
            { num: "02", title: "A IA planeja tudo",    body: "Algoritmos analisam milhares de opções e criam um roteiro otimizado por hora, custo e distância." },
            { num: "03", title: "Explore e ajuste",     body: "Visualize no mapa, reordene atividades e reserve passagens — tudo em um só lugar." },
          ].map((s) => (
            <StepCard key={s.num} num={s.num} title={s.title} body={s.body} />
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 px-12 bg-white/5 border-y border-border-light">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-14">
            <SectionLabel color="gold" style={{ marginBottom: 16 }}>Depoimentos</SectionLabel>
            <h2 className="font-display text-[clamp(28px,3vw,40px)] font-medium text-foreground">
              O que dizem os viajantes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: "Ana Lima",    role: "Designer, São Paulo",       dest: "Tóquio, Japão", text: "Planejei 10 dias no Japão em 3 minutos. O roteiro foi preciso, cultural e dentro do orçamento. Impressionante." },
              { name: "Rafael Moura", role: "Fotógrafo, Rio de Janeiro", dest: "Marrocos",      text: "A IA entendeu exatamente o que eu queria: trilhas, pôr do sol e gastronomia local. Não esqueci um único dia." },
              { name: "Carla Souza", role: "Engenheira, Curitiba",      dest: "Islândia",      text: "Viagem em casal, 7 dias na Islândia. O dashboard de custos foi perfeito para não extrapolar o orçamento." },
            ].map((t) => (
              <TestimonialCard key={t.name} name={t.name} role={t.role} dest={t.dest} text={t.text} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section className="py-28 px-12 text-center relative overflow-hidden">
        <ContourBg opacity={0.05} />
        <div className="relative z-10">
          <h2 className="font-display text-[clamp(36px,5vw,64px)] font-medium mb-5 leading-tight">
            Pronto para explorar?
          </h2>
          <p className="text-muted text-[17px] mb-10 max-w-[440px] mx-auto">
            Crie seu primeiro roteiro gratuitamente. Sem cartão de crédito.
          </p>
          <Link href="/wizard" className="btn-primary text-[16px] px-11 py-4">
            Começar agora
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border-light py-8 px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2.5">
          <Logo size={18} />
          <span className="font-display text-base text-muted">TripManager</span>
        </div>
        <div className="flex gap-7">
          {["Sobre", "Privacidade", "Termos", "Contato"].map((l) => (
            <span
              key={l}
              className="text-[13px] text-dim cursor-pointer transition-colors hover:text-muted"
            >
              {l}
            </span>
          ))}
        </div>
        <div className="text-[12px] text-dim font-mono">© 2026 TripManager</div>
      </footer>
    </div>
  );
}

function HeroMockup() {
  return (
    <div className="relative">
      <div className="absolute -inset-10 bg-[radial-gradient(circle,rgba(234,153,64,0.12)_0%,transparent_60%)] pointer-events-none" />
      <div className="bg-[#1a2d3a] border border-white/5 rounded-xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.7)] relative">
        {/* Top bar */}
        <div className="px-[18px] py-[14px] border-b border-white/5 flex justify-between items-center">
          <div>
            <div className="font-display text-[15px] text-foreground font-medium">
              Paris, França
            </div>
            <div className="text-[11px] text-muted font-mono mt-0.5">
              15–22 Jun · 7 dias
            </div>
          </div>
          <div className="bg-gold-dim border border-gold/30 rounded px-2.5 py-1 text-[11px] text-gold font-mono">
            R$ 8.400
          </div>
        </div>
        {/* Map placeholder */}
        <div className="h-40 bg-[#0e1f2c] relative overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 420 160">
            <defs>
              <radialGradient id="hm1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1e3a4a" />
                <stop offset="100%" stopColor="#0e1f2c" />
              </radialGradient>
            </defs>
            <rect width="420" height="160" fill="url(#hm1)" />
            <path
              d="M60 80 Q120 60 200 80 Q280 100 360 75"
              stroke="#1E2535"
              strokeWidth="8"
              fill="none"
            />
            <path
              d="M0 50 Q100 55 210 45 Q320 35 420 50"
              stroke="#1E2535"
              strokeWidth="6"
              fill="none"
            />
            <path
              d="M150 0 Q145 80 155 160"
              stroke="#1E2535"
              strokeWidth="5"
              fill="none"
            />
            <path
              d="M280 0 Q275 80 285 160"
              stroke="#1E2535"
              strokeWidth="5"
              fill="none"
            />
            <path
              d="M80 90 Q140 60 200 75 Q260 90 330 65"
              stroke="#C8A96E"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="4 3"
              opacity="0.7"
            />
            {[
              [80, 90],
              [200, 75],
              [330, 65],
            ].map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r={14} fill="rgba(234,153,64,0.1)" />
                <circle cx={x} cy={y} r={8} fill="#EA9940" />
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fill="#12212E"
                  fontSize="8"
                  fontFamily="DM Mono"
                  fontWeight="600"
                >
                  {i + 1}
                </text>
              </g>
            ))}
          </svg>
        </div>
        {/* Day list */}
        {[
          ["09:00", "Torre Eiffel", "🗼", "R$ 120"],
          ["12:00", "Café de Flore", "☕", "R$ 80"],
          ["15:00", "Musée du Louvre", "🎨", "R$ 90"],
        ].map(([t, name, ic, cost]) => (
          <div
            key={name}
            className="flex items-center gap-3 px-[18px] py-2.5 border-b border-white/5 last:border-0"
          >
            <span className="font-mono text-[10px] text-muted min-w-[38px]">
              {t}
            </span>
            <span className="text-sm">{ic}</span>
            <span className="text-[12px] text-foreground flex-1">{name}</span>
            <span className="font-mono text-[10px] text-gold">{cost}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
