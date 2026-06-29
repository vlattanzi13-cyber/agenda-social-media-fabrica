// src/lib/seedData.js
// Dados iniciais carregados na primeira vez que o app roda

export const initialProfissionais = [
  { id: 'vinicius', nome: 'Vinícius', cargo: 'Copy', horario: '8h30 – 15h30', horasDia: 6, freelancer: false, cor: '#534AB7', corClara: '#EEEDFE', corBorda: '#AFA9EC', corTexto: '#26215C', iniciais: 'Vi' },
  { id: 'karen',    nome: 'Karen',    cargo: 'Assistente de Social Media', horario: '8h30 – 15h30', horasDia: 6, freelancer: false, cor: '#185FA5', corClara: '#E6F1FB', corBorda: '#85B7EB', corTexto: '#042C53', iniciais: 'Ka' },
  { id: 'jean',     nome: 'Jean',     cargo: 'Designer', horario: '8h30 – 18h15', horasDia: 8.75, freelancer: false, cor: '#0F6E56', corClara: '#E1F5EE', corBorda: '#5DCAA5', corTexto: '#04342C', iniciais: 'Je' },
  { id: 'luiza',    nome: 'Luiza',    cargo: 'Coordenadora', horario: '8h30 – 18h15', horasDia: 8.75, freelancer: false, cor: '#993556', corClara: '#FBEAF0', corBorda: '#ED93B1', corTexto: '#4B1528', iniciais: 'Lu' },
  { id: 'lucas',    nome: 'Lucas',    cargo: 'Filmmaker', horario: 'Sob demanda', horasDia: null, freelancer: true, cor: '#BA7517', corClara: '#FAEEDA', corBorda: '#EF9F27', corTexto: '#412402', iniciais: 'Lc' },
  { id: 'helena',   nome: 'Helena',   cargo: 'Tráfego', horario: 'Freelancer', horasDia: null, freelancer: true, cor: '#854F0B', corClara: '#FEF3E2', corBorda: '#F59E0B', corTexto: '#431407', iniciais: 'He' },
];

export const initialClientes = [
  { id: 'ar7',          nome: 'AR7 Engenharia e Construção',  carrosseis: 4, reels: 0, posts: 0, temVideo: false, plataformas: ['Instagram', 'Facebook'], observacao: '' },
  { id: 'devita',       nome: 'Clínica DeVita',               carrosseis: 3, reels: 1, posts: 0, temVideo: true,  plataformas: ['Instagram', 'Facebook'], observacao: '' },
  { id: 'rapiso',       nome: 'Rapiso Contabilidade',          carrosseis: 1, reels: 4, posts: 0, temVideo: true,  plataformas: ['Instagram', 'Facebook'], observacao: '' },
  { id: 'saper',        nome: 'Saper Tecnologia',              carrosseis: 1, reels: 4, posts: 1, temVideo: false, plataformas: ['Instagram', 'Facebook', 'LinkedIn', 'YouTube', 'RD Station'], observacao: 'Vídeos chegam gravados. Revisar legenda e sugerir cortes. Inclui blog, e-mail mkt e landing page.' },
  { id: 'duda',         nome: 'Duda',                          carrosseis: 2, reels: 4, posts: 0, temVideo: true,  plataformas: ['Instagram'], observacao: '' },
  { id: 'nane',         nome: 'Nane',                          carrosseis: 0, reels: 4, posts: 4, temVideo: true,  plataformas: ['Instagram'], observacao: '' },
  { id: 'uniaomundial', nome: 'União Mundial',                 carrosseis: 4, reels: 2, posts: 2, temVideo: true,  plataformas: ['Instagram', 'Facebook'], observacao: '' },
  { id: 'grao',         nome: 'Grão',                          carrosseis: 2, reels: 0, posts: 2, temVideo: false, plataformas: ['Instagram'], observacao: '' },
  { id: 'fabrica',      nome: 'Fábrica de Ideias',             carrosseis: 2, reels: 0, posts: 2, temVideo: false, plataformas: ['Instagram', 'Facebook'], observacao: '' },
];

export const adminEmails = [
  // Adicione aqui os e-mails das pessoas que podem editar
  // Ex: "luiza@fabricadeideias.com.br"
];
