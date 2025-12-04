"use client";

import React from 'react';
import { X, Calendar, Clock, MapPin, Users, Package, AlertCircle } from 'lucide-react';
import { SessaoProjeto } from '@/app/types/projeto';
import { PessoasDummy } from '@/app/utils/data/peopleDummyData';
import { InventarioDummy } from '@/app/utils/data/inventoryDummyData';

interface ModalProps {
    session: SessaoProjeto | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function SessionDetailModal({ session, isOpen, onClose }: ModalProps) {
    if (!isOpen || !session) return null;

    // --- RESOLVER DADOS (Cruzamento de IDs) ---
    // Num cenário real, isto viria do backend (populate)
    const staff = PessoasDummy.filter(p => session.staffIds?.includes(p.id));
    const gear = InventarioDummy.filter(i => session.equipamentoIds?.includes(i.id));

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 pointer-events-auto flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">

                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                                    Sessão
                                </span>
                                <span className="text-slate-400 text-sm flex items-center gap-1">
                                    <MapPin size={14}/> {session.localId}
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{session.nome}</h2>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <X size={24} className="text-slate-500"/>
                        </button>
                    </div>

                    {/* Corpo Scrollável */}
                    <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">

                        {/* 1. Data e Hora */}
                        <div className="flex gap-6">
                            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex-1 border border-slate-100 dark:border-slate-700">
                                <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm text-slate-500">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Data</p>
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                        {new Date(session.data).toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex-1 border border-slate-100 dark:border-slate-700">
                                <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm text-slate-500">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Horário</p>
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                        {session.horaInicio} - {session.horaFim}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 2. Equipa Escalada */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase mb-4 flex items-center gap-2">
                                <Users size={16}/> Equipa Técnica ({staff.length})
                            </h3>

                            {staff.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {staff.map(pessoa => (
                                        <div key={pessoa.id} className="flex items-center gap-3 p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-300 transition-colors">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                                                {pessoa.fotoUrl && <img src={pessoa.fotoUrl} className="w-full h-full object-cover"/>}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 dark:text-white">{pessoa.nome} {pessoa.apelido}</p>
                                                <p className="text-xs text-slate-500">{pessoa.cargo}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-sm text-center">
                                    Nenhuma equipa alocada a esta sessão.
                                </div>
                            )}
                        </div>

                        {/* 3. Material Necessário */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase mb-4 flex items-center gap-2">
                                <Package size={16}/> Material Reservado ({gear.length})
                            </h3>

                            {gear.length > 0 ? (
                                <div className="space-y-2">
                                    {gear.map(item => (
                                        <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.nome}</span>
                                                <span className="text-xs bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">{item.marca}</span>
                                            </div>
                                            <span className="text-xs font-bold text-slate-500">
                                                {item.tipoControlo === 'Granel' ? 'Qtd: Variável' : '1 un.'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-sm text-center">
                                    Nenhum material específico reservado.
                                </div>
                            )}
                        </div>

                        {/* 4. Notas */}
                        {session.notas && (
                            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-900 dark:text-amber-100 text-sm">
                                <div className="flex items-center gap-2 font-bold mb-1">
                                    <AlertCircle size={14}/> Notas de Produção
                                </div>
                                {session.notas}
                            </div>
                        )}

                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl flex justify-end gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-white hover:shadow-sm rounded-lg text-sm font-medium transition-all">
                            Fechar
                        </button>
                        <button className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-bold hover:opacity-90">
                            Editar Sessão
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}