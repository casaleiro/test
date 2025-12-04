import React from 'react';
import { Projeto } from '@/app/types/projeto';

export default function TabLogistics({ project }: { project: Projeto }) {
    return (
        <div className="animate-in fade-in duration-300">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-6">Rider Técnico & Material</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-xs">
                    <tr>
                        <th className="p-3 rounded-l-lg">Item</th>
                        <th className="p-3">Categoria</th>
                        <th className="p-3 text-center">Qtd.</th>
                        <th className="p-3">Origem</th>
                        <th className="p-3 rounded-r-lg">Estado</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {project.listaMaterial?.map((item) => (
                        <tr key={item.id}>
                            <td className="p-3 font-medium text-slate-800 dark:text-white">{item.nome}</td>
                            <td className="p-3 text-slate-500">{item.categoria}</td>
                            <td className="p-3 text-center font-bold text-slate-700 dark:text-slate-300">{item.quantidade}</td>
                            <td className="p-3"><span className="text-xs border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded dark:text-slate-400">{item.origem}</span></td>
                            <td className="p-3">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                        item.estado === 'Reservado' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                        {item.estado}
                                    </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}