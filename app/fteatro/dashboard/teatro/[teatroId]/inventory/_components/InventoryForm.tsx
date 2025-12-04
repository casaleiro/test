"use client";

import React, { useState, useEffect } from 'react';
import { ItemEquipamento, CategoriaEquipamento, EstadoEquipamento, TipoControlo } from '@/app/types/inventario';
import { Save, Camera, Search, Image as ImageIcon, X, Loader2, AlertTriangle, Layers, Hash } from 'lucide-react';

interface InventoryFormProps {
    initialData?: ItemEquipamento | null;
    onSave: (data: Partial<ItemEquipamento>) => void;
    onCancel: () => void;
}

const CATEGORIAS: CategoriaEquipamento[] = ['Som', 'Luz', 'Video', 'Palco', 'Maquinaria', 'Cabos', 'Instrumentos', 'Mobiliario'];
const ESTADOS: EstadoEquipamento[] = ['Operacional', 'Danificado', 'Manutencao', 'Abatido', 'Extraviado'];

export default function InventoryForm({ initialData, onSave, onCancel }: InventoryFormProps) {

    const defaultData: Partial<ItemEquipamento> = {
        nome: '', marca: '', modelo: '', sku: '',
        categoria: 'Som', subCategoria: '',
        estado: 'Operacional', notasEstado: '',
        localizacao: '', fotoUrl: '', ehKit: false,
        // ⚠️ Defaults novos
        tipoControlo: 'Unico',
        quantidade: 1
    };

    const [formData, setFormData] = useState<Partial<ItemEquipamento>>(defaultData);
    const [isSearching, setIsSearching] = useState(false);
    const [showImageResults, setShowImageResults] = useState(false);
    const [imageResults, setImageResults] = useState<string[]>([]);

    useEffect(() => {
        if (initialData) {
            setFormData({ ...defaultData, ...initialData, notasEstado: initialData.notasEstado || '' });
        } else {
            setFormData(defaultData);
        }
    }, [initialData]);

    const handleChange = (field: keyof ItemEquipamento, value: any) => {
        setFormData(prev => {
            const updates = { ...prev, [field]: value };

            // Lógica de segurança: Se mudar para Único, força quantidade a 1
            if (field === 'tipoControlo' && value === 'Unico') {
                updates.quantidade = 1;
            }
            return updates;
        });
    };

    // ... (Lógica de Imagem Igual) ...
    const handleAutoSearchImage = async () => { /* ... igual ... */ };
    const selectImage = (url: string) => { setFormData(prev => ({ ...prev, fotoUrl: url })); setShowImageResults(false); };

    const needsDescription = formData.estado && formData.estado !== 'Operacional';
    const isBulk = formData.tipoControlo === 'Granel';

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900 h-full">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* ... (Área de Foto Igual) ... */}
                {/* (Manter código da foto aqui para não ocupar espaço na resposta) */}

                {/* --- ⚠️ NOVO: TIPO E QUANTIDADE --- */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Tipo de Controlo</label>
                        <div className="flex bg-white dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                            <button
                                type="button"
                                onClick={() => handleChange('tipoControlo', 'Unico')}
                                className={`flex-1 py-1.5 text-xs font-bold rounded flex items-center justify-center gap-1 transition-colors ${formData.tipoControlo === 'Unico' ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <Hash size={12}/> Único
                            </button>
                            <button
                                type="button"
                                onClick={() => handleChange('tipoControlo', 'Granel')}
                                className={`flex-1 py-1.5 text-xs font-bold rounded flex items-center justify-center gap-1 transition-colors ${formData.tipoControlo === 'Granel' ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <Layers size={12}/> Granel
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Quantidade</label>
                        <input
                            type="number"
                            min="1"
                            disabled={!isBulk} // Bloqueado se for único
                            value={formData.quantidade}
                            onChange={e => handleChange('quantidade', parseInt(e.target.value) || 0)}
                            className={`w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-center ${!isBulk ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white dark:bg-slate-800'}`}
                        />
                    </div>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

                {/* --- ESTADO E LOCALIZAÇÃO --- */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Estado Geral</label>
                            <select
                                value={formData.estado || 'Operacional'}
                                onChange={e => handleChange('estado', e.target.value)}
                                className={`w-full p-2 border rounded-lg text-sm font-bold outline-none ${
                                    formData.estado === 'Operacional' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'
                                }`}
                            >
                                {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Localização</label>
                            <input type="text" placeholder="ex: Armazém A" value={formData.localizacao} onChange={e => handleChange('localizacao', e.target.value)} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm" />
                        </div>
                    </div>
                    {needsDescription && (
                        <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
                            <label className="text-xs font-bold text-red-600 flex items-center gap-1 uppercase"><AlertTriangle size={12} /> Motivo / Descrição</label>
                            <textarea required rows={3} placeholder="Descreve o problema..." value={formData.notasEstado} onChange={e => handleChange('notasEstado', e.target.value)} className="w-full p-2 border border-red-200 bg-red-50/50 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none resize-none text-red-900" />
                        </div>
                    )}
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

                {/* --- DADOS TÉCNICOS --- */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Marca</label>
                        <input required type="text" placeholder="ex: Shure" value={formData.marca} onChange={e => handleChange('marca', e.target.value)} className="w-full p-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-sm" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Modelo</label>
                        <input required type="text" placeholder="ex: SM58" value={formData.modelo} onChange={e => handleChange('modelo', e.target.value)} className="w-full p-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-sm" />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Nome Comum</label>
                    <input required type="text" placeholder="ex: Microfone de Mão" value={formData.nome} onChange={e => handleChange('nome', e.target.value)} className="w-full p-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-sm" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Categoria</label>
                        <select value={formData.categoria} onChange={e => handleChange('categoria', e.target.value)} className="w-full p-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-sm">
                            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">SKU / Código</label>
                        <input type="text" placeholder={isBulk ? "ex: CAB-001 (Genérico)" : "ex: MIC-001"} value={formData.sku} onChange={e => handleChange('sku', e.target.value)} className="w-full p-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-sm" />
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-3 mt-auto">
                <button type="button" onClick={onCancel} className="flex-1 py-2.5 border border-slate-300 rounded-lg font-medium hover:bg-slate-50 text-sm">Cancelar</button>
                <button type="submit" className="flex-1 py-2.5 bg-red-700 text-white rounded-lg font-medium hover:bg-red-800 text-sm flex items-center justify-center gap-2"><Save size={18} /> Guardar</button>
            </div>
        </form>
    );
}