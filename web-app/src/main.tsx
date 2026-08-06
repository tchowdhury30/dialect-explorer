import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AudioProvider } from './lib/audio';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AudioProvider>
      <App />
    </AudioProvider>
  </StrictMode>
);

// Production only — a service worker in dev would serve stale modules and
// fight Vite's HMR.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Registration fails on http:// or with SW disabled; the app still works,
      // it just will not be installable or cache audio.
    });
  });
}
