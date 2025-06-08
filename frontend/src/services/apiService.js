const API_BASE = 'http://localhost:8010/api'; // Note: API_BASE is relative. Make sure your frontend serves from a path that makes this work, or use a full URL like 'http://localhost:8010/api' if not.
                          // For consistency with previous discussions, it's safer to use the full URL if your frontend is not proxied to the backend.

export const fetchHomeData = async () => {
  const response = await fetch(`${API_BASE}/home`, {
    credentials: 'include' // <--- ADICIONE ESTA LINHA AQUI!
  });
  if (!response.ok) {
    // É uma boa prática lançar o erro com a mensagem do servidor, se disponível
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(errorData.message || 'Failed to fetch home data');
  }
  return await response.json();
};

export const fetchAnnouncements = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE}/anuncios?${query}`, {
    credentials: 'include'
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
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
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(errorData.message || 'Failed to create announcement');
  }
  return await response.json();
};