import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import * as caronasService from '../services/caronasService';
import CaronaCard from '../components/CaronaCard';
import CaronaForm from '../components/CaronaForm';
import { useNavigate } from 'react-router-dom';

import '../styles/caronas.css';
import '../styles/cards.css';

const ProcurarCaronaTab = ({ onSearch, searchResults, loading, error, onJoinCarona, onEditCarona, onDeleteCarona, currentUser }) => {
    const [origem, setOrigem] = useState('');
    const [destino, setDestino] = useState('');
    const [data, setData] = useState('');

    const handleSearch = () => {
        onSearch(origem, destino, data);
    };

    return (
        <div className="tab-content">
            <div className="search-form-carona">
                <input type="text" placeholder="Origem" value={origem} onChange={(e) => setOrigem(e.target.value)} />
                <input type="text" placeholder="Destino" value={destino} onChange={(e) => setDestino(e.target.value)} />
                <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
                <button onClick={handleSearch} className="carona-button primary">Procurar</button>
            </div>

            {loading && <div className="loading">Carregando caronas...</div>}
            {error && <div className="error">{error}</div>}

            {searchResults !== null && !loading && !error && (
                <div className="caronas-list-grid">
                    {searchResults.length > 0 ? (
                        searchResults.map(carona => (
                            <CaronaCard 
                                key={carona.id} 
                                carona={carona} 
                                onJoinCarona={onJoinCarona}
                                onEditCarona={onEditCarona} 
                                onDeleteCarona={onDeleteCarona} 
                                currentUser={currentUser}
                            />
                        ))
                    ) : (
                        <p className="no-results">Nenhuma carona encontrada com os critérios.</p>
                    )}
                </div>
            )}

            {searchResults === null && !loading && !error && (
                <p className="initial-message">Utilize os filtros acima para encontrar caronas.</p>
            )}

            <div className="carona-alert-section">
                <p>Não encontrou sua carona? Crie um alerta para essa pesquisa e caso algum aluno insira uma carona você será notificado via email.</p>
                <button className="carona-button secondary">Criar alerta</button>
            </div>
        </div>
    );
};


const AvaliacoesCaronaTab = ({ userId }) => {
    const [activeTab, setActiveTab] = useState('recebidas');
    const [receivedEvaluations, setReceivedEvaluations] = useState(null);
    const [madeEvaluations, setMadeEvaluations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadEvaluations = async () => {
            if (!userId) {
                setError("ID do usuário não disponível para buscar avaliações.");
                setLoading(false);
                return;
            }
            try {
                const received = await caronasService.fetchReceivedEvaluations(userId);
                setReceivedEvaluations(received);
                const made = await caronasService.fetchMadeEvaluations(userId);
                setMadeEvaluations(made);
            } catch (err) {
                setError(err.message || "Erro ao carregar avaliações.");
            } finally {
                setLoading(false);
            }
        };
        loadEvaluations();
    }, [userId]);

    if (loading) return <div className="loading">Carregando avaliações...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="tab-content">
            <div className="evaluations-tabs">
                <button onClick={() => setActiveTab('recebidas')} className={`tab-button ${activeTab === 'recebidas' ? 'active' : ''}`}>Recebidas</button>
                <button onClick={() => setActiveTab('feitas')} className={`tab-button ${activeTab === 'feitas' ? 'active' : ''}`}>Feitas</button>
            </div>
            {activeTab === 'recebidas' && (
                <div className="evaluations-list">
                    {receivedEvaluations && receivedEvaluations.length > 0 ? (
                        receivedEvaluations.map(evalu => (
                            <div key={evalu.id} className="evaluation-card">
                                <p className="evaluation-meta">De: {evalu.avaliador?.nome || 'Desconhecido'} - Carona ID: {evalu.caronaId}</p>
                                <p className="evaluation-nota">Nota: {evalu.nota}</p>
                                <p className="evaluation-comentario">"{evalu.comentario}"</p>
                                <p className="evaluation-date">{new Date(evalu.dataAvaliacao).toLocaleDateString('pt-BR')}</p>
                            </div>
                        ))
                    ) : (
                        <p className="no-results">Nenhuma avaliação recebida.</p>
                    )}
                </div>
            )}
            {activeTab === 'feitas' && (
                <div className="evaluations-list">
                    {madeEvaluations && madeEvaluations.length > 0 ? (
                        madeEvaluations.map(evalu => (
                            <div key={evalu.id} className="evaluation-card">
                                <p className="evaluation-meta">Para: {evalu.avaliado?.nome || 'Desconhecido'} - Carona ID: {evalu.caronaId}</p>
                                <p className="evaluation-nota">Nota: {evalu.nota}</p>
                                <p className="evaluation-comentario">"{evalu.comentario}"</p>
                                <p className="evaluation-date">{new Date(evalu.dataAvaliacao).toLocaleDateString('pt-BR')}</p>
                            </div>
                        ))
                    ) : (
                        <p className="no-results">Nenhuma avaliação feita.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default function CaronasPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('procurar');
    const [searchResults, setSearchResults] = useState(null);
    const [loadingCaronas, setLoadingCaronas] = useState(false);
    const [errorCaronas, setErrorCaronas] = useState(null); 
    const [formStatus, setFormStatus] = useState({ loading: false, error: null, success: null });
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentCarona, setCurrentCarona] = useState(null);

    const navigate = useNavigate();

    const emptyCaronaData = {};

    const loadAllAvailableCaronas = useCallback(async () => {
        setLoadingCaronas(true);
        setErrorCaronas(null);
        try {
            const data = await caronasService.fetchAllCaronas();
            setSearchResults(data);
        } catch (err) {
            console.error("Erro ao carregar todas as caronas:", err);
            setErrorCaronas(err.message || "Erro ao carregar todas as caronas disponíveis.");
            setSearchResults([]);
        } finally {
            setLoadingCaronas(false);
        }
    }, []);

    useEffect(() => {
        if (activeTab === 'procurar') {
            loadAllAvailableCaronas();
        }
    }, [activeTab, loadAllAvailableCaronas]);


    const handleSearch = async (origem, destino, data) => {
        setLoadingCaronas(true);
        setErrorCaronas(null);
        try {
            const results = await caronasService.searchCaronas(origem, destino, data);
            setSearchResults(results);
        } catch (err) {
            setErrorCaronas(err.message || "Erro ao procurar caronas.");
            setSearchResults([]);
        } finally {
            setLoadingCaronas(false);
        }
    };

    const handleOfferCarona = useCallback(async (caronaData) => {
        setFormStatus({ loading: true, error: null, success: null });
        try {
            await caronasService.offerCarona(caronaData);
            setFormStatus({ loading: false, error: null, success: "Carona ofertada com sucesso!" });
            alert("Carona ofertada com sucesso!");
            loadAllAvailableCaronas();
            setShowOfferModal(false);
            setTimeout(() => setFormStatus({ loading: false, error: null, success: null }), 3000);
        } catch (err) {
            setFormStatus({ loading: false, error: err.message || "Erro ao ofertar carona." });
            alert(`Erro ao ofertar carona: ${err.message}`);
        }
    }, [loadAllAvailableCaronas]);

    const handleJoinCarona = async (caronaId, currentUserId) => {
        if (!currentUserId) {
            alert("Você precisa estar logado para participar de uma carona.");
            return;
        }
        try {
            await caronasService.addPassenger(caronaId, currentUserId);
            alert("Você entrou na carona com sucesso!");
            loadAllAvailableCaronas();
        } catch (err) {
            alert(`Erro ao entrar na carona: ${err.message}`);
        }
    };

    const handleEditCarona = useCallback((carona) => {
        setCurrentCarona(carona);
        setShowEditModal(true);
        setFormStatus({ loading: false, error: null, success: null });
    }, []);

    const handleUpdateCarona = useCallback(async (formData) => {
        if (!user || !user.id || !currentCarona || !formData.id) {
            alert("Erro: Dados incompletos para atualizar a carona.");
            return;
        }
        if (user.id !== formData.ofertanteId) { 
             alert("Você não tem permissão para editar esta carona.");
             return;
        }

        setFormStatus({ loading: true, error: null, success: null });
        try {
            await caronasService.updateCarona(formData.id, formData); 
            setFormStatus({ loading: false, error: null, success: "Carona atualizada com sucesso!" });
            alert("Carona atualizada com sucesso!");
            loadAllAvailableCaronas(); 
            setShowEditModal(false);
            setCurrentCarona(null);
            setTimeout(() => setFormStatus({ loading: false, error: null, success: null }), 3000);
        } catch (err) {
            setFormStatus({ loading: false, error: err.message || "Erro ao atualizar carona." });
            alert(`Erro ao atualizar carona: ${err.message}`);
        }
    }, [user, currentCarona, loadAllAvailableCaronas]);

    const handleDeleteCarona = useCallback(async (caronaId, origem, destino) => {
        if (!user || !user.id) {
            alert("Você precisa estar logado para excluir.");
            return;
        }

        const caronaToDelete = searchResults.find(carona => carona.id === caronaId);
        if (!caronaToDelete || caronaToDelete.ofertanteId !== user.id) {
            alert("Você não tem permissão para excluir esta carona.");
            return;
        }

        const confirmDelete = window.confirm(`Tem certeza que deseja excluir a carona de "${origem}" para "${destino}"?`);
        if (!confirmDelete) return;

        setFormStatus({ loading: true, error: null, success: null });
        try {
            await caronasService.deleteCarona(caronaId, user.id); 
            setFormStatus({ loading: false, error: null, success: "Carona excluída com sucesso!" });
            alert("Carona excluída com sucesso!");
            loadAllAvailableCaronas(); 
            setTimeout(() => setFormStatus({ loading: false, error: null, success: null }), 3000);
        } catch (err) {
            setFormStatus({ loading: false, error: err.message || "Erro ao excluir carona." });
            alert(`Erro ao excluir carona: ${err.message}`);
        }
    }, [user, searchResults, loadAllAvailableCaronas]); 


    const handleGoBack = () => {
        navigate('/home');
    };

    return (
        <div className="caronas-page">
            <header className="caronas-header">
                <div className="caronas-header-content">
                    <div className="left-header-group">
                        <button onClick={handleGoBack} className="back-button">
                            <img src="/icons/arrow-left.png" alt="Voltar" style={{ width: '24px', height: '24px' }} />
                        </button>
                        <img src="/udesc-logo.png" alt="UDESC Logo" className="home-udesc-logo" />
                    </div>
                    <div className="home-header-text">
                        <p className="home-welcome-greeting">Caronas</p>
                    </div>
                    <div className="right-header-group"></div>
                </div>
            </header>

            <div className="caronas-tabs-container">
                <div className="caronas-tab-buttons">
                    <button onClick={() => setActiveTab('procurar')} className={`tab-button ${activeTab === 'procurar' ? 'active' : ''}`}>
                        <img src="/icons/search-icon.png" alt="Procurar" className="tab-icon" />
                        Procurar
                    </button>
                    <button onClick={() => setShowOfferModal(true)} className={`tab-button ${activeTab === 'ofertar' ? 'active' : ''}`}>
                        <img src="/icons/plus-icon.png" alt="Oferecer" className="tab-icon" />
                        Oferecer
                    </button>
                    <button onClick={() => setActiveTab('avaliacoes')} className={`tab-button ${activeTab === 'avaliacoes' ? 'active' : ''}`}>
                        <img src="/icons/star-icon.png" alt="Avaliações" className="tab-icon" />
                        Avaliações
                    </button>
                </div>

                {activeTab === 'procurar' && (
                    <ProcurarCaronaTab
                        onSearch={handleSearch}
                        searchResults={searchResults}
                        loading={loadingCaronas}
                        error={errorCaronas}
                        onJoinCarona={(caronaId) => handleJoinCarona(caronaId, user?.id)}
                        onEditCarona={handleEditCarona} 
                        onDeleteCarona={handleDeleteCarona} 
                        currentUser={user} 
                    />
                )}
                {showOfferModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <button className="modal-close-button" onClick={() => setShowOfferModal(false)}>
                                &times;
                            </button>
                            <CaronaForm
                                onSubmit={handleOfferCarona}
                                loading={formStatus.loading}
                                error={formStatus.error}
                                successMessage={formStatus.success}
                                initialData={emptyCaronaData}
                                isEditing={false}
                                showModal={showOfferModal}
                                user={user}
                            />
                        </div>
                    </div>
                )}
                {activeTab === 'avaliacoes' && (
                    <AvaliacoesCaronaTab userId={user?.id} />
                )}

                {showEditModal && currentCarona && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <button className="modal-close-button" onClick={() => setShowEditModal(false)}>
                                &times;
                            </button>
                            <CaronaForm
                                onSubmit={handleUpdateCarona}
                                loading={formStatus.loading}
                                error={formStatus.error}
                                successMessage={formStatus.success}
                                initialData={currentCarona}
                                isEditing={true}
                                showModal={showEditModal}
                                user={user}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}