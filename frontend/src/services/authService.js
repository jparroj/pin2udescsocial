// frontend/src/services/authService.js
export const login = async (email, senha) => {
  const response = await fetch('http://localhost:8010/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });
  return await response.json();
};