"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Pessoa, Departamento } from '@/app/types/pessoas';
import { Save, User, Camera, Trash2 } from 'lucide-react';

interface PersonFormProps {
    initialData?: Pessoa | null;
    onSave: (data: Partial<Pessoa>) => void;
    onCancel: () => void;
}

const DEPARTAMENTOS_OPCOES: Departamento[] = ['Som', 'Luz', 'Video', 'Palco', 'Maquinaria', 'Producao', 'FrenteDeSala', 'Limpeza', 'Seguranca'];

export default function PersonForm({ initialData, onSave, onCancel }: PersonFormProps) {
    const [formData, setFormData] = useState<Partial<Pessoa>>({
        nome: '', apelido: '', email: '', telemovel: '', tipo: 'PrestadorServico', departamentos: [], cargo: '', estado: 'Ativo', nif: '', fotoUrl: ''
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) setFormData(initialData);
    }, [initialData]);

    const handleChange = (field: keyof Pessoa, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleDepartment = (dep: Departamento) => {
        setFormData(prev => {
            const current = prev.departamentos || [];
            return current.includes(dep) ? { ...prev, departamentos: current.filter(d => d !== dep) } : { ...prev, departamentos: [...current, dep] };
        });
    };

    // Simulação de Upload de Imagem
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Cria um URL temporário para mostrar a imagem imediatamente (Preview)
            const objectUrl = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, fotoUrl: objectUrl }));
        }
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, fotoUrl: '' }));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* --- 1. FOTO DE PERFIL --- */}
                <div className="flex flex-col items-center gap-3">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center">
                            {formData.fotoUrl ? (
                                <img src={formData.fotoUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <User size={40} className="text-slate-400" />
                            )}
                        </div>

                        {/* Botão de Upload (Sobreposto) */}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors"
                            title="Alterar foto"
                        >
                            <Camera size={14} />
                        </button>
                    </div>

                    {/* Botão Remover */}
                    {formData.fotoUrl && (
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                        >
                            <Trash2 size={12} /> Remover foto
                        </button>
                    )}

                    {/* Input Escondido */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

                {/* --- 2. DADOS PESSOAIS --- */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Nome</label>
                        <input required type="text" value={formData.nome} onChange={e => handleChange('nome', e.target.value)} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Apelido</label>
                        <input required type="text" value={formData.apelido} onChange={e => handleChange('apelido', e.target.value)} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm" />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Email</label>
                        <input required type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">Telemóvel</label>
                        <input required type="tel" value={formData.telemovel} onChange={e => handleChange('telemovel', e.target.value)} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm" />
                    </div>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

                {/* --- 3. DADOS PROFISSIONAIS --- */}
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500">Vínculo</label>
                            <select
                                value={formData.tipo}
                                onChange={e => handleChange('tipo', e.target.value)}
                                className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm"
                            >
                                <option value="Interno">Staff Interno</option>
                                <option value="PrestadorServico">Freelancer</option>
                                <option value="Agencia">Agência</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500">Cargo</label>
                            <input type="text" value={formData.cargo} onChange={e => handleChange('cargo', e.target.value)} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm" placeholder="ex: Técnico de Som" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500">Departamentos</label>
                        <div className="flex flex-wrap gap-2">
                            {DEPARTAMENTOS_OPCOES.map(dep => (
                                <button key={dep} type="button" onClick={() => toggleDepartment(dep)} className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${formData.departamentos?.includes(dep) ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                    {dep}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Rodapé */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-3">
                <button type="button" onClick={onCancel} className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 text-sm">Cancelar</button>
                <button type="submit" className="flex-1 py-2.5 bg-red-700 text-white rounded-lg font-medium hover:bg-red-800 text-sm flex items-center justify-center gap-2"><Save size={18} /> Guardar</button>
            </div>
        </form>
    );
}