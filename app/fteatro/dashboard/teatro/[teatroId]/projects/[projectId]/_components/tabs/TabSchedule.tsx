"use client";

import React, { useState } from 'react';
import { Clock, LayoutList, Calendar as CalendarIcon } from 'lucide-react';
import { Projeto, SessaoProjeto } from '@/app/types/projeto';
import SessionCalendarView from './SessionCalendarView';
import SessionDetailModal from './SessionDetailModal'; // ⚠️ Importar Modal

export default function TabSchedule({ project }: { project: Projeto }) {
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

    // --- ESTADOS DO MODAL ---
    const [selectedSession, setSelectedSession] = useState<SessaoProjeto | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Função para abrir modal (passada para Lista e Calendário)
    const handleSessionClick = (session: SessaoProjeto) => {
        setSelectedSession(session);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">

            <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">Agenda e Sessões</h3>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all flex items-center gap-2 text-xs font-bold ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-slate-900 shadow-sm' : 'text-slate-500'}`}>
                        <LayoutList size={14} /> Lista
                    </button>
                    <button onClick={() => setViewMode('calendar')} className={`p-1.5 rounded-md transition-all flex items-center gap-2 text-xs font-bold ${viewMode === 'calendar' ? 'bg-white dark:bg-slate-700 text-slate-900 shadow-sm' : 'text-slate-500'}`}>
                        <CalendarIcon size={14} /> Calendário
                    </button>
                </div>
            </div>

            {viewMode === 'list' ? (
                <div className="space-y-3">
                    {project.sessoes?.length === 0 && <div className="text-slate-500 italic">Sem sessões agendadas.</div>}
                    {project.sessoes?.map((s, idx) => (
                        <div
                            key={idx}
                            onClick={() => handleSessionClick(s)} // ⚠️ CLIQUE NA LISTA
                            className="flex items-center p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-red-200 dark:hover:border-red-900 transition-colors group bg-white dark:bg-slate-800/50 shadow-sm cursor-pointer"
                        >
                            <div className="w-16 text-center font-bold text-slate-400 mr-6 border-r border-slate-100 dark:border-slate-700 pr-6">
                                <span className="text-xl text-slate-800 dark:text-white block">{new Date(s.data).getDate()}</span>
                                <span className="text-[10px] uppercase font-bold">{new Date(s.data).toLocaleDateString('pt-PT', {month:'short'})}</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-900 dark:text-white">{s.nome}</h4>
                                <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                                    <Clock size={12}/> {s.horaInicio} - {s.horaFim}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-medium text-slate-600 dark:text-slate-400">{s.localId}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <SessionCalendarView
                    sessions={project.sessoes}
                    onSessionClick={handleSessionClick} // ⚠️ CLIQUE NO CALENDÁRIO
                />
            )}

            {/* O MODAL */}
            <SessionDetailModal
                session={selectedSession}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}