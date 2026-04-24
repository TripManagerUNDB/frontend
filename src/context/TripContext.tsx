'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TripData {
  destination: string;
  checkIn: string;
  checkOut: string;
  budget: number;
  interests: string[];
}

interface TripContextType {
  tripData: TripData | null;
  setTripData: (data: TripData) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const [tripData, setTripData] = useState<TripData | null>(null);

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
