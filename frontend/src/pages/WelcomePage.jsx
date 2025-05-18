import { useNavigate } from 'react-router-dom';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
      {/* Logo UDESC */}
      <img 
        src="/udesc-logo.png" 
        alt="UDESC Logo" 
        className="w-32 h-32 mb-6"
      />

      {/* Texto Institucional */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">UDESC</h1>
      <p className="text-lg text-gray-700 mb-8">
        UNIVERSIDADE<br />
        DO ESTADO DE<br />
        SANTA CATARINA
      </p>

      {/* Descrição do App */}
      <div className="max-w-md mb-10">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">UDESC SOCIAL</h2>
        <p className="text-gray-600 mb-4">
          Aplicativo para uso de alunos da UDESC. Neste aplicativo você irá encontrar ações
          sociais entre alunos oferecendo caronas, livros, equipamentos dentre outras coisas.
        </p>
        <p className="text-sm text-gray-500">
          Conecte-se e encontre recursos ou ajude outros alunos.
        </p>
      </div>

      {/* Botão de Acesso */}
      <button
        onClick={() => navigate('/login')}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors"
      >
        ACESSAR
      </button>
    </div>
  );
}
