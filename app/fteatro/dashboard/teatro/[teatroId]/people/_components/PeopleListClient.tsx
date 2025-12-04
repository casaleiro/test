"use client";

import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, User, MoreVertical } from 'lucide-react';
import { PessoasDummy } from '@/app/utils/data/peopleDummyData';
import { Pessoa, Departamento } from '@/app/types/pessoas';
import PersonDetailDrawer from './PersonDetailDrawer';

export default function PeopleListClient() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDep, setSelectedDep] = useState<string>('Todos');

    // ESTADOS DO DRAWER
    const [selectedPerson, setSelectedPerson] = useState<Pessoa | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const DEPARTAMENTOS = ['Todos', 'Producao', 'Som', 'Luz', 'Palco', 'Maquinaria', 'Video', 'FrenteDeSala'];

    const filteredPeople = useMemo(() => {
        return PessoasDummy.filter(pessoa => {
            const matchesSearch =
                pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pessoa.apelido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pessoa.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDep = selectedDep === 'Todos' || pessoa.departamentos.includes(selectedDep as Departamento);
            return matchesSearch && matchesDep;
        });
    }, [searchTerm, selectedDep]);

    // 1. ABRIR PARA CRIAR (Botão Topo)
    const handleAddPerson = () => {
        setSelectedPerson(null); // Importante: null para formulário vazio
        setIsEditMode(true);     // Importante: true para mostrar o formulário
        setIsDrawerOpen(true);
    };

    // 2. ABRIR PARA VER (Clique na Linha)
    const handleRowClick = (pessoa: Pessoa) => {
        setSelectedPerson(pessoa);
        setIsEditMode(false);    // Importante: false para mostrar detalhes
        setIsDrawerOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Equipa e Colaboradores</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Gere os técnicos, produtores e staff externo.</p>
                </div>

                {/* BOTÃO ADICIONAR */}
                <button
                    onClick={handleAddPerson}
                    className="bg-red-700 hover:bg-red-800 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-colors"
                >
                    <Plus size={20} />
                    <span className="hidden sm:inline">Adicionar Pessoa</span>
                    <span className="sm:hidden">Novo</span>
                </button>
            </div>

            {/* Filtros */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Pesquisar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-red-500"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter size={18} className="text-slate-400 hidden md:block" />
                    <select
                        value={selectedDep}
                        onChange={(e) => setSelectedDep(e.target.value)}
                        className="w-full md:w-48 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-red-500 cursor-pointer"
                    >
                        {DEPARTAMENTOS.map(dep => (
                            <option key={dep} value={dep}>{dep === 'Todos' ? 'Todos os Departamentos' : dep}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Tabela */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs uppercase text-slate-500 font-semibold">
                            <th className="px-6 py-4">Nome</th>
                            <th className="px-6 py-4">Cargo</th>
                            <th className="px-6 py-4">Contacto</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredPeople.map((pessoa) => (
                            <tr
                                key={pessoa.id}
                                onClick={() => handleRowClick(pessoa)}
                                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                                            {pessoa.fotoUrl ? <img src={pessoa.fotoUrl} className="w-full h-full object-cover"/> : <User size={18} className="text-slate-400"/>}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white">{pessoa.nome} {pessoa.apelido}</p>
                                            <p className="text-xs text-slate-500">{pessoa.tipo}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{pessoa.cargo}</td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{pessoa.telemovel}</td>
                                <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${pessoa.estado === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {pessoa.estado}
                                        </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 text-slate-400 hover:text-slate-600"><MoreVertical size={18} /></button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <PersonDetailDrawer
                person={selectedPerson}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                isEditingMode={isEditMode}
                onSave={(data) => {
                    console.log("Salvo:", data);
                    setIsDrawerOpen(false);
                }}
            />
        </div>
    );
}