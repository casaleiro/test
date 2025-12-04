"use client";

import React, { useState } from 'react';
import { Layout, PlusCircle, AlertCircle } from 'lucide-react'; // Ícones para o empty state
import SpaceHeader from './SpaceHeader';
import VerticalCalendar from './VerticalCalendar';
import MonthCalendar from './MonthCalendar';
import CalendarControls from './CalendarControls';

interface SingleSpaceClientProps {
    space: any;
    teatroName: string;
    bookings: any[];
}

export default function SingleSpaceClient({ space, teatroName, bookings }: SingleSpaceClientProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'day' | '3day' | '7day' | 'month'>('3day');

    // --- LÓGICA DE ESTADO VAZIO (QUANDO NÃO EXISTE SALA) ---
    if (!space) {
        return (
            <div className="h-[calc(100vh-60px)] flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
                <div className="bg-slate-50 dark:bg-slate-900 p-10 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 max-w-md w-full flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                        <Layout size={32} />
                    </div>

                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                        Sala não encontrada
                    </h2>
                    <p className="text-slate-500 text-sm mb-8">
                        Não foi possível encontrar a sala solicitada neste teatro ({teatroName}).
                    </p>

                    <button
                        onClick={() => alert("Abrir Modal de Criar Sala")} // Aqui ligarias a tua função de criar
                        className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-red-500/20 active:scale-95"
                    >
                        <PlusCircle size={20} />
                        Criar Nova Sala
                    </button>
                </div>
            </div>
        );
    }

    // --- COMPORTAMENTO NORMAL (QUANDO EXISTE SALA) ---

    const getDaysToShow = () => {
        if (viewMode === 'day') return 1;
        if (viewMode === '7day') return 7;
        return 3;
    };

    const nextPeriod = () => {
        const d = new Date(currentDate);
        if (viewMode === 'month') {
            d.setMonth(d.getMonth() + 1);
        } else {
            d.setDate(d.getDate() + getDaysToShow());
        }
        setCurrentDate(d);
    };

    const prevPeriod = () => {
        const d = new Date(currentDate);
        if (viewMode === 'month') {
            d.setMonth(d.getMonth() - 1);
        } else {
            d.setDate(d.getDate() - getDaysToShow());
        }
        setCurrentDate(d);
    };

    const goToToday = () => setCurrentDate(new Date());

    const handleDayClick = (date: Date) => {
        setCurrentDate(date);
        setViewMode('day');
    };

    return (
        <div className="pb-10 max-w-5xl mx-auto h-[calc(100vh-60px)] flex flex-col animate-in slide-in-from-bottom-2">

            <SpaceHeader space={space} teatroName={teatroName} />

            <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">

                <CalendarControls
                    teatroName="Agenda"
                    currentDate={currentDate}
                    daysToShow={getDaysToShow()}
                    zoomLevel={1}
                    initialSpaces={[]}
                    roomColors={[]}
                    onPrev={prevPeriod}
                    onNext={nextPeriod}
                    onToday={goToToday}
                    setViewMode={setViewMode}
                    viewMode={viewMode}
                />

                <div className="flex-1 flex flex-col min-h-0 relative">
                    {viewMode === 'month' ? (
                        <div className="h-full overflow-y-auto custom-scrollbar">
                            <MonthCalendar
                                currentDate={currentDate}
                                bookings={bookings}
                                onDayClick={handleDayClick}
                            />
                        </div>
                    ) : (
                        <VerticalCalendar
                            currentDate={currentDate}
                            bookings={bookings}
                            daysToShow={getDaysToShow()}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}