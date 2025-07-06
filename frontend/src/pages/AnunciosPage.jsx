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
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentPublication, setCurrentPublication] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedAnuncio, setSelectedAnuncio] = useState(null);

    const navigate = useNavigate();

    const PUBLICATION_TYPE = "ANUNCIO";

    const emptyPublicationData = {};

    const loadPublications = useCallback(async (keyword = '') => {
        setLoadingPublications(true);
        setErrorPublications(null);
        try {
            const data = await anunciosService.fetchAnuncios(PUBLICATION_TYPE, keyword);
            setPublications(data);
        } catch (err) {
            console.error("Erro ao carregar anúncios:", err);
            setErrorPublications(err.message || "Erro ao carregar anúncios.");
        } finally {
            setLoadingPublications(false);
        }
    }, [PUBLICATION_TYPE]);

    useEffect(() => {
        loadPublications(searchTerm);
    }, [loadPublications, searchTerm]);

    const handleSearch = () => {
        loadPublications(searchTerm);
    };

    const handleCreatePublication = async (formData) => {
        if (!user || !user.id) {
            alert("Você precisa estar logado para publicar.");
            return;
        }

        setFormStatus({ loading: true, error: null, success: null });
        try {
            const dataToSend = {
                autorId: user.id,
                tipo: PUBLICATION_TYPE,
                titulo: formData.titulo,
                descricao: formData.descricao,
                local: formData.local,
                quantidade: null,
                fotos: formData.fotos,
            };
            await anunciosService.createAnuncio(dataToSend);
            setFormStatus({ loading: false, error: null, success: "Anúncio publicado com sucesso!" });
            loadPublications(searchTerm);
            setShowCreateModal(false);
            setTimeout(() => setFormStatus({ loading: false, error: null, success: null }), 3000);
        } catch (err) {
            setFormStatus({ loading: false, error: err.message || "Erro ao publicar anúncio.", success: null });
        }
    };

    const handleEditPublication = useCallback((anuncio) => {
        setCurrentPublication(anuncio);
        setShowEditModal(true);
        setFormStatus({ loading: false, error: null, success: null });
    }, []);

    const handleUpdatePublication = useCallback(async (formData) => {
        if (!user || !user.id || !currentPublication || !formData.id) {
            alert("Erro: Dados incompletos para atualizar o anúncio.");
            return;
        }

        setFormStatus({ loading: true, error: null, success: null });
        try {
            const dataToSend = {
                id: formData.id,
                autorId: user.id,
                titulo: formData.titulo,
                descricao: formData.descricao,
                local: formData.local,
                quantidade: formData.quantidade,
                fotos: formData.fotos,
            };
            await anunciosService.updateAnuncio(formData.id, dataToSend);
            setFormStatus({ loading: false, error: null, success: "Anúncio atualizado com sucesso!" });
            loadPublications(searchTerm);
            setShowEditModal(false);
            setCurrentPublication(null);
            setTimeout(() => setFormStatus({ loading: false, error: null, success: null }), 3000);
        } catch (err) {
            setFormStatus({ loading: false, error: err.message || "Erro ao atualizar anúncio.", success: null });
        }
    }, [user, currentPublication, loadPublications, searchTerm]);

    const handleDeletePublication = useCallback(async (anuncioId, anuncioTitle) => {
        if (!user || !user.id) {
            alert("Você precisa estar logado para excluir.");
            return;
        }

        const publicationToDelete = publications.find(pub => pub.id === anuncioId);
        if (!publicationToDelete || publicationToDelete.autor.id !== user.id) {
            alert("Você não tem permissão para excluir este anúncio.");
            return;
        }

        const confirmDelete = window.confirm(`Tem certeza que deseja excluir o anúncio "${anuncioTitle}"?`);
        if (!confirmDelete) return;

        setFormStatus({ loading: true, error: null, success: null });
        try {
            await anunciosService.deleteAnuncio(anuncioId, user.id);
            setFormStatus({ loading: false, error: null, success: "Anúncio excluído com sucesso!" });
            loadPublications(searchTerm);
            setTimeout(() => setFormStatus({ loading: false, error: null, success: null }), 3000);
        } catch (err) {
            setFormStatus({ loading: false, error: err.message || "Erro ao excluir anúncio.", success: null });
        }
    }, [user, publications, loadPublications, searchTerm]);


    const handleGoBack = () => {
        navigate('/home');
    };

    const handleCardClick = useCallback((anuncio) => {
        setSelectedAnuncio(anuncio);
        setShowDetailModal(true);
    }, []);

    const getTipoTraduzido = (tipo) => {
        return {
            MATERIAL: 'Material/Livro',
            AULA: 'Aula Particular',
            ALUGUEL: 'Aluguel',
            EVENTO: 'Evento',
            ANUNCIO: 'Anúncio Geral' 
        }[tipo] || tipo; 
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

                <div className="search-bar-container">
                    <input
                        type="text"
                        placeholder="Buscar por título ou descrição..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                        className="search-input"
                    />
                    <button onClick={handleSearch} className="search-button">
                        <img src="/icons/search-icon.png" alt="Buscar" style={{ width: '20px', height: '20px' }} />
                    </button>
                </div>

                {loadingPublications ? (
                    <div className="loading">Carregando anúncios...</div>
                ) : errorPublications ? (
                    <div className="error-message">{errorPublications}</div>
                ) : publications.length === 0 ? (
                    <p className="no-results-message">Nenhum anúncio encontrado.</p>
                ) : (
                    <div className="publicacao-grid">
                        {publications.map((anuncio) => (
                            <AnuncioCard 
                                key={anuncio.id} 
                                anuncio={anuncio} 
                                onEdit={handleEditPublication}
                                onDelete={handleDeletePublication}
                                currentUser={user}
                                onCardClick={handleCardClick}
                            />
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
                            publicationType={PUBLICATION_TYPE}
                            initialData={emptyPublicationData}
                            isEditing={false}
                            showModal={showCreateModal}
                        />
                    </div>
                </div>
            )}

            {showEditModal && currentPublication && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close-button" onClick={() => setShowEditModal(false)}>
                            &times;
                        </button>
                        <PublicationForm
                            onSubmit={handleUpdatePublication}
                            loading={formStatus.loading}
                            error={formStatus.error}
                            successMessage={formStatus.success}
                            publicationType={PUBLICATION_TYPE}
                            initialData={currentPublication}
                            isEditing={true}
                            showModal={showEditModal}
                        />
                    </div>
                </div>
            )}

            {/* NOVO: Modal de Detalhes do Anúncio */}
            {showDetailModal && selectedAnuncio && (
                <div className="modal-overlay">
                    <div className="modal-content publicacao-detail-modal"> {/* Adicionada classe para estilos específicos */}
                        <button className="modal-close-button" onClick={() => setShowDetailModal(false)}>
                            &times;
                        </button>
                        <h3 className="detail-title">{selectedAnuncio.titulo}</h3>
                        <p className="detail-type">Tipo: {getTipoTraduzido(selectedAnuncio.tipo)}</p>
                        <p className="detail-description">{selectedAnuncio.descricao}</p>
                        <p className="detail-info">Local: {selectedAnuncio.local}</p>
                        {selectedAnuncio.quantidade && <p className="detail-info">Quantidade: {selectedAnuncio.quantidade}</p>}
                        <p className="detail-info">Por: {selectedAnuncio.autor?.nome || 'Desconhecido'}</p>
                        <p className="detail-info">Publicado em: {new Date(selectedAnuncio.dataPublicacao).toLocaleDateString('pt-BR')}</p>

                        {selectedAnuncio.fotos && selectedAnuncio.fotos.length > 0 && (
                            <div className="detail-photos-grid">
                                <h4>Fotos:</h4>
                                {selectedAnuncio.fotos.map((foto, index) => (
                                    <img key={index} src={foto.urlImagem} alt={`Foto ${index + 1}`} className="detail-photo" />
                                ))}
                            </div>
                        )}
                        {selectedAnuncio.fotos && selectedAnuncio.fotos.length === 0 && (
                            <p className="no-photos-message">Nenhuma foto disponível para este anúncio.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
