"use client";

import React, { useState, useEffect } from 'react';
import { X, Phone, Mail, User, Edit, Trash2 } from 'lucide-react';
import { Pessoa } from '@/app/types/pessoas';
import PersonCalendar from './PersonCalendar';
import PersonForm from './PersonForm';

interface PersonDetailDrawerProps {
    person: Pessoa | null;
    isOpen: boolean;
    onClose: () => void;
    isEditingMode?: boolean; // Recebe ordem do pai para abrir logo a editar
    onSave?: (data: Partial<Pessoa>) => void;
}

const ESTADO_COLORS: Record<string, string> = {
    'Ativo': 'bg-green-100 text-green-700',
    'Inativo': 'bg-slate-100 text-slate-500',
    'Bloqueado': 'bg-red-100 text-red-700'
};

export default function PersonDetailDrawer({
                                               person, isOpen, onClose, isEditingMode = false, onSave
                                           }: PersonDetailDrawerProps) {

    // Estado local para alternar entre ver/editar
    const [isEditing, setIsEditing] = useState(isEditingMode);

    // Sincroniza sempre que o pai mandar abrir ou mudar o modo
    useEffect(() => {
        setIsEditing(isEditingMode);
    }, [isOpen, isEditingMode, person]);

    if (!isOpen) return null;

    // --- RENDERIZAÇÃO ---
    return (
        <>
            {/* Overlay Escuro (Fundo) */}
            <div
                className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
                onClick={onClose}
            />

            {/* Painel Deslizante */}
            <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out translate-x-0`}>

                {/* === CENÁRIO A: MODO EDIÇÃO OU NOVA PESSOA === */}
                {isEditing ? (
                    <div className="h-full flex flex-col bg-white dark:bg-slate-900">
                        {/* Header Edição */}
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                                {person ? 'Editar Perfil' : 'Nova Pessoa'}
                            </h2>
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                        </div>

                        {/* Formulário */}
                        <PersonForm
                            initialData={person}
                            onSave={(data) => {
                                if (onSave) onSave(data);
                                onClose(); // Fecha após guardar
                            }}
                            onCancel={() => {
                                // Se é nova pessoa, fecha tudo. Se é edição, volta aos detalhes.
                                if (!person) onClose();
                                else setIsEditing(false);
                            }}
                        />
                    </div>
                ) : (
                    // === CENÁRIO B: MODO VISUALIZAÇÃO (Só aparece se person existir) ===
                    person ? (
                        <div className="h-full flex flex-col bg-white dark:bg-slate-900">

                            {/* Header Visual (Foto e Nome) */}
                            <div className="relative h-44 bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col justify-end p-6 flex-shrink-0">
                                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"><X size={20}/></button>

                                <div className="flex items-end gap-4 translate-y-8">
                                    <div className="w-24 h-24 rounded-xl bg-white dark:bg-slate-800 p-1 shadow-lg flex-shrink-0">
                                        {person.fotoUrl ? (
                                            <img src={person.fotoUrl} alt={person.nome} className="w-full h-full object-cover rounded-lg" />
                                        ) : (
                                            <div className="w-full h-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400"><User size={40}/></div>
                                        )}
                                    </div>
                                    <div className="mb-2 min-w-0">
                                        <h2 className="text-xl font-bold text-white leading-tight truncate">{person.nome} {person.apelido}</h2>
                                        <span className="text-slate-300 text-sm truncate block">{person.cargo}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Corpo dos Detalhes (Scrollável) */}
                            <div className="pt-12 px-6 pb-6 overflow-y-auto flex-1">
                                <div className="flex justify-between items-center mb-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${ESTADO_COLORS[person.estado]}`}>{person.estado}</span>

                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-slate-500 hover:text-red-600 flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition-colors"
                                    >
                                        <Edit size={16} /> Editar
                                    </button>
                                </div>

                                {/* Contactos */}
                                <div className="grid grid-cols-1 gap-3 mb-6">
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                                        <Mail size={16} className="text-slate-400"/>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{person.email}</span>
                                    </div>
                                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                                        <Phone size={16} className="text-slate-400"/>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{person.telemovel}</span>
                                    </div>
                                </div>

                                {/* Departamentos */}
                                <div className="mb-6">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Departamentos</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {person.departamentos.map(dep => (
                                            <span key={dep} className="px-2.5 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-medium rounded-md border border-blue-100 dark:border-blue-800">
                                                {dep}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Calendário */}
                                <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">Agenda</h3>
                                    <PersonCalendar />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-10 text-center text-slate-500">Erro: Nenhuma pessoa selecionada.</div>
                    )
                )}
            </div>
        </>
    );
}