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
        {}
        
        {}
        <div className={`announcement-tag ${anuncio.tipo.toLowerCase().replace(/[\s.]/g, '-')}`}>{anuncio.tipo}</div>
        {}

      </div>
    </div>
  );
}