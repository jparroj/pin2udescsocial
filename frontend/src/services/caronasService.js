// frontend/src/services/caronasService.js

// Única base para todos os endpoints da API
const API_BASE_URL = '/api'; 

export const fetchAllCaronas = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/caronas`, { // Gera /api/caronas
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
            throw new Error(errorData.message || 'Falha ao buscar caronas');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar todas as caronas:', error);
        throw error;
    }
};

export const searchCaronas = async (origem, destino, data) => {
    try {
        const params = new URLSearchParams();
        if (origem) params.append('origem', origem);
        if (destino) params.append('destino', destino);
        if (data) params.append('data', data);

        const response = await fetch(`${API_BASE_URL}/caronas/procurar?${params.toString()}`, { // Gera /api/caronas/procurar
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(errorBody || 'Falha ao procurar caronas');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro ao procurar caronas:', error);
        throw error;
    }
};

export const offerCarona = async (caronaData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/caronas/ofertar`, { // Gera /api/caronas/ofertar
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(caronaData),
            credentials: 'include'
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
            throw new Error(errorData.message || 'Falha ao oferecer carona');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro ao ofertar carona:', error);
        throw error;
    }
};

export const addPassenger = async (caronaId, passageiroId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/caronas/${caronaId}/passageiros/${passageiroId}`, { // Gera /api/caronas/{id}/passageiros/{id}
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(errorBody || 'Falha ao adicionar passageiro');
        }
        return response.ok;
    }
    catch (error) {
        console.error('Erro ao adicionar passageiro:', error);
        throw error;
    }
};

export const fetchReceivedEvaluations = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/caronas/avaliacoes/recebidas/${userId}`, { // Gera /api/caronas/avaliacoes/recebidas/{userId}
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
            throw new Error(errorData.message || 'Falha ao buscar avaliações recebidas');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar avaliações recebidas:', error);
        throw error;
    }
};

export const fetchMadeEvaluations = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/caronas/avaliacoes/feitas/${userId}`, { // Gera /api/caronas/avaliacoes/feitas/{userId}
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
            throw new Error(errorData.message || 'Falha ao buscar avaliações feitas');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar avaliações feitas:', error);
        throw error;
    }
};

export const evaluateCarona = async (evaluationData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/caronas/avaliar`, { // Gera /api/caronas/avaliar
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(evaluationData),
            credentials: 'include'
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
            throw new Error(errorData.message || 'Falha ao avaliar carona');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro ao avaliar carona:', error);
        throw error;
    }
};

export const createCaronaAlert = async (alertData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/caronas/alerta`, { // Gera /api/caronas/alerta
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(alertData),
            credentials: 'include'
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
            throw new Error(errorData.message || 'Falha ao criar alerta de carona');
        }
        return response.ok;
    } catch (error) {
        console.error('Erro ao criar alerta de carona:', error);
        throw error;
    }
};