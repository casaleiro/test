"use client";

import React, { useState } from 'react';
import TeatroSidebar from './TeatroSidebar';
import TopNavbar from './TopNavbar';
import { TeatrosDummy } from '@/app/utils/data/teatroDummyData';

interface TeatroLayoutClientProps {
    children: React.ReactNode;
    teatroId: string;
}

export default function TeatroLayoutClient({ children, teatroId }: TeatroLayoutClientProps) {
    // Estado Mobile (Aberto/Fechado)
    const [mobileOpen, setMobileOpen] = useState(false);
    // Estado Desktop (Sidebar Expandida/Colapsada)
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Obter dados do teatro para passar à Navbar
    const currentTeatro = TeatrosDummy.find(t => t.id === teatroId) || TeatrosDummy[0];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

            {/* 1. SIDEBAR (Lateral) */}
            <TeatroSidebar
                teatroId={teatroId}
                mobileOpen={mobileOpen}
                onCloseMobile={() => setMobileOpen(false)}
                isCollapsed={isCollapsed}
                toggleCollapse={() => setIsCollapsed(!isCollapsed)}
            />

            {/* 2. NAVBAR (Topo) */}
            {/* Ajustamos a margem esquerda (left) dinamicamente com base no estado da sidebar */}
            <div className={`transition-all duration-300 ease-in-out fixed top-0 right-0 z-40 ${isCollapsed ? 'left-0 md:left-20' : 'left-0 md:left-64'}`}>
                <TopNavbar
                    teatroName={currentTeatro.name}
                    userName="João Silva" // Nome do utilizador logado (Hardcoded por enquanto)
                    onMenuClick={() => setMobileOpen(true)}
                />
            </div>

            {/* 3. CONTEÚDO PRINCIPAL */}
            <div
                className={`
                    pt-16 /* Espaço para a Navbar fixa */
                    flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out
                    ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} 
                `}
            >
                <main className="p-6 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}