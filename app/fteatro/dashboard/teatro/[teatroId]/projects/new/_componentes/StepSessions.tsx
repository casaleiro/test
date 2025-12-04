"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Ban, CheckCircle2, X } from 'lucide-react';
import { TeatrosDummy } from '@/app/utils/data/teatroDummyData';

// Componentes
import SessionSidebar
    from "@/app/fteatro/dashboard/teatro/[teatroId]/projects/new/_componentes/sessions/SessionSidebar";
import CalendarGrid from "@/app/fteatro/dashboard/teatro/[teatroId]/projects/new/_componentes/sessions/CalendarGrid";
import SessionModal from "@/app/fteatro/dashboard/teatro/[teatroId]/projects/new/_componentes/sessions/SessionModal";

// --- CONFIGURAÇÃO ---
const START_HOUR = 8;
const END_HOUR = 26;
const PIXELS_PER_HOUR = 60;
const MOCKED_OCCUPIED_SLOTS = [
    { date: new Date().toISOString().split('T')[0], start: 14.5, end: 17.0, title: 'Manutenção AC' },
];

export default function StepSessions({ data, updateData }: any) {
    const params = useParams();
    const teatroId = params.teatroId as string;
    const currentTeatro = TeatrosDummy.find(t => t.id === teatroId) || TeatrosDummy[1];
    const salasDisponiveis = currentTeatro?.spaces || [];

    // --- ESTADOS ---
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingEvent, setPendingEvent] = useState<any>(null); // {date, startStr, endStr}

    const [newSession, setNewSession] = useState({
        nome: '',
        data: new Date().toISOString().split('T')[0],
        horaInicio: '09:00',
        horaFim: '13:00',
    });

    const [currentDate, setCurrentDate] = useState(new Date());
    const [toast, setToast] = useState<{ message: string, type: 'error' | 'success' } | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Drag State
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<number | null>(null);
    const [dragEnd, setDragEnd] = useState<number | null>(null);
    const [dragDay, setDragDay] = useState<string | null>(null);

    // Inicialização
    useEffect(() => {
        if (salasDisponiveis.length > 0 && !selectedRoomId) {
            setSelectedRoomId(salasDisponiveis[0].id);
        }
        if (scrollRef.current) scrollRef.current.scrollTop = 60;
    }, [salasDisponiveis, selectedRoomId]);

    // Timer do Toast
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const showToast = (msg: string, type: 'error' | 'success') => setToast({ message: msg, type });

    // --- HELPERS DE TEMPO ---
    const decimalToTime = (decimal: number) => {
        let hour = Math.floor(decimal);
        const minutes = Math.round((decimal - hour) * 60);
        if (hour >= 24) hour -= 24;
        return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    const pixelToDecimal = (y: number) => {
        const rawHour = START_HOUR + (y / PIXELS_PER_HOUR);
        return Math.round(rawHour * 4) / 4;
    };

    const timeToDecimal = (timeStr: string) => {
        let [h, m] = timeStr.split(':').map(Number);
        let decimal = h + (m / 60);
        if (decimal < START_HOUR) decimal += 24;
        return decimal;
    };

    const getPositionStyle = (startDec: number, endDec: number) => ({
        top: (startDec - START_HOUR) * PIXELS_PER_HOUR,
        height: Math.max(15, (endDec - startDec) * PIXELS_PER_HOUR)
    });

    const getSessionStyle = (start: string, end: string) => {
        const s = timeToDecimal(start);
        const e = timeToDecimal(end);
        return getPositionStyle(s, e);
    };

    // --- LOGICA DE COLISÃO ---
    const checkOverlap = (date: string, start: number, end: number) => {
        const occupied = MOCKED_OCCUPIED_SLOTS.some(slot =>
            slot.date === date && (start < slot.end && end > slot.start)
        );
        const internal = data.sessoes.some((s: any) => {
            if (s.localId !== selectedRoomId || s.data !== date) return false;
            const sStart = timeToDecimal(s.horaInicio);
            const sEnd = timeToDecimal(s.horaFim);
            return (start < sEnd && end > sStart);
        });
        return occupied || internal;
    };

    // --- HANDLERS (Ações) ---
    const handleSelectFullDay = (dateStr: string) => {
        if (!selectedRoomId) return showToast("Seleciona uma sala primeiro!", 'error');
        if (checkOverlap(dateStr, START_HOUR, END_HOUR)) return showToast("Conflito no dia todo.", 'error');

        setPendingEvent({ date: dateStr, startStr: "08:00", endStr: "02:00" });
        setIsModalOpen(true);
    };

    const handleMouseDown = (e: React.MouseEvent, dateStr: string) => {
        if (!selectedRoomId) return showToast("Seleciona uma sala primeiro!", 'error');
        const rect = e.currentTarget.getBoundingClientRect();
        const startH = pixelToDecimal(e.clientY - rect.top);

        if (checkOverlap(dateStr, startH, startH + 0.25)) return showToast("Horário ocupado.", 'error');

        setIsDragging(true);
        setDragDay(dateStr);
        setDragStart(startH);
        setDragEnd(startH + 0.25);
    };

    const handleMouseMove = (e: React.MouseEvent, dateStr: string) => {
        if (!isDragging || dateStr !== dragDay || dragStart === null) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const currentH = pixelToDecimal(e.clientY - rect.top);
        if (currentH > dragStart) setDragEnd(currentH);
    };

    const handleMouseUp = () => {
        if (!isDragging || !dragStart || !dragEnd || !dragDay) {
            setIsDragging(false);
            return;
        }

        const finalStart = Math.min(dragStart, dragEnd);
        const finalEnd = Math.max(dragStart, dragEnd);
        const adjustedEnd = finalEnd === finalStart ? finalStart + 1 : finalEnd;

        if (checkOverlap(dragDay, finalStart, adjustedEnd)) {
            showToast("Sobreposição detetada!", 'error');
        } else {
            // Abrir Modal
            setPendingEvent({
                date: dragDay,
                startStr: decimalToTime(finalStart),
                endStr: decimalToTime(adjustedEnd)
            });
            setIsModalOpen(true);
        }
        setIsDragging(false);
        setDragStart(null); setDragEnd(null); setDragDay(null);
    };

    // Gravar vindo do Modal
    const handleSaveSession = (desc: string, startStr: string, endStr: string) => {
        if (!pendingEvent) return;

        const sDec = timeToDecimal(startStr);
        const eDec = timeToDecimal(endStr);

        if (checkOverlap(pendingEvent.date, sDec, eDec)) {
            alert("Conflito de horário ao gravar.");
            return;
        }

        const sessionToAdd = {
            id: `s-${Date.now()}`,
            localId: selectedRoomId,
            nome: desc,
            data: pendingEvent.date,
            horaInicio: startStr,
            horaFim: endStr,
            staffIds: [],
            equipamentoIds: []
        };

        updateData((prev: any) => ({ ...prev, sessoes: [...prev.sessoes, sessionToAdd] }));
        showToast("Gravado!", 'success');
        setIsModalOpen(false);
        setPendingEvent(null);
    };

    const removeSession = (id: string) => {
        updateData((prev: any) => ({ ...prev, sessoes: prev.sessoes.filter((s: any) => s.id !== id) }));
    };

    const duplicateSession = (s: any) => {
        const d = new Date(s.data); d.setDate(d.getDate() + 1);
        const nextDateStr = d.toISOString().split('T')[0];
        const start = timeToDecimal(s.horaInicio);
        const end = timeToDecimal(s.horaFim);

        if (checkOverlap(nextDateStr, start, end)) return showToast("Conflito no dia seguinte.", 'error');

        const dup = { ...s, id: `s-${Date.now()}`, data: nextDateStr };
        updateData((prev: any) => ({ ...prev, sessoes: [...prev.sessoes, dup] }));
        showToast("Duplicado!", 'success');
    };

    // --- VISUAIS ---
    const visibleDates = Array.from({ length: 3 }, (_, i) => {
        const d = new Date(currentDate); d.setDate(d.getDate() + i); return d;
    });
    const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => i + START_HOUR);

    return (
        <div className="flex flex-col lg:flex-row h-[700px] gap-6 animate-in slide-in-from-right-4 relative" onMouseUp={handleMouseUp}>

            {/* Toast Simples Integrado (poderia ser componente separado também) */}
            {toast && (
                <div className={`absolute top-4 right-1/2 translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 fade-in duration-300 border ${
                    toast.type === 'error' ? 'bg-red-50 text-red-900 border-red-200' : 'bg-green-50 text-green-900 border-green-200'
                }`}>
                    {toast.type === 'error' ? <Ban size={18} className="text-red-500"/> : <CheckCircle2 size={18} className="text-green-500"/>}
                    <span className="text-sm font-bold">{toast.message}</span>
                    <button onClick={() => setToast(null)}><X size={14} className="opacity-50 hover:opacity-100"/></button>
                </div>
            )}

            <SessionSidebar
                salas={salasDisponiveis}
                selectedRoomId={selectedRoomId}
                onSelectRoom={setSelectedRoomId}
                sessions={data.sessoes}
                onRemoveSession={removeSession}
                onDuplicateSession={duplicateSession}
                newSession={newSession}
                setNewSession={setNewSession}
                onAddManual={() => { /* Lógica manual se quiser manter */ }}
                onSelectFullDay={handleSelectFullDay}
            />

            <CalendarGrid
                ref={scrollRef}
                currentDate={currentDate}
                onPrevDate={() => {const d=new Date(currentDate); d.setDate(d.getDate()-3); setCurrentDate(d)}}
                onNextDate={() => {const d=new Date(currentDate); d.setDate(d.getDate()+3); setCurrentDate(d)}}
                selectedRoomId={selectedRoomId}
                hours={hours}
                visibleDates={visibleDates}
                occupiedSlots={MOCKED_OCCUPIED_SLOTS}
                projectSessions={data.sessoes}
                isDragging={isDragging}
                dragDay={dragDay}
                dragStart={dragStart}
                dragEnd={dragEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onSelectFullDay={handleSelectFullDay}
                getPositionStyle={getPositionStyle}
                getSessionStyle={getSessionStyle}
                decimalToTime={decimalToTime}
            />

            <SessionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveSession}
                initialDate={pendingEvent?.date || new Date().toISOString()}
                initialStart={pendingEvent?.startStr || "09:00"}
                initialEnd={pendingEvent?.endStr || "10:00"}
            />
        </div>
    );
}