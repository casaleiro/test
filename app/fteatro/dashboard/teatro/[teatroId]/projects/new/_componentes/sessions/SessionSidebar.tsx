import React from 'react';
import { AlertCircle, MapPin, Maximize, Copy, Trash2 } from 'lucide-react';

interface SessionSidebarProps {
    salas: any[];
    selectedRoomId: string;
    onSelectRoom: (id: string) => void;
    sessions: any[];
    onRemoveSession: (id: string) => void;
    onDuplicateSession: (s: any) => void;
    // Props para o form manual
    newSession: any;
    setNewSession: (s: any) => void;
    onAddManual: () => void;
    onSelectFullDay: (date: string) => void;
}

export default function SessionSidebar({
                                           salas, selectedRoomId, onSelectRoom,
                                           sessions, onRemoveSession, onDuplicateSession,
                                           newSession, setNewSession, onAddManual, onSelectFullDay
                                       }: SessionSidebarProps) {

    return (
        <div className="w-full lg:w-1/3 flex flex-col gap-4 h-full">
            {/* 1. SELETOR DE SALA */}
            <div className={`p-4 rounded-xl shadow-md border-2 transition-colors ${!selectedRoomId ? 'bg-red-50 border-red-300 animate-pulse' : 'bg-slate-900 border-slate-900 text-white'}`}>
                <label className={`text-xs font-bold uppercase mb-2 block flex items-center gap-2 ${!selectedRoomId ? 'text-red-600' : 'text-slate-400'}`}>
                    {!selectedRoomId ? <AlertCircle size={14}/> : <MapPin size={14}/>}
                    1º Escolher Sala
                </label>
                <select
                    className={`w-full p-2 rounded-lg text-sm font-bold outline-none cursor-pointer ${!selectedRoomId ? 'bg-white text-slate-900' : 'bg-slate-800 border-slate-700'}`}
                    value={selectedRoomId}
                    onChange={e => onSelectRoom(e.target.value)}
                >
                    {salas.length === 0 && <option value="" disabled>Sem salas</option>}
                    {salas.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>

            {/* 2. FORMULÁRIO MANUAL */}
            <div className={`bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 ${!selectedRoomId ? 'opacity-50 pointer-events-none' : ''}`}>
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Inserção Manual</h3>
                <div className="space-y-3">
                    <input
                        type="text" placeholder="Nome (ex: Montagem)"
                        className="w-full p-2 text-sm border rounded-lg dark:bg-slate-800"
                        value={newSession.nome}
                        onChange={e => setNewSession({...newSession, nome: e.target.value})}
                    />

                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="date" className="p-2 text-sm border rounded-lg dark:bg-slate-800"
                            value={newSession.data}
                            onChange={e => setNewSession({...newSession, data: e.target.value})}
                        />
                        <button
                            onClick={() => onSelectFullDay(newSession.data)}
                            className="px-2 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 flex items-center justify-center gap-1"
                        >
                            <Maximize size={12}/> Dia Todo
                        </button>
                    </div>

                    <div className="flex gap-2 items-center bg-white dark:bg-slate-900 p-2 rounded border dark:border-slate-700">
                        <span className="text-xs font-bold text-slate-500 w-16">Horário:</span>
                        <span className="font-mono text-sm">{newSession.horaInicio}</span>
                        <span className="text-slate-300">-</span>
                        <span className="font-mono text-sm">{newSession.horaFim}</span>
                    </div>

                    <button onClick={onAddManual} className="w-full py-2 bg-slate-200 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-300 shadow-sm transition-transform active:scale-95">
                        Adicionar Manualmente
                    </button>
                </div>
            </div>

            {/* 3. LISTA */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar border-t pt-4 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Sessões ({sessions.length})</h4>
                {sessions.map((s: any) => (
                    <div key={s.id} className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-3 rounded-lg flex justify-between items-center group shadow-sm hover:border-red-200 transition-colors">
                        <div>
                            <div className="font-bold text-sm text-slate-800 dark:text-white">{s.nome}</div>
                            <div className="text-xs text-slate-500">{new Date(s.data).getDate()}/{new Date(s.data).getMonth()+1} • {s.horaInicio}-{s.horaFim}</div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => onDuplicateSession(s)} className="p-1.5 hover:text-blue-600 bg-slate-50 rounded"><Copy size={14}/></button>
                            <button onClick={() => onRemoveSession(s.id)} className="p-1.5 hover:text-red-600 bg-slate-50 rounded"><Trash2 size={14}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}