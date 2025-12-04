"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, LayoutList, Calendar, History, FolderOpen } from 'lucide-react';
import { ProjetosDummy } from '@/app/utils/data/projectsDummyData';
import ProjectTableView from './ProjectTableView';
import ProjectCalendarView from './ProjectCalendarView';

interface Props {
    teatroId: string;
}

export default function ProjectListClient({ teatroId }: Props) {
    const router = useRouter();

    // --- ESTADOS ---
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

    // Navegação
    const handleNewProject = () => router.push(`/fteatro/dashboard/teatro/${teatroId}/projects/new`);

    const openProjectDetail = (projectId: string) => {
        router.push(`/fteatro/dashboard/teatro/${teatroId}/projects/${projectId}`);
    };

    // --- FILTROS DE DADOS ---
    const today = new Date();
    today.setHours(0,0,0,0);

    // Projetos para a Lista (Filtrados por aba)
    const listProjects = ProjetosDummy.filter(p => {
        const endDate = new Date(p.dataFim);
        const isHistory = endDate < today || p.estado === 'Terminado' || p.estado === 'Cancelado';
        return activeTab === 'history' ? isHistory : !isHistory;
    });

    // Projetos para o Calendário (TODOS - O calendário filtra visualmente por data)
    const calendarProjects = ProjetosDummy;

    return (
        <div className="space-y-6">

            {/* Header Principal */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Projetos</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Gestão de eventos e produção.</p>
                </div>
                <button
                    onClick={handleNewProject}
                    className="bg-red-700 hover:bg-red-800 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-colors"
                >
                    <Plus size={20} />
                    <span className="hidden sm:inline">Novo Projeto</span>
                    <span className="sm:hidden">Novo</span>
                </button>
            </div>

            {/* Barra de Controlo */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-1">

                {/* Abas (Só aparecem na vista de Lista) */}
                <div className="flex gap-6">
                    {viewMode === 'list' ? (
                        <>
                            <button
                                onClick={() => setActiveTab('active')}
                                className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-all ${
                                    activeTab === 'active' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                <FolderOpen size={18} /> Ativos
                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full text-xs">
                                    {ProjetosDummy.filter(p => new Date(p.dataFim) >= today && p.estado !== 'Cancelado').length}
                                </span>
                            </button>

                            <button
                                onClick={() => setActiveTab('history')}
                                className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-all ${
                                    activeTab === 'history' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                <History size={18} /> Histórico
                            </button>
                        </>
                    ) : (
                        // Placeholder visual quando em calendário para alinhar à esquerda
                        <span className="text-sm font-bold text-slate-800 dark:text-white pb-3 flex items-center gap-2">
                            <Calendar size={18}/> Calendário Geral
                        </span>
                    )}
                </div>

                {/* Seletor de Vista */}
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-all flex items-center gap-2 text-xs font-bold ${
                            viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <LayoutList size={16} /> Lista
                    </button>
                    <button
                        onClick={() => setViewMode('calendar')}
                        className={`p-2 rounded-md transition-all flex items-center gap-2 text-xs font-bold ${
                            viewMode === 'calendar' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <Calendar size={16} /> Calendário
                    </button>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="min-h-[400px]">
                {viewMode === 'list' ? (
                    // Na tabela de lista, passamos a função para abrir o detalhe
                    // Nota: Precisas de atualizar o ProjectTableView para aceitar onClick na linha
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs uppercase text-slate-500 font-semibold">
                                <th className="px-6 py-4">Projeto / Cliente</th>
                                <th className="px-6 py-4">Datas</th>
                                <th className="px-6 py-4">Tipo</th>
                                <th className="px-6 py-4">Estado</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {listProjects.map((project) => (
                                <tr
                                    key={project.id}
                                    onClick={() => openProjectDetail(project.id)} // CLIQUE AQUI
                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-10 rounded-full ${project.cor || 'bg-slate-300'}`}></div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white text-sm">{project.nome}</p>
                                                <p className="text-xs text-slate-500">{project.cliente || "Interno"}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                        {project.dataInicio.toLocaleDateString('pt-PT')}
                                    </td>
                                    <td className="px-6 py-4 text-sm">{project.tipo}</td>
                                    <td className="px-6 py-4 text-xs font-bold">{project.estado}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    // No calendário, passamos TODOS os projetos
                    <ProjectCalendarView
                        projects={calendarProjects}
                        onProjectClick={openProjectDetail} // Passamos a função de clique
                    />
                )}
            </div>
        </div>
    );
}