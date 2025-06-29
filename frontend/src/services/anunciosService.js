// frontend/src/services/anunciosService.js
// Importe seu cliente HTTP configurado (por exemplo, Axios)
// Exemplo com Axios:
import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Base URL do seu backend
    withCredentials: true, // Importante para sessões/cookies
});

export const fetchAnuncios = async (tipo = null) => {
    try {
        let url = '/anuncios';
        if (tipo) {
            url += `?tipo=${tipo}`;
        }
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar publicações (tipo: ${tipo}):`, error);
        throw error.response?.data?.message || 'Erro ao buscar publicações.';
    }
};

export const createAnuncio = async (anuncioData) => {
    try {
        const response = await api.post('/anuncios', anuncioData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar publicação:', error);
        throw error.response?.data?.message || 'Erro ao criar publicação.';
    }
};

// Se você precisar buscar anúncios por ID de usuário (por exemplo, em um perfil)
export const fetchAnunciosByUserId = async (userId) => {
    try {
        const response = await api.get(`/anuncios/usuario/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar publicações do usuário ${userId}:`, error);
        throw error.response?.data?.message || 'Erro ao buscar publicações do usuário.';
    }
};