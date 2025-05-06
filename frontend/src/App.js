// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Login from './Login';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  useEffect(() => {
    if (isLoggedIn) {
      axios
        .get('http://localhost:8010/api/usuarios')
        .then((response) => {
          setUsuarios(response.data);
          setError('');
        })
        .catch((error) => {
          console.error('Erro ao buscar usuários:', error);
          setError('Erro ao carregar os usuários.');
        });
    }
  }, [isLoggedIn]);

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <h1>Lista de Usuários</h1>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <ul>
            {usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <li key={usuario.id}>
                  {usuario.nome} ({usuario.email})
                </li>
              ))
            ) : (
              <p>Nenhum usuário encontrado.</p>
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default App;