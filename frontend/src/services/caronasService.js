// frontend/src/services/caronasService.js

const API_BASE_URL = '/api'; 

export const fetchAllCaronas = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/caronas`, {
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

        const response = await fetch(`${API_BASE_URL}/caronas/procurar?${params.toString()}`, {
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
        const response = await fetch(`${API_BASE_URL}/caronas/ofertar`, {
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
        const response = await fetch(`${API_BASE_URL}/caronas/${caronaId}/passageiros/${passageiroId}`, {
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
        const response = await fetch(`${API_BASE_URL}/caronas/avaliacoes/recebidas/${userId}`, {
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
        const response = await fetch(`${API_BASE_URL}/caronas/avaliacoes/feitas/${userId}`, {
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
        const response = await fetch(`${API_BASE_URL}/caronas/avaliar`, {
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
        const response = await fetch(`${API_BASE_URL}/caronas/alerta`, {
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

export const updateCarona = async (id, caronaData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/caronas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(caronaData),
            credentials: 'include'
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
            throw new Error(errorData.message || 'Falha ao atualizar carona');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro ao atualizar carona:', error);
        throw error;
    }
};

export const deleteCarona = async (id, ofertanteId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/caronas/${id}?ofertanteId=${ofertanteId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
            throw new Error(errorData.message || 'Falha ao deletar carona');
        }
        return true;
    } catch (error) {
        console.error('Erro ao deletar carona:', error);
        throw error;
    }
};
