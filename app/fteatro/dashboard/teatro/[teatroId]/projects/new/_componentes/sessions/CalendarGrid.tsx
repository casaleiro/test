import React, { forwardRef } from 'react';
import { Ban, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarGridProps {
    currentDate: Date;
    onPrevDate: () => void;
    onNextDate: () => void;
    selectedRoomId: string;
    hours: number[];
    visibleDates: Date[];
    // Dados
    occupiedSlots: any[];
    projectSessions: any[];
    // Drag Props
    isDragging: boolean;
    dragDay: string | null;
    dragStart: number | null;
    dragEnd: number | null;
    // Handlers
    onMouseDown: (e: React.MouseEvent, date: string) => void;
    onMouseMove: (e: React.MouseEvent, date: string) => void;
    onSelectFullDay: (date: string) => void;
    // Helpers visuais passados do pai (ou duplicados se preferir utils)
    getPositionStyle: (s: number, e: number) => any;
    getSessionStyle: (s: string, e: string) => any;
    decimalToTime: (d: number) => string;
}

const CalendarGrid = forwardRef<HTMLDivElement, CalendarGridProps>(({
                                                                        currentDate, onPrevDate, onNextDate, selectedRoomId, hours, visibleDates,
                                                                        occupiedSlots, projectSessions,
                                                                        isDragging, dragDay, dragStart, dragEnd,
                                                                        onMouseDown, onMouseMove, onSelectFullDay,
                                                                        getPositionStyle, getSessionStyle, decimalToTime
                                                                    }, ref) => {

    return (
        <div className={`flex-1 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-sm relative ${!selectedRoomId ? 'cursor-not-allowed' : ''}`}>

            {!selectedRoomId && (
                <div className="absolute inset-0 bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur-sm z-40 flex items-center justify-center">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-2xl text-center border-2 border-red-100">
                        <Ban size={32} className="mx-auto text-red-400 mb-2"/>
                        <p className="text-slate-600 dark:text-slate-300 font-bold">Agenda Bloqueada</p>
                        <p className="text-xs text-slate-400">Seleciona uma sala à esquerda primeiro.</p>
                    </div>
                </div>
            )}

            <div className="p-3 border-b dark:border-slate-800 flex justify-between bg-slate-50 dark:bg-slate-800/50">
                <button onClick={onPrevDate} className="p-1 hover:bg-white rounded"><ChevronLeft/></button>
                <span className="font-bold text-sm text-slate-800 dark:text-white">{currentDate.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}</span>
                <button onClick={onNextDate} className="p-1 hover:bg-white rounded"><ChevronRight/></button>
            </div>

            <div ref={ref} className="flex-1 overflow-y-auto flex relative select-none custom-scrollbar">
                <div className="w-12 border-r dark:border-slate-800 bg-slate-50 dark:bg-slate-900 pt-8 sticky left-0 z-20 text-[10px] text-right pr-2">
                    {hours.map(h => (
                        <div key={h} className="h-[60px] relative -top-2 text-slate-400">{(h%24).toString().padStart(2,'0')}:00</div>
                    ))}
                </div>

                <div className="flex flex-1">
                    {visibleDates.map((date, i) => {
                        const dateStr = date.toISOString().split('T')[0];
                        // Filtra aqui para garantir que cada coluna só tem o seu
                        const dayOccupied = occupiedSlots.filter(s => s.date === dateStr);
                        const daySessions = projectSessions.filter(s => s.data === dateStr && s.localId === selectedRoomId);

                        return (
                            <div key={i} className="flex-1 border-r dark:border-slate-800 relative min-w-[120px] group/col"
                                 onMouseDown={(e) => onMouseDown(e, dateStr)}
                                 onMouseMove={(e) => onMouseMove(e, dateStr)}
                            >
                                <div
                                    onClick={() => onSelectFullDay(dateStr)}
                                    className="text-center py-2 text-xs font-bold border-b dark:border-slate-800 sticky top-0 z-10 bg-white dark:bg-slate-900 text-slate-600 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors"
                                    title="Clique para marcar dia inteiro"
                                >
                                    {date.getDate()} {date.toLocaleDateString('pt-PT',{weekday:'short'})}
                                </div>

                                <div className="absolute inset-0 top-8 z-0 pointer-events-none">
                                    {hours.map(h => <div key={h} className="h-[60px] border-b dark:border-slate-800/30"></div>)}
                                </div>

                                {/* MOCK OCUPADO */}
                                {dayOccupied.map((slot: any, idx: number) => (
                                    <div key={`occ-${idx}`} style={getPositionStyle(slot.start, slot.end)} className="absolute left-1 right-1 bg-slate-200 dark:bg-slate-700 border-l-4 border-slate-400 p-1 text-[10px] rounded z-10 pointer-events-none opacity-80 flex flex-col justify-center">
                                        <div className="font-bold text-slate-500 dark:text-slate-300 flex items-center gap-1"><Ban size={10}/> {slot.title}</div>
                                    </div>
                                ))}

                                {/* SESSÕES DO PROJETO */}
                                {daySessions.map((s:any) => (
                                    <div key={s.id} style={getSessionStyle(s.horaInicio, s.horaFim)} className="absolute left-1 right-1 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-600 text-red-900 dark:text-red-100 p-1 text-[10px] rounded z-20 pointer-events-none shadow-sm overflow-hidden">
                                        <div className="font-bold truncate">{s.nome}</div>
                                        <div>{s.horaInicio}-{s.horaFim}</div>
                                    </div>
                                ))}

                                {/* DRAG PREVIEW */}
                                {isDragging && dragDay === dateStr && dragStart !== null && dragEnd !== null && (
                                    <div style={getPositionStyle(Math.min(dragStart, dragEnd), Math.max(dragStart, dragEnd))} className="absolute left-1 right-1 border-2 border-dashed border-red-500 bg-red-50/50 dark:bg-red-900/20 p-1 text-[10px] rounded z-30 pointer-events-none flex flex-col justify-center items-center text-red-600 font-bold">
                                        <span>{decimalToTime(Math.min(dragStart, dragEnd))}</span>
                                        <span className="text-[8px] opacity-75">até</span>
                                        <span>{decimalToTime(Math.max(dragStart, dragEnd))}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});

CalendarGrid.displayName = "CalendarGrid";
export default CalendarGrid;