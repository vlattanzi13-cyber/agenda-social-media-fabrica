import React, { useState, useMemo } from 'react';
import AgendaSemana from '../components/AgendaSemana';
import { getSemanasMes, gerarTarefasSemana, MESES_PT } from '../lib/gerarAgenda';

export default function Agenda({ profissionais, clientes, isAdmin, tarefasEditadas, onSalvarTarefa, onExcluirTarefa }) {
  const hoje = new Date();
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth());
  const [semanaAtiva, setSemanaAtiva] = useState(0);
  const [visao, setVisao] = useState('semana');

  const semanas = useMemo(() => getSemanasMes(ano, mes), [ano, mes]);
  const totalReels = useMemo(() => clientes.reduce((s, c) => s + (c.reels || 0), 0), [clientes]);
  const totalPecas = useMemo(() => clientes.reduce((s, c) => s + (c.carrosseis||0) + (c.reels||0) + (c.posts||0), 0), [clientes]);

  const chaveTarefa = (semanaIdx, profId, diaIdx) => `${ano}-${mes}-sem${semanaIdx}-${profId}-dia${diaIdx}`;

  const mesclarComEditadas = (semanaIdx, tarefasGeradas) => {
    const resultado = {};
    Object.keys(tarefasGeradas).forEach(profId => {
      resultado[profId] = tarefasGeradas[profId].map((tarefa, diaIdx) => {
        const chave = chaveTarefa(semanaIdx, profId, diaIdx);
        const editada = tarefasEditadas?.[chave];
        if (editada) {
          if (editada.excluida) return { titulo: '', detalhe: '', vazio: true, _chave: chave };
          return { ...tarefa, ...editada, vazio: false, _editada: true, _chave: chave };
        }
        return { ...tarefa, _chave: chave };
      });
    });
    return resultado;
  };

  const tarefasSemana = useMemo(() => {
    if (!semanas[semanaAtiva]) return {};
    const geradas = gerarTarefasSemana(semanaAtiva, semanas.length, profissionais, clientes, semanas[semanaAtiva]);
    return mesclarComEditadas(semanaAtiva, geradas);
  }, [semanaAtiva, semanas, profissionais, clientes, tarefasEditadas, ano, mes]);

  const anos = [hoje.getFullYear() - 1, hoje.getFullYear(), hoje.getFullYear() + 1];

  const mesProduzindo = mes === 11 ? `Janeiro ${ano+1}` : `${MESES_PT[mes+1]} ${ano}`;

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", color: '#2C2C2A' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => { if (mes === 0) { setMes(11); setAno(a => a-1); } else setMes(m => m-1); setSemanaAtiva(0); }}
            style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid #E5E3DC', background: '#fff', cursor: 'pointer', fontSize: 16 }}>‹</button>
          <select value={mes} onChange={e => { setMes(+e.target.value); setSemanaAtiva(0); }}
            style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #E5E3DC', fontSize: 13, color: '#2C2C2A', background: '#fff', cursor: 'pointer' }}>
            {MESES_PT.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select value={ano} onChange={e => { setAno(+e.target.value); setSemanaAtiva(0); }}
            style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #E5E3DC', fontSize: 13, color: '#2C2C2A', background: '#fff', cursor: 'pointer' }}>
            {anos.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <button onClick={() => { if (mes === 11) { setMes(0); setAno(a => a+1); } else setMes(m => m+1); setSemanaAtiva(0); }}
            style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid #E5E3DC', background: '#fff', cursor: 'pointer', fontSize: 16 }}>›</button>
        </div>
        <div style={{ fontSize: 12, color: '#888780' }}>
          Produzindo conteúdo para <strong style={{ color: '#2C2C2A' }}>{mesProduzindo}</strong>
        </div>
        {isAdmin && (
          <span style={{ fontSize: 11, background: '#EEEDFE', color: '#3C3489', padding: '3px 10px', borderRadius: 20, fontWeight: 500 }}>
            ✏️ Modo admin — clique em uma tarefa para editar
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
        {[
          { num: semanas.length, label: 'Semanas úteis' },
          { num: clientes.length, label: 'Clientes' },
          { num: totalPecas, label: 'Peças / mês' },
          { num: totalReels, label: 'Reels / mês' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #E5E3DC', borderRadius: 10, padding: '10px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 600 }}>{s.num}</div>
            <div style={{ fontSize: 11, color: '#888780', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '1px solid #E5E3DC' }}>
        {[['semana', 'Por semana'], ['profissional', 'Por profissional'], ['volume', 'Volume de conteúdo']].map(([v, l]) => (
          <button key={v} onClick={() => setVisao(v)} style={{
            padding: '8px 14px', fontSize: 13, fontWeight: 500, background: 'transparent',
            border: 'none', borderBottom: visao === v ? '2px solid #2C2C2A' : '2px solid transparent',
            color: visao === v ? '#2C2C2A' : '#888780', cursor: 'pointer'
          }}>{l}</button>
        ))}
      </div>

      {visao === 'semana' && (
        <div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
            {semanas.map((sem, i) => (
              <button key={i} onClick={() => setSemanaAtiva(i)} style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                border: '1px solid', cursor: 'pointer',
                borderColor: semanaAtiva === i ? '#2C2C2A' : '#E5E3DC',
                background: semanaAtiva === i ? '#2C2C2A' : '#fff',
                color: semanaAtiva === i ? '#fff' : '#5F5E5A',
              }}>
                Sem {i+1} · {sem[0].dia}/{String(mes+1).padStart(2,'0')}–{sem[sem.length-1].dia}/{String(mes+1).padStart(2,'0')}
              </button>
            ))}
          </div>

          {semanas[semanaAtiva] && (
            <AgendaSemana
              semanaIdx={semanaAtiva}
              diasDaSemana={semanas[semanaAtiva]}
              tarefas={tarefasSemana}
              profissionais={profissionais}
              clientes={clientes}
              totalSemanas={semanas.length}
              isAdmin={isAdmin}
              onSalvarTarefa={onSalvarTarefa}
              onExcluirTarefa={onExcluirTarefa}
            />
          )}
        </div>
      )}

      {visao === 'profissional' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {profissionais.map(prof => (
            <div key={prof.id} style={{ background: '#fff', border: '1px solid #E5E3DC', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid #E5E3DC' }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: prof.cor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{prof.iniciais}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{prof.nome}</div>
                  <div style={{ fontSize: 11, color: '#888780' }}>{prof.cargo} · {prof.horario}</div>
                </div>
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {semanas.map((sem, si) => {
                  const tGeradas = gerarTarefasSemana(si, semanas.length, profissionais, clientes, sem);
                  const tMescladas = mesclarComEditadas(si, tGeradas);
                  const diasProf = tMescladas[prof.id] || [];
                  const tarefasReais = diasProf.filter(d => d && !d.vazio);
                  if (tarefasReais.length === 0) return null;
                  return (
                    <div key={si} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: prof.corClara, color: prof.cor, border: `1px solid ${prof.corBorda}`, flexShrink: 0, marginTop: 1 }}>
                        Sem {si+1} · {sem[0].dia}/{String(mes+1).padStart(2,'0')}
                      </span>
                      <span style={{ fontSize: 12, color: '#5F5E5A', lineHeight: 1.5 }}>
                        {tarefasReais.map(t => t.titulo).filter(Boolean).join(' → ')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {visao === 'volume' && (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, background: '#fff', borderRadius: 10, overflow: 'hidden', border: '1px solid #E5E3DC' }}>
            <thead>
              <tr style={{ background: '#FAFAF9' }}>
                {['Cliente', 'Carrosseis', 'Reels', 'Posts', 'Total', 'Plataformas'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', fontSize: 11, fontWeight: 600, color: '#888780', textTransform: 'uppercase', letterSpacing: '.05em', textAlign: h === 'Cliente' ? 'left' : 'center', borderBottom: '1px solid #E5E3DC' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clientes.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #E5E3DC' }}>
                  <td style={{ padding: '9px 12px', fontWeight: 500 }}>{c.nome}</td>
                  <td style={{ padding: '9px 12px', textAlign: 'center' }}>
                    {c.carrosseis > 0 ? <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#E6F1FB', color: '#0C447C' }}>{c.carrosseis}</span> : <span style={{ color: '#E5E3DC' }}>—</span>}
                  </td>
                  <td style={{ padding: '9px 12px', textAlign: 'center' }}>
                    {c.reels > 0 ? <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#FAEEDA', color: '#633806' }}>{c.reels}</span> : <span style={{ color: '#E5E3DC' }}>—</span>}
                  </td>
                  <td style={{ padding: '9px 12px', textAlign: 'center' }}>
                    {c.posts > 0 ? <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#E1F5EE', color: '#085041' }}>{c.posts}</span> : <span style={{ color: '#E5E3DC' }}>—</span>}
                  </td>
                  <td style={{ padding: '9px 12px', textAlign: 'center', fontWeight: 600 }}>{(c.carrosseis||0)+(c.reels||0)+(c.posts||0)}</td>
                  <td style={{ padding: '9px 12px', fontSize: 11, color: '#888780' }}>{c.plataformas?.join(' · ')}</td>
                </tr>
              ))}
              <tr style={{ background: '#FAFAF9', fontWeight: 600 }}>
                <td style={{ padding: '10px 12px' }}>Total</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>{clientes.reduce((s,c)=>s+(c.carrosseis||0),0)}</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>{totalReels}</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>{clientes.reduce((s,c)=>s+(c.posts||0),0)}</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>{totalPecas}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
