"use client";

import React, { useState, useMemo } from 'react';
import { Calendar as CalIcon, ChevronLeft, ChevronRight, Clock, Users, Package, MapPin, Info } from 'lucide-react';
import { PessoasDummy } from '@/app/utils/data/peopleDummyData';
import { EquipamentosDummy } from '@/app/utils/data/equipmentDummyData';
import { TeatrosDummy } from '@/app/utils/data/teatroDummyData';

// --- CONFIGURAÇÃO DO CALENDÁRIO ---
const START_HOUR = 8; // 08:00
const END_HOUR = 26;  // Até às 02:00
const HOUR_HEIGHT = 60; // px por hora

export default function StepReview({ data }: any) {
    const sessoes = data?.sessoes || [];

    // --- ESTADOS ---
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedSession, setSelectedSession] = useState<any>(null);

    // --- HELPERS DE DADOS ---
    const getStaffDetails = (ids: string[]) => {
        return ids.map(id => PessoasDummy.find(p => p.id === id)).filter(Boolean);
    };

    const getEquipDetails = (ids: string[]) => {
        const counts: Record<string, number> = {};
        ids.forEach(id => { counts[id] = (counts[id] || 0) + 1; });
        return Object.entries(counts).map(([id, qtd]) => {
            const item = EquipamentosDummy.find(e => e.id === id);
            return item ? { ...item, qtd } : null;
        }).filter(Boolean);
    };

    // Novo Helper para buscar o nome da sala
    const getRoomName = (localId: string) => {
        if (!localId) return "Sala não definida";
        for (const teatro of TeatrosDummy) {
            const space = teatro.spaces.find(s => s.id === localId);
            if (space) return space.name;
        }
        return "Sala desconhecida";
    };

    // --- HELPERS DE CALENDÁRIO ---
    const timeToDecimal = (t: string) => {
        if(!t) return 0;
        const [h, m] = t.split(':').map(Number);
        let decimal = h + (m/60);
        if (decimal < START_HOUR) decimal += 24; // Ajuste para madrugada
        return decimal;
    };

    const getWeekDays = (date: Date) => {
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        start.setDate(diff);

        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            days.push(d);
        }
        return days;
    };

    const weekDays = getWeekDays(currentDate);

    // --- ESTATÍSTICAS GERAIS ---
    const stats = useMemo(() => {
        const uniqueStaff = new Set(sessoes.flatMap((s:any) => s.staffIds || []));

        return {
            totalSessions: sessoes.length,
            uniqueStaff: uniqueStaff.size,
            // Custo removido conforme pedido
        };
    }, [sessoes]);

    return (
        <div className="h-full flex flex-col gap-6 animate-in slide-in-from-right-4 pb-10">

            {/* 1. RESUMO KPI (Topo) */}
            <div className="flex flex-col md:flex-row gap-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{data.nome || 'Novo Projeto'}</h2>
                    <p className="text-sm text-slate-500">{data.cliente || 'Sem cliente definido'}</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-center px-4 border-r border-slate-200 dark:border-slate-700">
                        <div className="text-xs text-slate-400 uppercase font-bold">Sessões</div>
                        <div className="font-bold text-lg">{stats.totalSessions}</div>
                    </div>
                    <div className="text-center px-4">
                        <div className="text-xs text-slate-400 uppercase font-bold">Pessoas</div>
                        <div className="font-bold text-lg">{stats.uniqueStaff}</div>
                    </div>
                </div>
            </div>

            {/* 2. ÁREA PRINCIPAL (Calendário + Detalhes) */}
            <div className="flex flex-col lg:flex-row gap-6 h-[600px]">

                {/* ESQUERDA: CALENDÁRIO SEMANAL */}
                <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">

                    {/* Header Calendário */}
                    <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                        <div className="flex gap-2">
                            <button onClick={() => {const d = new Date(currentDate); d.setDate(d.getDate()-7); setCurrentDate(d)}} className="p-1 hover:bg-slate-200 rounded"><ChevronLeft/></button>
                            <button onClick={() => {const d = new Date(currentDate); d.setDate(d.getDate()+7); setCurrentDate(d)}} className="p-1 hover:bg-slate-200 rounded"><ChevronRight/></button>
                        </div>
                        <span className="font-bold text-sm">
                            {weekDays[0].toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
                        </span>
                        <div className="w-16"></div>
                    </div>

                    {/* Grid do Calendário */}
                    <div className="flex-1 overflow-y-auto relative custom-scrollbar flex">

                        {/* Coluna Horas */}
                        <div className="w-12 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 pt-8 text-[10px] text-slate-400 text-right pr-2 select-none">
                            {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => (
                                <div key={i} style={{ height: HOUR_HEIGHT }} className="relative -top-2">
                                    {(START_HOUR + i) % 24}:00
                                </div>
                            ))}
                        </div>

                        {/* Colunas Dias */}
                        <div className="flex flex-1 min-w-[500px]">
                            {weekDays.map((day, i) => {
                                const dateStr = day.toISOString().split('T')[0];
                                const daySessions = sessoes.filter((s:any) => s.data === dateStr);
                                const isToday = dateStr === new Date().toISOString().split('T')[0];

                                return (
                                    <div key={i} className="flex-1 border-r border-slate-100 dark:border-slate-800 relative min-w-[100px] group/col">
                                        {/* Header Dia */}
                                        <div className={`text-center py-2 text-xs font-bold border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 bg-white dark:bg-slate-900 ${isToday ? 'text-blue-600' : 'text-slate-500'}`}>
                                            {day.getDate()} <span className="opacity-50">{day.toLocaleDateString('pt-PT', { weekday: 'short' })}</span>
                                        </div>

                                        {/* Linhas de fundo */}
                                        <div className="absolute inset-0 top-8 z-0 pointer-events-none">
                                            {Array.from({ length: END_HOUR - START_HOUR }).map((_, h) => (
                                                <div key={h} style={{ height: HOUR_HEIGHT }} className="border-b border-slate-50 dark:border-slate-800/50"></div>
                                            ))}
                                        </div>

                                        {/* Eventos */}
                                        {daySessions.map((s:any) => {
                                            const startDec = timeToDecimal(s.horaInicio);
                                            const endDec = timeToDecimal(s.horaFim);
                                            // Se end for menor que start, assume que passou da meia noite (adiciona 24h à logica se não tiver sido feito no helper)
                                            const safeEnd = endDec < startDec ? endDec + 24 : endDec;

                                            const top = (startDec - START_HOUR) * HOUR_HEIGHT;
                                            const height = (safeEnd - startDec) * HOUR_HEIGHT;
                                            const isSelected = selectedSession?.id === s.id;
                                            const roomName = getRoomName(s.localId);

                                            return (
                                                <div
                                                    key={s.id}
                                                    onClick={() => setSelectedSession(s)}
                                                    style={{ top: top + 32, height: Math.max(30, height) }} // +32 offset do header
                                                    className={`absolute left-1 right-1 rounded border-l-4 p-1.5 cursor-pointer transition-all hover:brightness-95 hover:scale-[1.02] shadow-sm z-10 overflow-hidden flex flex-col justify-start
                                                        ${isSelected
                                                        ? 'bg-blue-600 text-white border-blue-800 shadow-lg ring-2 ring-blue-300 z-20'
                                                        : 'bg-blue-100 text-blue-900 border-blue-500 dark:bg-blue-900/40 dark:text-blue-100'
                                                    }`}
                                                >
                                                    <div className="font-bold text-[10px] leading-tight truncate">{s.nome}</div>
                                                    <div className="opacity-80 text-[9px] mt-0.5 truncate">{s.horaInicio} - {s.horaFim}</div>

                                                    {/* NOME DA SALA ADICIONADO AQUI */}
                                                    <div className="flex items-center gap-1 mt-1 pt-1 border-t border-black/10 text-[9px] font-bold opacity-75 truncate">
                                                        <MapPin size={8} /> {roomName}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* DIREITA: DETALHES (Painel Fixo) */}
                <div className="w-full lg:w-1/3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                        <h3 className="font-bold text-sm text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                            Detalhes da Sessão
                        </h3>
                    </div>

                    {!selectedSession ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                            <Info size={48} className="mb-4 opacity-20"/>
                            <p className="text-sm">Clica numa sessão no calendário para veres a equipa e o material alocado.</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">

                            {/* Info Básica */}
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{selectedSession.nome}</h2>
                                <div className="flex flex-col gap-2 text-sm text-slate-500 mt-2">
                                    <span className="flex items-center gap-2"><CalIcon size={14}/> {selectedSession.data}</span>
                                    <span className="flex items-center gap-2"><Clock size={14}/> {selectedSession.horaInicio} - {selectedSession.horaFim}</span>
                                    <span className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                                        <MapPin size={14}/> {getRoomName(selectedSession.localId)}
                                    </span>
                                </div>
                            </div>

                            <hr className="border-slate-100 dark:border-slate-800"/>

                            {/* Staff */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-1">
                                    <Users size={12}/> Equipa Técnica ({selectedSession.staffIds?.length || 0})
                                </h4>
                                {(!selectedSession.staffIds || selectedSession.staffIds.length === 0) ? (
                                    <p className="text-xs text-slate-400 italic bg-slate-50 p-2 rounded">Ninguém alocado.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {getStaffDetails(selectedSession.staffIds).map((p:any) => (
                                            <div key={p.id} className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-lg">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                                                    {p.fotoUrl ? <img src={p.fotoUrl} className="w-full h-full rounded-full object-cover"/> : p.nome[0]}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-800 dark:text-white">{p.nome}</div>
                                                    <div className="text-xs text-slate-500">{p.cargo}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Equipamento */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-1">
                                    <Package size={12}/> Material ({selectedSession.equipamentoIds?.length || 0})
                                </h4>
                                {(!selectedSession.equipamentoIds || selectedSession.equipamentoIds.length === 0) ? (
                                    <p className="text-xs text-slate-400 italic bg-slate-50 p-2 rounded">Sem material.</p>
                                ) : (
                                    <div className="grid grid-cols-1 gap-2">
                                        {getEquipDetails(selectedSession.equipamentoIds).map((e:any, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-100 dark:border-slate-800">
                                                <div className="text-sm text-slate-700 dark:text-slate-300 font-medium">{e.name}</div>
                                                <div className="text-xs font-bold bg-white dark:bg-slate-700 px-2 py-1 rounded border dark:border-slate-600 shadow-sm">
                                                    x{e.qtd}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}