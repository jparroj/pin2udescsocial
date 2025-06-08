// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as authServiceLogin, logout as authServiceLogout, getCurrentUser } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const currentUser = await getCurrentUser();
                if (currentUser) {
                    setUser(currentUser);
                    localStorage.setItem('user', JSON.stringify(currentUser));
                } else {
                    localStorage.removeItem('user');
                    setUser(null);
                }
            } catch (error) {
                console.error("Erro ao verificar status de autenticação:", error);
                localStorage.removeItem('user');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const login = async (email, senha) => {
        try {
            console.log("AuthContext: Iniciando processo de login para:", email);
            const data = await authServiceLogin(email, senha);

            console.log("AuthContext: Dados recebidos do authServiceLogin:", data);
            console.log("AuthContext: data.success é:", data.success);

            if (data.success) {
                const loggedUser = {
                    nome: data.nome,
                    tipo: data.tipo,
                    email: email
                };
                setUser(loggedUser);
                localStorage.setItem('user', JSON.stringify(loggedUser));
                console.log("AuthContext: Login bem-sucedido! Redirecionando para /home."); // <--- LOG ATUALIZADO
                navigate('/home'); // <--- MUDANÇA PRINCIPAL AQUI: DE '/dashboard' PARA '/home'
            } else {
                console.error("AuthContext: Login falhou (data.success é false):", data.message);
                throw new Error(data.message || 'Falha no login');
            }
        } catch (error) {
            console.error('AuthContext: Erro ao fazer login no contexto:', error.message);
            console.error('Erro ao fazer login:', error.message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authServiceLogout();
            setUser(null);
            localStorage.removeItem('user');
            navigate('/login');
        } catch (error) {
            console.error('Erro ao fazer logout:', error.message);
            setUser(null);
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user,
                loading,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);