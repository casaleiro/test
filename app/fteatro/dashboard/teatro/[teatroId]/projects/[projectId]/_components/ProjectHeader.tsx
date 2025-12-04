"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Users, Clock, Settings, MoreVertical } from 'lucide-react';
import { Projeto } from '@/app/types/projeto';
import StatusBadge from '../../_components/StatusBadge'; // Ajusta o import conforme a tua estrutura

export default function ProjectHeader({ project }: { project: Projeto }) {
    const router = useRouter();

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-6">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-sm font-medium">
                    <ArrowLeft size={16} /> Voltar à lista
                </button>
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500"><Settings size={18}/></button>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500"><MoreVertical size={18}/></button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg ${project.cor}`}>
                    <Calendar size={32} />
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{project.nome}</h1>
                        <StatusBadge status={project.estado} />
                    </div>
                    <p className="text-slate-500 text-lg">{project.cliente || "Produção Interna"}</p>

                    <div className="flex gap-6 mt-4 text-sm text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-slate-400"/>
                            <span>{project.dataInicio.toLocaleDateString()} - {project.dataFim.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users size={16} className="text-slate-400"/>
                            <span>{(project.equipaDetalhada || []).length} Pessoas</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}