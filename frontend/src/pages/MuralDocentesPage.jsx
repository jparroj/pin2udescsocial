import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import * as muralService from '../services/muralService';
import MuralCard from '../components/MuralCard';
import MuralForm from '../components/MuralForm';
import { useNavigate } from 'react-router-dom';

import '../styles/mural.css';
import '../styles/global.css';
import '../styles/caronas.css';

export default function MuralDocentesPage() {
    const { user, loading: authLoading } = useAuth();
    const [publications, setPublications] = useState([]);
    const [loadingPublications, setLoadingPublications] = useState(true);
    const [errorPublications, setErrorPublications] = useState(null);
    const [formStatus, setFormStatus] = useState({ loading: false, error: null, success: null });
    const [professorId, setProfessorId] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentPublication, setCurrentPublication] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); 

    const navigate = useNavigate();

    const emptyPublicationData = {};

    const loadPublications = useCallback(async (keyword = '') => {
        setLoadingPublications(true);
        setErrorPublications(null);
        try {
            const data = await muralService.fetchMuralPublications(null, keyword); 
            setPublications(data);
        } catch (err) {
            setErrorPublications(err.message || 'Erro ao carregar publicações.');
        } finally {
            setLoadingPublications(false);
        }
    }, []);

    useEffect(() => {
        loadPublications(searchTerm); 
    }, [loadPublications, searchTerm]); 

    const handleSearch = () => {
        loadPublications(searchTerm); 
    };

    const setFormStatusDebug = useCallback((newStatus) => {
        setFormStatus(newStatus);
    }, []);

    useEffect(() => {
        const getProfessorId = async () => {
            if (!authLoading && user && user.tipo === 'PROFESSOR') {
                try {
                    const profId = await muralService.fetchProfessorIdByUserId(user.id);
                    setProfessorId(profId);
                } catch {
                    setErrorPublications('Não foi possível carregar suas informações de professor.');
                    setProfessorId(null);
                }
            } else if (!authLoading) {
                setProfessorId(null);
            }
        };
        getProfessorId();
    }, [authLoading, user]);

    const handleCreatePublication = useCallback(async (formData) => {
        if (!user || user.tipo !== 'PROFESSOR' || !professorId) return;

        setFormStatusDebug({ loading: true, error: null, success: null });
        try {
            const dataToSend = {
                autorId: professorId,
                titulo: formData.titulo,
                categoria: formData.categoria,
                conteudo: formData.conteudo,
            };
            await muralService.createMuralPublication(dataToSend);
            setFormStatusDebug({ loading: false, error: null, success: 'Publicação criada com sucesso!' });
            loadPublications(searchTerm); 
            setShowCreateModal(false);
            setTimeout(() => setFormStatusDebug({ loading: false, error: null, success: null }), 3000);
        } catch (err) {
            setFormStatusDebug({ loading: false, error: err.message || 'Erro ao criar publicação.', success: null });
        }
    }, [user, professorId, loadPublications, setFormStatusDebug, searchTerm]);

    const handleEditPublication = useCallback((publication) => {
        setCurrentPublication(publication);
        setShowEditModal(true);
        setFormStatusDebug({ loading: false, error: null, success: null });
    }, [setFormStatusDebug]);

    const handleUpdatePublication = useCallback(async (formData) => {
        if (!user || user.tipo !== 'PROFESSOR' || !professorId || !currentPublication || !formData.id) return;

        setFormStatusDebug({ loading: true, error: null, success: null });
        try {
            const dataToSend = {
                id: formData.id,
                autorId: professorId,
                titulo: formData.titulo,
                categoria: formData.categoria,
                conteudo: formData.conteudo,
            };
            await muralService.updateMuralPublication(formData.id, dataToSend);
            setFormStatusDebug({ loading: false, error: null, success: 'Publicação atualizada com sucesso!' });
            loadPublications(searchTerm); 
            setShowEditModal(false);
            setCurrentPublication(null);
            setTimeout(() => setFormStatusDebug({ loading: false, error: null, success: null }), 3000);
        } catch (err) {
            setFormStatusDebug({ loading: false, error: err.message || 'Erro ao atualizar publicação.', success: null });
        }
    }, [user, professorId, currentPublication, loadPublications, setFormStatusDebug, searchTerm]);

    const handleDeletePublication = useCallback(async (publicationId, publicationTitle) => {
        if (!user || user.tipo !== 'PROFESSOR' || !professorId) return;
        const confirmDelete = window.confirm(`Tem certeza que deseja excluir a publicação "${publicationTitle}"?`);
        if (!confirmDelete) return;

        setFormStatusDebug({ loading: true, error: null, success: null });
        try {
            await muralService.deleteMuralPublication(publicationId, professorId);
            setFormStatusDebug({ loading: false, error: null, success: 'Publicação excluída com sucesso!' });
            loadPublications(searchTerm); 
            setTimeout(() => setFormStatusDebug({ loading: false, error: null, success: null }), 3000);
        } catch (err) {
            setFormStatusDebug({ loading: false, error: err.message || 'Erro ao excluir publicação.', success: null });
        }
    }, [user, professorId, loadPublications, setFormStatusDebug, searchTerm]);

    const handleGoBack = () => {
        navigate('/home');
    };

    const isProfessor = user && user.tipo === 'PROFESSOR';

    if (authLoading) {
        return <div className="loading">Carregando informações do usuário...</div>;
    }

    return (
        <div className="mural-page">
            <header className="caronas-header">
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
                {isProfessor && professorId && (
                    <div className="mural-actions-top">
                        <button
                            onClick={() => {
                                setShowCreateModal(true);
                                setFormStatusDebug({ loading: false, error: null, success: null });
                            }}
                            className="mural-button primary"
                        >
                            + Nova Publicação
                        </button>
                        {formStatus.success && <p className="success-message">{formStatus.success}</p>}
                        {formStatus.error && <p className="error-message">{formStatus.error}</p>}
                    </div>
                )}

                <h2>Publicações Recentes</h2>

                <div className="search-bar-container">
                    <input
                        type="text"
                        placeholder="Buscar por título ou conteúdo..."
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
                    <div className="loading">Carregando publicações...</div>
                ) : errorPublications ? (
                    <div className="error-message">{errorPublications}</div>
                ) : publications.length === 0 ? (
                    <p className="no-results-message">Nenhuma publicação encontrada no mural.</p>
                ) : !showCreateModal && !showEditModal ? (
                    <div className="mural-publications-grid">
                        {publications.map((publication) => (
                            <MuralCard
                                key={publication.id}
                                publication={publication}
                                onEdit={handleEditPublication}
                                onDelete={handleDeletePublication}
                                currentUserProfessorId={professorId}
                            />
                        ))}
                    </div>
                ) : null}
            </div>

            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close-button" onClick={() => setShowCreateModal(false)}>
                            &times;
                        </button>
                        <MuralForm
                            onSubmit={handleCreatePublication}
                            loading={formStatus.loading}
                            error={formStatus.error}
                            successMessage={formStatus.success}
                            isEditing={false}
                            initialData={emptyPublicationData}
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
                        <MuralForm
                            onSubmit={handleUpdatePublication}
                            loading={formStatus.loading}
                            error={formStatus.error}
                            successMessage={formStatus.success}
                            initialData={currentPublication}
                            isEditing={true}
                            showModal={showEditModal}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}