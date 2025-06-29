// frontend/src/services/muralService.js

// Única base para todos os endpoints da API
const API_BASE_URL = '/api'; 

export const fetchMuralPublications = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/mural/murais`, { // Gera /api/mural/murais
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Descomente se exigir autenticação
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao buscar publicações do mural.');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro em fetchMuralPublications:', error);
        throw error;
    }
};

export const createMuralPublication = async (publicationData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/mural/cadastrar`, { // Gera /api/mural/cadastrar
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Descomente se exigir autenticação
            },
            body: JSON.stringify(publicationData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao criar publicação no mural.');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro em createMuralPublication:', error);
        throw error;
    }
};

export const fetchProfessorIdByUserId = async (userId /* eslint-disable-line no-unused-vars */) => {
    try {
        const response = await fetch(`${API_BASE_URL}/professores/by-usuario/${userId}`, { // Gera /api/professores/by-usuario/{userId}
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Descomente e adicione o token se o seu backend exigir
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Professor não encontrado para este usuário.');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro em fetchProfessorIdByUserId:', error);
        throw error;
    }
};