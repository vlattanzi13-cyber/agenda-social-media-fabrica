// src/components/AgendaSemana.jsx
import React from 'react';

export default function AgendaSemana({ semanaIdx, diasDaSemana, tarefas, profissionais, totalSemanas }) {
  const fases = ['Pesquisa & Planejamento', 'Criação em bloco', 'Edição & Aprovação', 'Agendamento & Relatório'];
  const fase = semanaIdx < 4 ? fases[semanaIdx] : 'Semana extra — antecipação';
  const numDias = diasDaSemana.length;

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#888780' }}>Semana {semanaIdx + 1} — </span>
        <span style={{ fontSize: 12, color: '#5F5E5A' }}>{fase}</span>
        {diasDaSemana.length < 5 && (
          <span style={{ marginLeft: 8, fontSize: 11, background: '#FAEEDA', color: '#633806', padding: '2px 8px', borderRadius: 20, fontWeight: 500 }}>
            {diasDaSemana.length} dias úteis
          </span>
        )}
      </div>

      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 4, minWidth: 600 }}>
        <thead>
          <tr>
            <th style={{ width: 90, padding: '4px 6px', fontSize: 11, color: '#888780', fontWeight: 500, textAlign: 'left' }}></th>
            {diasDaSemana.map(d => (
              <th key={d.dia} style={{ padding: '4px 4px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#888780', textTransform: 'uppercase', letterSpacing: '.05em' }}>{d.label}</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#2C2C2A', lineHeight: 1 }}>{d.dia}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {profissionais.map(prof => {
            const dias = tarefas[prof.id] || Array(numDias).fill({ vazio: true });
            return (
              <tr key={prof.id}>
                <td style={{ padding: '0 6px 4px 0', verticalAlign: 'top', paddingTop: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#2C2C2A' }}>{prof.nome}</div>
                  <div style={{ fontSize: 10, color: '#888780', marginTop: 1 }}>{prof.cargo}</div>
                </td>
                {Array(numDias).fill(null).map((_, i) => {
                  const t = dias[i];
                  if (!t || t.vazio) return <td key={i}><div style={{ minHeight: 58 }}></div></td>;
                  return (
                    <td key={i}>
                      <div style={{
                        background: prof.corClara, border: `1px solid ${prof.corBorda}`,
                        borderRadius: 7, padding: '7px 8px', minHeight: 58,
                        color: prof.corTexto
                      }}>
                        <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.3, marginBottom: 3 }}>{t.titulo}</div>
                        <div style={{ fontSize: 10, opacity: .85, lineHeight: 1.4 }}>{t.detalhe}</div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
