// frontend/src/components/CaronaCard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function CaronaCard({ carona, onJoinCarona, onEditCarona, onDeleteCarona }) {
    const { user } = useAuth();

    const formattedDate = carona.data ? new Date(carona.data).toLocaleDateString('pt-BR') : 'Data Indefinida';

    const handleSolicitar = () => {
        if (user && user.id) {
            onJoinCarona(carona.id, user.id);
        } else {
            alert("Erro: Você precisa estar logado para solicitar uma carona.");
        }
    };

    const isOfertante = user && carona.ofertanteId && user.id === carona.ofertanteId;

    return (
        <div className="carona-card">
            {isOfertante && (
                <div className="carona-card-actions"> {/* Contêiner para os botões */}
                    <button
                        className="carona-action-button edit-button"
                        onClick={() => onEditCarona(carona)}
                        title="Editar Carona"
                    >
                        <img src="/icons/edit-icon.png" alt="Editar" style={{ width: '20px', height: '20px' }} />
                    </button>
                    <button
                        className="carona-action-button delete-button"
                        onClick={() => onDeleteCarona(carona.id, carona.origem, carona.destino)}
                        title="Excluir Carona"
                    >
                        <img src="/icons/delete-icon.png" alt="Excluir" style={{ width: '20px', height: '20px' }} />
                    </button>
                </div>
            )}

            <div className="carona-header-card">
                <img src="/icons/car-icon.png" alt="Carro" className="carona-icon-card" />
                <span className="carona-vagas">{carona.vagas} vaga(s)</span>
            </div>

            <div className="carona-details">
                <div className="carona-route">
                    <span className="carona-location-from">{carona.origem}</span>
                    <img src="/icons/arrow-right.png" alt="Para" className="carona-arrow-icon" />
                    <span className="carona-location-to">{carona.destino}</span>
                </div>
                <div className="carona-time-date">
                    <span className="carona-time">{carona.horario}</span>
                    <span className="carona-date">{formattedDate}</span>
                </div>
                <p className="carona-ofertante">Oferecido por: {carona.ofertanteNome}</p>
                {carona.descricao && <p className="carona-description">{carona.descricao}</p>}
            </div>

            <div className="carona-actions-footer"> {/* Renomeado para evitar conflito com carona-card-actions */}
                {carona.ofertanteId !== user?.id && carona.vagas > 0 && (
                    <button onClick={handleSolicitar} className="carona-button primary">Solicitar</button>
                )}
                {carona.vagas <= 0 && <span className="no-vagas">Sem Vagas</span>}
                {carona.ofertanteId === user?.id && <span className="your-carona">Sua Carona</span>}
            </div>
        </div>
    );
}
