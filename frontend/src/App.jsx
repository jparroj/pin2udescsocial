import React from 'react';
// Não precisamos do BrowserRouter aqui, pois ele já estará no main.jsx
import { Routes, Route, Navigate } from 'react-router-dom'; 

// Importe o useAuth do AuthContext, mas NÃO o AuthProvider aqui
import { useAuth } from './context/AuthContext'; 

// Importe suas páginas
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import ProfilePage from './pages/ProfilePage';

// Importe seus componentes de layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Importe seus estilos globais
import './styles/global.css';

// Componente para proteger rotas que precisam de autenticação
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>; // Pode colocar spinner aqui se quiser
  }

  // Se não estiver autenticado, redireciona para a página de login
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    // Removido <BrowserRouter> daqui, pois ele deve envolver o App no main.jsx
    <Routes>
      {/* Rota da Página de Boas-Vindas (sem Navbar) */}
      {/* Esta é a página inicial que o usuário vê antes de tentar fazer login */}
      <Route path="/" element={<WelcomePage />} />

      {/* Rota para a Página de Login */}
      {/* É importante ter uma rota explícita para /login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rotas Protegidas (com Navbar) */}
      {/* Use o ProtectedRoute para envolver as páginas que só podem ser acessadas por usuários logados */}

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Navbar />
            <HomePage />
            <Footer /> {/* Adicione o Footer se ele for parte do layout padrão */}
          </ProtectedRoute>
        }
      />

      <Route
        path="/announcements"
        element={
          <ProtectedRoute>
            <Navbar />
            <AnnouncementsPage />
            <Footer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Navbar />
            <ProfilePage />
            <Footer />
          </ProtectedRoute>
        }
      />

      {/* Rota de fallback para qualquer caminho não encontrado */}
      {/* Pode redirecionar para a página inicial ou uma página 404 */}
      <Route path="*" element={<Navigate to="/" replace />} /> 

    </Routes>
  );
}

export default App;