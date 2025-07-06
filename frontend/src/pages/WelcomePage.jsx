import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; 
import '../styles/WelcomePage.css';

export default function WelcomePage() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); 
    
    const { login } = useAuth(); 

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); 
        setError(null); 

        try {
            await login(email, senha);
            
        } catch (err) {
            setError(err.message || 'Falha no login. Verifique seu ID e senha.');
            console.error('Erro no componente WelcomePage:', err);
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className="welcome-container">
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
                        placeholder="Digite seu email UDESC"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading} 
                        required
                    />

                    <label htmlFor="senha">Senha</label>
                    <input
                        id="senha"
                        type="password"
                        placeholder="Digite sua senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        disabled={loading} 
                        required
                    />

                    <a href="#" className="forgot-password">Esqueceu sua senha?</a>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading} 
                    >
                        {loading ? 'ENTRANDO...' : 'ENTRAR'} 
                    </button>

                    {error && <p className="error-message">{error}</p>}
                </form>

                <div className="login-footer">
                    <img src="/logo-s.png" alt="Logo S" className="logo-s" />
                </div>
            </section>
        </div>
    );
}