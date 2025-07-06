// frontend/src/services/muralService.js

const API_BASE_URL = '/api';

export const fetchMuralPublications = async (categoria = null, keyword = null) => { 
    let url = `${API_BASE_URL}/mural/murais`;
    const params = new URLSearchParams();

    if (categoria) {
        params.append('categoria', categoria);
    }
    if (keyword) {
        params.append('keyword', keyword);
    }

    if (params.toString()) {
        url += `?${params.toString()}`;
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
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
        const response = await fetch(`${API_BASE_URL}/mural/cadastrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(publicationData),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
            throw new Error(errorData.message || 'Erro ao criar publicação no mural.');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro em createMuralPublication:', error);
        throw error;
    }
};

export const updateMuralPublication = async (id, publicationData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/mural/atualizar/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(publicationData),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
            throw new Error(errorData.message || 'Erro ao atualizar publicação no mural.');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro em updateMuralPublication:', error);
        throw error;
    }
};

export const deleteMuralPublication = async (id, autorId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/mural/excluir/${id}?autorId=${autorId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
            throw new Error(errorData.message || 'Erro ao excluir publicação do mural.');
        }
        return true;
    } catch (error) {
        console.error('Erro em deleteMuralPublication:', error);
        throw error;
    }
};

export const fetchProfessorIdByUserId = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/mural/professores/by-usuario/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        if (response.status === 404) {
            console.warn("Professor não encontrado para este usuário (404). Retornando null.");
            return null;
        }
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
            throw new Error(errorData.message || 'Erro ao buscar professor logado.');
        }
        
        const data = await response.json();
        if (typeof data === 'number') {
            return data;
        } else if (data && typeof data.id === 'number') {
            return data.id;
        } else {
            console.error("muralService.fetchProfessorIdByUserId: Formato de resposta inesperado:", data);
            throw new Error("Formato de resposta inesperado ao buscar ID do professor.");
        }
    } catch (error) {
        console.error('Erro em fetchProfessorIdByUserId:', error);
        throw error;
    }
};
