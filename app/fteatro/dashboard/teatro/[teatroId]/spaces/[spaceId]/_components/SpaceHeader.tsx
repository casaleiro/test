"use client";

import React, { useState } from 'react';
import { MapPin, Users, ChevronDown, ChevronUp, Wrench, Info } from 'lucide-react';

interface SpaceHeaderProps {
  space: any;
  teatroName: string;
}

const STATUS_COLORS: any = {
  Available: 'bg-green-100 text-green-700 border-green-200',
  Booked: 'bg-red-100 text-red-700 border-red-200',
  Maintenance: 'bg-yellow-100 text-yellow-700 border-yellow-200'
};

const STATUS_LABELS: any = {
  Available: 'Disponível',
  Booked: 'Ocupada',
  Maintenance: 'Manutenção'
};

export default function SpaceHeader({ space, teatroName }: SpaceHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      className={`
                bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 
                relative overflow-hidden flex-shrink-0 mb-6 cursor-pointer transition-all duration-300 group
                ${isOpen ? 'ring-2 ring-slate-200 dark:ring-slate-700' : 'hover:shadow-md hover:border-slate-300'}
            `}
    >
      {/* Decoração de Fundo (Visível apenas quando expandido ou hover leve) */}
      <div className={`absolute top-0 right-0 p-6 transition-opacity duration-500 pointer-events-none ${isOpen ? 'opacity-5' : 'opacity-0'}`}>
        <MapPin size={120} />
      </div>

      <div className="relative z-10 p-6">

        {/* 1. LINHA PRINCIPAL (SEMPRE VISÍVEL) */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white group-hover:text-red-700 transition-colors">
              {space.name}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {teatroName}
            </p>
          </div>

          {/* Ícone de Expansão */}
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 group-hover:text-slate-600 transition-colors">
            {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </div>
        </div>

        {/* 2. CONTEÚDO EXPANDÍVEL (DETALHES + TÉCNICA) */}
        <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800' : 'grid-rows-[0fr] opacity-0 h-0 p-0 m-0'}`}>
          <div className="overflow-hidden">

            {/* Status e Metadados Básicos */}
            <div className="flex flex-wrap gap-4 mb-6">
                            <span className={`text-xs font-bold px-3 py-1.5 rounded-full border flex items-center gap-2 ${STATUS_COLORS[space.status] || 'bg-slate-100'}`}>
                                <Info size={14} />
                              {STATUS_LABELS[space.status] || space.status}
                            </span>
              <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                <Users size={16} className="text-slate-400" />
                <span className="font-semibold">{space.capacity}</span> Lugares
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                <MapPin size={16} className="text-slate-400" />
                Tipo: <span className="font-semibold">{space.type}</span>
              </div>
            </div>

            {/* Informação Técnica */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <Wrench size={16} className="text-red-600" />
                Especificações Técnicas
              </h3>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                  {space.techNotes || "Nenhuma informação técnica registada para esta sala."}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}