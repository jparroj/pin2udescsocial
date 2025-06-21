// frontend/src/pages/CaronasPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as caronasService from '../services/caronasService';
import CaronaCard from '../components/CaronaCard';
import { useNavigate } from 'react-router-dom';

import '../styles/caronas.css';
import '../styles/cards.css';

// Componentes das abas (permanecem os mesmos)
const ProcurarCaronaTab = ({ onSearch, searchResults, loading, error, onJoinCarona }) => {
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
                            <CaronaCard key={carona.id} carona={carona} onJoinCarona={onJoinCarona} />
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

const OfertarCaronaTab = ({ onOfferCarona, offerStatus, user }) => {
    const [origem, setOrigem] = useState('');
    const [destino, setDestino] = useState('');
    const [data, setData] = useState('');
    const [horario, setHorario] = useState('');
    const [vagas, setVagas] = useState(1);
    const [descricao, setDescricao] = useState('');

    const handleSubmitOffer = () => {
        if (!user || !user.id) {
            alert("Erro: Usuário não logado ou ID de usuário não disponível.");
            return;
        }
        const offerData = {
            ofertanteId: user.id,
            origem,
            destino,
            data,
            horario,
            vagas,
            descricao
        };
        onOfferCarona(offerData);
    };

    useEffect(() => {
        if (offerStatus.success) {
            setOrigem('');
            setDestino('');
            setData('');
            setHorario('');
            setVagas(1);
            setDescricao('');
        }
    }, [offerStatus.success]);


    return (
        <div className="tab-content">
            <div className="offer-form-carona">
                <input type="text" placeholder="De onde você vai sair?" value={origem} onChange={(e) => setOrigem(e.target.value)} />
                <input type="text" placeholder="Até aonde você vai?" value={destino} onChange={(e) => setDestino(e.target.value)} />
                <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
                <input type="time" placeholder="Qual horário?" value={horario} onChange={(e) => setHorario(e.target.value)} />
                <input type="number" placeholder="Quantas vagas você tem?" min="1" value={vagas} onChange={(e) => setVagas(e.target.value)} />
                <textarea placeholder="Utilize este espaço para acrescentar mais informações sobre sua carona" value={descricao} onChange={(e) => setDescricao(e.target.value)}></textarea>
                <button onClick={handleSubmitOffer} className="carona-button primary">Oferecer carona</button>
            </div>
            {offerStatus.loading && <div className="loading">Oferecendo carona...</div>}
            {offerStatus.success && <div className="success-message">Carona ofertada com sucesso!</div>}
            {offerStatus.error && <div className="error">{offerStatus.error}</div>}
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

// Componente principal CaronasPage
export default function CaronasPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('procurar');
    const [searchResults, setSearchResults] = useState(null);
    const [loadingAllCaronas, setLoadingAllCaronas] = useState(false);
    const [errorAllCaronas, setErrorAllCaronas] = useState(null);
    const [offerStatus, setOfferStatus] = useState({ loading: false, success: false, error: null });

    const navigate = useNavigate();

    const handleSearch = async (origem, destino, data) => {
        setLoadingAllCaronas(true);
        setErrorAllCaronas(null);
        try {
            const results = await caronasService.searchCaronas(origem, destino, data);
            setSearchResults(results);
        } catch (err) {
            setErrorAllCaronas(err.message || "Erro ao procurar caronas.");
            setSearchResults([]);
        } finally {
            setLoadingAllCaronas(false);
        }
    };

    const handleOfferCarona = async (caronaData) => {
        setOfferStatus({ loading: true, success: false, error: null });
        try {
            await caronasService.offerCarona(caronaData);
            setOfferStatus({ loading: false, success: true, error: null });
            alert("Carona ofertada com sucesso!");
            setLoadingAllCaronas(true);
            setErrorAllCaronas(null);
            const updatedCaronas = await caronasService.fetchAllCaronas();
            setSearchResults(updatedCaronas);
            setLoadingAllCaronas(false);
        } catch (err) {
            setOfferStatus({ loading: false, success: false, error: err.message || "Erro ao ofertar carona." });
            alert(`Erro ao ofertar carona: ${err.message}`);
        }
    };

    const handleJoinCarona = async (caronaId, currentUserId) => {
        if (!currentUserId) {
            alert("Você precisa estar logado para participar de uma carona.");
            return;
        }
        try {
            await caronasService.addPassenger(caronaId, currentUserId);
            alert("Você entrou na carona com sucesso!");
            setLoadingAllCaronas(true);
            setErrorAllCaronas(null);
            const updatedCaronas = await caronasService.fetchAllCaronas();
            setSearchResults(updatedCaronas);
            setLoadingAllCaronas(false);
        } catch (err) {
            alert(`Erro ao entrar na carona: ${err.message}`);
        }
    };

    // Função para voltar para a HomePage (será usada pelo botão no cabeçalho)
    const handleGoBack = () => {
        navigate('/home'); // Volta para a rota da HomePage
    };



    return (
        <div className="caronas-page">
            <header className="caronas-header">
                <div className="caronas-header-content">
                    {/* Botão de Voltar e Logo UDESC no canto esquerdo */}
                    <div className="left-header-group">
                        <button onClick={handleGoBack} className="back-button">
                            <img src="/icons/arrow-left.png" alt="Voltar" style={{ width: '24px', height: '24px' }} />
                        </button>
                        <img src="/udesc-logo.png" alt="UDESC Logo" className="home-udesc-logo" />
                    </div>

                    {/* Título da Página - Centralizado */}
                    <div className="home-header-text">
                        <p className="home-welcome-greeting">Caronas</p>
                    </div>

                    {/* O lado direito do cabeçalho ficará vazio. A classe 'right-header-group'
                        será mantida para balancear o layout, com um min-width equivalente ao lado esquerdo. */}
                    <div className="right-header-group">
                        {/* Conteúdo vazio aqui */}
                    </div>
                </div>
            </header>

            <div className="caronas-tabs-container">
                <div className="caronas-tab-buttons">
                    <button onClick={() => setActiveTab('procurar')} className={`tab-button ${activeTab === 'procurar' ? 'active' : ''}`}>
                        <img src="/icons/search-icon.png" alt="Procurar" className="tab-icon" />
                        Procurar
                    </button>
                    <button onClick={() => setActiveTab('ofertar')} className={`tab-button ${activeTab === 'ofertar' ? 'active' : ''}`}>
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
                        loading={loadingAllCaronas}
                        error={errorAllCaronas}
                        onJoinCarona={(caronaId) => handleJoinCarona(caronaId, user?.id)}
                    />
                )}
                {activeTab === 'ofertar' && (
                    <OfertarCaronaTab
                        onOfferCarona={handleOfferCarona}
                        offerStatus={offerStatus}
                        user={user}
                    />
                )}
                {activeTab === 'avaliacoes' && (
                    <AvaliacoesCaronaTab userId={user?.id} />
                )}
            </div>
        </div>
    );
}