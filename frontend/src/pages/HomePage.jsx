// frontend/src/pages/HomePage.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchHomeData, fetchRecommendations } from '../services/apiService';
import AnuncioCard from '../components/AnuncioCard'; 
import { Link, useNavigate } from 'react-router-dom';
import '../styles/home.css';
import '../styles/cards.css';
import '../styles/publicacoes.css'; 

const ICON_PATHS = {
    LIVROS: '/icons/book-icon.png',
    MURAL_DOCENTES: '/icons/teacher-board-icon.png',
    CARONAS: '/icons/car-icon.png',
    ANUNCIOS: '/icons/megaphone-icon.png',
};

export default function HomePage() {
    console.log("HomePage: Componente HomePage está sendo renderizado.");
    const { user, logout } = useAuth();
    const navigate = useNavigate();
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

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            console.error("Erro ao fazer logout:", err);
        }
    };

    const categories = [
        { name: 'Livros', icon: ICON_PATHS.LIVROS, path: '/livros' },
        { name: 'Mural dos docentes', icon: ICON_PATHS.MURAL_DOCENTES, path: '/mural-docentes' },
        { name: 'Caronas', icon: ICON_PATHS.CARONAS, path: '/caronas' },
        { name: 'Anúncios', icon: ICON_PATHS.ANUNCIOS, path: '/anuncios' },
    ];

    if (loading) return <div className="loading">Carregando...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="home-page">
            <header className="home-header">
                <div className="home-header-content">
                    <img src="/udesc-logo.png" alt="UDESC Logo" className="home-udesc-logo" />
                    <div className="home-header-text">
                        <p className="home-welcome-greeting">Bem vindo (a)</p>
                        <h1 className="home-user-name">{user?.nome || 'Usuário'}</h1>
                    </div>
                    {/* Botão de Sair */}
                    <button onClick={handleLogout} className="logout-button">
                        Sair
                    </button>
                </div>
            </header>

            <section className="categories-section">
                <h2>Categorias</h2>
                <div className="category-grid">
                    {categories.map((category, index) => (
                        <Link key={index} to={category.path || '#'}>
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
                            <AnuncioCard key={anuncio.id} anuncio={anuncio} />
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
                            <AnuncioCard key={anuncio.id} anuncio={anuncio} />
                        ))
                    ) : (
                        <p>Nenhum anúncio recente encontrado.</p>
                    )}
                </div>
            </section>
        </div>
    );
}