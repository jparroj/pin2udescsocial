// frontend/src/components/AnuncioCard.jsx
import React from 'react';
import '../styles/publicacoes.css';

export default function AnuncioCard({ anuncio, onEdit, onDelete, currentUser, onCardClick }) {

    const formattedDate = anuncio.dataPublicacao
        ? new Date(anuncio.dataPublicacao).toLocaleDateString('pt-BR')
        : 'Data Indefinida';

    const autorNome = anuncio.autor?.nome || 'Desconhecido';
    
    const tipoTraduzido = {
        MATERIAL: 'Material/Livro',
        AULA: 'Aula Particular',
        ALUGUEL: 'Aluguel',
        EVENTO: 'Evento',
        ANUNCIO: 'Anúncio Geral' 
    }[anuncio.tipo] || anuncio.tipo; 

    const isAuthor = currentUser && anuncio.autor && currentUser.id === anuncio.autor.id;

    return (
        <div className="anuncio-card" onClick={() => onCardClick(anuncio)}>
            {isAuthor && (
                <div className="anuncio-card-actions">
                    <button
                        className="anuncio-action-button edit-button"
                        onClick={(e) => { e.stopPropagation(); onEdit(anuncio); }}
                        title="Editar Publicação"
                    >
                        <img src="/icons/edit-icon.png" alt="Editar" style={{ width: '20px', height: '20px' }} />
                    </button>
                    <button
                        className="anuncio-action-button delete-button"
                        onClick={(e) => { e.stopPropagation(); onDelete(anuncio.id, anuncio.titulo); }}
                        title="Excluir Publicação"
                    >
                        <img src="/icons/delete-icon.png" alt="Excluir" style={{ width: '20px', height: '20px' }} />
                    </button>
                </div>
            )}

            <h3 className="anuncio-card-title">{anuncio.titulo}</h3>
            <p className="anuncio-card-type">Tipo: {tipoTraduzido}</p>
            <p className="anuncio-card-description">{anuncio.descricao}</p>
            <p className="anuncio-card-location">Local: {anuncio.local}</p>
            {anuncio.quantidade && <p className="anuncio-card-quantity">Quantidade: {anuncio.quantidade}</p>}
            
            <div className="anuncio-card-footer">
                <span className="anuncio-card-author">Por: {autorNome}</span>
                <span className="anuncio-card-date">Publicado em: {formattedDate}</span>
            </div>
        </div>
    );
}
