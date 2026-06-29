// src/lib/gerarAgenda.js
// Motor que gera a agenda de qualquer mês baseado nos profissionais e clientes cadastrados

const MESES_PT = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const DIAS_PT  = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

export function getNomesMes() { return MESES_PT; }

// Retorna os dias úteis (seg–sex) do mês agrupados por semana
export function getSemanasMes(ano, mes) {
  const semanas = [];
  let semanaAtual = [];
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();

  for (let dia = 1; dia <= diasNoMes; dia++) {
    const data = new Date(ano, mes, dia);
    const diaSemana = data.getDay(); // 0=dom, 6=sáb
    if (diaSemana >= 1 && diaSemana <= 5) {
      semanaAtual.push({ dia, diaSemana, label: DIAS_PT[diaSemana], data });
      // vira semana quando chega na sex ou no último dia útil do mês
      if (diaSemana === 5 || dia === diasNoMes) {
        if (semanaAtual.length > 0) {
          semanas.push([...semanaAtual]);
          semanaAtual = [];
        }
      }
    }
  }
  return semanas;
}

// Gera as tarefas de cada profissional para cada semana do ciclo
export function gerarTarefasSemana(semanaIdx, totalSemanas, profissionais, clientes, diasDaSemana) {
  const numDias = diasDaSemana.length;

  // Identifica profissionais por cargo (busca flexível)
  const getProfPorCargo = (cargo) => profissionais.find(p =>
    p.cargo.toLowerCase().includes(cargo.toLowerCase())
  );

  const copy      = getProfPorCargo('copy');
  const social    = getProfPorCargo('social');
  const designer  = getProfPorCargo('design');
  const coord     = getProfPorCargo('coord');
  const filmmaker = getProfPorCargo('film') || getProfPorCargo('maker');
  const trafego   = getProfPorCargo('tráfego') || getProfPorCargo('trafego');

  // Clientes com vídeo
  const clientesComVideo = clientes.filter(c => c.temVideo);
  const totalReels = clientes.reduce((s, c) => s + (c.reels || 0), 0);

  const tarefas = {};

  // Helper: distribui tarefas pelos dias da semana disponíveis
  const distribuir = (listaTarefas) => {
    const resultado = Array(numDias).fill(null).map(() => ({ titulo: '', detalhe: '', vazio: true }));
    listaTarefas.forEach((t, i) => {
      if (i < numDias) resultado[i] = { ...t, vazio: false };
    });
    return resultado;
  };

  // Fase do ciclo baseada no índice da semana (0=índice)
  const fase = semanaIdx < 4 ? semanaIdx : 3; // semanas extras repetem fase 4

  if (semanaIdx === 0) {
    // ── SEMANA 1: Pesquisa & Planejamento ──
    if (copy) tarefas[copy.id] = distribuir([
      { titulo: 'Pesquisa de referências', detalhe: `Tendências, datas comemorativas, concorrência (${clientes.slice(0, Math.ceil(clientes.length/2)).map(c=>c.nome).join(', ')})` },
      { titulo: 'Pesquisa de referências', detalhe: `Continua por cliente: ${clientes.slice(Math.ceil(clientes.length/2)).map(c=>c.nome).join(', ')}` },
      { titulo: 'Planejamento editorial', detalhe: 'Monta pauta completa: temas, formatos, briefings de todos os clientes' },
      { titulo: 'Planejamento editorial', detalhe: 'Conclui pauta e ajusta datas comemorativas do mês seguinte' },
      { titulo: 'Fecha planejamento', detalhe: 'Entrega documento para aprovação na reunião de hoje' },
    ]);

    if (social) tarefas[social.id] = distribuir([
      { titulo: 'Inbox + comentários', detalhe: 'Rotina diária de todas as contas' },
      { titulo: 'Relatório de insights', detalhe: 'Consolida dados do mês anterior para orientar o planejamento' },
      { titulo: 'Inbox + comentários', detalhe: 'Rotina + análise de campanhas em andamento' },
      { titulo: 'Resultado de campanhas', detalhe: 'Alinha resultados semanais com o tráfego' },
      { titulo: 'Organiza drive', detalhe: 'Cria pastas do mês seguinte por cliente com nomenclatura padronizada' },
    ]);

    if (designer) tarefas[designer.id] = distribuir([
      { titulo: 'Pendências do mês anterior', detalhe: 'Finaliza artes ou ajustes que ficaram do ciclo anterior' },
      { titulo: 'Referências visuais', detalhe: 'Pesquisa moodboards e referências de motion por cliente' },
      { titulo: 'Referências visuais', detalhe: 'Continua pesquisa e monta moodboard por cliente' },
      { titulo: 'Aguarda briefing', detalhe: 'Organiza templates e revisa identidades visuais' },
      { titulo: 'Reunião de alinhamento', detalhe: `${copy?.nome || 'Copy'} + ${designer?.nome || 'Design'} + ${coord?.nome || 'Coord'} — aprova planejamento (30 min)` },
    ]);

    if (coord) tarefas[coord.id] = distribuir([
      { titulo: 'Interface com clientes', detalhe: 'Alinhamentos e demandas de início de mês' },
      { titulo: 'Interface com clientes', detalhe: 'Gestão de relacionamento com clientes' },
      { titulo: 'Revisa planejamento', detalhe: `Lê rascunho de ${copy?.nome || 'Copy'} e prepara feedback` },
      { titulo: 'Interface com clientes', detalhe: 'Gestão de relacionamento' },
      { titulo: 'Aprova planejamento', detalhe: 'Reunião de aprovação + ajustes finais' },
    ]);

    if (filmmaker) tarefas[filmmaker.id] = distribuir([
      { titulo: '', detalhe: '', vazio: true },
      { titulo: '', detalhe: '', vazio: true },
      { titulo: 'Recebe briefing de gravação', detalhe: `${copy?.nome || 'Copy'} envia roteiros e datas de set confirmadas` },
      { titulo: 'Prepara produção', detalhe: 'Lista de materiais, locações e agenda de gravação por cliente' },
      { titulo: '', detalhe: '', vazio: true },
    ]);

  } else if (semanaIdx === 1) {
    // ── SEMANA 2: Criação em bloco ──
    const metade1 = clientes.slice(0, Math.ceil(clientes.length / 2));
    const metade2 = clientes.slice(Math.ceil(clientes.length / 2));

    if (copy) tarefas[copy.id] = distribuir([
      { titulo: 'Textos — bloco 1', detalhe: metade1.slice(0, 2).map(c => `${c.nome} (${_resumoConteudo(c)})`).join(' + ') || 'Primeiros clientes' },
      { titulo: 'Textos — bloco 2', detalhe: metade1.slice(2).map(c => `${c.nome} (${_resumoConteudo(c)})`).join(' + ') || 'Continua clientes' },
      { titulo: 'Textos — bloco 3 + set', detalhe: `${metade2.slice(0, 2).map(c => c.nome).join(' + ')} (manhã) · Acompanha gravações (tarde)` },
      { titulo: 'Textos — bloco 4 + set', detalhe: `${metade2.slice(2).map(c => c.nome).join(' + ')} (manhã) · Acompanha set (tarde)` },
      { titulo: 'Revisão geral de textos', detalhe: `Lê e ajusta todos os textos · Entrega para ${coord?.nome || 'Coord'}` },
    ]);

    if (social) tarefas[social.id] = distribuir([
      { titulo: 'Inbox + comentários', detalhe: 'Rotina diária + monitora insights' },
      { titulo: 'Inbox + comentários', detalhe: 'Rotina + acompanha campanhas em veiculação' },
      { titulo: 'Inbox + comentários', detalhe: 'Rotina diária de todas as contas' },
      { titulo: 'Alinha com tráfego', detalhe: 'Resultados semanais de campanhas' },
      { titulo: 'Inbox + comentários', detalhe: 'Rotina diária de todas as contas' },
    ]);

    // Distribui clientes pelos dias para o designer
    const blocos = _dividirEmBlocos(clientes, 5);
    if (designer) tarefas[designer.id] = distribuir(
      blocos.map((b, i) => ({ titulo: `Artes — bloco ${i+1}`, detalhe: b.map(c => `${c.nome} (${_resumoArtes(c)})`).join(' + ') }))
    );

    if (coord) tarefas[coord.id] = distribuir([
      { titulo: 'Interface com clientes', detalhe: 'Gestão de relacionamento' },
      { titulo: 'Interface com clientes', detalhe: 'Gestão de relacionamento' },
      { titulo: 'Interface com clientes', detalhe: 'Gestão de relacionamento' },
      { titulo: '1ª revisão de textos', detalhe: `Lê entregas de ${copy?.nome || 'Copy'} e aponta ajustes` },
      { titulo: 'Devolve feedback', detalhe: `Passa correções para ${copy?.nome || 'Copy'} fechar` },
    ]);

    if (filmmaker) {
      const diasGravacao = clientesComVideo.length > 0 ? [
        { titulo: 'Gravações — dia 1', detalhe: clientesComVideo.slice(0, Math.ceil(clientesComVideo.length/2)).map(c => `${c.nome} (${c.reels} reel${c.reels > 1 ? 's' : ''})`).join(' + ') },
        { titulo: 'Gravações — dia 2', detalhe: clientesComVideo.slice(Math.ceil(clientesComVideo.length/2)).map(c => `${c.nome} (${c.reels} reel${c.reels > 1 ? 's' : ''})`).join(' + ') },
      ] : [];
      tarefas[filmmaker.id] = distribuir([
        { titulo: '', detalhe: '', vazio: true },
        { titulo: '', detalhe: '', vazio: true },
        ...diasGravacao,
        { titulo: '', detalhe: '', vazio: true },
      ].slice(0, 5));
    }

  } else if (semanaIdx === 2) {
    // ── SEMANA 3: Edição, revisão & aprovação ──
    if (copy) tarefas[copy.id] = distribuir([
      { titulo: '', detalhe: '', vazio: true },
      { titulo: '', detalhe: '', vazio: true },
      { titulo: 'Aguarda feedback', detalhe: 'Disponível para ajustes de texto pós-aprovação' },
      { titulo: 'Ajustes de texto', detalhe: 'Aplica correções solicitadas pelos clientes' },
      { titulo: 'Inicia próximo ciclo', detalhe: 'Começa referências para o planejamento do mês seguinte' },
    ]);

    if (social) tarefas[social.id] = distribuir([
      { titulo: 'Inbox + comentários', detalhe: 'Rotina diária das contas' },
      { titulo: 'Organiza pasta de entrega', detalhe: 'Nomenclatura, links e arquivos finais por cliente' },
      { titulo: 'Inbox + comentários', detalhe: 'Rotina + monitora campanhas' },
      { titulo: 'Alinha com tráfego', detalhe: 'Resultados semanais de campanhas' },
      { titulo: 'Pasta final', detalhe: 'Confere arquivos aprovados e prepara para agendamento' },
    ]);

    if (designer) tarefas[designer.id] = distribuir([
      { titulo: 'Motion — bloco 1', detalhe: 'Anima carrosseis que precisam de motion' },
      { titulo: 'Motion — bloco 2', detalhe: 'Conclui motions pendentes' },
      { titulo: 'Aguarda aprovação', detalhe: 'Finaliza detalhes e organiza arquivos' },
      { titulo: 'Ajustes visuais', detalhe: 'Aplica correções dos clientes nas artes' },
      { titulo: 'Exporta arquivos finais', detalhe: 'Entrega nas pastas nas dimensões e specs corretas' },
    ]);

    if (coord) tarefas[coord.id] = distribuir([
      { titulo: 'Revisa pacote completo', detalhe: 'Textos + artes + vídeos antes de apresentar aos clientes' },
      { titulo: 'Revisa pacote completo', detalhe: 'Conclui revisão interna' },
      { titulo: 'Apresentação aos clientes', detalhe: 'Envia / apresenta conteúdo de todos os clientes para aprovação' },
      { titulo: 'Gerencia feedbacks', detalhe: 'Coleta, prioriza e repassa ajustes para a equipe' },
      { titulo: 'Confirma aprovações', detalhe: `Dá OK final para ${social?.nome || 'Social'} programar` },
    ]);

    if (filmmaker) {
      const blocoReels = _dividirEmBlocos(clientesComVideo, 3);
      tarefas[filmmaker.id] = distribuir([
        ...blocoReels.map((b, i) => ({ titulo: `Edição — bloco ${i+1}`, detalhe: b.map(c => `${c.nome} (${c.reels} reel${c.reels > 1 ? 's' : ''})`).join(' + ') })),
        { titulo: 'Ajustes de edição', detalhe: 'Aplica correções dos clientes nos vídeos' },
        { titulo: 'Exporta vídeos finais', detalhe: 'Entrega nas pastas nas specs corretas' },
      ].slice(0, 5));
    }

  } else {
    // ── SEMANA 4+: Agendamento, tráfego & relatório (e semanas extras) ──
    const isExtra = semanaIdx >= 4;

    if (copy) tarefas[copy.id] = distribuir([
      { titulo: isExtra ? 'Pesquisa antecipada' : 'Pesquisa — próximo mês', detalhe: 'Referências de conteúdo para o próximo ciclo' },
      { titulo: 'Pesquisa — próximo mês', detalhe: 'Continua levantamento por cliente' },
      { titulo: 'Planejamento editorial', detalhe: 'Inicia montagem da pauta do mês seguinte' },
      { titulo: 'Planejamento editorial', detalhe: 'Continua montagem da pauta' },
      { titulo: 'Entrega rascunho', detalhe: `Envia planejamento para ${coord?.nome || 'Coord'} revisar` },
    ]);

    if (social) {
      if (isExtra) {
        tarefas[social.id] = distribuir(Array(5).fill({ titulo: 'Rotina diária', detalhe: 'Inbox, comentários e monitoramento das contas' }));
      } else {
        const blocos = _dividirEmBlocos(clientes, 3);
        tarefas[social.id] = distribuir([
          { titulo: 'Agendamento — bloco 1', detalhe: blocos[0]?.map(c => c.nome).join(', ') || 'Primeiros clientes' },
          { titulo: 'Agendamento — bloco 2', detalhe: blocos[1]?.map(c => c.nome).join(', ') || 'Continua clientes' },
          { titulo: 'Agendamento — bloco 3', detalhe: `${blocos[2]?.map(c => c.nome).join(', ') || 'Últimos clientes'} · Envia links para tráfego` },
          { titulo: 'Consolida insights', detalhe: 'Dados de performance do mês de todas as contas' },
          { titulo: 'Entrega relatório', detalhe: `Repassa relatório de insights para ${coord?.nome || 'Coord'}` },
        ]);
      }
    }

    if (designer) tarefas[designer.id] = distribuir(
      Array(5).fill({ titulo: 'Backlog / demandas', detalhe: 'Peças avulsas, identidade visual, organização de assets' })
    );

    if (coord) {
      if (isExtra) {
        tarefas[coord.id] = distribuir([
          { titulo: 'Interface com clientes', detalhe: 'Gestão de relacionamento' },
          { titulo: 'Interface com clientes', detalhe: 'Gestão de relacionamento' },
          { titulo: 'Revisa planejamento', detalhe: `Lê rascunho de ${copy?.nome || 'Copy'}` },
          { titulo: 'Interface com clientes', detalhe: 'Gestão de relacionamento' },
          { titulo: 'Aprova planejamento', detalhe: 'Reunião de aprovação da pauta do mês seguinte' },
        ]);
      } else {
        tarefas[coord.id] = distribuir([
          { titulo: 'Interface com clientes', detalhe: 'Gestão de relacionamento' },
          { titulo: 'Interface com clientes', detalhe: 'Gestão de relacionamento' },
          { titulo: 'Interface com clientes', detalhe: 'Gestão de relacionamento' },
          { titulo: 'Revisa relatório', detalhe: 'Revisa e formata o relatório mensal' },
          { titulo: 'Envia relatório', detalhe: 'Relatório do mês para todos os clientes' },
        ]);
      }
    }

    if (filmmaker) {
      const dias = Array(5).fill({ titulo: '', detalhe: '', vazio: true });
      if (!isExtra) dias[4] = { titulo: 'Alinhamento próximo mês', detalhe: `Confirma datas de set com ${copy?.nome || 'Copy'}`, vazio: false };
      tarefas[filmmaker.id] = distribuir(dias);
    }
  }

  return tarefas;
}

// Helpers internos
function _resumoConteudo(c) {
  const partes = [];
  if (c.carrosseis > 0) partes.push(`${c.carrosseis} carrossel${c.carrosseis > 1 ? 'eis' : ''}`);
  if (c.reels > 0) partes.push(`${c.reels} reel${c.reels > 1 ? 's' : ''}`);
  if (c.posts > 0) partes.push(`${c.posts} post${c.posts > 1 ? 's' : ''}`);
  return partes.join(' + ') || 'conteúdo';
}

function _resumoArtes(c) {
  const partes = [];
  if (c.carrosseis > 0) partes.push(`${c.carrosseis} carrossel${c.carrosseis > 1 ? 'eis' : ''}`);
  if (c.posts > 0) partes.push(`${c.posts} post${c.posts > 1 ? 's' : ''}`);
  return partes.join(' + ') || 'artes';
}

function _dividirEmBlocos(arr, numBlocos) {
  const result = [];
  const tamanho = Math.ceil(arr.length / numBlocos);
  for (let i = 0; i < arr.length; i += tamanho) {
    result.push(arr.slice(i, i + tamanho));
  }
  return result;
}

export { MESES_PT, DIAS_PT };
