"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Projeto } from '@/app/types/projeto';

interface CalendarProps {
    projects: Projeto[];
    onProjectClick: (id: string) => void; // Nova prop
}

export default function ProjectCalendarView({ projects, onProjectClick }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const navigate = (dir: number) => {
        const d = new Date(currentDate);
        d.setMonth(d.getMonth() + dir);
        setCurrentDate(d);
        // Aqui no futuro podias fazer um fetch dos dados do novo mês
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let startDay = new Date(year, month, 1).getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;

    const blanks = Array(startDay).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const calendarGrid = [...blanks, ...days];

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-300">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <span className="font-bold text-lg text-slate-800 dark:text-white capitalize">
                    {currentDate.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
                </span>
                <div className="flex gap-1 bg-white dark:bg-slate-700 p-1 rounded-lg border border-slate-200 dark:border-slate-600">
                    <button onClick={() => navigate(-1)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded"><ChevronLeft size={18}/></button>
                    <button onClick={() => navigate(1)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded"><ChevronRight size={18}/></button>
                </div>
            </div>

            <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(d => (
                    <div key={d} className="py-2 text-center text-xs font-bold text-slate-400 uppercase">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 auto-rows-fr bg-slate-200 dark:bg-slate-800 gap-px">
                {calendarGrid.map((day, idx) => {
                    if (!day) return <div key={idx} className="bg-white dark:bg-slate-900 min-h-[120px]"></div>;

                    const dateObj = new Date(year, month, day);
                    const isToday = new Date().toDateString() === dateObj.toDateString();

                    const dayProjects = projects.filter(p => {
                        const start = new Date(p.dataInicio); start.setHours(0,0,0,0);
                        const end = new Date(p.dataFim); end.setHours(23,59,59,999);
                        return dateObj >= start && dateObj <= end;
                    });

                    return (
                        <div key={idx} className={`bg-white dark:bg-slate-900 min-h-[120px] p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50`}>
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-red-600 text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                    {day}
                                </span>
                            </div>

                            <div className="space-y-1">
                                {dayProjects.map(proj => (
                                    <div
                                        key={proj.id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onProjectClick(proj.id); // Navegar para detalhe
                                        }}
                                        className={`px-2 py-1 text-[10px] rounded border-l-4 truncate font-medium cursor-pointer hover:opacity-80 hover:shadow-md transition-all ${proj.cor} bg-opacity-10 text-slate-700 dark:text-slate-200 border-opacity-50`}
                                        style={{ borderLeftColor: 'var(--tw-bg-opacity)' }}
                                    >
                                        {proj.nome}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}