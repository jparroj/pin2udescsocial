// frontend/src/components/CaronaCard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext'; // Para pegar o ID do usuário logado se precisar no botão

export default function CaronaCard({ carona, onJoinCarona }) {
    const { user } = useAuth(); // Pega o usuário logado para o botão "Solicitar"

    // Formata a data para pt-BR
    const formattedDate = carona.data ? new Date(carona.data).toLocaleDateString('pt-BR') : 'Data Indefinida';

    const handleSolicitar = () => {
        if (user && user.id) {
            onJoinCarona(carona.id, user.id); // Passa o ID da carona e o ID do usuário
        } else {
            alert("Erro: Você precisa estar logado para solicitar uma carona.");
        }
    };

    return (
        <div className="carona-card">
            <div className="carona-header-card">
                <img src="/icons/car-icon.png" alt="Carro" className="carona-icon-card" /> {/* Ícone de carro */}
                <span className="carona-vagas">{carona.vagas} vaga(s)</span>
            </div>

            <div className="carona-details">
                <div className="carona-route">
                    <span className="carona-location-from">{carona.origem}</span>
                    <img src="/icons/arrow-right.png" alt="Para" className="carona-arrow-icon" /> {/* Ícone de flecha */}
                    <span className="carona-location-to">{carona.destino}</span>
                </div>
                <div className="carona-time-date">
                    <span className="carona-time">{carona.horario}</span>
                    <span className="carona-date">{formattedDate}</span>
                </div>
                <p className="carona-ofertante">Oferecido por: {carona.ofertanteNome}</p>
                {carona.descricao && <p className="carona-description">{carona.descricao}</p>}
            </div>

            <div className="carona-actions">
                {/* Não mostra o botão se for o próprio ofertante ou não tiver vagas, ou se a carona já passou (adicional) */}
                {carona.ofertanteId !== user?.id && carona.vagas > 0 && (
                    <button onClick={handleSolicitar} className="carona-button primary">Solicitar</button>
                )}
                {carona.vagas <= 0 && <span className="no-vagas">Sem Vagas</span>}
                {carona.ofertanteId === user?.id && <span className="your-carona">Sua Carona</span>}
            </div>
        </div>
    );
}