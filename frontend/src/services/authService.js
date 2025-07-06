// frontend/src/services/authService.js

const API_BASE_URL = '/api'; 

export const login = async (email, senha) => {
    try {
        console.log("authService: Enviando requisição de login para o backend...");
        const response = await fetch(`${API_BASE_URL}/login`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha }),
            credentials: 'include'
        });

        console.log("authService: Resposta do backend recebida. Status:", response.status);
        const data = await response.json();

        if (!response.ok) {
            console.error("authService: Resposta NÃO OK do backend:", data)
            throw new Error(data.message || 'Erro no login');
        }

        console.log("authService: Login bem-sucedido. Dados da resposta:", data);
        return data;
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        throw error;
    }
};

export const logout = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/login/logout`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Erro ao fazer logout');
        }
        return;
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/login/me`, { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (response.status === 401) {
            return null;
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao buscar usuário logado');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar usuário atual:', error);
        throw error;
    }
};