import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Guard against third-party cross-origin widget errors (e.g. Disqus iframe/tracking scripts)
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    // If error is a generic cross-origin "Script error." or comes from disqus/external CDN, prevent default uncaught propagation
    if (
      event.message === 'Script error.' ||
      (event.filename && (event.filename.includes('disqus') || event.filename.includes('doubleclick')))
    ) {
      event.preventDefault?.();
      return true;
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    if (
      event.reason &&
      typeof event.reason === 'string' &&
      (event.reason.includes('disqus') || event.reason.includes('Script error'))
    ) {
      event.preventDefault?.();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

