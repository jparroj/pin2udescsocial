import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './services/AuthContext';

import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import ProfilePage from './pages/ProfilePage';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import './styles/global.css';

// Componente para proteger rotas que precisam de autenticação
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>; // Pode colocar spinner aqui se quiser
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
  <Routes>
    {/* Sem Navbar */}
    <Route path="/" element={<WelcomePage />} />

    {/* Com Navbar */}
    <Route
      path="/home"
      element={
        <>
          <Navbar />
          <HomePage />
        </>
      }
    />
    {/* outras rotas com Navbar */}
  </Routes>
</BrowserRouter>
  );
}

export default App;
