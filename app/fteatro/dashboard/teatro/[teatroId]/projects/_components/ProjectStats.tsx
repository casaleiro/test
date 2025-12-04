import React from 'react';
import { Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function ProjectStats() {
    // Num cenário real, estes números viriam calculados das props
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <Calendar size={24} />
                </div>
                <div>
                    <p className="text-xs text-slate-500 font-bold uppercase">Este Mês</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">12</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                    <CheckCircle size={24} />
                </div>
                <div>
                    <p className="text-xs text-slate-500 font-bold uppercase">A Decorrer</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">3</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                    <Clock size={24} />
                </div>
                <div>
                    <p className="text-xs text-slate-500 font-bold uppercase">Pendentes</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">5</p>
                </div>
            </div>

            {/* Exemplo de métrica de conflito */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                    <AlertCircle size={24} />
                </div>
                <div>
                    <p className="text-xs text-slate-500 font-bold uppercase">Conflitos</p>
                    <p className="text-2xl font-bold text-red-600">1</p>
                </div>
            </div>
        </div>
    );
}