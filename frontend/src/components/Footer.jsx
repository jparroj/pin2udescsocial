// frontend/src/components/Footer.jsx
import React from 'react'; // Adicionado import React, se não estava.
import { Link } from 'react-router-dom'; // <--- ADICIONE ESTA LINHA AQUI!
import '../styles/footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-nav-icons">
            {/* Adicione os ícones de navegação inferior aqui */}
            {/* Ex: <Link to="/home"><img src="/icons/home-bottom.png" alt="Home" /></Link> */}
            {/* Você precisará ter esses ícones e estilizá-los em footer.css */}
            <Link to="/home" className="footer-icon-link"><img src="/icons/book-bottom.png" alt="Livros" className="footer-icon" /></Link>
            <Link to="/groups" className="footer-icon-link"><img src="/icons/group-bottom.png" alt="Grupos" className="footer-icon" /></Link>
            <Link to="/announcements" className="footer-icon-link"><img src="/icons/announcement-bottom.png" alt="Anúncios" className="footer-icon" /></Link>
            <Link to="/settings" className="footer-icon-link"><img src="/icons/settings-bottom.png" alt="Configurações" className="footer-icon" /></Link>
        </div>
        <p className="footer-copyright">© {new Date().getFullYear()} UDESC Social. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}