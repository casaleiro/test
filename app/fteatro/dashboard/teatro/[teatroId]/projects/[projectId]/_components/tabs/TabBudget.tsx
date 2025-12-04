import React from 'react';
import { Projeto } from '@/app/types/projeto';

export default function TabBudget({ project }: { project: Projeto }) {
    const totalPrevisto = project.orcamento?.reduce((a,b)=>a+b.previsto,0) || 0;
    const totalGasto = project.orcamento?.reduce((a,b)=>a+b.gasto,0) || 0;

    return (
        <div className="animate-in fade-in duration-300">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-6">Orçamento Estimado</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-xs">
                    <tr>
                        <th className="p-3 rounded-l-lg">Descrição</th>
                        <th className="p-3">Categoria</th>
                        <th className="p-3 text-right">Previsto</th>
                        <th className="p-3 text-right">Real</th>
                        <th className="p-3 rounded-r-lg">Estado</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {project.orcamento?.map((item) => (
                        <tr key={item.id}>
                            <td className="p-3 font-medium text-slate-800 dark:text-white">{item.descricao}</td>
                            <td className="p-3 text-slate-500">{item.categoria}</td>
                            <td className="p-3 text-right font-mono text-slate-700 dark:text-slate-300">{item.previsto}€</td>
                            <td className={`p-3 text-right font-mono font-bold ${item.gasto > item.previsto ? 'text-red-600' : 'text-green-600'}`}>{item.gasto}€</td>
                            <td className="p-3">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                        item.estado === 'Pago' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {item.estado}
                                    </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot className="border-t-2 border-slate-200 dark:border-slate-700 font-bold bg-slate-50 dark:bg-slate-900">
                    <tr>
                        <td className="p-3 text-slate-800 dark:text-white" colSpan={2}>Total</td>
                        <td className="p-3 text-right text-slate-800 dark:text-white">{totalPrevisto}€</td>
                        <td className="p-3 text-right text-slate-800 dark:text-white">{totalGasto}€</td>
                        <td></td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}