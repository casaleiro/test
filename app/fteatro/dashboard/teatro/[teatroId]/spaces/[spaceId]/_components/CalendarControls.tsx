"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Plus } from "lucide-react";
import { SpaceItem } from "@/app/utils/data/teatroDummyData";

interface CalendarControlsProps {
  teatroName: string;
  currentDate: Date;
  daysToShow: number;
  zoomLevel: number;
  initialSpaces: SpaceItem[];
  roomColors: { bg: string }[];
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  // ⚠️ Mudei o tipo de viewMode para incluir '7day' se usares string, mas aqui usamos daysToShow numerico
  setViewMode: (mode: "day" | "3day" | "7day" | "month") => void;
  viewMode: string;
}

export default function CalendarControls({
  teatroName,
  currentDate,
  daysToShow,
  viewMode,
  onPrev,
  onNext,
  onToday,
  setViewMode,
}: CalendarControlsProps) {
  // Calcular data final para mostrar no header
  const endDate = new Date(currentDate);
  // Se for modo mês, o cálculo é diferente, mas para os dias funciona assim:
  if (viewMode !== "month") {
    endDate.setDate(endDate.getDate() + daysToShow - 1);
  }

  const dateLabel =
    viewMode === "month"
      ? currentDate.toLocaleDateString("pt-PT", {
          month: "long",
          year: "numeric",
        })
      : `${currentDate.toLocaleDateString("pt-PT", {
          day: "numeric",
          month: "short",
        })} - ${endDate.toLocaleDateString("pt-PT", {
          day: "numeric",
          month: "short",
        })}`;

  return (
    <div className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 flex-shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-slate-800 dark:text-white capitalize">
          {teatroName}
        </h1>
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
        <h2 className="text-sm font-medium text-slate-500 capitalize">
          {dateLabel}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {/* ⚠️ Botões de Vista: 1, 3, 7, Mês */}
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode("day")}
            className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
              viewMode === "day"
                ? "bg-white shadow text-slate-900"
                : "text-slate-500"
            }`}
          >
            Dia
          </button>
          <button
            onClick={() => setViewMode("3day")}
            className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
              viewMode === "3day"
                ? "bg-white shadow text-slate-900"
                : "text-slate-500"
            }`}
          >
            3D
          </button>
          <button
            onClick={() => setViewMode("7day")}
            className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
              viewMode === "7day"
                ? "bg-white shadow text-slate-900"
                : "text-slate-500"
            }`}
          >
            7D
          </button>
          <button
            onClick={() => setViewMode("month")}
            className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
              viewMode === "month"
                ? "bg-white shadow text-slate-900"
                : "text-slate-500"
            }`}
          >
            Mês
          </button>
        </div>

        {/* Navegação */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button onClick={onPrev} className="p-1.5 hover:bg-white rounded">
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={onToday}
            className="text-xs font-bold px-3 hover:text-red-600"
          >
            Hoje
          </button>
          <button onClick={onNext} className="p-1.5 hover:bg-white rounded">
            <ChevronRight size={16} />
          </button>
        </div>

        <button className="bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-red-800">
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
