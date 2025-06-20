// frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
// Certifique-se que CaronasPage está importado
import CaronasPage from './pages/CaronasPage'; // <-- Importe CaronasPage

import Footer from './components/Footer';

import './styles/global.css'; // Mantenha o import dos estilos globais

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Carregando...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    // NOVO: Wrapper principal para a aplicação inteira para gerenciar a altura
    <div className="app-container"> {/* <--- ADICIONE ESTA DIV */}
      <div className="main-content-wrapper"> {/* <--- ADICIONE ESTA DIV */}
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/home" element={
            <ProtectedRoute>
              <HomePage />
              {/* O Footer será movido para fora daqui se ele for sempre no final da tela */}
            </ProtectedRoute>
          } />

          {/* Rota para a Página de Caronas */}
          <Route path="/caronas" element={
            <ProtectedRoute>
              <CaronasPage />
              {/* O Footer será movido para fora daqui */}
            </ProtectedRoute>
          } />

          {/* Rota de fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div> {/* <--- FECHA main-content-wrapper */}
      <Footer /> {/* <--- FOOTER AGORA FORA DAS ROTAS, NO FINAL DO app-container */}
    </div> // <--- FECHA app-container
  );
}

export default App;
