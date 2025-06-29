// frontend/src/App.jsx
// Remova o BrowserRouter de novo, se você o adicionou de volta por engano.
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Remova este import completo se ele tiver sido adicionado de volta.
import { Routes, Route, Navigate } from 'react-router-dom'; // Mantenha apenas este.
import { AuthProvider, useAuth } from './context/AuthContext'; 
// import LoginPage from './pages/LoginPage'; // Remova esta importação (se você não usa mais ela para login)
import WelcomePage from './pages/WelcomePage'; // <--- IMPORTE O SEU WELCOMEPAGE

import HomePage from './pages/HomePage';
import MuralDocentesPage from './pages/MuralDocentesPage';
import CaronasPage from './pages/CaronasPage';
import LivrosPage from './pages/LivrosPage';
import AnunciosPage from './pages/AnunciosPage';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="loading">Verificando autenticação...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        // O Router DEVE ESTAR APENAS NO main.jsx (ou index.js)
        // Se você o removeu do App.jsx na última instrução, não o adicione de volta.
        // Se ainda estiver aqui, remova-o novamente.
        <AuthProvider>
            <Routes>
                {/* ALTERE AQUI: Use WelcomePage no lugar de LoginPage */}
                <Route path="/login" element={<WelcomePage />} /> 
                
                <Route path="/" element={<Navigate to="/home" />} />
                <Route
                    path="/home"
                    element={
                        <PrivateRoute>
                            <HomePage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/mural-docentes"
                    element={
                        <PrivateRoute>
                            <MuralDocentesPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/caronas"
                    element={
                        <PrivateRoute>
                            <CaronasPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/livros"
                    element={
                        <PrivateRoute>
                            <LivrosPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/anuncios"
                    element={
                        <PrivateRoute>
                            <AnunciosPage />
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<p>404 Not Found</p>} />
            </Routes>
        </AuthProvider>
    );
}

export default App;