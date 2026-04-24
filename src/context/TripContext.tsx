'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { TripData } from '@/types/trip';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface TripContextType {
  tripData: TripData | null;
  setTripData: (data: TripData) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const [tripData, setTripData] = useLocalStorage<TripData | null>('trip-data', null);

  return (
    <TripContext.Provider value={{ tripData, setTripData }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
}
