import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './styles/navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">UDESC Social</Link>
        
        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/home">Home</Link>
              <Link to="/anuncios">Anúncios</Link>
              <Link to="/perfil">Perfil</Link>
              <button onClick={logout} className="logout-button">Sair</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}