import type { BudgetLevel } from '@/types/trip';

export function formatDateBR(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
}

export function tripDuration(checkIn: string, checkOut: string): number {
  return Math.round(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000
  );
}

export const BUDGET_LABELS: Record<BudgetLevel, string> = {
  0: 'Econômico',
  1: 'Confortável',
  2: 'Luxo',
};

export const BUDGET_RANGES: Record<BudgetLevel, string> = {
  0: 'R$ 3.000 – 6.000',
  1: 'R$ 6.000 – 15.000',
  2: 'R$ 15.000+',
};

export const INTEREST_EMOJI: Record<string, string> = {
  praia:    '🏖️',
  cultura:  '🏛️',
  gastro:   '🍽️',
  natureza: '🌲',
  noite:    '🎭',
  familia:  '👨‍👩‍👧',
  romance:  '💑',
  solo:     '🎒',
};
