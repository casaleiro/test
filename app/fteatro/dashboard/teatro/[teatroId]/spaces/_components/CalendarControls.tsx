"use client";

import React from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Plus } from 'lucide-react';
import { SpaceItem } from "@/app/utils/data/teatroDummyData";

interface CalendarControlsProps {
  teatroName: string;
  currentDate: Date;
  daysToShow: number;
  zoomLevel: number;
  spaces: SpaceItem[];
  roomColors: { bg: string }[]; // Array de cores simples
  onPrevPeriod: () => void;
  onNextPeriod: () => void;
  onGoToToday: () => void;
  onZoomChange: (newZoom: number) => void;
  onDaysChange: (days: number) => void;
}

export default function CalendarControls({
                                           teatroName, currentDate, daysToShow, zoomLevel, spaces, roomColors,
                                           onPrevPeriod, onNextPeriod, onGoToToday, onZoomChange, onDaysChange
                                         }: CalendarControlsProps) {

  // Calcular data final do período visível para mostrar no texto
  const endDate = new Date(currentDate);
  endDate.setDate(endDate.getDate() + daysToShow - 1);

  return (
    <div className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-col xl:flex-row justify-between items-center gap-4 flex-shrink-0">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">{teatroName}</h1>

        {/* LEGENDA DAS SALAS */}
        <div className="hidden md:flex flex-wrap gap-3 items-center border-l border-slate-200 dark:border-slate-700 pl-6">
          {spaces.map((space, idx) => {
            const color = roomColors[idx % roomColors.length];
            return (
              <div key={space.id} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-sm ${color.bg}`}></div>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{space.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Botões de Dias */}
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          {[1, 3, 7].map(d => (
            <button
              key={d}
              onClick={() => onDaysChange(d)}
              className={`px-3 py-1 text-xs font-bold rounded transition-colors ${daysToShow === d ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
            >
              {d} Dias
            </button>
          ))}
        </div>

        {/* Zoom */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          <button onClick={() => onZoomChange(Math.max(0.3, zoomLevel - 0.1))} className="p-1.5 hover:bg-white rounded"><ZoomOut size={16}/></button>
          <span className="text-xs w-10 text-center font-mono">{Math.round(zoomLevel * 100)}%</span>
          <button onClick={() => onZoomChange(Math.min(1.5, zoomLevel + 0.1))} className="p-1.5 hover:bg-white rounded"><ZoomIn size={16}/></button>
        </div>

        {/* Navegação Data */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button onClick={onPrevPeriod} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded shadow-sm"><ChevronLeft size={16}/></button>
          <span className="text-xs font-bold px-2 w-32 text-center">
                        {currentDate.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })}
            {daysToShow > 1 && ` - ${endDate.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })}`}
                    </span>
          <button onClick={onNextPeriod} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded shadow-sm"><ChevronRight size={16}/></button>
        </div>

        <button className="bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-red-800 transition-colors">
          <Plus size={16} /> Reserva
        </button>
      </div>
    </div>
  );
}