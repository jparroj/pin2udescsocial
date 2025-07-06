// frontend/src/components/CaronaForm.jsx
import React, { useState, useEffect, useRef } from 'react';

function CaronaForm({ onSubmit, loading, error, successMessage, initialData = {}, isEditing = false, showModal, user }) {
    const [origem, setOrigem] = useState(initialData.origem || '');
    const [destino, setDestino] = useState(initialData.destino || '');
    const [data, setData] = useState(initialData.data ? new Date(initialData.data).toISOString().split('T')[0] : '');
    const [horario, setHorario] = useState(initialData.horario || '');
    const [vagas, setVagas] = useState(initialData.vagas !== undefined ? initialData.vagas : 1);
    const [descricao, setDescricao] = useState(initialData.descricao || '');

    const origemInputRef = useRef(null);

    useEffect(() => {
        if (isEditing && initialData) {
            setOrigem(initialData.origem || '');
            setDestino(initialData.destino || '');
            setData(initialData.data ? new Date(initialData.data).toISOString().split('T')[0] : '');
            setHorario(initialData.horario || '');
            setVagas(initialData.vagas !== undefined ? initialData.vagas : 1);
            setDescricao(initialData.descricao || '');
        } else {
            setOrigem('');
            setDestino('');
            setData('');
            setHorario('');
            setVagas(1);
            setDescricao('');
        }
    }, [initialData, isEditing]);

    useEffect(() => {
        if (showModal && origemInputRef.current) {
            origemInputRef.current.focus();
        }
    }, [showModal]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!origem.trim() || !destino.trim() || !data.trim() || !horario.trim() || vagas === null || vagas < 0) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (!user || !user.id) {
            alert("Erro: Usuário não logado ou ID de usuário não disponível.");
            return;
        }

        onSubmit({
            id: isEditing ? initialData.id : null,
            ofertanteId: user.id,
            origem,
            destino,
            data,
            horario,
            vagas: parseInt(vagas, 10),
            descricao,
        });

        if (!isEditing && successMessage) {
            setOrigem('');
            setDestino('');
            setData('');
            setHorario('');
            setVagas(1);
            setDescricao('');
        }
    };

    const formKey = isEditing ? `edit-carona-${initialData.id}` : 'create-new-carona';

    return (
        <div className="carona-form-container">
            <h3>{isEditing ? 'Editar Carona' : 'Oferecer Nova Carona'}</h3>
            <form onSubmit={handleSubmit} className="offer-form-carona" key={formKey}>
                <input type="text" placeholder="De onde você vai sair?" value={origem} onChange={(e) => setOrigem(e.target.value)} disabled={loading} ref={origemInputRef} />
                <input type="text" placeholder="Até aonde você vai?" value={destino} onChange={(e) => setDestino(e.target.value)} disabled={loading} />
                <input type="date" value={data} onChange={(e) => setData(e.target.value)} disabled={loading} />
                <input type="time" placeholder="Qual horário?" value={horario} onChange={(e) => setHorario(e.target.value)} disabled={loading} />
                <input type="number" placeholder="Quantas vagas você tem?" min="0" value={vagas} onChange={(e) => setVagas(e.target.value)} disabled={loading} />
                <textarea placeholder="Utilize este espaço para acrescentar mais informações sobre sua carona" value={descricao} onChange={(e) => setDescricao(e.target.value)} disabled={loading}></textarea>
                
                <button type="submit" className="carona-button primary" disabled={loading}>
                    {loading ? (isEditing ? 'Atualizando...' : 'Oferecendo...') : (isEditing ? 'Atualizar Carona' : 'Oferecer Carona')}
                </button>
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
            </form>
        </div>
    );
}

export default CaronaForm;
