// frontend/src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-container">
        {}
        <Link to="/home" className="navbar-brand"> {/* Link para home */}
          UDESC Social
        </Link>

        {/* Informações do usuário no Navbar (topo direito do protótipo) */}
        {user && (
            <div className="navbar-user-info">
                {user.profilePicUrl ? (
                    <img src={user.profilePicUrl} alt="Foto de Perfil" className="navbar-profile-pic" />
                ) : (
                    <div className="navbar-profile-pic-placeholder"></div>
                )}
                {/* <span className="navbar-username">{user.nome}</span> -- Nome já aparece no banner */}
            </div>
        )}

        {/* Links de navegação */}
        <nav className="navbar-links">
          {user ? (
            <>
              <Link to="/home" className="nav-link">Home</Link>
              <Link to="/anuncios" className="nav-link">Anúncios</Link>
              <Link to="/profile" className="nav-link">Perfil</Link> {/* Assumindo que '/perfil' é '/profile' */}
              <button onClick={logout} className="logout-button">Sair</button>
            </>
          ) : (
            <Link to="/login" className="nav-link">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}