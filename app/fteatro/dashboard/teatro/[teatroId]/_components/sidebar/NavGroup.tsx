"use client";

import React, { useState, useEffect } from 'react';
import { LucideIcon, ChevronDown, ChevronRight } from 'lucide-react';

interface NavGroupProps {
    icon: LucideIcon;
    label: string;
    isCollapsed: boolean;
    children: React.ReactNode;
    expandSidebar: () => void;
    initialOpen?: boolean; // Opcional: para começar aberto
}

export default function NavGroup({
                                     icon: Icon,
                                     label,
                                     isCollapsed,
                                     children,
                                     expandSidebar,
                                     initialOpen = false
                                 }: NavGroupProps) {

    const [isOpen, setIsOpen] = useState(initialOpen);
    const showText = !isCollapsed;

    // Se a sidebar colapsar, podemos querer fechar o grupo visualmente ou mantê-lo
    // Aqui optamos por não alterar o estado isOpen, mas o render condicional (&& !isCollapsed) trata de esconder os filhos

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Impede eventos de clique no pai

        if (isCollapsed) {
            // Se estiver colapsado, primeiro abre a sidebar, e garante que o grupo fica aberto
            expandSidebar();
            setIsOpen(true);
        } else {
            // Comportamento normal de toggle
            setIsOpen(!isOpen);
        }
    };

    return (
        <div>
            <button
                onClick={handleClick}
                className={`
                    w-full flex items-center px-3 py-2.5 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors relative group
                    ${isCollapsed ? 'justify-center' : 'justify-between'}
                `}
            >
                <div className="flex items-center gap-3">
                    <Icon size={20} className="flex-shrink-0" />
                    {/* Texto com animação */}
                    {showText && (
                        <span className="animate-in fade-in slide-in-from-left-2 duration-200 whitespace-nowrap overflow-hidden">
                            {label}
                        </span>
                    )}
                </div>

                {/* Seta (Chevron) */}
                {showText && (
                    <div className="text-slate-400">
                        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </div>
                )}

                {/* Tooltip (Apenas quando colapsado) */}
                {isCollapsed && (
                    <div className="absolute left-14 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
                        {label}
                    </div>
                )}
            </button>

            {/* Conteúdo do Submenu (Filhos) */}
            {/* Só mostra se estiver Aberto E a Sidebar NÃO estiver colapsada */}
            <div
                className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${isOpen && !isCollapsed ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}
                `}
            >
                <div className="space-y-0.5">
                    {children}
                </div>
            </div>
        </div>
    );
}