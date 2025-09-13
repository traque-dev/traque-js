import { Traque, TraqueProvider } from '@traque/react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';

import './index.css';

const queryClient = new QueryClient();

const traque = new Traque({
  serviceUrl: import.meta.env.VITE_TRAQUE_SERVICE_URL,
  apiKey: import.meta.env.VITE_TRAQUE_API_KEY,
  environment: 'PRODUCTION',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TraqueProvider client={traque}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </TraqueProvider>
  </StrictMode>,
);
