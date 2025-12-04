"use client";

import React, { useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';

// Cores por Tipo de Evento
const EVENT_COLORS: Record<string, string> = {
  'Technical': 'bg-gray-100 border-l-4 border-gray-500 text-gray-700',
  'Rehearsal': 'bg-blue-50 border-l-4 border-blue-500 text-blue-700',
  'Performance': 'bg-red-50 border-l-4 border-red-600 text-red-800 shadow-sm',
  'Maintenance': 'bg-amber-50 border-l-4 border-amber-500 text-amber-700',
  'Event': 'bg-purple-50 border-l-4 border-purple-500 text-purple-700',
  'Workshop': 'bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700',
  'Exhibition': 'bg-pink-50 border-l-4 border-pink-500 text-pink-700',
};

interface VerticalCalendarProps {
  bookings: any[];
  currentDate: Date;
  daysToShow: number;
}

export default function VerticalCalendar({ bookings, currentDate, daysToShow }: VerticalCalendarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // --- CONFIGURAÇÃO HORÁRIA ---
  const START_HOUR = 8;
  const END_HOUR = 31; // Até às 07:00 do dia seguinte
  const hoursCount = END_HOUR - START_HOUR;

  // ⚠️ REDUÇÃO DE ALTURA: Mudamos de 80px para 60px para ser mais compacto
  const PIXELS_PER_HOUR = 30;

  // --- GERAR DADOS ---
  const visibleDates = Array.from({ length: daysToShow }, (_, i) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + i);
    return d;
  });

  const hours = Array.from({ length: hoursCount }, (_, i) => i + START_HOUR);

  // --- HELPERS ---
  const formatHourDisplay = (h: number) => `${(h % 24).toString().padStart(2, '0')}:00`;

  const getEventGridPosition = (date: Date) => {
    let eventHour = date.getHours();
    const eventMinutes = date.getMinutes();

    // Ajuste Madrugada (01:00 -> 25:00)
    if (eventHour < START_HOUR) eventHour += 24;

    return (eventHour - START_HOUR) + (eventMinutes / 60);
  };

  const getEventStyle = (date: Date, duration: number) => {
    const startOffset = getEventGridPosition(date);

    // Se começar antes das 08:00 (e não for madrugada do dia seguinte), esconde
    if (startOffset < 0) return null;

    return {
      top: `${startOffset * PIXELS_PER_HOUR}px`,
      height: `${duration * PIXELS_PER_HOUR}px`
    };
  };

  // --- ⚠️ AUTO-SCROLL PARA O PRIMEIRO EVENTO ---
  useEffect(() => {
    if (scrollContainerRef.current) {
      // 1. Filtrar eventos que estão visíveis nestes dias
      const visibleEvents = bookings.filter(b =>
        visibleDates.some(date =>
          b.date.getDate() === date.getDate() &&
          b.date.getMonth() === date.getMonth() &&
          b.date.getFullYear() === date.getFullYear()
        )
      );

      if (visibleEvents.length > 0) {
        // 2. Encontrar o evento que começa mais cedo (menor valor na grelha Y)
        const earliestPosition = visibleEvents.reduce((min, curr) => {
          const pos = getEventGridPosition(curr.date);
          return pos < min ? pos : min;
        }, 100); // 100 é um valor alto inicial

        // 3. Calcular pixel de scroll (com margem de 30min para não ficar colado)
        // Math.max(0, ...) garante que não faz scroll negativo
        const scrollToPixel = Math.max(0, (earliestPosition - 0.5) * PIXELS_PER_HOUR);

        scrollContainerRef.current.scrollTo({ top: scrollToPixel, behavior: 'smooth' });
      } else {
        // Se não houver eventos, scroll para o topo (08:00)
        scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [currentDate, daysToShow, bookings]); // Corre quando mudamos dias ou reservas

  return (
    <div className="flex flex-col h-full min-h-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">

      {/* 1. CABEÇALHO DOS DIAS */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 z-20 flex-shrink-0 pl-14 pr-4">
        {visibleDates.map((date, idx) => {
          const isToday = new Date().toDateString() === date.toDateString();
          return (
            <div key={idx} className="flex-1 py-2 text-center border-r border-slate-200 dark:border-slate-700/50 last:border-0">
                            <span className={`text-[10px] font-bold uppercase block ${isToday ? 'text-red-600' : 'text-slate-500'}`}>
                                {date.toLocaleDateString('pt-PT', { weekday: 'short' })}
                            </span>
              <span className={`text-sm font-bold block ${isToday ? 'text-red-700' : 'text-slate-800 dark:text-white'}`}>
                                {date.getDate()}
                            </span>
            </div>
          );
        })}
      </div>

      {/* 2. CORPO COM SCROLL */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto relative custom-scrollbar flex"
      >
        {/* COLUNA DAS HORAS */}
        <div className="w-14 flex-shrink-0 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 sticky left-0 z-30 pt-4">
          {hours.map(h => (
            <div key={h} className="border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 text-right pr-2 relative box-border" style={{ height: `${PIXELS_PER_HOUR}px` }}>
                            <span className="-top-2 relative bg-slate-50 dark:bg-slate-900 pl-1">
                                {formatHourDisplay(h)}
                            </span>
            </div>
          ))}
        </div>

        {/* COLUNAS DE DIAS */}
        <div className="flex-1 flex min-w-[300px]">
          {visibleDates.map((date, dayIdx) => {
            const isToday = new Date().toDateString() === date.toDateString();

            return (
              <div key={dayIdx} className={`flex-1 border-r border-slate-100 dark:border-slate-800 relative ${isToday ? 'bg-slate-50/40' : ''}`}>

                {/* Grelha de Fundo */}
                <div className="absolute inset-0 top-4 z-0 pointer-events-none">
                  {hours.map(h => (
                    <div key={h} className="border-b border-slate-50 dark:border-slate-800/50 w-full box-border" style={{ height: `${PIXELS_PER_HOUR}px` }}></div>
                  ))}
                </div>

                {/* EVENTOS */}
                <div className="relative mt-4" style={{ height: `${hoursCount * PIXELS_PER_HOUR}px` }}>
                  {bookings.filter(b =>
                    b.date.toDateString() === date.toDateString()
                  ).map(evt => {
                    const style = getEventStyle(evt.date, evt.duration);
                    if (!style) return null;

                    const colorClass = EVENT_COLORS[evt.type || 'Event'] || EVENT_COLORS['Event'];

                    return (
                      <div
                        key={evt.id}
                        className={`absolute left-1 right-2 rounded p-1.5 text-xs cursor-pointer hover:z-20 hover:scale-[1.02] hover:shadow-md transition-all overflow-hidden flex flex-col ${colorClass}`}
                        style={style}
                        title={`${evt.title} (${evt.client})`}
                      >
                        <p className="font-bold leading-tight line-clamp-2 text-[11px]">{evt.title}</p>
                        {/* Só mostra hora se o evento for alto o suficiente */}
                        {evt.duration >= 1 && (
                          <div className="flex items-center gap-1 opacity-80 mt-0.5 text-[9px]">
                            <Clock size={10} />
                            <span>
                                                            {evt.date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                                        </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}