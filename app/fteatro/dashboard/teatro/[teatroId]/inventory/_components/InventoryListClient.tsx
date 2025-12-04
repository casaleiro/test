"use client";

import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, Package, AlertTriangle, Layers } from 'lucide-react';
import { InventarioDummy } from '@/app/utils/data/inventoryDummyData';
import { ItemEquipamento } from '@/app/types/inventario';
import InventoryDetailDrawer from './InventoryDetailDrawer';

export default function InventoryListClient() {
    const [items, setItems] = useState<ItemEquipamento[]>(InventarioDummy);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCat, setSelectedCat] = useState<string>('Todas');
    const [selectedItem, setSelectedItem] = useState<ItemEquipamento | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const CATEGORIAS = ['Todas', 'Som', 'Luz', 'Video', 'Palco', 'Maquinaria', 'Cabos'];

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                (item.nome?.toLowerCase() || '').includes(searchLower) ||
                (item.marca?.toLowerCase() || '').includes(searchLower) ||
                (item.sku?.toLowerCase() || '').includes(searchLower);

            const matchesCat = selectedCat === 'Todas' || item.categoria === selectedCat;
            return matchesSearch && matchesCat;
        });
    }, [searchTerm, selectedCat, items]);

    const handleAddItem = () => {
        setSelectedItem(null);
        setIsEditMode(true);
        setIsDrawerOpen(true);
    };

    const handleRowClick = (item: ItemEquipamento) => {
        setSelectedItem(item);
        setIsEditMode(false);
        setIsDrawerOpen(true);
    };

    const handleSaveData = (data: Partial<ItemEquipamento>) => {
        if (selectedItem) {
            setItems(prev => prev.map(i => i.id === selectedItem.id ? { ...i, ...data } as ItemEquipamento : i));
            setSelectedItem(prev => prev ? { ...prev, ...data } as ItemEquipamento : null);
        } else {
            const newItem = {
                ...data, id: `new-${Date.now()}`, ehKit: false,
                nome: data.nome || 'Novo Item', marca: data.marca || '', modelo: data.modelo || '', sku: data.sku || 'N/A', categoria: data.categoria || 'Som', subCategoria: '', estado: data.estado || 'Operacional', localizacao: data.localizacao || '', notasEstado: data.notasEstado || '',
                tipoControlo: data.tipoControlo || 'Unico',
                quantidade: data.quantidade || 1
            } as ItemEquipamento;
            setItems(prev => [newItem, ...prev]);
        }
        setIsDrawerOpen(false);
    };

    const getStatusColor = (status: string) => {
        if (status === 'Operacional') return 'bg-green-100 text-green-700';
        if (status === 'Danificado') return 'bg-red-100 text-red-700';
        if (status === 'Manutencao') return 'bg-amber-100 text-amber-700';
        return 'bg-slate-100 text-slate-500';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Inventário</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Gere os equipamentos técnicos.</p>
                </div>
                <button onClick={handleAddItem} className="bg-red-700 hover:bg-red-800 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm">
                    <Plus size={20} /> <span className="hidden sm:inline">Adicionar Material</span>
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Pesquisar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-red-500" />
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-slate-400" />
                    <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)} className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none cursor-pointer">
                        {CATEGORIAS.map(c => <option key={c} value={c}>{c === 'Todas' ? 'Todas as Categorias' : c}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs uppercase text-slate-500 font-semibold">
                            <th className="px-4 py-4 w-16">Foto</th>
                            <th className="px-4 py-4">Equipamento</th>
                            <th className="px-4 py-4">Qtd.</th> {/* ⚠️ COLUNA QTD */}
                            <th className="px-4 py-4">Categoria</th>
                            <th className="px-4 py-4">Localização</th>
                            <th className="px-4 py-4">Estado</th>
                            <th className="px-4 py-4 text-right">SKU</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredItems.map((item) => (
                            <tr key={item.id} onClick={() => handleRowClick(item)} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                                <td className="px-4 py-3">
                                    <div className="w-10 h-10 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                                        {item.fotoUrl ? <img src={item.fotoUrl} className="w-full h-full object-cover"/> : <Package size={18} className="text-slate-400"/>}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{item.nome}</p>
                                    <p className="text-xs text-slate-500">{item.marca} {item.modelo}</p>
                                    {item.notasEstado && item.estado !== 'Operacional' && (
                                        <div className="flex items-center gap-1 text-[10px] text-red-500 mt-0.5 font-bold"><AlertTriangle size={10} /> Ver Nota</div>
                                    )}
                                </td>

                                {/* ⚠️ CÉLULA QUANTIDADE */}
                                <td className="px-4 py-3">
                                    {item.tipoControlo === 'Granel' ? (
                                        <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded w-fit text-xs border border-slate-200 dark:border-slate-700">
                                                <Layers size={12} className="text-slate-400"/> {item.quantidade}
                                            </span>
                                    ) : (
                                        <span className="text-slate-400 text-xs pl-2">1</span>
                                    )}
                                </td>

                                <td className="px-4 py-3"><span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-xs rounded border border-slate-200 dark:border-slate-700">{item.categoria}</span></td>
                                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{item.localizacao}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getStatusColor(item.estado)}`}>{item.estado}</span>
                                </td>
                                <td className="px-4 py-3 text-right text-xs font-mono text-slate-400">{item.sku}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                {filteredItems.length === 0 && <div className="p-10 text-center text-slate-500 text-sm">Nenhum equipamento encontrado.</div>}
            </div>

            <InventoryDetailDrawer
                key={selectedItem ? selectedItem.id : 'new'}
                item={selectedItem}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                isEditingMode={isEditMode}
                onSave={handleSaveData}
            />
        </div>
    );
}