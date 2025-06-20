// frontend/src/pages/HomePage.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchHomeData, fetchRecommendations } from '../services/apiService';
import AnnouncementCard from '../components/AnnouncementCard';
import { Link } from 'react-router-dom'; // <--- NOVO IMPORT: Link para navegação

import '../styles/home.css';
import '../styles/cards.css';

const ICON_PATHS = {
    LIVROS: '/icons/book-icon.png',
    MURAL_DOCENTES: '/icons/teacher-board-icon.png',
    CARONAS: '/icons/car-icon.png',
    ANUNCIOS: '/icons/megaphone-icon.png',
};

export default function HomePage() {
    console.log("HomePage: Componente HomePage está sendo renderizado.");
    const { user } = useAuth();
    const [homeData, setHomeData] = useState(null);
    const [recommendationsData, setRecommendationsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadAllData = async () => {
            try {
                const homeResponse = await fetchHomeData();
                setHomeData(homeResponse);

                const recsResponse = await fetchRecommendations(4);
                setRecommendationsData(recsResponse);

            } catch (err) {
                console.error("Erro ao carregar dados da HomePage:", err);
                setError(err.message || "Erro ao carregar a página inicial.");
            } finally {
                setLoading(false);
            }
        };

        loadAllData();
    }, []);

    const categories = [
        { name: 'Livros', icon: ICON_PATHS.LIVROS, path: '/livros' }, // Exemplo: path para Livros
        { name: 'Mural dos docentes', icon: ICON_PATHS.MURAL_DOCENTES, path: '/mural-docentes' },
        { name: 'Caronas', icon: ICON_PATHS.CARONAS, path: '/caronas' }, // <--- CAMINHO PARA A PÁGINA DE CARONAS
        { name: 'Anúncios', icon: ICON_PATHS.ANUNCIOS, path: '/anuncios' },
    ];

    if (loading) return <div className="loading">Carregando...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="home-page">
            <header className="home-header">
                <div className="home-header-content">
                    <img src="/udesc-logo.png" alt="UDESC Logo" className="home-udesc-logo" /> {/* Certifique-se que o nome do arquivo da logo está correto aqui */}
                    <div className="home-header-text">
                        <p className="home-welcome-greeting">Bem vindo (a)</p>
                        <h1 className="home-user-name">{user?.nome || 'Usuário'}</h1>
                    </div>
                </div>
            </header>

            <section className="categories-section">
                <h2>Categorias</h2>
                <div className="category-grid">
                    {categories.map((category, index) => (
                        <Link key={index} to={category.path || '#'}> {/* <--- Usa Link para a navegação */}
                            <div className="category-item-card">
                                <img src={category.icon} alt={category.name} className="category-icon" />
                                <p className="category-name">{category.name}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="recommendations-section">
                <h2>Recomendações</h2>
                <div className="recommendations-container">
                    {recommendationsData && recommendationsData.length > 0 ? (
                        recommendationsData.map(anuncio => (
                            <AnnouncementCard key={anuncio.id} anuncio={anuncio} type="recommendation" />
                        ))
                    ) : (
                        <p>Nenhuma recomendação encontrada.</p>
                    )}
                </div>
            </section>
            
            <section className="recent-announcements">
                <h2>Últimos Anúncios</h2>
                <div className="announcements-grid">
                    {homeData?.anunciosRecentes && homeData.anunciosRecentes.length > 0 ? (
                        homeData.anunciosRecentes.map(anuncio => (
                            <AnnouncementCard key={anuncio.id} anuncio={anuncio} type="full" />
                        ))
                    ) : (
                        <p>Nenhum anúncio recente encontrado.</p>
                    )}
                </div>
            </section>
        </div>
    );
}
