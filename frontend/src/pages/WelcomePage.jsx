import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // <--- Importa o hook useAuth
import '../styles/WelcomePage.css';

export default function WelcomePage() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // <--- Adiciona estado de carregamento
    
    // Obtém a função 'login' do seu AuthContext
    const { login } = useAuth(); // <--- Usa o hook useAuth para acessar a função de login centralizada

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); // Ativa o estado de carregamento
        setError(null); // Limpa erros anteriores

        try {
            // Chama a função de login do AuthContext, que por sua vez chama o authService
            await login(email, senha);
            // Se o login for bem-sucedido, o AuthContext já cuida da navegação
            
        } catch (err) {
            // Se houver um erro (lançado pelo AuthContext ou authService), define a mensagem de erro
            setError(err.message || 'Falha no login. Verifique seu ID e senha.');
            console.error('Erro no componente WelcomePage:', err);
        } finally {
            setLoading(false); // Desativa o estado de carregamento
        }
    };

    return (
        <div className="welcome-container">
            {/* Esquerda: Apresentação */}
            <section className="welcome-info">
                <img src="/udesc-logo.png" alt="UDESC" className="welcome-logo" />
                <h1>UDESC SOCIAL</h1>
                <p>
                    Aplicativo para uso de alunos da UDESC. Neste aplicativo você irá
                    encontrar ações sociais entre alunos oferecendo caronas, livros,
                    equipamentos dentre outras coisas.
                </p>
                <p className="warning">
                    É proibido a comercialização de produtos ou serviços
                </p>
            </section>

            {/* Direita: Login */}
            <section className="welcome-login">
                <img src="/logo-udesc.png" alt="UDESC" className="login-logo" />
                <p className="login-instruction">
                    Bem-vindo ao UDESC SOCIAL. Para acessar, tenha em mãos seu login e senha do SIGA.
                </p>

                <form className="login-form" onSubmit={handleLogin}>
                    <label htmlFor="id-udesc">ID UDESC</label>
                    <input
                        id="id-udesc"
                        type="text"
                        placeholder="Digite seu ID UDESC"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading} // <--- Desabilita o input enquanto carrega
                        required
                    />

                    <label htmlFor="senha">Senha</label>
                    <input
                        id="senha"
                        type="password"
                        placeholder="Digite sua senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        disabled={loading} // <--- Desabilita o input enquanto carrega
                        required
                    />

                    <a href="#" className="forgot-password">Esqueceu sua senha?</a>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading} // <--- Desabilita o botão enquanto carrega
                    >
                        {loading ? 'ENTRANDO...' : 'ENTRAR'} {/* <--- Mostra texto de carregamento */}
                    </button>

                    {error && <p className="error-message">{error}</p>}
                </form>

                <div className="login-footer">
                    <span>Ou</span>
                    <img src="/logo-s.png" alt="Logo S" className="logo-s" />
                </div>
            </section>
        </div>
    );
}