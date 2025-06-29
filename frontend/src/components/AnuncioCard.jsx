// frontend/src/components/AnuncioCard.jsx
import React from 'react';
import '../styles/publicacoes.css';

export default function AnuncioCard({ anuncio }) {
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

    return (
        <div className="anuncio-card">
            {anuncio.fotos && anuncio.fotos.length > 0 && (
                <div className="anuncio-card-image-container">
                    <img src={anuncio.fotos[0].urlImagem} alt={anuncio.titulo} className="anuncio-card-image" />
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