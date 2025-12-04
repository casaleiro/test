// types/pessoas.ts

export type TipoVinculo = 'Interno' | 'PrestadorServico' | 'Agencia';

// Departamentos / Especialidades
export type Departamento =
    | 'Som'
    | 'Luz'
    | 'Video'
    | 'Palco'
    | 'Maquinaria' // Rigging
    | 'Producao'
    | 'FrenteDeSala' // Front of House
    | 'Limpeza'
    | 'Seguranca';

export interface Pessoa {
    id: string;
    nome: string;
    apelido: string;
    email: string;
    telemovel: string;
    fotoUrl?: string;

    // Dados Profissionais
    tipo: TipoVinculo;
    departamentos: Departamento[];
    cargo: string; // ex: "Diretor Técnico", "Técnico de Som"

    // Dados para Contratação (Visível apenas a Gestores)
    nif?: string;
    numeroSegurancaSocial?: string;
    valorDia?: number; // Custo estimado
    valorHora?: number;

    // Estado no sistema
    estado: 'Ativo' | 'Inativo' | 'Bloqueado';
}

// Bloqueios de agenda pessoais (Férias, Doença, Outros Trabalhos)
export interface Indisponibilidade {
    id: string;
    pessoaId: string;
    dataInicio: Date;
    dataFim: Date;
    motivo: 'Ferias' | 'BaixaMedica' | 'OutroTrabalho' | 'Pessoal';
    notas?: string;
}