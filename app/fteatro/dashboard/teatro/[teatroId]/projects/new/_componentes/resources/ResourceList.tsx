import React from 'react';
import { AlertCircle, Info, Package, Minus, Plus, Check } from 'lucide-react';

interface ResourceListProps {
    activeMode: 'staff' | 'equipment';
    hasSelection: boolean;
    staffList: any[];
    equipmentList: any[];

    // Funções de verificação e cálculo que vêm do pai
    getStaffState: (id: string) => { available: boolean, reason: string, assignedToAll: boolean };
    getEquipmentState: (id: string, total: number) => { maxStock: number, reason: string, currentAssigned: number };

    // Ações imediatas
    onToggleStaff: (id: string) => void;
    onUpdateQuantity: (id: string, delta: number) => void;
}

export default function ResourceList({
                                         activeMode, hasSelection,
                                         staffList, equipmentList,
                                         getStaffState, getEquipmentState,
                                         onToggleStaff, onUpdateQuantity
                                     }: ResourceListProps) {

    // EMPTY STATE
    if (!hasSelection) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <div className="absolute inset-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center">
                    <AlertCircle size={40} className="mb-3 opacity-50"/>
                    <p className="font-bold text-slate-600 dark:text-slate-300">Nenhuma sessão selecionada</p>
                    <p className="text-sm">Seleciona sessões à esquerda para gerir recursos.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar relative pb-20">

            {/* --- LISTA DE STAFF (Cartões Clicáveis) --- */}
            {activeMode === 'staff' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {staffList.map(p => {
                        const { available, reason, assignedToAll } = getStaffState(p.id);

                        return (
                            <div
                                key={p.id}
                                onClick={() => available && onToggleStaff(p.id)}
                                className={`relative group flex items-center p-3 rounded-xl border transition-all duration-200 select-none ${
                                    !available && !assignedToAll // Se indisponível E não está já atribuído
                                        ? 'bg-slate-100 dark:bg-slate-800 border-slate-100 dark:border-slate-800 opacity-60 grayscale cursor-not-allowed'
                                        : assignedToAll
                                            ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 shadow-md dark:bg-blue-900/20 dark:border-blue-500 cursor-pointer'
                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 hover:shadow-sm cursor-pointer'
                                }`}
                            >
                                <div className="flex items-center gap-3 w-full">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${assignedToAll ? 'bg-blue-200 text-blue-700' : 'bg-slate-200 text-slate-500'}`}>
                                        {p.fotoUrl ? <img src={p.fotoUrl} className="w-full h-full object-cover rounded-full"/> : p.nome[0]}
                                    </div>
                                    <div className="min-w-0">
                                        <div className={`font-bold text-sm truncate ${assignedToAll ? 'text-blue-900 dark:text-blue-100' : 'text-slate-800 dark:text-white'}`}>
                                            {p.nome}
                                        </div>
                                        <div className="text-xs text-slate-500 truncate">{p.cargo}</div>

                                        {!available && !assignedToAll && (
                                            <div className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-0.5">
                                                <Info size={10}/> Ocupado
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Checkmark se selecionado */}
                                {assignedToAll && (
                                    <div className="absolute top-3 right-3 text-blue-500 bg-white dark:bg-slate-800 rounded-full p-0.5 shadow-sm">
                                        <Check size={14} strokeWidth={3}/>
                                    </div>
                                )}

                                {/* Tooltip de erro */}
                                {!available && !assignedToAll && (
                                    <div className="absolute left-1/2 -translate-x-1/2 mt-12 z-50 hidden group-hover:block bg-slate-800 text-white text-xs p-2 rounded shadow-lg whitespace-nowrap pointer-events-none">
                                        {reason}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* --- LISTA DE MATERIAL (Contadores + e -) --- */}
            {activeMode === 'equipment' && (
                <div className="space-y-2">
                    {equipmentList.map(eq => {
                        const { maxStock, reason, currentAssigned } = getEquipmentState(eq.id, eq.totalStock);
                        const remaining = maxStock; // Maximo que ainda se pode adicionar
                        const isSoldOut = maxStock <= 0;

                        return (
                            <div key={eq.id} className={`group flex items-center justify-between p-3 rounded-lg border transition-all ${
                                isSoldOut && currentAssigned === 0
                                    ? 'bg-slate-100 dark:bg-slate-800 border-slate-100 dark:border-slate-800 opacity-60 grayscale cursor-not-allowed'
                                    : currentAssigned > 0
                                        ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-700'
                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                            }`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500">
                                        <Package size={18}/>
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm text-slate-800 dark:text-white">{eq.name}</div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="text-slate-500">{eq.type}</span>
                                            {!isSoldOut && (
                                                <span className={`${remaining === 0 ? 'text-amber-600' : 'text-green-600'} font-bold bg-white dark:bg-slate-700 px-1 rounded border dark:border-slate-600`}>
                                                    {remaining} livres neste horário
                                                </span>
                                            )}
                                        </div>
                                        {isSoldOut && currentAssigned === 0 && <div className="text-[10px] text-red-500 font-bold mt-0.5">Esgotado</div>}
                                    </div>
                                </div>

                                {reason && currentAssigned === 0 && (
                                    <div className="absolute right-10 mt-8 z-50 hidden group-hover:block bg-slate-800 text-white text-xs p-2 rounded shadow-lg whitespace-nowrap pointer-events-none">
                                        {reason}
                                    </div>
                                )}

                                <div className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
                                    <button
                                        disabled={currentAssigned === 0}
                                        onClick={() => onUpdateQuantity(eq.id, -1)}
                                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30"
                                    >
                                        <Minus size={14}/>
                                    </button>
                                    <span className={`w-4 text-center text-sm font-bold ${currentAssigned > 0 ? 'text-amber-600' : 'text-slate-300'}`}>
                                        {currentAssigned}
                                    </span>
                                    <button
                                        disabled={remaining === 0}
                                        onClick={() => onUpdateQuantity(eq.id, 1)}
                                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30"
                                    >
                                        <Plus size={14}/>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}