// src/App.jsx
import React, { useState } from 'react';
import Login from './components/Login';
import Agenda from './pages/Agenda';
import Configuracoes from './pages/Configuracoes';
import { useAuth } from './hooks/useAuth';
import { useData } from './hooks/useData';

export default function App() {
  const { user, isAdmin, loading: authLoading, login, logout } = useAuth();
const { profissionais, clientes, loading: dataLoading, salvarProfissional, excluirProfissional, salvarCliente, excluirCliente } = useData(user);
  const [pagina, setPagina] = useState('agenda');

  if (authLoading || dataLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter',sans-serif", color: '#888780', fontSize: 13 }}>
        Carregando...
      </div>
    );
  }

  if (!user) return <Login onLogin={login} />;

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF9', fontFamily: "'Inter',sans-serif" }}>
      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #E5E3DC', padding: '0 24px', display: 'flex', alignItems: 'center', height: 52, gap: 16, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8 }}>
          <div style={{ width: 28, height: 28, background: '#2C2C2A', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1" fill="white"/>
              <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity=".7"/>
              <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity=".7"/>
              <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity=".4"/>
            </svg>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#2C2C2A' }}>Agenda de Produção</span>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', gap: 2, flex: 1 }}>
          {[['agenda', 'Agenda'], ...(isAdmin ? [['config', 'Configurações']] : [])].map(([p, l]) => (
            <button key={p} onClick={() => setPagina(p)} style={{
              padding: '5px 12px', borderRadius: 6, border: 'none', fontSize: 13,
              background: pagina === p ? '#F5F5F4' : 'transparent',
              color: pagina === p ? '#2C2C2A' : '#888780',
              fontWeight: pagina === p ? 500 : 400, cursor: 'pointer'
            }}>{l}</button>
          ))}
        </nav>

        {/* User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isAdmin && <span style={{ fontSize: 11, background: '#EEEDFE', color: '#3C3489', padding: '2px 8px', borderRadius: 20, fontWeight: 500 }}>Admin</span>}
          <img src={user.photoURL} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
          <span style={{ fontSize: 12, color: '#5F5E5A', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.displayName || user.email}</span>
          <button onClick={logout} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #E5E3DC', background: '#fff', fontSize: 12, cursor: 'pointer', color: '#888780' }}>Sair</button>
        </div>
      </header>

      {/* Conteúdo */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px' }}>
        {pagina === 'agenda' && (
          <Agenda profissionais={profissionais} clientes={clientes} />
        )}
        {pagina === 'config' && isAdmin && (
          <Configuracoes
            profissionais={profissionais}
            clientes={clientes}
            onSalvarProf={salvarProfissional}
            onExcluirProf={excluirProfissional}
            onSalvarCliente={salvarCliente}
            onExcluirCliente={excluirCliente}
          />
        )}
      </main>
    </div>
  );
}
