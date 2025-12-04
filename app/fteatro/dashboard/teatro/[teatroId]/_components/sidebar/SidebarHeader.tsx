"use client";

import React from 'react';
import { Box, X, PanelLeftClose } from 'lucide-react';

interface SidebarHeaderProps {
    teatroName: string;
    isCollapsed: boolean;
    toggleCollapse: () => void;
    onCloseMobile: () => void;
}

export default function SidebarHeader({
                                          teatroName,
                                          isCollapsed,
                                          toggleCollapse,
                                          onCloseMobile
                                      }: SidebarHeaderProps) {

    // Apenas mostra o texto se a sidebar NÃO estiver colapsada
    const showText = !isCollapsed;

    return (
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 flex-shrink-0 transition-all duration-300">

            {/* LOGÓTIPO E TÍTULO */}
            <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'w-full justify-center' : ''}`}>
                <div className="p-2 bg-red-50 text-red-700 rounded-lg flex-shrink-0 transition-colors">
                    <Box size={20} />
                </div>

                {/* Texto com Animação de Entrada */}
                {showText && (
                    <div className="flex-1 min-w-0 animate-in fade-in duration-200">
                        <h2 className="font-bold text-slate-900 dark:text-white text-sm leading-tight truncate">
                            Molière
                        </h2>
                        <p className="text-[10px] text-slate-500 truncate font-medium">
                            {teatroName}
                        </p>
                    </div>
                )}
            </div>

            {/* BOTÃO TOGGLE (Apenas Desktop) */}
            {/* Nota: Se estiver colapsado, o botão não aparece aqui porque usamos o clique na sidebar inteira para abrir */}
            <div className="hidden md:block">
                {!isCollapsed && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Impede que o clique se propague para a sidebar
                            toggleCollapse();
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                        title="Recolher Menu"
                    >
                        <PanelLeftClose size={18} />
                    </button>
                )}
            </div>

            {/* BOTÃO FECHAR (Apenas Mobile) */}
            <button onClick={onCloseMobile} className="md:hidden text-slate-400 hover:text-red-500 transition-colors">
                <X size={24} />
            </button>
        </div>
    );
}