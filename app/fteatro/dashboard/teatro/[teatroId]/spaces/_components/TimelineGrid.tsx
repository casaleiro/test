"use client";

import React, { useRef } from 'react';
import { SpaceItem, BookingsDummy } from "@/app/utils/data/teatroDummyData";
import { Clock, Users } from 'lucide-react';

interface TimelineGridProps {
  currentDate: Date;
  daysToShow: number;
  zoomLevel: number;
  spaces: SpaceItem[];
  roomColors: any[]; // Tipar corretamente se possível
  eventColors: Record<string, string>;
}

export default function TimelineGrid({
                                       currentDate, daysToShow, zoomLevel, spaces, roomColors, eventColors
                                     }: TimelineGridProps) {

  const scrollRef = useRef<HTMLDivElement>(null);

  // Configurações Base
  const BASE_PIXELS_PER_HOUR = 140;
  const pixelsPerHour = BASE_PIXELS_PER_HOUR * zoomLevel;
  const START_HOUR = 8;
  const END_HOUR = 31; // Até às 07:00 do dia seguinte
  const hoursCount = END_HOUR - START_HOUR;

  // Gerar Arrays
  const hours = Array.from({ length: hoursCount }, (_, i) => i + START_HOUR);
  const visibleDates = Array.from({ length: daysToShow }, (_, i) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + i);
    return d;
  });

  // Helpers
  const formatHourDisplay = (h: number) => {
    const displayH = h % 24;
    return `${displayH.toString().padStart(2, '0')}:00`;
  };

  const hasActivityOnDay = (spaceId: string, targetDate: Date) => {
    return BookingsDummy.some(b =>
      b.spaceId === spaceId &&
      b.date.getDate() === targetDate.getDate() &&
      b.date.getMonth() === targetDate.getMonth() &&
      b.date.getFullYear() === targetDate.getFullYear()
    );
  };

  const getEventStyle = (date: Date, duration: number) => {
    let eventHour = date.getHours();
    const eventMinutes = date.getMinutes();
    if (eventHour < START_HOUR) eventHour += 24;

    const hoursFromStart = (eventHour - START_HOUR) + (eventMinutes / 60);
    return {
      left: `${hoursFromStart * pixelsPerHour}px`,
      width: `${duration * pixelsPerHour}px`
    };
  };

  return (
    <div className="flex-1 overflow-auto custom-scrollbar bg-slate-50 dark:bg-slate-950" ref={scrollRef}>
      <div className="relative min-w-fit">
        {/* Loop pelos Dias */}
        {visibleDates.map((date, dayIndex) => {
          const isToday = new Date().toDateString() === date.toDateString();

          return (
            <div key={dayIndex} className="flex border-b-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">

              {/* COLUNA DATA (Sticky Left) */}
              <div className="w-24 flex-shrink-0 sticky left-0 z-10 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-center items-center py-4 shadow-[4px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                <span className={`text-xs font-bold uppercase ${isToday ? 'text-red-600' : 'text-slate-400'}`}>
                                    {date.toLocaleDateString('pt-PT', { weekday: 'short' }).replace('.', '')}
                                </span>
                <span className={`text-2xl font-bold leading-none ${isToday ? 'text-red-700' : 'text-slate-800 dark:text-white'}`}>
                                    {date.getDate()}
                                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                                    {date.toLocaleDateString('pt-PT', { month: 'short' })}
                                </span>
              </div>

              {/* CONTEÚDO DO DIA */}
              <div className="flex-1 min-w-max relative">

                {/* Cabeçalho Horas */}
                <div className="flex h-6 border-b border-slate-100 dark:border-slate-800">
                  {hours.map(h => (
                    <div key={h} style={{ width: `${pixelsPerHour}px` }} className="flex-shrink-0 border-r border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 pl-1 leading-6">
                      {formatHourDisplay(h)}
                    </div>
                  ))}
                </div>

                {/* Grelha Fundo */}
                <div className="absolute inset-0 top-6 flex pointer-events-none z-0">
                  {hours.map(h => (
                    <div key={h} style={{ width: `${pixelsPerHour}px` }} className="border-r border-slate-50 dark:border-slate-800/50 h-full"></div>
                  ))}
                </div>

                {/* Linhas das Salas */}
                {spaces.map((space, spaceIdx) => {
                  const color = roomColors[spaceIdx % roomColors.length];
                  const active = hasActivityOnDay(space.id, date);
                  const rowHeight = active ? 'h-24' : 'h-6';

                  return (
                    <div key={space.id} className={`${rowHeight} border-b border-slate-100 dark:border-slate-800 relative w-full group transition-all duration-300`}>

                      {/* Barra Cor Lateral */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${color.bg} z-10`} title={space.name}></div>

                      {/* Nome Sala */}
                      <div className="absolute left-3 top-1 z-10 pointer-events-none">
                                                <span className={`text-[10px] font-bold px-1 rounded ${active ? 'text-slate-700 dark:text-slate-300' : 'text-slate-300 dark:text-slate-600'} bg-white/50 dark:bg-slate-900/50`}>
                                                    {space.name} {!active && "(Sem atividade)"}
                                                </span>
                      </div>

                      {/* Eventos */}
                      {active && (
                        <div style={{ width: `${hoursCount * pixelsPerHour}px` }} className="h-full relative mt-5">
                          {BookingsDummy.filter(b =>
                            b.spaceId === space.id &&
                            b.date.getDate() === date.getDate() &&
                            b.date.getMonth() === date.getMonth() &&
                            b.date.getFullYear() === date.getFullYear()
                          ).map(evt => {
                            const style = getEventStyle(evt.date, evt.duration);
                            const colorClass = eventColors[evt.type || 'Event'];

                            return (
                              <div
                                key={evt.id}
                                className={`absolute top-0 bottom-1 rounded-md shadow-sm border px-2 py-1 text-xs cursor-pointer hover:brightness-110 hover:z-20 hover:scale-[1.01] transition-all overflow-hidden flex flex-col justify-center ${colorClass}`}
                                style={style}
                                title={`${space.name}: ${evt.title} (${evt.client})`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-bold truncate leading-tight">{evt.title}</span>
                                  {evt.duration > 1 && <Clock size={10} className="opacity-70 flex-shrink-0" />}
                                </div>
                                {evt.duration > 2 && (
                                  <p className="text-[9px] opacity-80 truncate mt-0.5">{evt.client}</p>
                                )}
                              </div>
                            );
                          })}
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
  );
}