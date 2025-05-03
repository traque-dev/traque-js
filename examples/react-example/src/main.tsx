import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Traque, TraqueProvider } from '@traque/react';

const traque = new Traque({
  serviceUrl: import.meta.env.VITE_TRAQUE_SERVICE_URL,
  apiKey: import.meta.env.VITE_TRAQUE_API_KEY,
  environment: 'PRODUCTION',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TraqueProvider traque={traque}>
      <App />
    </TraqueProvider>
  </StrictMode>,
);
