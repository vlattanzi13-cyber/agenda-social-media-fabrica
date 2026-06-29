// src/components/ModalProfissional.jsx
import React, { useState, useEffect } from 'react';

const CORES = [
  { cor: '#534AB7', corClara: '#EEEDFE', corBorda: '#AFA9EC', corTexto: '#26215C' },
  { cor: '#185FA5', corClara: '#E6F1FB', corBorda: '#85B7EB', corTexto: '#042C53' },
  { cor: '#0F6E56', corClara: '#E1F5EE', corBorda: '#5DCAA5', corTexto: '#04342C' },
  { cor: '#993556', corClara: '#FBEAF0', corBorda: '#ED93B1', corTexto: '#4B1528' },
  { cor: '#BA7517', corClara: '#FAEEDA', corBorda: '#EF9F27', corTexto: '#412402' },
  { cor: '#854F0B', corClara: '#FEF3E2', corBorda: '#F59E0B', corTexto: '#431407' },
  { cor: '#A32D2D', corClara: '#FCEBEB', corBorda: '#F09595', corTexto: '#501313' },
  { cor: '#3B6D11', corClara: '#EAF3DE', corBorda: '#97C459', corTexto: '#173404' },
];

export default function ModalProfissional({ profissional, onSalvar, onFechar }) {
  const [form, setForm] = useState({
    nome: '', cargo: '', horario: '', horasDia: '', freelancer: false,
    cor: CORES[0].cor, corClara: CORES[0].corClara, corBorda: CORES[0].corBorda, corTexto: CORES[0].corTexto,
    iniciais: ''
  });

  useEffect(() => {
    if (profissional) setForm(profissional);
  }, [profissional]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSalvar = () => {
    if (!form.nome || !form.cargo) return alert('Nome e cargo são obrigatórios.');
    const iniciais = form.iniciais || form.nome.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
    onSalvar({ ...form, iniciais });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 460, padding: 28, fontFamily: "'Inter',sans-serif" }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#2C2C2A', marginBottom: 20 }}>
          {profissional ? 'Editar profissional' : 'Novo profissional'}
        </h2>

        {[
          { label: 'Nome', key: 'nome', type: 'text', placeholder: 'Ex: Vinícius' },
          { label: 'Cargo', key: 'cargo', type: 'text', placeholder: 'Ex: Copy, Designer, Filmmaker...' },
          { label: 'Horário', key: 'horario', type: 'text', placeholder: 'Ex: 8h30 – 15h30' },
          { label: 'Horas por dia', key: 'horasDia', type: 'number', placeholder: 'Ex: 6' },
          { label: 'Iniciais', key: 'iniciais', type: 'text', placeholder: 'Ex: Vi' },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#5F5E5A', marginBottom: 4 }}>{f.label}</label>
            <input
              type={f.type} value={form[f.key] || ''} placeholder={f.placeholder}
              onChange={e => set(f.key, e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '1px solid #E5E3DC', fontSize: 13, outline: 'none', color: '#2C2C2A' }}
            />
          </div>
        ))}

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#2C2C2A', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.freelancer} onChange={e => set('freelancer', e.target.checked)} />
            Freelancer (sem horário fixo)
          </label>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#5F5E5A', marginBottom: 8 }}>Cor</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CORES.map(c => (
              <div key={c.cor} onClick={() => setForm(f => ({ ...f, ...c }))}
                style={{ width: 28, height: 28, borderRadius: '50%', background: c.cor, cursor: 'pointer',
                  border: form.cor === c.cor ? '3px solid #2C2C2A' : '2px solid transparent' }} />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onFechar} style={{ padding: '8px 18px', borderRadius: 7, border: '1px solid #E5E3DC', background: '#fff', fontSize: 13, cursor: 'pointer', color: '#5F5E5A' }}>Cancelar</button>
          <button onClick={handleSalvar} style={{ padding: '8px 18px', borderRadius: 7, border: 'none', background: '#2C2C2A', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#fff' }}>Salvar</button>
        </div>
      </div>
    </div>
  );
}
