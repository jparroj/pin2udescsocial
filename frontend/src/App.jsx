import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; 
import WelcomePage from './pages/WelcomePage'; 

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
        <AuthProvider>
            <Routes>
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