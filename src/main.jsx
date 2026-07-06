import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Prevent benign unhandled rejections from crashing the preview or showing error overlays (e.g., closed dev hmr WebSockets)
window.addEventListener('unhandledrejection', (event) => {
  const msg = event.reason?.message || '';
  if (
    msg.includes('WebSocket') || 
    msg.includes('connection') || 
    msg.includes('HMR') ||
    msg.includes('vite') ||
    event.reason === 'WebSocket closed without opened.'
  ) {
    event.preventDefault();
    console.warn(`[Benign WebSocket Event Suppressed]: ${msg || event.reason}`);
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

