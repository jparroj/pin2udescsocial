// frontend/src/components/PublicationForm.jsx
import React, { useState, useEffect } from 'react';
import '../styles/publicacoes.css'; // Importa estilos específicos do formulário

export default function PublicationForm({ onSubmit, loading, error, successMessage, publicationType }) {
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [local, setLocal] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [fotos, setFotos] = useState([]);

    // Clear form on success
    useEffect(() => {
        if (successMessage) {
            setTitulo('');
            setDescricao('');
            setLocal('');
            setQuantidade('');
            setFotos([]);
        }
    }, [successMessage]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic frontend validation
        if (!titulo.trim() || !descricao.trim() || !local.trim()) {
            alert('Por favor, preencha os campos obrigatórios (Título, Descrição, Local).');
            return;
        }

        const fotosArray = fotos.map(f => f.trim()).filter(f => f !== '');
        
        const dataToSend = {
            titulo,
            descricao,
            local,
            // A quantidade só é enviada se for para livros/materiais e se tiver um valor
            quantidade: publicationType === 'MATERIAL' && quantidade ? parseInt(quantidade, 10) : null,
            fotos: fotosArray.length > 0 ? fotosArray : null,
            // O autorId e o tipo serão adicionados pela página pai
        };
        onSubmit(dataToSend);
    };

    const handleAddPhoto = () => {
        setFotos([...fotos, '']);
    };

    const handlePhotoChange = (index, value) => {
        const newFotos = [...fotos];
        newFotos[index] = value;
        setFotos(newFotos);
    };

    const handleRemovePhoto = (index) => {
        const newFotos = fotos.filter((_, i) => i !== index);
        setFotos(newFotos);
    };

    const isBook = publicationType === 'MATERIAL';

    return (
        <div className="publication-form-container">
            <h3>{isBook ? 'Publicar Livro/Material' : 'Criar Novo Anúncio'}</h3>
            <form onSubmit={handleSubmit} className="publication-form">
                <input
                    type="text"
                    placeholder="Título da Publicação"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    disabled={loading}
                    required
                />
                <textarea
                    placeholder={isBook ? "Descrição do livro ou material (condição, matéria, etc.)" : "Detalhes do anúncio (o que, onde, quando)"}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    rows="6"
                    disabled={loading}
                    required
                ></textarea>
                <input
                    type="text"
                    placeholder={isBook ? "Local de entrega/retirada (Ex: Bloco A, Biblioteca)" : "Local do item ou evento"}
                    value={local}
                    onChange={(e) => setLocal(e.target.value)}
                    disabled={loading}
                    required
                />
                {isBook && (
                    <input
                        type="number"
                        placeholder="Quantidade disponível"
                        value={quantidade}
                        onChange={(e) => setQuantidade(e.target.value)}
                        disabled={loading}
                        min="1"
                    />
                )}
                
                <div className="form-photos-section">
                    <h4>Fotos (URLs)</h4>
                    {fotos.map((photoUrl, index) => (
                        <div key={index} className="photo-input-group">
                            <input
                                type="text"
                                placeholder={`URL da Foto ${index + 1}`}
                                value={photoUrl}
                                onChange={(e) => handlePhotoChange(index, e.target.value)}
                                disabled={loading}
                            />
                            <button type="button" onClick={() => handleRemovePhoto(index)} className="remove-photo-button" disabled={loading}>
                                &times;
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddPhoto} className="add-photo-button" disabled={loading}>
                        + Adicionar Foto
                    </button>
                </div>

                <button type="submit" className="publication-button primary" disabled={loading}>
                    {loading ? 'Publicando...' : (isBook ? 'Publicar Livro/Material' : 'Publicar Anúncio')}
                </button>
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
            </form>
        </div>
    );
}