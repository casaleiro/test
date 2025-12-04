"use client";

import React, { useState, useEffect } from 'react';
import { X, Package, Edit, MapPin, Tag, AlertTriangle, Save, Layers, Hash } from 'lucide-react';
import { ItemEquipamento, EstadoEquipamento } from '@/app/types/inventario';
import InventoryForm from './InventoryForm';

interface DrawerProps {
    item: ItemEquipamento | null;
    isOpen: boolean;
    onClose: () => void;
    isEditingMode?: boolean;
    onSave?: (data: Partial<ItemEquipamento>) => void;
}

const ESTADOS: EstadoEquipamento[] = ['Operacional', 'Danificado', 'Manutencao', 'Abatido', 'Extraviado'];

export default function InventoryDetailDrawer({ item, isOpen, onClose, isEditingMode = false, onSave }: DrawerProps) {
    const [isEditing, setIsEditing] = useState(isEditingMode);

    // Estados locais para edição rápida
    const [quickStatus, setQuickStatus] = useState<EstadoEquipamento>('Operacional');
    const [quickNotes, setQuickNotes] = useState('');
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        setIsEditing(isEditingMode);
        if (item) {
            setQuickStatus(item.estado);
            setQuickNotes(item.notasEstado || '');
            setHasChanges(false);
        }
    }, [isOpen, isEditingMode, item]);

    const handleQuickStatusChange = (newStatus: EstadoEquipamento) => {
        setQuickStatus(newStatus);
        setHasChanges(true);
    };

    const handleQuickNotesChange = (text: string) => {
        setQuickNotes(text);
        setHasChanges(true);
    };

    const saveQuickStatus = () => {
        if (onSave && item) {
            onSave({ id: item.id, estado: quickStatus, notasEstado: quickNotes });
            setHasChanges(false);
        }
    };

    if (!isOpen) return null;

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Operacional': return 'bg-green-100 text-green-700 border-green-200';
            case 'Danificado': return 'bg-red-100 text-red-700 border-red-200';
            case 'Manutencao': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-slate-100 text-slate-500 border-slate-200';
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40" onClick={onClose} />

            <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out translate-x-0`}>

                {isEditing ? (
                    <div className="h-full flex flex-col bg-white dark:bg-slate-900">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                                {item ? 'Editar Equipamento' : 'Novo Equipamento'}
                            </h2>
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                        </div>
                        <InventoryForm
                            initialData={item}
                            onSave={(d) => { if(onSave) onSave(d); onClose(); }}
                            onCancel={() => item ? setIsEditing(false) : onClose()}
                        />
                    </div>
                ) : (
                    item && (
                        <div className="h-full flex flex-col bg-white dark:bg-slate-900">

                            {/* Header */}
                            <div className="relative h-60 bg-slate-800 flex flex-col justify-end p-6 flex-shrink-0">
                                {item.fotoUrl ? (
                                    <img src={item.fotoUrl} className="absolute inset-0 w-full h-full object-cover opacity-80" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-500"><Package size={64}/></div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent pointer-events-none"></div>
                                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full"><X size={20}/></button>

                                <div className="relative z-10">
                                    <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block shadow-sm">
                                        {item.categoria}
                                    </span>
                                    <h2 className="text-2xl font-bold text-white leading-tight">{item.nome}</h2>
                                    <p className="text-slate-300 text-sm mt-1">{item.marca} {item.modelo}</p>
                                </div>
                            </div>

                            <div className="pt-6 px-6 pb-6 overflow-y-auto flex-1 space-y-6">

                                <div className="flex justify-between items-center">
                                    <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-200">
                                        SKU: {item.sku}
                                    </span>
                                    <button onClick={() => setIsEditing(true)} className="text-slate-500 hover:text-blue-600 flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition-colors">
                                        <Edit size={14} /> Editar Tudo
                                    </button>
                                </div>

                                {/* ⚠️ GRELHA DE INFORMAÇÃO PRINCIPAL (COM QUANTIDADE) */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Bloco de Quantidade */}
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                                        <div className="flex items-center gap-2 mb-1 text-slate-400 font-bold text-xs uppercase">
                                            {item.tipoControlo === 'Granel' ? <Layers size={14}/> : <Hash size={14}/>}
                                            {item.tipoControlo === 'Granel' ? 'Stock' : 'Qtd.'}
                                        </div>
                                        <span className="text-xl font-bold text-slate-800 dark:text-white">
                                            {item.quantidade}
                                            <span className="text-xs font-normal text-slate-500 ml-1">un.</span>
                                        </span>
                                    </div>

                                    {/* Bloco de Localização */}
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                                        <div className="flex items-center gap-2 mb-1 text-slate-400 font-bold text-xs uppercase"><MapPin size={14}/> Localização</div>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 line-clamp-2">{item.localizacao}</span>
                                    </div>
                                </div>

                                {/* Cartão de Estado */}
                                <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${hasChanges ? 'border-blue-200 bg-blue-50/50 shadow-md' : 'border-slate-100 bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700'}`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                            <Tag size={14}/> Estado do Equipamento
                                        </label>
                                        {hasChanges && (
                                            <button onClick={saveQuickStatus} className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1 hover:bg-blue-700 shadow-sm animate-in fade-in zoom-in">
                                                <Save size={12} /> Guardar
                                            </button>
                                        )}
                                    </div>
                                    <select value={quickStatus} onChange={(e) => handleQuickStatusChange(e.target.value as EstadoEquipamento)} className={`w-full p-2.5 rounded-lg text-sm font-bold outline-none border-2 cursor-pointer transition-all ${getStatusColor(quickStatus)}`}>
                                        {ESTADOS.map(st => <option key={st} value={st}>{st}</option>)}
                                    </select>
                                    {quickStatus !== 'Operacional' && (
                                        <div className="mt-3 animate-in slide-in-from-top-2">
                                            <label className="text-[10px] font-bold text-red-600 mb-1 flex items-center gap-1 uppercase"><AlertTriangle size={10} /> Motivo</label>
                                            <textarea rows={3} placeholder="Descreve a avaria..." value={quickNotes} onChange={(e) => handleQuickNotesChange(e.target.value)} className="w-full p-2 text-sm border border-red-200 bg-white dark:bg-slate-800 rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none"/>
                                        </div>
                                    )}
                                </div>

                                {/* Especificações */}
                                {item.especificacoes && (
                                    <div className="border-t pt-4 border-slate-100 dark:border-slate-800">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Especificações</h3>
                                        <div className="bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg text-sm space-y-2 text-slate-600 dark:text-slate-400">
                                            {item.especificacoes.peso && <div className="flex justify-between"><span>Peso:</span> <span className="font-mono text-slate-800 dark:text-slate-200">{item.especificacoes.peso}kg</span></div>}
                                            {item.especificacoes.potencia && <div className="flex justify-between"><span>Potência:</span> <span className="font-mono text-slate-800 dark:text-slate-200">{item.especificacoes.potencia}W</span></div>}
                                            {item.especificacoes.conexoes && <div className="flex justify-between"><span>Conexões:</span> <span className="font-mono text-slate-800 dark:text-slate-200">{item.especificacoes.conexoes.join(', ')}</span></div>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                )}
            </div>
        </>
    );
}