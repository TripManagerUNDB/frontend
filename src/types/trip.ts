export type BudgetLevel = 0 | 1 | 2;

export type InterestId =
  | 'praia'
  | 'cultura'
  | 'gastro'
  | 'natureza'
  | 'noite'
  | 'familia'
  | 'romance'
  | 'solo';

export type TripStatus = 'Planejada' | 'Concluída';

export interface TripData {
  destination: string;
  checkIn: string;
  checkOut: string;
  budget: BudgetLevel;
  interests: InterestId[];
}

export interface Activity {
  time: string;
  name: string;
  type: string;
  icon: string;
  dur: string;
  cost: number;
  desc: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  activities: Activity[];
}

export interface SavedTrip {
  id: number;
  dest: string;
  dates: string;
  status: TripStatus;
  days: number;
  cost: number;
  emoji: string;
  color: string;
  photo?: string;
}
