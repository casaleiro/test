"use client";

import React from 'react';
import { Calendar, MapPin, Users, MoreVertical } from 'lucide-react';
import { Projeto } from '@/app/types/projeto';
import StatusBadge from './StatusBadge';

export default function ProjectTableView({ projects }: { projects: Projeto[] }) {
    if (projects.length === 0) {
        return <div className="p-10 text-center text-slate-500 italic">Sem projetos nesta vista.</div>;
    }

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs uppercase text-slate-500 font-semibold">
                    <th className="px-6 py-4">Projeto / Cliente</th>
                    <th className="px-6 py-4">Datas</th>
                    <th className="px-6 py-4">Tipo</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {projects.map((project) => (
                    <tr
                        key={project.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    >
                        {/* Nome e Cliente */}
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-10 rounded-full ${project.cor || 'bg-slate-300'}`}></div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white text-sm">{project.nome}</p>
                                    <p className="text-xs text-slate-500">{project.cliente || "Produção Interna"}</p>
                                </div>
                            </div>
                        </td>

                        {/* Datas */}
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                <Calendar size={14} className="text-slate-400"/>
                                <span>
                                        {project.dataInicio.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })}
                                    {' - '}
                                    {project.dataFim.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })}
                                    </span>
                            </div>
                        </td>

                        {/* Tipo */}
                        <td className="px-6 py-4">
                                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-xs font-medium border border-slate-200 dark:border-slate-700">
                                    {project.tipo}
                                </span>
                        </td>

                        {/* Estado */}
                        <td className="px-6 py-4">
                            <StatusBadge status={project.estado} />
                        </td>

                        {/* Ações */}
                        <td className="px-6 py-4 text-right">
                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                <MoreVertical size={18} />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}