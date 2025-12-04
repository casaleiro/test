import React from 'react';

export default function StepGeneral({ data, updateData }: any) {
    const handleChange = (field: string, value: any) => {
        updateData((prev: any) => ({ ...prev, [field]: value }));
    };

    const CORES = [
        { name: 'Azul', val: 'bg-blue-600' },
        { name: 'Vermelho', val: 'bg-red-600' },
        { name: 'Verde', val: 'bg-green-600' },
        { name: 'Roxo', val: 'bg-purple-600' },
        { name: 'Laranja', val: 'bg-orange-500' },
    ];

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Dados Gerais</h2>

            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-500">Nome do Projeto</label>
                    <input type="text" placeholder="Ex: O Quebra-Nozes" className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:border-slate-700" value={data.nome} onChange={e => handleChange('nome', e.target.value)} autoFocus />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-500">Cliente</label>
                        <input type="text" placeholder="Ex: Produção Própria" className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:border-slate-700" value={data.cliente} onChange={e => handleChange('cliente', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-500">Tipo</label>
                        <select className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:border-slate-700" value={data.tipo} onChange={e => handleChange('tipo', e.target.value)}>
                            <option value="Teatro">Teatro</option>
                            <option value="Concerto">Concerto</option>
                            <option value="Danca">Dança</option>
                            <option value="Conferencia">Conferência</option>
                            <option value="Manutencao">Manutenção</option>
                        </select>
                    </div>
                </div>
                <div className="space-y-2 pt-2">
                    <label className="text-sm font-bold text-slate-500">Cor</label>
                    <div className="flex gap-3">
                        {CORES.map(c => (
                            <button key={c.val} onClick={() => handleChange('cor', c.val)} className={`w-8 h-8 rounded-full ${c.val} ${data.cor === c.val ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'opacity-40 hover:opacity-100'}`} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}