import React, { createContext, useContext, type ReactNode } from 'react';
import { Traque } from '@traque/core';
import type { Exception } from '@traque/core';
import { errorToException } from './utils';

interface TraqueContextType {
  traque: Traque;
  captureException: (error: unknown) => void;
}

const TraqueContext = createContext<TraqueContextType | null>(null);

interface TraqueProviderProps {
  traque: Traque;
  children: ReactNode;
}

export function TraqueProvider({ traque, children }: TraqueProviderProps) {
  const captureException = (error: unknown) => {
    if (error instanceof Error) {
      const exception = errorToException(error);
      traque.captureException(exception);
      return;
    }

    if (
      typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      'message' in error
    ) {
      traque.captureException(error as Exception);
      return;
    }

    // Handle unknown error types by creating a generic exception
    traque.captureException({
      name: 'Unknown Error',
      message: String(error),
    });
  };

  return (
    <TraqueContext.Provider value={{ traque, captureException }}>
      {children}
    </TraqueContext.Provider>
  );
}

export function useTraque() {
  const context = useContext(TraqueContext);
  if (!context) {
    throw new Error('useTraque must be used within a TraqueProvider');
  }
  return context;
}
