export type CategoriaEquipamento = 'Som' | 'Luz' | 'Video' | 'Palco' | 'Maquinaria' | 'Cabos' | 'Instrumentos' | 'Mobiliario';

export type EstadoEquipamento = 'Operacional' | 'Danificado' | 'Manutencao' | 'Abatido' | 'Extraviado';

// ⚠️ NOVO: Distinção entre item único e lote
export type TipoControlo = 'Unico' | 'Granel';

export interface ItemEquipamento {
    id: string;
    nome: string;
    marca: string;
    modelo: string;
    sku: string; // Em granel, o SKU é igual para todos (ex: o código de barras do produto)
    numeroSerie?: string; // Só faz sentido se for 'Unico'

    categoria: string;
    subCategoria: string;

    // ⚠️ NOVOS CAMPOS
    tipoControlo: TipoControlo;
    quantidade: number; // Se for Unico = 1. Se for Granel = N.

    estado: EstadoEquipamento;
    notasEstado?: string;

    localizacao: string;
    fotoUrl?: string;

    ehKit: boolean;
    conteudoKit?: { itemId: string; quantidade: number }[];
    especificacoes?: any;
}