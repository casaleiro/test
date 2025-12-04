"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// 1. IMPORTAR O ÍCONE 'USERS'
import { Calendar, LayoutDashboard, MapPin, Package, LogOut, Users } from 'lucide-react';
import { TeatrosDummy } from '@/app/utils/data/teatroDummyData';

import SidebarHeader from './sidebar/SidebarHeader';
import NavItem from './sidebar/NavItem';
import NavGroup from './sidebar/NavGroup';

interface TeatroSidebarProps {
    teatroId: string;
    mobileOpen: boolean;
    onCloseMobile: () => void;
    isCollapsed: boolean;
    toggleCollapse: () => void;
}

export default function TeatroSidebar({
                                          teatroId, mobileOpen, onCloseMobile, isCollapsed, toggleCollapse
                                      }: TeatroSidebarProps) {

    const pathname = usePathname();
    const currentTeatro = TeatrosDummy.find(t => t.id === teatroId) || TeatrosDummy.find(t => t.id === 'teatro-vazio')!;

    const handleSidebarClick = (e: React.MouseEvent) => {
        if (isCollapsed && e.target === e.currentTarget) {
            toggleCollapse();
        }
    };

    return (
        <>
            {/* OVERLAY MOBILE */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={onCloseMobile}
                ></div>
            )}

            {/* SIDEBAR CONTAINER */}
            <aside
                onClick={handleSidebarClick}
                className={`
                    fixed top-0 left-0 z-50 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
                    transform transition-all duration-300 ease-in-out flex flex-col shadow-sm select-none
                    ${mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full'} 
                    md:translate-x-0 ${isCollapsed ? 'md:w-20 cursor-pointer' : 'md:w-64'}
                `}
            >
                {/* 1. CABEÇALHO */}
                <SidebarHeader
                    teatroName={currentTeatro.name}
                    isCollapsed={isCollapsed}
                    toggleCollapse={toggleCollapse}
                    onCloseMobile={onCloseMobile}
                />

                {/* 2. ÁREA DE NAVEGAÇÃO */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">

                    {/* VISÃO GERAL */}
                    <NavItem
                        href={`/fteatro/dashboard/teatro/${teatroId}/spaces`}
                        icon={LayoutDashboard}
                        label="Visão Geral"
                        isCollapsed={isCollapsed}
                        onClick={onCloseMobile}
                    />

                    {/* SALAS (SUBMENU) */}
                    <NavGroup
                        icon={MapPin}
                        label={`Salas (${currentTeatro.spaces.length})`}
                        isCollapsed={isCollapsed}
                        expandSidebar={toggleCollapse}
                    >
                        {currentTeatro.spaces.length > 0 ? (
                            currentTeatro.spaces.map(space => {
                                const isActive = pathname.includes(space.id);
                                return (
                                    <Link
                                        key={space.id}
                                        href={`/fteatro/dashboard/teatro/${teatroId}/spaces/${space.id}`}
                                        onClick={(e) => { e.stopPropagation(); onCloseMobile(); }}
                                        className={`
                                            block px-3 py-2 text-xs rounded-md transition-colors ml-4 border-l border-slate-200 dark:border-slate-800 truncate
                                            ${isActive
                                            ? 'text-red-700 font-semibold border-red-300 bg-red-50/30'
                                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:border-slate-300'}
                                        `}
                                    >
                                        {space.name}
                                    </Link>
                                );
                            })
                        ) : (
                            <span className="block px-4 py-2 text-xs text-slate-400 italic ml-4">Sem salas</span>
                        )}
                    </NavGroup>

                    {/* 3. ADICIONAR AQUI O LINK PARA PESSOAS */}
                    <NavItem
                        href={`/fteatro/dashboard/teatro/${teatroId}/people`}
                        icon={Users}
                        label="Equipa"
                        isCollapsed={isCollapsed}
                        onClick={onCloseMobile}
                    />
                    <NavItem
                        href={`/fteatro/dashboard/teatro/${teatroId}/inventory`}
                        icon={Package}
                        label="Inventário"
                        isCollapsed={isCollapsed}
                        onClick={onCloseMobile}
                    />
                    <NavItem
                        href={`/fteatro/dashboard/teatro/${teatroId}/projects`}
                        icon={Calendar}
                        label="Projetos"
                        isCollapsed={isCollapsed}
                        onClick={onCloseMobile}
                    />
                </nav>

                {/* 3. RODAPÉ */}
                <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
                    <NavItem
                        href="/"
                        icon={LogOut}
                        label="Sair"
                        isCollapsed={isCollapsed}
                    />

                </div>
            </aside>
        </>
    );
}