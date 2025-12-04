// utils/data/teatroDummyData.ts

// Tipos para clareza
interface Space {
  id: string;
  name: string;
  capacity: number;
  type: 'Performance' | 'Rehearsal' | 'Exhibition' | 'Technical';
  status: 'Available' | 'Booked' | 'Maintenance';
  techNotes: string; // Detalhes técnicos da sala
}

interface TeatroData {
  name: string;
  id: string;
  spaces: Space[];
  // Outros módulos (a adicionar futuramente)
}

// ----------------------------------------------------
// 1. TEATRO VAZIO (Para simular o primeiro acesso)
// ----------------------------------------------------
export const TeatroVazio: TeatroData = {
  name: 'Teatro Novo Horizonte',
  id: 'teatro-vazio',
  spaces: [], // Sem salas
};

// ----------------------------------------------------
// 2. TEATRO ALEGRE (Com dados detalhados)
// ----------------------------------------------------
export const TeatroAlegre: TeatroData = {
  name: 'Teatro Alegre & Cia',
  id: 'teatro-alegre',
  spaces: [
    {
      id: 'sa-1',
      name: 'Sala Principal',
      capacity: 800,
      type: 'Performance',
      status: 'Available',
      techNotes: 'Palco italiano, 15m x 10m. Fly system manual. Fossa de orquestra disponível.'
    },
    {
      id: 'sa-2',
      name: 'Estúdio de Dança',
      capacity: 70,
      type: 'Rehearsal',
      status: 'Booked',
      techNotes: 'Piso flutuante, espelhos, som ambiente. Sem *rigging*.'
    },
    {
      id: 'sa-3',
      name: 'Sala Multiusos (Foyer)',
      capacity: 200,
      type: 'Exhibition',
      status: 'Available',
      techNotes: 'Ideal para instalações artísticas e recepções. Iluminação LED básica.'
    },
    {
      id: 'sa-4',
      name: 'Armazém Técnico',
      capacity: 0,
      type: 'Technical',
      status: 'Maintenance',
      techNotes: 'Apenas acesso técnico. Ponto de carga e descarga para o palco.'
    },
  ],
};

// --- FUNÇÃO AUXILIAR PARA DATAS DINÂMICAS ---
// Isto garante que vês sempre dados no calendário, independentemente do dia em que testas
const getRelativeDate = (daysFromToday: number, hour: number, minute: number = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  date.setHours(hour, minute, 0, 0);
  return date;
};

// --- DADOS DE RESERVAS (BOOKINGS) ---
export const BookingsDummy = [
  // --- SALA PRINCIPAL (sa-1) ---
  {
    id: 'bk-1',
    title: 'Montagem Técnica: A Noite Estrelada',
    spaceId: 'sa-1', // Sala Principal
    date: getRelativeDate(0, 9, 0), // Hoje às 09:00
    duration: 4, // horas
    client: 'Equipa Técnica Interna',
    status: 'Confirmed',
    type: 'Technical'
  },
  {
    id: 'bk-2',
    title: 'Ensaio Geral com Figurinos',
    spaceId: 'sa-1',
    date: getRelativeDate(0, 14, 30), // Hoje às 14:30
    duration: 3,
    client: 'Companhia Molière',
    status: 'Confirmed',
    type: 'Rehearsal'
  },
  {
    id: 'bk-3',
    title: 'Espetáculo: A Noite Estrelada (Estreia)',
    spaceId: 'sa-1',
    date: getRelativeDate(1, 21, 0), // Amanhã às 21:00
    duration: 2.5,
    client: 'Companhia Molière',
    status: 'Confirmed',
    type: 'Performance'
  },
  {
    id: 'bk-4',
    title: 'Limpeza e Desmontagem Parcial',
    spaceId: 'sa-1',
    date: getRelativeDate(2, 8, 0), // Daqui a 2 dias
    duration: 3,
    client: 'Serviços Gerais',
    status: 'Maintenance',
    type: 'Maintenance'
  },

  // --- ESTÚDIO DE DANÇA (sa-2) ---
  {
    id: 'bk-5',
    title: 'Aula Aberta: Dança Contemporânea',
    spaceId: 'sa-2', // Estúdio
    date: getRelativeDate(0, 10, 0), // Hoje
    duration: 2,
    client: 'Escola de Dança Local',
    status: 'Confirmed',
    type: 'Workshop'
  },
  {
    id: 'bk-6',
    title: 'Audicões: Novo Projeto',
    spaceId: 'sa-2',
    date: getRelativeDate(1, 14, 0), // Amanhã
    duration: 4,
    client: 'Produtora Externa',
    status: 'Tentative',
    type: 'Audition'
  },
  {
    id: 'bk-7',
    title: 'Ensaio Privado: Solistas',
    spaceId: 'sa-2',
    date: getRelativeDate(2, 18, 0), // Daqui a 2 dias
    duration: 2,
    client: 'Artista Convidado',
    status: 'Confirmed',
    type: 'Rehearsal'
  },

  // --- SALA MULTIUSOS / FOYER (sa-3) ---
  {
    id: 'bk-8',
    title: 'Porto de Honra / Recepção',
    spaceId: 'sa-3',
    date: getRelativeDate(1, 19, 30), // Amanhã (antes do espetáculo)
    duration: 1.5,
    client: 'Câmara Municipal',
    status: 'Confirmed',
    type: 'Event'
  },
  {
    id: 'bk-9',
    title: 'Instalação da Exposição de Fotografia',
    spaceId: 'sa-3',
    date: getRelativeDate(3, 10, 0), // Daqui a 3 dias
    duration: 6,
    client: 'Museu da Imagem',
    status: 'Confirmed',
    type: 'Exhibition'
  }
];

// Array principal para a simulação de Login
export const TeatrosDummy = [TeatroVazio, TeatroAlegre];

// Exportação da estrutura da Sala para uso nos componentes
export type SpaceItem = Space;
export type Teatro = TeatroData;