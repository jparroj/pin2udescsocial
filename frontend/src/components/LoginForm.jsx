import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginForm() {
  const [id, setId] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await axios.post('http://localhost:8010/login', {
      email: id,  // Mude de "id" para "email"
      senha: senha
    });

    if (response.data.message === "Login bem-sucedido!") {
      navigate('/dashboard');
    } else {
      setError(response.data.message || 'Credenciais inválidas');
    }
  } catch (err) {
    setError(err.response?.data?.message || 'Erro ao conectar com o servidor');
    console.error('Erro no login:', err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      {/* Logo */}
      <img 
        src="/udesc-logo.png" 
        alt="UDESC Logo" 
        className="w-28 h-28 mb-6"
      />

      {/* Cabeçalho */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">UDESC</h1>
        <p className="text-lg text-gray-700 leading-tight">
          UNIVERSIDADE<br />
          DO ESTADO DE<br />
          SANTA CATARINA
        </p>
      </div>

      {/* Título */}
      <h2 className="text-2xl font-semibold text-blue-800 mb-3">Bem-vindo ao UDESC SOCIAL</h2>
      <p className="text-gray-600 mb-8">
        Para acessar, tenha em mãos seu ID e senha institucional.
      </p>

      {/* Mensagem de erro */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm w-full max-w-sm">
          {error}
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm text-left">
        <div className="mb-5">
          <label className="block text-gray-700 text-md font-medium mb-2">ID UDESC</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Digite seu ID UDESC"
            disabled={loading}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-md font-medium mb-2">Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Digite sua senha"
            disabled={loading}
            required
          />
          <div className="text-right mt-2">
            <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
              Esqueceu sua senha?
            </a>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-300 ${
            loading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'ENTRANDO...' : 'ENTRAR'}
        </button>
      </form>

      {/* Rodapé */}
      <p className="text-gray-400 text-xs mt-12">
        © {new Date().getFullYear()} UDESC SOCIAL
      </p>
    </div>
  );
}