import React from 'react';

export default function StatusBadge({ status }: { status: string }) {
    const styles = {
        'Rascunho': 'bg-slate-100 text-slate-500 border-slate-200',
        'Pendente': 'bg-amber-50 text-amber-700 border-amber-200',
        'Confirmado': 'bg-green-50 text-green-700 border-green-200',
        'A Decorrer': 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse',
        'Cancelado': 'bg-red-50 text-red-700 border-red-200 line-through',
        'Terminado': 'bg-slate-100 text-slate-900 border-slate-300',
    };

    const style = styles[status as keyof typeof styles] || styles['Rascunho'];

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${style}`}>
            {status}
        </span>
    );
}