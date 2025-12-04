import React from 'react';
import { Projeto } from '@/app/types/projeto';

export default function TabOverview({ project }: { project: Projeto }) {
    const totalPrevisto = project.orcamento?.reduce((acc, item) => acc + item.previsto, 0) || 0;
    const totalGasto = project.orcamento?.reduce((acc, item) => acc + item.gasto, 0) || 0;
    const percentagem = totalPrevisto > 0 ? (totalGasto / totalPrevisto) * 100 : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
            <div className="md:col-span-2 space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Notas Recentes</h3>
                    <div className="p-4 bg-yellow-50 border border-yellow-100 text-yellow-800 rounded-lg text-sm">
                        <span className="font-bold block mb-1">Atenção ao Rider:</span>
                        Verificar se a planta de luz está atualizada com as novas varas.
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Próximas Sessões</h3>
                    <div className="space-y-2">
                        {project.sessoes?.slice(0,3).map((s, i) => (
                            <div key={i} className="flex items-center p-3 border rounded-lg bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700">
                                <div className="w-12 text-center font-bold text-slate-400 mr-4 border-r dark:border-slate-700 pr-4">
                                    {new Date(s.data).getDate()}
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-slate-800 dark:text-white">{s.nome}</div>
                                    <div className="text-xs text-slate-500">{s.horaInicio} - {s.horaFim} • {s.localId}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Progresso do Orçamento</h4>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
                        {totalGasto}€
                        <span className="text-sm font-normal text-slate-400 ml-1">/ {totalPrevisto}€</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                        <div
                            className={`h-2 rounded-full ${percentagem > 100 ? 'bg-red-500' : 'bg-green-500'}`}
                            style={{width: `${Math.min(percentagem, 100)}%`}}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}