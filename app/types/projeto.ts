export type TipoProjeto = 'Teatro' | 'Concerto' | 'Danca' | 'Conferencia' | 'Residencia' | 'Manutencao';
export type EstadoProjeto = 'Rascunho' | 'Pendente' | 'Confirmado' | 'A Decorrer' | 'Cancelado' | 'Terminado';

// --- SUB-TIPOS ---
export interface SessaoProjeto {
    id: string;
    nome: string;
    data: string;
    horaInicio: string;
    horaFim: string;
    localId: string;

    // ⚠️ RE-ADICIONADO: Estes campos são necessários para o Wizard
    staffIds: string[];
    equipamentoIds: string[];

    notas?: string;
}

export interface MembroEquipa {
    id: string;
    nome: string;
    cargo: string;
    estado: 'Confirmado' | 'Pendente' | 'Recusou';
    fotoUrl?: string;
}

export interface ItemOrcamento {
    id: string;
    descricao: string;
    categoria: 'Pessoal' | 'Equipamento' | 'Catering' | 'Logistica' | 'Outros';
    previsto: number;
    gasto: number;
    estado: 'Pago' | 'Pendente' | 'Nao Pago';
}

export interface FicheiroProjeto {
    id: string;
    nome: string;
    tipo: 'PDF' | 'DOC' | 'IMG' | 'XLS';
    dataUpload: string;
    tamanho: string;
}

export interface ItemLogistica {
    id: string;
    nome: string;
    quantidade: number;
    categoria: string;
    origem: 'Interno' | 'Aluguer';
    estado: 'Reservado' | 'Pendente';
}

// --- TIPO PRINCIPAL ---
export interface Projeto {
    id: string;
    nome: string;
    cliente?: string;
    tipo: TipoProjeto;
    estado: EstadoProjeto;
    cor: string;

    dataInicio: Date;
    dataFim: Date;

    sessoes: SessaoProjeto[];

    equipaDetalhada: MembroEquipa[];
    orcamento: ItemOrcamento[];
    ficheiros: FicheiroProjeto[];
    listaMaterial: ItemLogistica[];
}