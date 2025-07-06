// frontend/src/components/MuralCard.jsx
import React from 'react';

export default function MuralCard({ publication, onEdit, onDelete, currentUserProfessorId }) {
    console.log(`--- Depurando MuralCard ID: ${publication.id} ---`); 
    console.log("publication.autorId:", publication.autorId); 
    console.log("currentUserProfessorId:", currentUserProfessorId);

    const formattedDate = publication.dataPublicacao
        ? new Date(publication.dataPublicacao).toLocaleDateString('pt-BR')
        : 'Data Indefinida';

    const autorNome = publication.autorNome || 'Desconhecido';

    const canManage = currentUserProfessorId && currentUserProfessorId === publication.autorId;
    console.log("canManage (resultado final):", canManage);

    return (
        <div className="mural-card">
            {canManage && (
                <div className="mural-card-actions"> {/* Contêiner para os botões */}
                    <button
                        className="mural-action-button edit-button-mural"
                        onClick={() => onEdit(publication)}
                        title="Editar Publicação"
                    >
                        <img src="/icons/edit-icon.png" alt="Editar" style={{ width: '20px', height: '20px' }} />
                    </button>
                    <button
                        className="mural-action-button delete-button-mural"
                        onClick={() => onDelete(publication.id, publication.titulo)}
                        title="Excluir Publicação"
                    >
                        <img src="/icons/delete-icon.png" alt="Excluir" style={{ width: '20px', height: '20px' }} />
                    </button>
                </div>
            )}
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