// frontend/src/pages/LivrosPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import * as anunciosService from '../services/anunciosService'; // Serviço unificado
import AnuncioCard from '../components/AnuncioCard'; // Novo card para publicações
import PublicationForm from '../components/PublicationForm'; // Novo formulário para publicações
import { useNavigate } from 'react-router-dom';

import '../styles/publicacoes.css'; // Estilos para a página e cards
import '../styles/global.css';
import '../styles/caronas.css'; // Para o cabeçalho (reutilizando estilos)

export default function LivrosPage() {
    const { user, loading: authLoading } = useAuth();
    const [publications, setPublications] = useState([]);
    const [loadingPublications, setLoadingPublications] = useState(true);
    const [errorPublications, setErrorPublications] = useState(null);
    const [formStatus, setFormStatus] = useState({ loading: false, error: null, success: null });
    const [showCreateModal, setShowCreateModal] = useState(false);

    const navigate = useNavigate();

    // Tipo de publicação específico para esta página
    const PUBLICATION_TYPE = "MATERIAL"; // Corresponde ao tipo 'MATERIAL' no backend para livros/materiais

    const loadPublications = useCallback(async () => {
        setLoadingPublications(true);
        setErrorPublications(null);
        try {
            const data = await anunciosService.fetchAnuncios(PUBLICATION_TYPE);
            setPublications(data);
        } catch (err) {
            console.error("Erro ao carregar livros/materiais:", err);
            setErrorPublications(err.message || "Erro ao carregar livros e materiais.");
        } finally {
            setLoadingPublications(false);
        }
    }, [PUBLICATION_TYPE]); // Dependência em PUBLICATION_TYPE

    useEffect(() => {
        loadPublications();
    }, [loadPublications]);

    const handleCreatePublication = async (formData) => {
        if (!user || !user.id) {
            alert("Você precisa estar logado para publicar.");
            return;
        }

        setFormStatus({ loading: true, error: null, success: null });
        try {
            const dataToSend = {
                autorId: user.id, // Qualquer usuário logado pode publicar
                tipo: PUBLICATION_TYPE, // Define o tipo para o backend
                titulo: formData.titulo,
                descricao: formData.descricao,
                local: formData.local,
                quantidade: formData.quantidade,
                fotos: formData.fotos,
            };
            await anunciosService.createAnuncio(dataToSend);
            setFormStatus({ loading: false, error: null, success: "Livro/Material publicado com sucesso!" });
            loadPublications();
            setShowCreateModal(false);
            setTimeout(() => setFormStatus({ loading: false, error: null, success: null }), 3000);
        } catch (err) {
            setFormStatus({ loading: false, error: err.message || "Erro ao publicar livro/material.", success: null });
        }
    };

    const handleGoBack = () => {
        navigate('/home');
    };

    if (authLoading) {
        return <div className="loading">Carregando informações do usuário...</div>;
    }

    return (
        <div className="publicacao-page">
            <header className="caronas-header">
                <div className="caronas-header-content">
                    <div className="left-header-group">
                        <button onClick={handleGoBack} className="back-button">
                            <img src="/icons/arrow-left.png" alt="Voltar" style={{ width: '24px', height: '24px' }} />
                        </button>
                        <img src="/udesc-logo.png" alt="UDESC Logo" className="home-udesc-logo" />
                    </div>
                    <div className="home-header-text">
                        <p className="home-welcome-greeting">Livros e Materiais</p>
                    </div>
                    <div className="right-header-group"></div>
                </div>
            </header>

            <div className="publicacao-content-area">
                {user && ( // Qualquer usuário logado pode criar
                    <div className="publicacao-actions-top">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="publicacao-button primary"
                        >
                            + Novo Livro/Material
                        </button>
                        {formStatus.success && <p className="success-message">{formStatus.success}</p>}
                        {formStatus.error && <p className="error-message">{formStatus.error}</p>}
                    </div>
                )}
                
                <h2>Livros e Materiais Recentes</h2>

                {loadingPublications ? (
                    <div className="loading">Carregando livros e materiais...</div>
                ) : errorPublications ? (
                    <div className="error-message">{errorPublications}</div>
                ) : publications.length === 0 ? (
                    <p className="no-results-message">Nenhum livro ou material encontrado.</p>
                ) : (
                    <div className="publicacao-grid">
                        {publications.map((anuncio) => (
                            <AnuncioCard key={anuncio.id} anuncio={anuncio} />
                        ))}
                    </div>
                )}
            </div>

            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close-button" onClick={() => setShowCreateModal(false)}>
                            &times;
                        </button>
                        <PublicationForm
                            onSubmit={handleCreatePublication}
                            loading={formStatus.loading}
                            error={formStatus.error}
                            successMessage={formStatus.success}
                            publicationType={PUBLICATION_TYPE} // Passa o tipo para o formulário
                        />
                    </div>
                </div>
            )}
        </div>
    );
}