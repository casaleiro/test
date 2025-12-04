"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List, LayoutGrid, Clock } from 'lucide-react';

export default function PersonCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    // Estado para controlar a vista: 'month' (Grelha) ou 'week' (Lista)
    const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

    // --- DADOS DUMMY ---
    const shifts = [
        { day: 5, month: currentDate.getMonth(), year: currentDate.getFullYear(), type: 'work', title: 'Montagem Palco', hours: '09:00 - 18:00' },
        { day: 6, month: currentDate.getMonth(), year: currentDate.getFullYear(), type: 'work', title: 'Espetáculo - Som', hours: '14:00 - 23:00' },
        { day: 7, month: currentDate.getMonth(), year: currentDate.getFullYear(), type: 'work', title: 'Desmontagem', hours: '10:00 - 14:00' },
        { day: 12, month: currentDate.getMonth(), year: currentDate.getFullYear(), type: 'unavailable', title: 'Indisponível', hours: 'Dia Todo' },
    ];

    // Helpers Navegação
    const navigate = (direction: 'prev' | 'next') => {
        const d = new Date(currentDate);
        if (viewMode === 'month') {
            d.setMonth(d.getMonth() + (direction === 'next' ? 1 : -1));
        } else {
            d.setDate(d.getDate() + (direction === 'next' ? 7 : -7));
        }
        setCurrentDate(d);
    };

    // --- VISTA MENSAL (Grelha) ---
    const renderMonthView = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let firstDayOfWeek = new Date(year, month, 1).getDay();
        firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

        const calendarDays = [...Array(firstDayOfWeek).fill(null), ...Array(daysInMonth).fill(0).map((_, i) => i + 1)];

        return (
            <div className="p-3 animate-in fade-in duration-200">
                <div className="grid grid-cols-7 gap-1 text-center mb-2 text-[10px] font-bold text-slate-400 uppercase">
                    {['S','T','Q','Q','S','S','D'].map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, idx) => {
                        if (!day) return <div key={idx}></div>;

                        const shift = shifts.find(s => s.day === day && s.month === month && s.year === year);
                        const isToday = new Date().getDate() === day && new Date().getMonth() === month;

                        return (
                            <div
                                key={idx}
                                // Ao clicar num dia, muda para a vista de semana focada nesse dia
                                onClick={() => {
                                    const newDate = new Date(currentDate);
                                    newDate.setDate(day);
                                    setCurrentDate(newDate);
                                    setViewMode('week');
                                }}
                                className="aspect-square flex items-center justify-center rounded-md bg-white dark:bg-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-600 relative text-xs text-slate-600 dark:text-slate-300 cursor-pointer group transition-colors"
                            >
                                <span className={isToday ? 'bg-red-600 text-white w-6 h-6 flex items-center justify-center rounded-full font-bold' : ''}>{day}</span>
                                {shift && <div className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${shift.type === 'work' ? 'bg-green-500' : 'bg-red-500'}`}></div>}

                                {/* Tooltip */}
                                {shift && (
                                    <div className="absolute bottom-full mb-1 z-10 hidden group-hover:block bg-slate-800 text-white text-[10px] p-2 rounded w-max max-w-[120px] shadow-xl">
                                        <p className="font-bold">{shift.title}</p>
                                        <p className="opacity-75">{shift.hours}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // --- VISTA SEMANAL (Lista Detalhada) ---
    const renderWeekView = () => {
        // Calcular início da semana (Segunda-feira)
        const startOfWeek = new Date(currentDate);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);

        const weekDays = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            return d;
        });

        return (
            <div className="divide-y divide-slate-100 dark:divide-slate-700 animate-in slide-in-from-right-4 duration-200">
                {weekDays.map((date, idx) => {
                    const isToday = new Date().toDateString() === date.toDateString();
                    const shift = shifts.find(s =>
                        s.day === date.getDate() &&
                        s.month === date.getMonth() &&
                        s.year === date.getFullYear()
                    );

                    return (
                        <div key={idx} className={`p-3 flex items-center gap-3 ${isToday ? 'bg-slate-50 dark:bg-slate-800/80' : ''}`}>
                            {/* Coluna Dia */}
                            <div className="flex flex-col items-center w-10 text-center flex-shrink-0">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">
                                    {date.toLocaleDateString('pt-PT', { weekday: 'short' }).replace('.', '')}
                                </span>
                                <span className={`text-lg font-bold leading-none ${isToday ? 'text-red-600' : 'text-slate-700 dark:text-slate-300'}`}>
                                    {date.getDate()}
                                </span>
                            </div>

                            {/* Coluna Evento */}
                            <div className="flex-1 min-w-0 border-l border-slate-100 dark:border-slate-700 pl-3">
                                {shift ? (
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{shift.title}</p>
                                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                                            <Clock size={12} />
                                            <span>{shift.hours}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400 italic">Livre</p>
                                )}
                            </div>

                            {/* Indicador Visual */}
                            {shift && (
                                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${shift.type === 'work' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden mt-4">

            {/* Header com Controlos */}
            <div className="p-3 flex justify-between items-center border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-700 dark:text-slate-200 capitalize">
                        {viewMode === 'month'
                            ? currentDate.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })
                            : 'Semana de ' + currentDate.getDate()
                        }
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Botão Toggle View */}
                    <button
                        onClick={() => setViewMode(viewMode === 'month' ? 'week' : 'month')}
                        className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors mr-1"
                        title={viewMode === 'month' ? "Ver Semana" : "Ver Mês"}
                    >
                        {viewMode === 'month' ? <List size={16} /> : <LayoutGrid size={16} />}
                    </button>

                    <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded p-0.5">
                        <button onClick={() => navigate('prev')} className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded shadow-sm"><ChevronLeft size={14}/></button>
                        <button onClick={() => navigate('next')} className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded shadow-sm"><ChevronRight size={14}/></button>
                    </div>
                </div>
            </div>

            {/* Conteúdo Condicional */}
            {viewMode === 'month' ? renderMonthView() : renderWeekView()}
        </div>
    );
}