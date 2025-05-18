// frontend/src/components/LoginForm.jsx
import { useState } from 'react';
import { login } from '../services/authService';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { message } = await login(email, senha);
    setMensagem(message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* Cabeçalho UDESC */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-800">UDESC</h1>
          <p className="text-sm text-gray-600">UNIVERSIDADE DO ESTADO DE SANTA CATARINA</p>
          <h2 className="text-xl mt-4 text-blue-600">Bem vindo ao UDESC SOCIAL</h2>
          <p className="text-sm text-gray-500 mt-2">para acessar tenha em mão seu login e senha de acesso</p>
        </div>

        {/* Divisor */}
        <div className="border-t border-gray-300 my-6"></div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ID UDESC</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite seu ID UDESC"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite sua senha"
              required
            />
            <a href="#" className="text-xs text-blue-600 hover:underline">Esqueceu sua senha?</a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            ENTRAR
          </button>
        </form>

        {/* Divisor */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-2 text-sm text-gray-500">Ou</span>
          </div>
        </div>

        {/* Ícone opcional */}
        <div className="text-center">
          <span className="text-2xl">😊</span>
        </div>

        {/* Mensagem de feedback */}
        {mensagem && (
          <div className={`mt-4 p-2 text-sm rounded-md ${mensagem.includes('bem-sucedido') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {mensagem}
          </div>
        )}
      </div>
    </div>
  );
}