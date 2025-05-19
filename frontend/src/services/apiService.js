const API_BASE = '/api';

export const fetchHomeData = async () => {
  const response = await fetch(`${API_BASE}/home`);
  if (!response.ok) {
    throw new Error('Failed to fetch home data');
  }
  return await response.json();
};

export const fetchAnnouncements = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE}/anuncios?${query}`);
  if (!response.ok) {
    throw new Error('Failed to fetch announcements');
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
  });
  if (!response.ok) {
    throw new Error('Failed to create announcement');
  }
  return await response.json();
};