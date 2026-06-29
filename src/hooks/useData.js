// src/hooks/useData.js
import { useState, useEffect } from 'react';
import {
  collection, doc, onSnapshot, setDoc, addDoc,
  deleteDoc, updateDoc, getDocs, writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { initialProfissionais, initialClientes } from '../lib/seedData';

export function useData() {
  const [profissionais, setProfissionais] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Inicializa dados se o banco estiver vazio
    const init = async () => {
      const profSnap = await getDocs(collection(db, 'profissionais'));
      if (profSnap.empty) {
        const batch = writeBatch(db);
        initialProfissionais.forEach(p => batch.set(doc(db, 'profissionais', p.id), p));
        await batch.commit();
      }
      const cliSnap = await getDocs(collection(db, 'clientes'));
      if (cliSnap.empty) {
        const batch = writeBatch(db);
        initialClientes.forEach(c => batch.set(doc(db, 'clientes', c.id), c));
        await batch.commit();
      }
    };
    init();

    // Listeners em tempo real
    const unsubProf = onSnapshot(collection(db, 'profissionais'), snap => {
      setProfissionais(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubCli = onSnapshot(collection(db, 'clientes'), snap => {
      setClientes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => { unsubProf(); unsubCli(); };
  }, []);

  // PROFISSIONAIS
  const salvarProfissional = async (prof) => {
    const id = prof.id || prof.nome.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    await setDoc(doc(db, 'profissionais', id), { ...prof, id });
  };
  const excluirProfissional = async (id) => deleteDoc(doc(db, 'profissionais', id));

  // CLIENTES
  const salvarCliente = async (cliente) => {
    const id = cliente.id || cliente.nome.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    await setDoc(doc(db, 'clientes', id), { ...cliente, id });
  };
  const excluirCliente = async (id) => deleteDoc(doc(db, 'clientes', id));

  return { profissionais, clientes, loading, salvarProfissional, excluirProfissional, salvarCliente, excluirCliente };
}
