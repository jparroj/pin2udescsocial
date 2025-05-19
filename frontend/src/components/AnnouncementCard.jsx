import './styles/cards.css';

export default function AnnouncementCard({ anuncio }) {
  return (
    <div className="announcement-card">
      {anuncio.fotos?.length > 0 && (
        <img 
          src={anuncio.fotos[0].urlImagem} 
          alt={anuncio.titulo}
          className="announcement-image"
        />
      )}
      <div className="announcement-content">
        <h3>{anuncio.titulo}</h3>
        <div className="announcement-meta">
          <span className="announcement-type">{anuncio.tipo}</span>
          <span className="announcement-location">{anuncio.local}</span>
        </div>
        <p className="announcement-author">Por: {anuncio.autor.nome}</p>
        <time className="announcement-date">
          {new Date(anuncio.dataPublicacao).toLocaleDateString('pt-BR')}
        </time>
      </div>
    </div>
  );
}