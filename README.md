# TripManager — Planejador de Viagens com IA 🌍✈️

O **TripManager** é o frontend de uma aplicação moderna para planejamento de viagens, construído com **Next.js 16**, **React 19** e **Tailwind CSS v4**. Ele permite que os usuários criem roteiros personalizados e inteligentes com base em suas preferências, orçamento e estilo de viagem.

---

## ✨ Funcionalidades

- **Planejamento Inteligente:** Wizard em 4 etapas para definir destino, datas, orçamento e estilo.
- **Roteiros Dinâmicos:** Visualização detalhada do roteiro, incluindo integração com mapas e estimativas de custo.
- **Gestão de Perfil:** Visualize suas viagens salvas e gerencie suas preferências.
- **Experiência Premium:** Design moderno com animações sutis, backgrounds dinâmicos e componentes altamente reutilizáveis.

---

## 🛠️ Stack Tecnológica

- **Core:** [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Ícones:** [Phosphor Icons](https://phosphoricons.com/)
- **Tipografia:** 
  - `Playfair Display` (Títulos e Elegância)
  - `DM Sans` (Corpo e Leitura)
  - `DM Mono` (Dados e Valores)

---

## 🎨 Design System & UI

O projeto utiliza um sistema de design focado em estética premium e modularidade. Os componentes principais estão localizados em `src/components/ui/`:

- **ContourBg:** Background animado com curvas elegantes.
- **Logo:** Identidade visual da marca.
- **StatItem:** Exibição de dados estatísticos com ícones.
- **StepCard:** Cards informativos para processos de etapas.
- **TestimonialCard:** Prova social e depoimentos.
- **Button / Badge / Chip:** Componentes de interação base.

---

## 📂 Estrutura de Pastas

```
src/
├── app/                  # Rotas (App Router)
│   ├── page.tsx          # Landing page (Home)
│   ├── wizard/           # Fluxo de planejamento (4 etapas)
│   ├── dashboard/        # Visualização do roteiro gerado
│   └── profile/          # Área do usuário e histórico
├── components/
│   ├── layout/           # Componentes globais (Navbar, Footer)
│   └── ui/               # Componentes atômicos e de design system
├── context/              # TripContext (estado global da viagem)
├── hooks/                # Hooks customizados (ex: useLocalStorage)
├── lib/                  # Utilitários (formatação, constantes, API)
└── types/                # Definições de tipos TypeScript
```

---

## 🚀 Como começar

### Pré-requisitos
- Node.js (v20+)
- Yarn

```bash
# Instalar Yarn globalmente (se não tiver)
npm install -g yarn
```

### Instalação
```bash
yarn install
```

### Desenvolvimento
```bash
yarn dev
```
O servidor estará disponível em: [http://localhost:3000](http://localhost:3000)

---

## 🔗 Backend (API)

O backend deste projeto está sendo desenvolvido em **Spring Boot**. A integração com a API será centralizada em `src/lib/` para facilitar a manutenção e escalabilidade.

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
