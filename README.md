# TripManager — Planejador de Viagens com IA

Frontend da aplicação TripManager, construído em Next.js. Permite que usuários criem roteiros de viagem personalizados com base em destino, datas, orçamento e estilo de viagem.

## Stack

- **Next.js 16** com App Router
- **React 19**
- **TypeScript 5**
- **Tailwind CSS v4**
- **Fontes:** Playfair Display, DM Sans, DM Mono

## Pré-requisitos

- Node.js (versão LTS recomendada)
- Yarn

```bash
npm install -g yarn
```

## Instalação

```bash
yarn install
```

## Rodar em desenvolvimento

```bash
yarn dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `yarn dev` | Servidor de desenvolvimento |
| `yarn build` | Build de produção |
| `yarn start` | Inicia o build de produção |
| `yarn lint` | Verifica erros de lint |

## Rotas

| Rota | Página |
|------|--------|
| `/` | Landing page |
| `/wizard` | Formulário de planejamento (4 etapas) |
| `/dashboard` | Roteiro gerado com mapa e custos |
| `/profile` | Perfil e viagens salvas |

## Estrutura de pastas

```
src/
├── app/                  # Rotas (App Router)
│   ├── page.tsx          # Landing page
│   ├── wizard/           # Formulário de viagem
│   ├── dashboard/        # Roteiro gerado
│   └── profile/          # Perfil do usuário
├── components/
│   ├── layout/           # Navbar
│   └── ui/               # Button, Badge, Chip, Logo, ContourBg
├── context/              # TripContext (estado global da viagem)
├── hooks/                # useLocalStorage
├── lib/                  # Utilitários (formatação de datas, labels)
└── types/                # Tipos TypeScript compartilhados
```

## Backend

O backend será desenvolvido em **Spring Boot**. A integração com a API será feita a partir de `src/lib/`.
