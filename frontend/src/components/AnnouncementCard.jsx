// frontend/src/components/AnnouncementCard.jsx

import React from 'react';
import '../styles/cards.css';

export default function AnnouncementCard({ anuncio, type = 'full' }) {
  const isRecommendation = type === 'recommendation';

  return (
    <div className={`announcement-card ${isRecommendation ? 'recommendation-card' : 'full-card'}`}>
      {anuncio.fotoPrincipal && (
        <img
          src={anuncio.fotoPrincipal}
          alt={anuncio.titulo}
          className={`announcement-image ${isRecommendation ? 'recommendation-image' : ''}`}
        />
      )}
      <div className="announcement-content">
        {/* ... código existente ... */}
        
        {/* Linha corrigida: Removido o escape desnecessário para o ponto */}
        <div className={`announcement-tag ${anuncio.tipo.toLowerCase().replace(/[\s.]/g, '-')}`}>{anuncio.tipo}</div>
        {/* Ou, se o tipo puder ter outros caracteres especiais que você também queira substituir, poderia ser mais abrangente, ex: replace(/[^a-z0-9]/g, '-') */}

      </div>
    </div>
  );
}