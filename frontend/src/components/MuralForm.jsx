// frontend/src/components/MuralForm.jsx
import React, { useState, useEffect, useRef } from 'react';

function MuralForm({ onSubmit, loading, error, successMessage, initialData = {}, isEditing = false, showModal }) {
    const [titulo, setTitulo] = useState(initialData.titulo || '');
    const [categoria, setCategoria] = useState(initialData.categoria || '');
    const [conteudo, setConteudo] = useState(initialData.conteudo || '');

    const tituloInputRef = useRef(null);

    useEffect(() => {
        if (isEditing) {
            setTitulo(initialData.titulo || '');
            setCategoria(initialData.categoria || '');
            setConteudo(initialData.conteudo || '');
        } else {
            setTitulo('');
            setCategoria('');
            setConteudo('');
        }
    }, [initialData, isEditing]);

    useEffect(() => {
        if (showModal && tituloInputRef.current) {
            tituloInputRef.current.focus();
        }
    }, [showModal]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!titulo.trim() || !categoria.trim() || !conteudo.trim()) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        onSubmit({
            id: isEditing ? initialData.id : null,
            titulo,
            categoria,
            conteudo
        });
        if (!isEditing && successMessage) {
            setTitulo('');
            setCategoria('');
            setConteudo('');
        }
    };

    const formKey = isEditing ? `edit-${initialData.id}` : 'create-new';

    return (
        <div className="mural-form-container">
            <h3>{isEditing ? 'Editar Publicação' : 'Criar Nova Publicação'}</h3>
            <form onSubmit={handleSubmit} className="mural-form" key={formKey}>
                <input
                    type="text"
                    placeholder="Título da Publicação"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    disabled={loading}
                    ref={tituloInputRef}
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
                    {loading ? (isEditing ? 'Atualizando...' : 'Publicando...') : (isEditing ? 'Atualizar Publicação' : 'Publicar no Mural')}
                </button>
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
            </form>
        </div>
    );
}

export default MuralForm;
