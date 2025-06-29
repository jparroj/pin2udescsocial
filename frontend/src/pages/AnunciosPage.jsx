// frontend/src/pages/AnunciosPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import * as anunciosService from '../services/anunciosService';
import AnuncioCard from '../components/AnuncioCard';
import PublicationForm from '../components/PublicationForm';
import { useNavigate } from 'react-router-dom';

import '../styles/publicacoes.css';
import '../styles/global.css';
import '../styles/caronas.css';

export default function AnunciosPage() {
    const { user, loading: authLoading } = useAuth();
    const [publications, setPublications] = useState([]);
    const [loadingPublications, setLoadingPublications] = useState(true);
    const [errorPublications, setErrorPublications] = useState(null);
    const [formStatus, setFormStatus] = useState({ loading: false, error: null, success: null });
    const [showCreateModal, setShowCreateModal] = useState(false);

    const navigate = useNavigate();

    // Tipo de publicação específico para esta página
    const PUBLICATION_TYPE = "ANUNCIO"; // Corresponde ao tipo 'ANUNCIO' no backend

    const loadPublications = useCallback(async () => {
        setLoadingPublications(true);
        setErrorPublications(null);
        try {
            const data = await anunciosService.fetchAnuncios(PUBLICATION_TYPE);
            setPublications(data);
        } catch (err) {
            console.error("Erro ao carregar anúncios:", err);
            setErrorPublications(err.message || "Erro ao carregar anúncios.");
        } finally {
            setLoadingPublications(false);
        }
    }, [PUBLICATION_TYPE]);

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
                quantidade: null, // Anúncios gerais não têm campo de quantidade visível
                fotos: formData.fotos,
            };
            await anunciosService.createAnuncio(dataToSend);
            setFormStatus({ loading: false, error: null, success: "Anúncio publicado com sucesso!" });
            loadPublications();
            setShowCreateModal(false);
            setTimeout(() => setFormStatus({ loading: false, error: null, success: null }), 3000);
        } catch (err) {
            setFormStatus({ loading: false, error: err.message || "Erro ao publicar anúncio.", success: null });
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
                        <p className="home-welcome-greeting">Anúncios</p>
                    </div>
                    <div className="right-header-group"></div>
                </div>
            </header>

            <div className="publicacao-content-area">
                {user && (
                    <div className="publicacao-actions-top">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="publicacao-button primary"
                        >
                            + Novo Anúncio
                        </button>
                        {formStatus.success && <p className="success-message">{formStatus.success}</p>}
                        {formStatus.error && <p className="error-message">{formStatus.error}</p>}
                    </div>
                )}
                
                <h2>Últimos Anúncios</h2>

                {loadingPublications ? (
                    <div className="loading">Carregando anúncios...</div>
                ) : errorPublications ? (
                    <div className="error-message">{errorPublications}</div>
                ) : publications.length === 0 ? (
                    <p className="no-results-message">Nenhum anúncio encontrado.</p>
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