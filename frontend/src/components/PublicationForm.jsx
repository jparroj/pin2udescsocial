// frontend/src/components/PublicationForm.jsx
import React, { useState, useEffect, useRef } from 'react';

function PublicationForm({ onSubmit, loading, error, successMessage, initialData = {}, isEditing = false, showModal, publicationType }) {
    const [titulo, setTitulo] = useState(initialData.titulo || '');
    const [descricao, setDescricao] = useState(initialData.descricao || '');
    const [local, setLocal] = useState(initialData.local || '');
    const [quantidade, setQuantidade] = useState(initialData.quantidade || '');
    const [fotos, setFotos] = useState(initialData.fotos && initialData.fotos.length > 0 ? initialData.fotos.map(f => f.urlImagem) : ['']);

    const tituloInputRef = useRef(null);

    useEffect(() => {
        if (isEditing && initialData) {
            setTitulo(initialData.titulo || '');
            setDescricao(initialData.descricao || '');
            setLocal(initialData.local || '');
            setQuantidade(initialData.quantidade || '');
            setFotos(initialData.fotos && initialData.fotos.length > 0 ? initialData.fotos.map(f => f.urlImagem) : ['']);
        } else {
            setTitulo('');
            setDescricao('');
            setLocal('');
            setQuantidade('');
            setFotos(['']); 
        }
    }, [initialData, isEditing]);

    useEffect(() => {
        if (showModal && tituloInputRef.current) {
            tituloInputRef.current.focus();
        }
    }, [showModal]);

    const handleAddPhotoField = () => {
        setFotos([...fotos, '']);
    };

    const handleRemovePhotoField = (index) => {
        const newFotos = fotos.filter((_, i) => i !== index);
        setFotos(newFotos.length > 0 ? newFotos : ['']); 
    };

    const handlePhotoUrlChange = (index, value) => {
        const newFotos = [...fotos];
        newFotos[index] = value;
        setFotos(newFotos);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const filteredFotos = fotos.filter(url => url.trim() !== '');

        if (!titulo.trim() || !descricao.trim() || !local.trim()) {
            alert('Por favor, preencha os campos obrigatórios (Título, Descrição, Local).');
            return;
        }

        if (publicationType === "MATERIAL" && (!quantidade || quantidade <= 0)) {
            alert('Por favor, preencha a quantidade para Materiais/Livros.');
            return;
        }

        onSubmit({
            id: isEditing ? initialData.id : null, 
            titulo,
            descricao,
            local,
            quantidade: publicationType === "MATERIAL" ? quantidade : null,
            fotos: filteredFotos,
        });

        if (!isEditing && successMessage) {
            setTitulo('');
            setDescricao('');
            setLocal('');
            setQuantidade('');
            setFotos(['']);
        }
    };

    const formKey = isEditing ? `edit-${initialData.id}` : 'create-new-publication';

    return (
        <div className="publication-form-container">
            <h3>{isEditing ? `Editar ${publicationType === "MATERIAL" ? 'Livro/Material' : 'Anúncio'}` : `Criar Novo ${publicationType === "MATERIAL" ? 'Livro/Material' : 'Anúncio'}`}</h3>
            <form onSubmit={handleSubmit} className="publication-form" key={formKey}>
                <input
                    type="text"
                    placeholder="Título"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    disabled={loading}
                    ref={tituloInputRef}
                />
                <textarea
                    placeholder="Descrição"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    rows="4"
                    disabled={loading}
                ></textarea>
                <input
                    type="text"
                    placeholder="Local"
                    value={local}
                    onChange={(e) => setLocal(e.target.value)}
                    disabled={loading}
                />
                {publicationType === "MATERIAL" && (
                    <input
                        type="number"
                        placeholder="Quantidade"
                        value={quantidade}
                        onChange={(e) => setQuantidade(e.target.value)}
                        disabled={loading}
                        min="1"
                    />
                )}

                <div className="form-photos-section">
                    <h4>Fotos (URLs)</h4>
                    {fotos.map((url, index) => (
                        <div key={index} className="photo-input-group">
                            <input
                                type="text"
                                placeholder={`URL da Foto ${index + 1}`}
                                value={url}
                                onChange={(e) => handlePhotoUrlChange(index, e.target.value)}
                                disabled={loading}
                            />
                            {fotos.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemovePhotoField(index)}
                                    className="remove-photo-button"
                                    disabled={loading}
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddPhotoField}
                        className="add-photo-button"
                        disabled={loading}
                    >
                        + Adicionar Foto
                    </button>
                </div>

                <button type="submit" className="publication-button primary" disabled={loading}>
                    {loading ? (isEditing ? 'Atualizando...' : 'Publicando...') : (isEditing ? 'Atualizar' : 'Publicar')}
                    {publicationType === "MATERIAL" ? ' Livro/Material' : ' Anúncio'}
                </button>
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
            </form>
        </div>
    );
}

export default PublicationForm;
