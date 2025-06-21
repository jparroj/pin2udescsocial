// frontend/src/components/MuralCard.jsx
import React from 'react';

export default function MuralCard({ publication }) {
    // Formata a data para pt-BR
    const formattedDate = publication.dataPublicacao 
        ? new Date(publication.dataPublicacao).toLocaleDateString('pt-BR') 
        : 'Data Indefinida';

    // Garante que o autor e seu usuário existam antes de acessar o nome
    const autorNome = publication.autor && publication.autor.usuario 
                      ? publication.autor.usuario.nome 
                      : 'Desconhecido';

    return (
        <div className="mural-card">
            <h3 className="mural-card-title">{publication.titulo}</h3>
            <p className="mural-card-category">Categoria: {publication.categoria}</p>
            <p className="mural-card-content">{publication.conteudo}</p>
            <div className="mural-card-footer">
                <span className="mural-card-author">Por: {autorNome}</span>
                <span className="mural-card-date">Publicado em: {formattedDate}</span>
            </div>
        </div>
    );
}