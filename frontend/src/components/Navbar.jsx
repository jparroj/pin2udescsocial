import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css'; // Descomente se o arquivo existir

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          UDESC Social
        </Link>

        <nav className="navbar-links">
          {user ? (
            <>
              <Link to="/home" className="nav-link">Home</Link>
              <Link to="/anuncios" className="nav-link">Anúncios</Link>
              <Link to="/perfil" className="nav-link">Perfil</Link>
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
