"use client";

import React from 'react';
import { Clock } from 'lucide-react';

// Cores (Reutilizadas para consistência)
const EVENT_COLORS: Record<string, string> = {
  'Technical': 'bg-gray-100 border-l-2 border-gray-500 text-gray-700',
  'Rehearsal': 'bg-blue-50 border-l-2 border-blue-500 text-blue-700',
  'Performance': 'bg-red-50 border-l-2 border-red-600 text-red-800',
  'Maintenance': 'bg-amber-50 border-l-2 border-amber-500 text-amber-700',
  'Event': 'bg-purple-50 border-l-2 border-purple-500 text-purple-700',
};

interface MonthCalendarProps {
  currentDate: Date;
  bookings: any[];
  onDayClick: (date: Date) => void;
}

export default function MonthCalendar({ currentDate, bookings, onDayClick }: MonthCalendarProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 1. Calcular dias do mês
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 2. Calcular dia da semana que começa o mês (0 = Domingo, mas queremos Segunda = 0)
  let firstDayOfWeek = new Date(year, month, 1).getDay();
  // Ajuste para Segunda-feira ser o primeiro dia da grelha (0)
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  // 3. Gerar grelha
  // Dias vazios antes do dia 1
  const blanks = Array.from({ length: firstDayOfWeek }, (_, i) => null);
  // Dias do mês
  const days = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));

  // Combinar tudo
  const calendarDays = [...blanks, ...days];

  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[800px]">

      {/* Cabeçalho Semana */}
      <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        {weekDays.map(day => (
          <div key={day} className="py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Grelha Dias */}
      <div className="grid grid-cols-7 grid-rows-5 flex-1 bg-slate-100 dark:bg-slate-950 gap-px border-b border-slate-200 dark:border-slate-800">
        {calendarDays.map((date, idx) => {
          if (!date) return <div key={`blank-${idx}`} className="bg-white dark:bg-slate-900"></div>;

          const isToday = new Date().toDateString() === date.toDateString();

          // Filtrar eventos deste dia
          const dayEvents = bookings.filter(b =>
            b.date.getDate() === date.getDate() &&
            b.date.getMonth() === date.getMonth() &&
            b.date.getFullYear() === date.getFullYear()
          ).sort((a, b) => a.date.getTime() - b.date.getTime());

          return (
            <div
              key={idx}
              onClick={() => onDayClick(date)}
              className={`bg-white dark:bg-slate-900 p-2 relative group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex flex-col gap-1 overflow-hidden`}
            >
              {/* Número do Dia */}
              <div className="flex justify-between items-center mb-1">
                                <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-red-600 text-white' : 'text-slate-500 group-hover:text-slate-900'}`}>
                                    {date.getDate()}
                                </span>
                {dayEvents.length > 0 && (
                  <span className="text-[9px] text-slate-400 font-medium">{dayEvents.length} ev.</span>
                )}
              </div>

              {/* Lista de Eventos (Máximo 3 ou 4 visíveis) */}
              <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                {dayEvents.map(evt => (
                  <div
                    key={evt.id}
                    className={`px-1.5 py-0.5 rounded text-[10px] truncate border-l-2 font-medium ${EVENT_COLORS[evt.type || 'Event'] || 'bg-slate-100 border-slate-400 text-slate-600'}`}
                    title={`${evt.time} - ${evt.title}`}
                  >
                                        <span className="opacity-75 mr-1 text-[9px]">
                                            {evt.date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                        </span>
                    {evt.title}
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