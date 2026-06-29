// src/components/ModalCliente.jsx
import React, { useState, useEffect } from 'react';

const PLATAFORMAS_DISPONIVEIS = ['Instagram', 'Facebook', 'LinkedIn', 'YouTube', 'TikTok', 'Twitter/X', 'RD Station', 'Blog'];

export default function ModalCliente({ cliente, onSalvar, onFechar }) {
  const [form, setForm] = useState({
    nome: '', carrosseis: 0, reels: 0, posts: 0,
    temVideo: false, plataformas: [], observacao: ''
  });

  useEffect(() => {
    if (cliente) setForm(cliente);
  }, [cliente]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const togglePlat = (p) => {
    setForm(f => ({
      ...f,
      plataformas: f.plataformas.includes(p)
        ? f.plataformas.filter(x => x !== p)
        : [...f.plataformas, p]
    }));
  };

  const handleSalvar = () => {
    if (!form.nome) return alert('Nome do cliente é obrigatório.');
    onSalvar({ ...form, carrosseis: +form.carrosseis, reels: +form.reels, posts: +form.posts });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, overflowY: 'auto' }}>
      <div style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 500, padding: 28, fontFamily: "'Inter',sans-serif", margin: 'auto' }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#2C2C2A', marginBottom: 20 }}>
          {cliente ? 'Editar cliente' : 'Novo cliente'}
        </h2>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#5F5E5A', marginBottom: 4 }}>Nome do cliente</label>
          <input type="text" value={form.nome} placeholder="Ex: AR7 Engenharia"
            onChange={e => set('nome', e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '1px solid #E5E3DC', fontSize: 13, outline: 'none', color: '#2C2C2A' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
          {[
            { label: 'Carrosseis / mês', key: 'carrosseis' },
            { label: 'Reels / mês', key: 'reels' },
            { label: 'Posts / mês', key: 'posts' },
          ].map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#5F5E5A', marginBottom: 4 }}>{f.label}</label>
              <input type="number" min="0" value={form[f.key]} onChange={e => set(f.key, e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '1px solid #E5E3DC', fontSize: 13, outline: 'none', color: '#2C2C2A' }} />
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#2C2C2A', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.temVideo} onChange={e => { set('temVideo', e.target.checked); if (!e.target.checked) set('reels', 0); }} />
            Este cliente tem gravações de vídeo (reels)
          </label>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#5F5E5A', marginBottom: 8 }}>Plataformas</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {PLATAFORMAS_DISPONIVEIS.map(p => (
              <button key={p} onClick={() => togglePlat(p)} style={{
                padding: '5px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
                border: form.plataformas.includes(p) ? 'none' : '1px solid #E5E3DC',
                background: form.plataformas.includes(p) ? '#2C2C2A' : '#fff',
                color: form.plataformas.includes(p) ? '#fff' : '#5F5E5A', fontWeight: form.plataformas.includes(p) ? 500 : 400
              }}>{p}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#5F5E5A', marginBottom: 4 }}>Observações</label>
          <textarea value={form.observacao} onChange={e => set('observacao', e.target.value)}
            placeholder="Ex: vídeos chegam gravados, inclui blog, e-mail mkt..."
            rows={3} style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '1px solid #E5E3DC', fontSize: 13, outline: 'none', color: '#2C2C2A', resize: 'vertical', fontFamily: 'inherit' }} />
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onFechar} style={{ padding: '8px 18px', borderRadius: 7, border: '1px solid #E5E3DC', background: '#fff', fontSize: 13, cursor: 'pointer', color: '#5F5E5A' }}>Cancelar</button>
          <button onClick={handleSalvar} style={{ padding: '8px 18px', borderRadius: 7, border: 'none', background: '#2C2C2A', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#fff' }}>Salvar</button>
        </div>
      </div>
    </div>
  );
}
