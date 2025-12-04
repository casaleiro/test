import { Projeto } from '@/app/types/projeto';

export const ProjetosDummy: Projeto[] = [
    {
        id: 'proj-001',
        nome: 'O Quebra-Nozes (Bailado)',
        cliente: 'Companhia Nacional de Bailado',
        tipo: 'Danca',
        estado: 'A Decorrer',
        cor: 'bg-red-600',
        dataInicio: new Date('2025-12-01'),
        dataFim: new Date('2025-12-20'),

        sessoes: [
            {
                id: 's1',
                nome: 'Montagem Luz',
                data: '2025-12-01',
                horaInicio: '09:00',
                horaFim: '18:00',
                localId: 'Sala Principal',
                // ⚠️ ALOCAR EQUIPA AQUI
                staffIds: ['p1', 'p4'], // Diretor Técnico e Maquinista
                equipamentoIds: []
            },
            {
                id: 's2',
                nome: 'Ensaio Geral',
                data: '2025-12-02',
                horaInicio: '14:00',
                horaFim: '19:00',
                localId: 'Sala Principal',
                // ⚠️ ALOCAR TODOS
                staffIds: ['p1', 'p2', 'p3', 'p4'],
                equipamentoIds: []
            },
            {
                id: 's3',
                nome: 'Espetáculo Estreia',
                data: '2025-12-03',
                horaInicio: '21:00',
                horaFim: '23:30',
                localId: 'Sala Principal',
                // ⚠️ ALOCAR OPERADORES
                staffIds: ['p2', 'p3'], // Luz e Som
                equipamentoIds: []
            }
        ],

        equipaDetalhada: [
            { id: 'p1', nome: 'João Silva', cargo: 'Diretor Técnico', estado: 'Confirmado', fotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
            { id: 'p2', nome: 'Maria Santos', cargo: 'Operadora de Luz', estado: 'Confirmado', fotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
            { id: 'p3', nome: 'Pedro Oliveira', cargo: 'Técnico de Som', estado: 'Pendente' },
            { id: 'p4', nome: 'Rui Costa', cargo: 'Maquinista', estado: 'Confirmado' }
        ],

        // ... (restante código igual: orçamentos, ficheiros, material)
        orcamento: [
            { id: 'orc1', descricao: 'Cachet Técnicos Extra', categoria: 'Pessoal', previsto: 1500, gasto: 1200, estado: 'Pago' },
            { id: 'orc2', descricao: 'Aluguer Projetor Laser', categoria: 'Equipamento', previsto: 500, gasto: 500, estado: 'Pendente' },
            { id: 'orc3', descricao: 'Catering Estreia', categoria: 'Catering', previsto: 300, gasto: 350, estado: 'Nao Pago' },
            { id: 'orc4', descricao: 'Transporte Cenário', categoria: 'Logistica', previsto: 200, gasto: 200, estado: 'Pago' }
        ],
        ficheiros: [
            { id: 'f1', nome: 'Rider_Tecnico_V3.pdf', tipo: 'PDF', dataUpload: '2025-11-20', tamanho: '2.4 MB' },
            { id: 'f2', nome: 'Planta_Luz_Final.pdf', tipo: 'PDF', dataUpload: '2025-11-25', tamanho: '5.1 MB' },
            { id: 'f3', nome: 'Alinhamento_Cenas.docx', tipo: 'DOC', dataUpload: '2025-11-28', tamanho: '0.5 MB' }
        ],
        listaMaterial: [
            { id: 'mat1', nome: 'GrandMA3 Light', quantidade: 1, categoria: 'Luz', origem: 'Interno', estado: 'Reservado' },
            { id: 'mat2', nome: 'Robe Pointe', quantidade: 12, categoria: 'Luz', origem: 'Interno', estado: 'Reservado' },
            { id: 'mat3', nome: 'Linóleo Preto', quantidade: 10, categoria: 'Palco', origem: 'Interno', estado: 'Reservado' }
        ]
    },
    // ... (restantes projetos)
];