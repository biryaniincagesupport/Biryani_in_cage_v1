import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { CartProvider } from './state/CartContext.jsx';
import { AdminProvider } from './state/AdminContext.jsx';
import './styles/globals.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AdminProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AdminProvider>
    </BrowserRouter>
  </StrictMode>,
);
