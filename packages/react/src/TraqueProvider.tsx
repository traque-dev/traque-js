import { createContext, useContext, type ReactNode } from 'react';
import { Traque } from '@traque/core';

const TraqueContext = createContext<Traque | null>(null);

interface TraqueProviderProps {
  client: Traque;
  children: ReactNode;
}

export function TraqueProvider({ client, children }: TraqueProviderProps) {
  return (
    <TraqueContext.Provider value={client}>{children}</TraqueContext.Provider>
  );
}

export function useTraque() {
  const context = useContext(TraqueContext);
  if (!context) {
    throw new Error('useTraque must be used within a TraqueProvider');
  }
  return context;
}
