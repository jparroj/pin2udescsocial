// frontend/src/main.jsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx'; // Seu componente App

// --- IMPORTANTE: Adicione estes imports ---
import { BrowserRouter as Router } from 'react-router-dom'; // Importa o Router
import { AuthProvider } from './context/AuthContext'; // Importa seu AuthProvider
// ----------------------------------------

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* --- O Router DEVE envolver todo o seu aplicativo com rotas --- */}
    <Router>
      {/* --- O AuthProvider DEVE envolver o App para que todos os componentes dentro de App
               tenham acesso ao contexto de autenticação --- */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </StrictMode>,
);