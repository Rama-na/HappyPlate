import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import './assets/fonts.css';
import './styles/global.css';
import './styles/sections.css';
import './styles/reservation.css';

const el = document.getElementById('root');
if (!el) throw new Error('#root not found');

createRoot(el).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
