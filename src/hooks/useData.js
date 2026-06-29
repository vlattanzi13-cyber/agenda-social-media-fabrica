import { useState, useEffect } from 'react';
import {
  collection, doc, onSnapshot, setDoc,
  deleteDoc, getDocs, writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { initialProfissionais, initialClientes } from '../lib/seedData';

export function useData(user) {
  const [profissionais, setProfissionais] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

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

    const unsubProf = onSnapshot(collection(db, 'profissionais'), snap => {
      setProfissionais(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubCli = onSnapshot(collection(db, 'clientes'), snap => {
      setClientes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => { unsubProf(); unsubCli(); };
  }, [user]);

  const salvarProfissional = async (prof) => {
    const id = prof.id || prof.nome.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    await setDoc(doc(db, 'profissionais', id), { ...prof, id });
  };
  const excluirProfissional = async (id) => deleteDoc(doc(db, 'profissionais', id));
  const salvarCliente = async (cliente) => {
    const id = cliente.id || cliente.nome.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    await setDoc(doc(db, 'clientes', id), { ...cliente, id });
  };
  const excluirCliente = async (id) => deleteDoc(doc(db, 'clientes', id));

  return { profissionais, clientes, loading, salvarProfissional, excluirProfissional, salvarCliente, excluirCliente };
}
