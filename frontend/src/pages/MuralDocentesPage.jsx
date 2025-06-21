// frontend/src/pages/MuralDocentesPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Para pegar o tipo de usuário e ID
import * as muralService from '../services/muralService'; // Nosso novo serviço
import MuralCard from '../components/MuralCard';
import MuralForm from '../components/MuralForm';
import { useNavigate } from 'react-router-dom'; // Para o botão de voltar

import '../styles/mural.css'; // Vamos criar este CSS
import '../styles/global.css'; // Para estilos globais como .loading, .error-message, etc.

export default function MuralDocentesPage() {
    const { user, loading: authLoading } = useAuth(); // Pega o usuário logado e o estado de carregamento da autenticação
    const [publications, setPublications] = useState([]);
    const [loadingPublications, setLoadingPublications] = useState(true);
    const [errorPublications, setErrorPublications] = useState(null);
    const [formStatus, setFormStatus] = useState({ loading: false, error: null, success: null });
    const [professorId, setProfessorId] = useState(null); // Para guardar o ID do professor logado

    const navigate = useNavigate();

    // Função para carregar as publicações do mural
    const loadPublications = async () => {
        setLoadingPublications(true);
        setErrorPublications(null);
        try {
            const data = await muralService.fetchMuralPublications();
            setPublications(data);
        } catch (err) {
            setErrorPublications(err.message || "Erro ao carregar publicações.");
        } finally {
            setLoadingPublications(false);
        }
    };

    // Efeito para carregar as publicações quando o componente é montado
    useEffect(() => {
        loadPublications();
    }, []); // Array de dependências vazio para rodar apenas uma vez

    // Efeito para buscar o ID do professor se o usuário for PROFESSOR
    useEffect(() => {
        const getProfessorId = async () => {
            if (!authLoading && user && user.tipo === 'PROFESSOR') {
                try {
                    const profId = await muralService.fetchProfessorIdByUserId(user.id);
                    setProfessorId(profId);
                } catch (err) {
                    console.error("Não foi possível obter o ID do professor:", err);
                    // Opcional: setar um erro para o usuário se não conseguir criar posts
                    setErrorPublications("Não foi possível carregar suas informações de professor para criar publicações.");
                }
            }
        };
        getProfessorId();
    }, [authLoading, user]); // Depende do user e authLoading

    // Função para lidar com o envio do formulário de criação de publicação
    const handleCreatePublication = async (formData) => {
        if (!user || user.tipo !== 'PROFESSOR') {
            alert("Apenas professores podem criar publicações.");
            return;
        }
        if (!professorId) {
            alert("Seu ID de professor não foi carregado. Tente novamente.");
            return;
        }

        setFormStatus({ loading: true, error: null, success: null });
        try {
            const dataToSend = {
                autorId: professorId, // Usamos o ID do professor aqui
                titulo: formData.titulo,
                categoria: formData.categoria,
                conteudo: formData.conteudo,
            };
            await muralService.createMuralPublication(dataToSend);
            setFormStatus({ loading: false, error: null, success: "Publicação criada com sucesso!" });
            loadPublications(); // Recarrega as publicações para mostrar a nova
            setTimeout(() => setFormStatus({ loading: false, error: null, success: null }), 3000); // Limpa mensagem após 3s
        } catch (err) {
            setFormStatus({ loading: false, error: err.message || "Erro ao criar publicação.", success: null });
        }
    };

    const handleGoBack = () => {
        navigate('/home'); // Volta para a rota da HomePage
    };

    const isProfessor = user && user.tipo === 'PROFESSOR';
    //const isAluno = user && user.tipo === 'ALUNO';

    if (authLoading) {
        return <div className="loading">Carregando informações do usuário...</div>;
    }

    return (
        <div className="mural-page">
            <header className="caronas-header"> {/* Reutilizando estilos do cabeçalho de caronas */}
                <div className="caronas-header-content">
                    <div className="left-header-group">
                        <button onClick={handleGoBack} className="back-button">
                            <img src="/icons/arrow-left.png" alt="Voltar" style={{ width: '24px', height: '24px' }} />
                        </button>
                        <img src="/udesc-logo.png" alt="UDESC Logo" className="home-udesc-logo" />
                    </div>
                    <div className="home-header-text">
                        <p className="home-welcome-greeting">Mural dos Docentes</p>
                    </div>
                    <div className="right-header-group"></div>
                </div>
            </header>

            <div className="mural-content-area">
                {isProfessor && professorId && ( // Mostra o formulário apenas para professores logados com ID de professor
                    <MuralForm
                        onSubmit={handleCreatePublication}
                        loading={formStatus.loading}
                        error={formStatus.error}
                        successMessage={formStatus.success}
                    />
                )}
                {isProfessor && !professorId && !errorPublications && (
                    <p className="info-message">Buscando seu perfil de professor para permitir a publicação...</p>
                )}
                
                <h2>Publicações Recentes</h2>
                {loadingPublications ? (
                    <div className="loading">Carregando publicações...</div>
                ) : errorPublications ? (
                    <div className="error-message">{errorPublications}</div>
                ) : publications.length === 0 ? (
                    <p className="no-results-message">Nenhuma publicação encontrada no mural.</p>
                ) : (
                    <div className="mural-publications-grid">
                        {publications.map((publication) => (
                            <MuralCard key={publication.id} publication={publication} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}