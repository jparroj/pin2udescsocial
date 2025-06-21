// frontend/src/services/muralService.js

const API_BASE_URL = 'http://localhost:3001/api'; // Ajuste sua URL base da API se necessário

// Função para listar todas as publicações do mural
export const fetchMuralPublications = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/mural/murais`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Se sua API exigir token de autenticação, adicione aqui
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao buscar publicações do mural.');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro em fetchMuralPublications:', error);
        throw error;
    }
};

// Função para criar uma nova publicação no mural
export const createMuralPublication = async (publicationData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/mural/cadastrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Se sua API exigir token de autenticação, adicione aqui
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(publicationData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao criar publicação no mural.');
        }
        return await response.json(); // O backend retorna o ID do mural salvo
    } catch (error) {
        console.error('Erro em createMuralPublication:', error);
        throw error;
    }
};

// Se você precisar buscar o ID do professor pelo ID do usuário
// Isto é necessário porque o MuralRequest espera autorId, que é o ID do Professor,
// mas o frontend geralmente tem o ID do Usuário logado.
// O ProfessorController no backend tem um endpoint para listar professores,
// mas não um que busca um professor por ID de usuário diretamente.
// Precisaremos de um endpoint no backend para buscar o ID do professor dado um userId.
// POR ENQUANTO, vamos SIMULAR que o `user.id` já é o `autorId` do professor.
// Ou você pode ajustar seu backend para retornar o `professor.id` junto com o `usuario` logado.
// Ou criar um endpoint /api/professores/by-usuario/{usuarioId}
export const fetchProfessorIdByUserId = async (userId) => {
    // ESTE ENDPOINT NÃO EXISTE NO SEU BACKEND AINDA.
    // VOCÊ PRECISARÁ IMPLEMENTAR ISSO NO SEU ProfessorController (backend)
    // Ex: GET /api/professores/by-usuario/{userId} que retorna o {id: professorId}

    // Por agora, vamos simular que o userId é o mesmo que o professorId,
    // o que é uma suposição perigosa para produção.
    // A implementação correta seria fazer uma requisição real aqui.

    console.warn("ATENÇÃO: fetchProfessorIdByUserId é uma simulação. Implemente a busca real no backend.");
    // return new Promise(resolve => setTimeout(() => resolve({ professorId: userId }), 500)); // Simula uma API call
    
    // Implementação ideal (requer endpoint no backend):
    try {
        const response = await fetch(`${API_BASE_URL}/api/professores/by-usuario/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Professor não encontrado para este usuário.');
        }
        const data = await response.json();
        return data.id; // Supondo que o endpoint retorne um objeto Professor ou {id: professorId}
    } catch (error) {
        console.error('Erro em fetchProfessorIdByUserId:', error);
        throw error;
    }
};