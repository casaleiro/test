import React, { useEffect, useState } from 'react';
import { Clock, Save, X } from 'lucide-react';

interface SessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (desc: string, start: string, end: string) => void;
    initialDate: string;
    initialStart: string;
    initialEnd: string;
}

export default function SessionModal({ isOpen, onClose, onSave, initialDate, initialStart, initialEnd }: SessionModalProps) {
    const [description, setDescription] = useState("");
    const [startTime, setStartTime] = useState(initialStart);
    const [endTime, setEndTime] = useState(initialEnd);

    // Reseta os valores quando o modal abre
    useEffect(() => {
        if (isOpen) {
            setDescription("");
            setStartTime(initialStart);
            setEndTime(initialEnd);
        }
    }, [isOpen, initialStart, initialEnd]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!description.trim()) {
            alert("Por favor insira uma descrição.");
            return;
        }
        if (endTime <= startTime && !endTime.startsWith('0')) { // Validação simples
            alert("A hora de fim deve ser superior à de início.");
            return;
        }
        onSave(description, startTime, endTime);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md p-6 border dark:border-slate-800 scale-100 animate-in zoom-in-95 duration-200">

                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <Clock className="text-red-600" size={24}/>
                            Nova Sessão
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            {new Date(initialDate).toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                        <X size={20}/>
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                            Descrição <span className="text-red-500">*</span>
                        </label>
                        <input
                            autoFocus
                            type="text"
                            className="w-full border dark:border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:outline-none dark:bg-slate-800 font-medium"
                            placeholder="Ex: Montagem Luzes"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Início</label>
                            <input
                                type="time"
                                className="w-full border dark:border-slate-700 rounded-lg p-3 dark:bg-slate-800 font-mono text-sm"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fim</label>
                            <input
                                type="time"
                                className="w-full border dark:border-slate-700 rounded-lg p-3 dark:bg-slate-800 font-mono text-sm"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3 pt-4 border-t dark:border-slate-800">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg dark:text-slate-400 dark:hover:bg-slate-800">
                        Cancelar
                    </button>
                    <button onClick={handleSave} className="px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 font-bold text-sm shadow-lg shadow-red-500/30 flex items-center gap-2">
                        <Save size={16}/> Gravar
                    </button>
                </div>
            </div>
        </div>
    );
}