import React from 'react';
import { Users, Package, Search } from 'lucide-react';

interface ResourceHeaderProps {
    activeMode: 'staff' | 'equipment';
    onModeChange: (mode: 'staff' | 'equipment') => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export default function ResourceHeader({ activeMode, onModeChange, searchTerm, onSearchChange }: ResourceHeaderProps) {
    return (
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4">
            <div className="flex gap-4 mb-4">
                <button
                    onClick={() => onModeChange('staff')}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeMode === 'staff' ? 'bg-slate-800 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                    <Users size={16}/> Equipa
                </button>
                <button
                    onClick={() => onModeChange('equipment')}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeMode === 'equipment' ? 'bg-slate-800 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                    <Package size={16}/> Material
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                <input
                    type="text"
                    placeholder={activeMode === 'staff' ? "Pesquisar técnicos, produtores..." : "Pesquisar microfones, cabos..."}
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
        </div>
    );
}