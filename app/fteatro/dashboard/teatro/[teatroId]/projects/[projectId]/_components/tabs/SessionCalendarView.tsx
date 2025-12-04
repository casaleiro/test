"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalIcon, LayoutGrid } from 'lucide-react';
import { SessaoProjeto } from '@/app/types/projeto';

const START_HOUR = 8;
const END_HOUR = 24;
const PIXELS_PER_HOUR = 60;

interface CalendarProps {
    sessions: SessaoProjeto[];
    onSessionClick: (session: SessaoProjeto) => void; // ⚠️ Nova Prop
}

export default function SessionCalendarView({ sessions, onSessionClick }: CalendarProps) {

    // ⚠️ LÓGICA DE DATA INICIAL INTELIGENTE
    // Se houver sessões, começa no dia da primeira. Se não, hoje.
    const [currentDate, setCurrentDate] = useState(() => {
        if (sessions && sessions.length > 0) {
            // Ordenar por data para encontrar a mais antiga
            const sorted = [...sessions].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
            return new Date(sorted[0].data);
        }
        return new Date();
    });

    const [viewMode, setViewMode] = useState<'month' | 'week'>('week');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (viewMode === 'week' && scrollRef.current) {
            scrollRef.current.scrollTop = 60;
        }
    }, [viewMode]);

    const navigate = (dir: number) => {
        const d = new Date(currentDate);
        if (viewMode === 'month') {
            d.setMonth(d.getMonth() + dir);
        } else {
            d.setDate(d.getDate() + (dir * 7));
        }
        setCurrentDate(d);
    };

    const getWeekDays = () => {
        const d = new Date(currentDate);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(d.setDate(diff));
        return Array.from({ length: 7 }, (_, i) => {
            const day = new Date(monday);
            day.setDate(monday.getDate() + i);
            return day;
        });
    };

    const getPosition = (start: string, end: string) => {
        const [h1, m1] = start.split(':').map(Number);
        const [h2, m2] = end.split(':').map(Number);
        let startVal = h1 + (m1/60);
        let endVal = h2 + (m2/60);
        if (startVal < START_HOUR) startVal = START_HOUR;
        if (endVal > END_HOUR) endVal = END_HOUR;
        return {
            top: (startVal - START_HOUR) * PIXELS_PER_HOUR,
            height: Math.max(25, (endVal - startVal) * PIXELS_PER_HOUR)
        };
    };

    const renderMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let startDay = new Date(year, month, 1).getDay();
        startDay = startDay === 0 ? 6 : startDay - 1;
        const blanks = Array(startDay).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const calendarGrid = [...blanks, ...days];

        return (
            <>
                <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                    {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(d => (
                        <div key={d} className="py-2 text-center text-xs font-bold text-slate-400 uppercase">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 auto-rows-fr bg-slate-200 dark:bg-slate-800 gap-px">
                    {calendarGrid.map((day, idx) => {
                        if (!day) return <div key={idx} className="bg-white dark:bg-slate-900 min-h-[100px]"></div>;
                        const dateStr = new Date(year, month, day).toLocaleDateString('en-CA');
                        const daySessions = sessions.filter(s => s.data === dateStr);
                        const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

                        return (
                            <div key={idx} className="bg-white dark:bg-slate-900 min-h-[100px] p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <div className="flex justify-between mb-1">
                                    <span className={`text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-red-600 text-white' : 'text-slate-700 dark:text-slate-300'}`}>{day}</span>
                                </div>
                                <div className="space-y-1">
                                    {daySessions.map(s => (
                                        <div
                                            key={s.id}
                                            onClick={() => onSessionClick(s)} // ⚠️ CLIQUE AQUI
                                            className="px-1.5 py-1 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-[10px] truncate border-l-2 border-blue-500 cursor-pointer hover:opacity-80"
                                        >
                                            {s.nome}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </>
        );
    };

    const renderWeek = () => {
        const weekDays = getWeekDays();
        const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => i + START_HOUR);

        return (
            <div ref={scrollRef} className="flex-1 overflow-y-auto relative custom-scrollbar flex h-[500px]">
                <div className="w-12 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex-shrink-0 pt-8 sticky left-0 z-20">
                    {hours.map(h => (
                        <div key={h} className="h-[60px] text-[10px] text-slate-400 text-right pr-2 -mt-2 relative">
                            {h.toString().padStart(2, '0')}:00
                        </div>
                    ))}
                </div>
                <div className="flex flex-1 min-w-[600px]">
                    {weekDays.map((date, idx) => {
                        const dateStr = date.toLocaleDateString('en-CA');
                        const isToday = new Date().toDateString() === date.toDateString();
                        const daySessions = sessions.filter(s => s.data === dateStr);

                        return (
                            <div key={idx} className="flex-1 border-r border-slate-100 dark:border-slate-800 relative group/col min-w-[100px]">
                                <div className={`sticky top-0 h-8 flex items-center justify-center text-xs font-bold border-b border-slate-200 dark:border-slate-800 z-10 ${isToday ? 'bg-red-50 text-red-700' : 'bg-white dark:bg-slate-900 text-slate-500'}`}>
                                    {date.toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric' })}
                                </div>
                                <div className="absolute inset-0 top-8 z-0">
                                    {hours.map(h => (
                                        <div key={h} className="h-[60px] border-b border-slate-50 dark:border-slate-800/50"></div>
                                    ))}
                                </div>
                                {daySessions.map(sessao => (
                                    <div
                                        key={sessao.id}
                                        style={getPosition(sessao.horaInicio, sessao.horaFim)}
                                        onClick={() => onSessionClick(sessao)} // ⚠️ CLIQUE AQUI
                                        className="absolute left-1 right-1 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-600 text-red-900 dark:text-red-100 p-1.5 text-xs rounded shadow-sm z-10 overflow-hidden hover:brightness-95 hover:shadow-md transition-all cursor-pointer"
                                    >
                                        <div className="font-bold truncate leading-tight">{sessao.nome}</div>
                                        <div className="flex items-center gap-1 opacity-80 text-[10px] mt-0.5">
                                            <Clock size={10}/> {sessao.horaInicio} - {sessao.horaFim}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-300">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center bg-slate-50 dark:bg-slate-800/50 gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex gap-1 bg-white dark:bg-slate-700 p-1 rounded-lg border border-slate-200 dark:border-slate-600">
                        <button onClick={() => navigate(-1)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded"><ChevronLeft size={18}/></button>
                        <button onClick={() => navigate(1)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded"><ChevronRight size={18}/></button>
                    </div>
                    <span className="font-bold text-lg text-slate-800 dark:text-white capitalize">
                        {viewMode === 'month'
                            ? currentDate.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })
                            : `Semana de ${getWeekDays()[0].getDate()} ${getWeekDays()[0].toLocaleDateString('pt-PT', { month: 'short' })}`
                        }
                    </span>
                </div>
                <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
                    <button onClick={() => setViewMode('month')} className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${viewMode === 'month' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        <LayoutGrid size={14}/> Mês
                    </button>
                    <button onClick={() => setViewMode('week')} className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${viewMode === 'week' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        <CalIcon size={14}/> Semana
                    </button>
                </div>
            </div>
            {viewMode === 'month' ? renderMonth() : renderWeek()}
        </div>
    );
}