"use client";

import React from 'react';
import { Bell, Settings, User, LogOut, Menu } from 'lucide-react';

interface TopNavbarProps {
    teatroName: string;
    userName: string;
    userAvatar?: string; // URL da foto
    onMenuClick: () => void; // Para abrir a sidebar no telemóvel
}

export default function TopNavbar({ teatroName, userName, userAvatar, onMenuClick }: TopNavbarProps) {
    return (
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 fixed top-0 right-0 left-0 z-40 md:left-20 lg:left-64 transition-all duration-300">
            {/* Lado Esquerdo: Menu (Mobile) e Nome do Teatro */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg md:hidden"
                >
                    <Menu size={24} />
                </button>

                {/* Em mobile mostra o nome, em desktop já está na sidebar, mas podemos reforçar ou mostrar o "breadcrumbs" */}
                <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate">
                    {teatroName}
                </h1>
            </div>

            {/* Lado Direito: Ações */}
            <div className="flex items-center gap-2 sm:gap-4">

                {/* 1. Notificações */}
                <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors group">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>

                    {/* Tooltip simples */}
                    <span className="absolute top-full right-0 mt-2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Notificações
                    </span>
                </button>

                {/* 2. Definições (Apenas Gestor) */}
                <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors group relative">
                    <Settings size={20} />
                    <span className="absolute top-full right-0 mt-2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Definições
                    </span>
                </button>

                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

                {/* 3. Perfil do Utilizador */}
                <div className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors group relative">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center border border-red-200 overflow-hidden">
                        {userAvatar ? (
                            <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                        ) : (
                            <User size={16} className="text-red-700" />
                        )}
                    </div>
                    <div className="hidden sm:block text-left">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{userName}</p>
                        <p className="text-[10px] text-slate-500">Diretor Técnico</p>
                    </div>

                    {/* Dropdown Menu (Simulado com Hover para já) */}
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                        <div className="p-2">
                            <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                                Minha Conta
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg flex items-center gap-2">
                                <LogOut size={14} /> Sair
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </header>
    );
}