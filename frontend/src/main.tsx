
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// aza ala lu reo commentaire reo
// import { BrowserRouter } from 'react-router-dom'; // Ajouter BrowserRouter
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <BrowserRouter> */}
      <App />
    {/* </BrowserRouter> */}
  </StrictMode>
);