// frontend/src/components/MuralForm.jsx
import React, { useState } from 'react';

export default function MuralForm({ onSubmit, loading, error, successMessage }) {
    const [titulo, setTitulo] = useState('');
    const [categoria, setCategoria] = useState('');
    const [conteudo, setConteudo] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validação básica no frontend
        if (!titulo.trim() || !categoria.trim() || !conteudo.trim()) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        onSubmit({ titulo, categoria, conteudo });
        // Limpar formulário após o envio (se houver sucesso)
        if (successMessage) {
            setTitulo('');
            setCategoria('');
            setConteudo('');
        }
    };

    return (
        <div className="mural-form-container">
            <h3>Criar Nova Publicação</h3>
            <form onSubmit={handleSubmit} className="mural-form">
                <input
                    type="text"
                    placeholder="Título da Publicação"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    disabled={loading}
                />
                <input
                    type="text"
                    placeholder="Categoria (Ex: Evento, Aviso, Oportunidade)"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    disabled={loading}
                />
                <textarea
                    placeholder="Conteúdo da Publicação"
                    value={conteudo}
                    onChange={(e) => setConteudo(e.target.value)}
                    rows="6"
                    disabled={loading}
                ></textarea>
                <button type="submit" className="mural-button primary" disabled={loading}>
                    {loading ? 'Publicando...' : 'Publicar no Mural'}
                </button>
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
            </form>
        </div>
    );
}