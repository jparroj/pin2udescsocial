// frontend/src/services/apiService.js

// Única base para todos os endpoints da API
const API_BASE_URL = '/api'; 

export const fetchHomeData = async () => {
    const response = await fetch(`${API_BASE_URL}/home`, { // Gera /api/home
        credentials: 'include'
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido ao buscar home data' }));
        throw new Error(errorData.message || 'Failed to fetch home data');
    }
    return await response.json();
};

export const fetchRecommendations = async (quantidade = 4) => {
    try {
        const response = await fetch(`${API_BASE_URL}/home/recommendations?quantidadeRecomendacoes=${quantidade}`, { // Gera /api/home/recommendations
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido ao buscar recomendações' }));
            throw new Error(errorData.message || 'Failed to fetch recommendations');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro na requisição de recomendações:', error);
        throw error;
    }
};

export const fetchAnnouncements = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/anuncios?${query}`, { // Gera /api/anuncios
        credentials: 'include'
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido ao buscar announcements' }));
        throw new Error(errorData.message || 'Failed to fetch announcements');
    }
    return await response.json();
};

export const createAnnouncement = async (announcementData) => {
    const response = await fetch(`${API_BASE_URL}/anuncios`, { // Gera /api/anuncios
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(announcementData),
        credentials: 'include'
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido ao criar anuncio' }));
        throw new Error(errorData.message || 'Failed to create announcement');
    }
    return await response.json();
};