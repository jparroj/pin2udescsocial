// frontend/src/services/authService.js

export const login = async (email, senha) => {
    try {
        console.log("authService: Enviando requisição de login para o backend...");
        const response = await fetch('http://localhost:8010/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha }),
            credentials: 'include' // IMPORTANTE: Inclui cookies na requisição cross-origin
        });

        console.log("authService: Resposta do backend recebida. Status:", response.status);
        const data = await response.json(); // Pega o JSON da resposta

        // Verifica se a resposta foi bem-sucedida (status 2xx)
        if (!response.ok) {
            console.error("authService: Resposta NÃO OK do backend:", data)
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro no login');
        }

        console.log("authService: Login bem-sucedido. Dados da resposta:", data);
        return data; // Retorna os dados completos, não apenas await response.json()

       // return await response.json(); // Retorna os dados da resposta (ex: mensagem, sucesso, nome, tipo)
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        throw error; // Relança o erro para ser tratado no componente que chamou
    }
};

// Função para realizar o logout do usuário
export const logout = async () => {
    try {
        const response = await fetch('http://localhost:8010/login/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // IMPORTANTE: Inclui cookies na requisição
        });

        if (!response.ok) {
            throw new Error('Erro ao fazer logout');
        }

        // Não há retorno de dados específicos para o logout (ResponseEntity<Void>)
        return; 
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        throw error;
    }
};

// Função para buscar as informações do usuário atualmente logado (pela sessão)
export const getCurrentUser = async () => {
    try {
        const response = await fetch('http://localhost:8010/login/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // IMPORTANTE: Inclui cookies na requisição
        });

        // Se o status for 401 (Não Autorizado), significa que não há usuário logado
        if (response.status === 401) {
            return null; // Retorna null indicando que não há usuário autenticado
        }

        // Se a resposta não for ok por outro motivo, lança um erro
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao buscar usuário logado');
        }

        return await response.json(); // Retorna os dados do usuário (nome, tipo, etc.)
    } catch (error) {
        console.error('Erro ao buscar usuário atual:', error);
        throw error; // Relança o erro para ser tratado
    }
};