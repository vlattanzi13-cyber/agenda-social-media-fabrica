// src/components/ModalEditarTarefa.jsx
import React, { useState } from 'react';

const TIPOS = ['Copy', 'Design', 'Vídeo', 'Reunião', 'Revisão', 'Agendamento', 'Outro'];

export default function ModalEditarTarefa({ tarefa, profissional, clientes, onSalvar, onExcluir, onFechar }) {
  const [titulo, setTitulo] = useState(tarefa.titulo || '');
  const [detalhe, setDetalhe] = useState(tarefa.detalhe || '');
  const [cliente, setCliente] = useState(tarefa.cliente || '');
  const [tipo, setTipo] = useState(tarefa.tipo || '');
  const [salvando, setSalvando] = useState(false);

  const labelStyle = { fontSize: 12, fontWeight: 600, color: '#5F5E5A', marginBottom: 4, display: 'block' };
  const inputStyle = { width: '100%', padding: '8px 10px', borderRadius: 7, border: '1px solid #E5E3DC', fontSize: 13, color: '#2C2C2A', fontFamily: "'Inter',sans-serif", boxSizing: 'border-box' };

  const handleSalvar = async () => {
    if (!titulo.trim()) return;
    setSalvando(true);
    await onSalvar({ titulo: titulo.trim(), detalhe: detalhe.trim(), cliente, tipo });
    setSalvando(false);
  };

  const handleLimpar = async () => {
    setSalvando(true);
    await onExcluir();
    setSalvando(false);
  };

  return (
    <div
      onClick={onFechar}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 14, padding: 22, width: 380,
          maxWidth: '90vw', fontFamily: "'Inter',sans-serif", boxShadow: '0 10px 40px rgba(0,0,0,.2)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#2C2C2A' }}>Editar atividade</div>
            <div style={{ fontSize: 11, color: '#888780', marginTop: 2 }}>{profissional?.nome} · {profissional?.cargo}</div>
          </div>
          <button onClick={onFechar} style={{ border: 'none', background: 'transparent', fontSize: 16, color: '#888780', cursor: 'pointer', lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={labelStyle}>Título</label>
          <input style={inputStyle} value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ex: Textos — bloco 1" />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={labelStyle}>Detalhe</label>
          <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} value={detalhe} onChange={e => setDetalhe(e.target.value)} placeholder="Descrição da atividade" />
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Cliente</label>
            <select style={inputStyle} value={cliente} onChange={e => setCliente(e.target.value)}>
              <option value="">— Nenhum —</option>
              {clientes?.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Tipo</label>
            <select style={inputStyle} value={tipo} onChange={e => setTipo(e.target.value)}>
              <option value="">— Nenhum —</option>
              {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleSalvar}
            disabled={salvando || !titulo.trim()}
            style={{
              flex: 1, padding: '10px', borderRadius: 8, border: 'none',
              background: '#2C2C2A', color: '#fff', fontSize: 13, fontWeight: 600,
              cursor: salvando ? 'wait' : 'pointer', opacity: !titulo.trim() ? .5 : 1,
            }}
          >
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            onClick={handleLimpar}
            disabled={salvando}
            style={{
              padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E3DC',
              background: '#fff', color: '#C0392B', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            }}
          >
            Limpar
          </button>
        </div>
        <div style={{ fontSize: 10, color: '#B7B5AD', marginTop: 10, lineHeight: 1.4 }}>
          "Limpar" remove a edição e a célula volta a ser gerada automaticamente (ou fica vazia, se não houver geração padrão).
        </div>
      </div>
    </div>
  );
}
