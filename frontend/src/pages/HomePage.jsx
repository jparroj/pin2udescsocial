    import { useEffect, useState } from 'react';
    import { useAuth } from '../context/AuthContext';
    import { fetchHomeData } from '../services/apiService';
    import AnnouncementCard from '../components/AnnouncementCard';
    import '../styles/home.css';

    export default function HomePage() {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
        try {
            const homeData = await fetchHomeData();
            setData(homeData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

        loadData();
    }, []);

    if (loading) return <div className="loading">Carregando...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="home-page">
        <h1>Bem-vindo, {user?.nome}</h1>
        
        <section className="recent-announcements">
            <h2>Últimos Anúncios</h2>
            <div className="announcements-grid">
            {data?.anunciosRecentes.map(anuncio => (
                <AnnouncementCard key={anuncio.id} anuncio={anuncio} />
            ))}
            </div>
        </section>
        </div>
    );
    }