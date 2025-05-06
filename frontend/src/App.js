// src/App.js
import React, { useState } from 'react';
import Login from './Login';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#e0f7e9', minHeight: '100vh' }}>
      {/* Cabeçalho */}
      <div style={{
        backgroundColor: '#2e7d32',
        color: 'white',
        padding: '20px',
        borderBottomLeftRadius: '40px',
        borderBottomRightRadius: '40px',
        textAlign: 'center'
      }}>
        <h2>Bem vindo (a) Adm</h2>
      </div>

      {/* Categorias */}
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Categorias</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '10px' }}>
          <span>📚</span>
          <span>👩‍🏫</span>
          <span>🚗</span>
          <span>🖥️</span>
        </div>
      </div>

      {/* Recomendações */}
      <div style={{ padding: '0 20px' }}>
        <h3 style={{ color: '#2e7d32' }}>Recomendações</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center' }}>
          <div style={cardStyle}>
            <p><strong>Juliana</strong></p>
            <p>Doa 5 livros de programação orientada a objetos.</p>
            <span style={tagStyle}>Livros usados</span>
          </div>
          <div style={cardStyle}>
            <p><strong>Cristiano</strong></p>
            <p>Doa um monitor LG 24 polegadas.</p>
            <span style={tagStyle}>Equipamentos</span>
          </div>
        </div>
      </div>

      {/* Últimos Anúncios */}
      <div style={{ padding: '20px' }}>
        <h3 style={{ color: '#2e7d32' }}>Últimos Anúncios</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center' }}>
          <div style={cardStyle}>
            <p><strong>Beatriz</strong></p>
            <p>Ofereço carona de Floripa para Joinville dia 25/07.</p>
            <span style={tagStyle}>Carona</span>
          </div>
          <div style={cardStyle}>
            <p><strong>Elian</strong></p>
            <p>Ofereço aulas de álgebra e matemática.</p>
            <span style={tagStyle}>Aulas particulares</span>
          </div>
          <div style={cardStyle}>
            <p><strong>Bruna</strong></p>
            <p>Ofereço aulas de programação orientada a objetos.</p>
            <span style={tagStyle}>Aulas particulares</span>
          </div>
          <div style={cardStyle}>
            <p><strong>Cristiano</strong></p>
            <p>Doa um monitor LG 24 polegadas.</p>
            <span style={tagStyle}>Equipamentos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Estilos reutilizáveis
const cardStyle = {
  backgroundColor: '#fff',
  borderRadius: '10px',
  padding: '15px',
  width: '220px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  textAlign: 'left'
};

const tagStyle = {
  marginTop: '10px',
  display: 'inline-block',
  backgroundColor: '#2e7d32',
  color: '#fff',
  padding: '5px 10px',
  borderRadius: '20px',
  fontSize: '12px'
};

export default App;
