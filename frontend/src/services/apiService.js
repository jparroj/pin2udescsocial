// frontend/src/services/apiService.js

// Recomendado: Use a URL completa do seu backend, incluindo a porta
const API_BASE = 'http://localhost:8010/api'; 

export const fetchHomeData = async () => {
  const response = await fetch(`${API_BASE}/home`, {
    credentials: 'include' // Garante que os cookies de sessão sejam enviados
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido ao buscar home data' }));
    throw new Error(errorData.message || 'Failed to fetch home data');
  }
  return await response.json();
};

// NOVA FUNÇÃO: Para buscar recomendações
export const fetchRecommendations = async (quantidade = 4) => {
    try {
        const response = await fetch(`${API_BASE}/home/recommendations?quantidadeRecomendacoes=${quantidade}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' // Garante que os cookies de sessão sejam enviados
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido ao buscar recomendações' }));
            throw new Error(errorData.message || 'Failed to fetch recommendations');
        }

        return await response.json(); // Retorna a lista de AnuncioResumoDTO
    } catch (error) {
        console.error('Erro na requisição de recomendações:', error);
        throw error;
    }
};


export const fetchAnnouncements = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE}/anuncios?${query}`, {
    credentials: 'include'
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido ao buscar announcements' }));
    throw new Error(errorData.message || 'Failed to fetch announcements');
  }
  return await response.json();
};

export const createAnnouncement = async (announcementData) => {
  const response = await fetch(`${API_BASE}/anuncios`, {
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
