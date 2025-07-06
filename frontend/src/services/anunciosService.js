// frontend/src/services/anunciosService.js

const API_BASE_URL = '/api';

export const fetchAnuncios = async (tipo = null, keyword = null) => { 
    let url = `${API_BASE_URL}/anuncios`;
    const params = new URLSearchParams();

    if (tipo) {
        params.append('tipo', tipo);
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
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
            throw new Error(errorData.message || 'Erro ao buscar anúncios.');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro em fetchAnuncios:', error);
        throw error;
    }
};

export const createAnuncio = async (anuncioData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/anuncios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(anuncioData),
            credentials: 'include'
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
            throw new Error(errorData.message || 'Erro ao criar anúncio.');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro em createAnuncio:', error);
        throw error;
    }
};

export const updateAnuncio = async (id, anuncioData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/anuncios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(anuncioData),
            credentials: 'include'
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
            throw new Error(errorData.message || 'Erro ao atualizar anúncio.');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro em updateAnuncio:', error);
        throw error;
    }
};

export const deleteAnuncio = async (id, autorId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/anuncios/${id}?autorId=${autorId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
            throw new Error(errorData.message || 'Erro ao deletar anúncio.');
        }
        return true;
    } catch (error) {
        console.error('Erro em deleteAnuncio:', error);
        throw error;
    }
};
