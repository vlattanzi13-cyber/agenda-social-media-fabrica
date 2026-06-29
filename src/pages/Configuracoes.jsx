// src/pages/Configuracoes.jsx
import React, { useState } from 'react';
import ModalProfissional from '../components/ModalProfissional';
import ModalCliente from '../components/ModalCliente';

export default function Configuracoes({ profissionais, clientes, onSalvarProf, onExcluirProf, onSalvarCliente, onExcluirCliente }) {
  const [aba, setAba] = useState('profissionais');
  const [modalProf, setModalProf] = useState(null); // null | 'novo' | objeto
  const [modalCli, setModalCli] = useState(null);
  const [confirmExcluir, setConfirmExcluir] = useState(null);

  const totalConteudo = clientes.reduce((s, c) => s + (c.carrosseis||0) + (c.reels||0) + (c.posts||0), 0);
  const totalReels = clientes.reduce((s, c) => s + (c.reels||0), 0);

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", color: '#2C2C2A' }}>
      {/* Abas */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid #E5E3DC', paddingBottom: 0 }}>
        {['profissionais', 'clientes'].map(a => (
          <button key={a} onClick={() => setAba(a)} style={{
            padding: '10px 16px', fontSize: 13, fontWeight: 500, background: 'transparent',
            border: 'none', borderBottom: aba === a ? '2px solid #2C2C2A' : '2px solid transparent',
            color: aba === a ? '#2C2C2A' : '#888780', cursor: 'pointer', textTransform: 'capitalize'
          }}>{a}</button>
        ))}
      </div>

      {/* PROFISSIONAIS */}
      {aba === 'profissionais' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Profissionais</div>
              <div style={{ fontSize: 12, color: '#888780' }}>{profissionais.length} cadastrados</div>
            </div>
            <button onClick={() => setModalProf('novo')} style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', background: '#2C2C2A',
              color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer'
            }}>+ Novo profissional</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {profissionais.map(p => (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: '#fff', border: '1px solid #E5E3DC', borderRadius: 10, padding: '12px 16px'
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', background: p.cor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0
                }}>{p.iniciais}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{p.nome}</div>
                  <div style={{ fontSize: 11, color: '#888780' }}>{p.cargo} · {p.horario}</div>
                </div>
                {p.freelancer && (
                  <span style={{ fontSize: 11, background: '#FAEEDA', color: '#633806', padding: '2px 8px', borderRadius: 20, fontWeight: 500 }}>Freelancer</span>
                )}
                <button onClick={() => setModalProf(p)} style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #E5E3DC', background: '#fff', fontSize: 12, cursor: 'pointer', color: '#5F5E5A' }}>Editar</button>
                <button onClick={() => setConfirmExcluir({ tipo: 'prof', id: p.id, nome: p.nome })} style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #FCEBEB', background: '#FCEBEB', fontSize: 12, cursor: 'pointer', color: '#A32D2D' }}>Excluir</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CLIENTES */}
      {aba === 'clientes' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Clientes</div>
              <div style={{ fontSize: 12, color: '#888780' }}>{clientes.length} contas · {totalConteudo} peças/mês · {totalReels} reels/mês</div>
            </div>
            <button onClick={() => setModalCli('novo')} style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', background: '#2C2C2A',
              color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer'
            }}>+ Novo cliente</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {clientes.map(c => (
              <div key={c.id} style={{
                background: '#fff', border: '1px solid #E5E3DC', borderRadius: 10, padding: '12px 16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: c.observacao ? 6 : 0 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{c.nome}</div>
                    <div style={{ fontSize: 11, color: '#888780', marginTop: 2 }}>
                      {[c.carrosseis > 0 && `${c.carrosseis} carrossel`, c.reels > 0 && `${c.reels} reels`, c.posts > 0 && `${c.posts} posts`].filter(Boolean).join(' · ')}
                      {c.plataformas?.length > 0 && ` · ${c.plataformas.join(', ')}`}
                    </div>
                  </div>
                  {c.temVideo && <span style={{ fontSize: 11, background: '#E1F5EE', color: '#085041', padding: '2px 8px', borderRadius: 20, fontWeight: 500 }}>Tem vídeo</span>}
                  <button onClick={() => setModalCli(c)} style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #E5E3DC', background: '#fff', fontSize: 12, cursor: 'pointer', color: '#5F5E5A' }}>Editar</button>
                  <button onClick={() => setConfirmExcluir({ tipo: 'cli', id: c.id, nome: c.nome })} style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #FCEBEB', background: '#FCEBEB', fontSize: 12, cursor: 'pointer', color: '#A32D2D' }}>Excluir</button>
                </div>
                {c.observacao && <div style={{ fontSize: 11, color: '#5F5E5A', background: '#FAFAF9', borderRadius: 6, padding: '5px 8px', marginTop: 4 }}>{c.observacao}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAIS */}
      {modalProf && (
        <ModalProfissional
          profissional={modalProf === 'novo' ? null : modalProf}
          onSalvar={async (p) => { await onSalvarProf(p); setModalProf(null); }}
          onFechar={() => setModalProf(null)}
        />
      )}
      {modalCli && (
        <ModalCliente
          cliente={modalCli === 'novo' ? null : modalCli}
          onSalvar={async (c) => { await onSalvarCliente(c); setModalCli(null); }}
          onFechar={() => setModalCli(null)}
        />
      )}

      {/* CONFIRMAÇÃO EXCLUSÃO */}
      {confirmExcluir && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, maxWidth: 360, width: '100%', fontFamily: "'Inter',sans-serif" }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Confirmar exclusão</div>
            <p style={{ fontSize: 13, color: '#5F5E5A', marginBottom: 20 }}>Tem certeza que deseja excluir <strong>{confirmExcluir.nome}</strong>? Essa ação não pode ser desfeita.</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setConfirmExcluir(null)} style={{ padding: '8px 16px', borderRadius: 7, border: '1px solid #E5E3DC', background: '#fff', fontSize: 13, cursor: 'pointer' }}>Cancelar</button>
              <button onClick={async () => {
                if (confirmExcluir.tipo === 'prof') await onExcluirProf(confirmExcluir.id);
                else await onExcluirCliente(confirmExcluir.id);
                setConfirmExcluir(null);
              }} style={{ padding: '8px 16px', borderRadius: 7, border: 'none', background: '#A32D2D', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
