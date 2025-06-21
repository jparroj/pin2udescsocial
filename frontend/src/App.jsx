// frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
// Certifique-se que CaronasPage está importado
import CaronasPage from './pages/CaronasPage'; 
// --- NOVO IMPORT ---
import MuralDocentesPage from './pages/MuralDocentesPage'; // <-- Importe MuralDocentesPage

import Footer from './components/Footer';

import './styles/global.css'; // Mantenha o import dos estilos globais
// --- NOVO IMPORT (se não estiver em global.css) ---
import './styles/mural.css'; // <-- Importe os estilos do mural

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Carregando...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <div className="app-container">
      <div className="main-content-wrapper">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/home" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />

          {/* Rota para a Página de Caronas */}
          <Route path="/caronas" element={
            <ProtectedRoute>
              <CaronasPage />
            </ProtectedRoute>
          } />

          {/* --- NOVA ROTA PARA MURAL DOS DOCENTES --- */}
          <Route path="/mural-docentes" element={
            <ProtectedRoute>
              <MuralDocentesPage />
            </ProtectedRoute>
          } />

          {/* Rota de fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;