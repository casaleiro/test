// components/SpaceFormModal.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { SpaceItem} from "@/app/utils/data/teatroDummyData";
import { X, Save, MapPin, Users, Info, Building2, Wrench } from 'lucide-react';

interface SpaceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Se for nulo, estamos a criar. Se tiver dados, estamos a editar.
  initialData: SpaceItem | null;
  onSubmit: (space: SpaceItem) => void;
}

// Valores iniciais para um novo formulário
const defaultFormData: SpaceItem = {
  id: '', // Será gerado na submissão
  name: '',
  capacity: 0,
  type: 'Performance',
  status: 'Available',
  techNotes: '',
};

const SPACE_TYPES = ['Performance', 'Rehearsal', 'Exhibition', 'Technical'];

export default function SpaceFormModal({ isOpen, onClose, initialData, onSubmit }: SpaceFormModalProps) {
  const [formData, setFormData] = useState<SpaceItem>(defaultFormData);

  // Atualiza o formulário se os dados iniciais mudarem (para edição)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultFormData);
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!formData.name || formData.capacity <= 0 || !formData.techNotes) {
      alert('Por favor, preencha todos os campos obrigatórios (Nome, Lotação e Notas Técnicas).');
      return;
    }

    // Se estiver a criar, gera um ID (na vida real, seria gerado pelo backend)
    const spaceToSubmit: SpaceItem = initialData
      ? formData // Se for edição, mantém o ID
      : { ...formData, id: `sa-${Date.now()}` }; // Novo ID

    onSubmit(spaceToSubmit);
    onClose(); // Fecha o modal após submissão
  };

  const isEditing = initialData !== null;
  const title = isEditing ? `Editar Sala: ${initialData?.name}` : 'Criar Nova Sala/Espaço';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100 opacity-100">

        {/* Cabeçalho do Modal */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin size={24} className="text-red-700" /> {title}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={24} />
          </button>
        </div>

        {/* Corpo do Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Linha 1: Nome e Lotação */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1"><Building2 size={16} /> Nome da Sala</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Sala Principal ou Estúdio de Ensaio"
                required
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg focus:ring-red-500 focus:border-red-500 text-slate-900 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="capacity" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1"><Users size={16} /> Lotação Máxima (pax)</label>
              <input
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                value={formData.capacity > 0 ? formData.capacity : ''} // Evita mostrar 0 no input
                onChange={handleChange}
                placeholder="Capacidade"
                required
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg focus:ring-red-500 focus:border-red-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Linha 2: Tipo de Uso e Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="type" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1"><Info size={16} /> Tipo de Uso</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg focus:ring-red-500 focus:border-red-500 text-slate-900 dark:text-white"
              >
                {SPACE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label htmlFor="status" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1"><Wrench size={16} /> Status Inicial</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg focus:ring-red-500 focus:border-red-500 text-slate-900 dark:text-white"
              >
                <option value="Available">Disponível</option>
                <option value="Booked">Reservado (Uso Imediato)</option>
                <option value="Maintenance">Em Manutenção</option>
              </select>
            </div>
          </div>

          {/* Notas Técnicas */}
          <div className="space-y-1">
            <label htmlFor="techNotes" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1"><Wrench size={16} /> Notas Técnicas (Equipamento, Dimensões)</label>
            <textarea
              id="techNotes"
              name="techNotes"
              value={formData.techNotes}
              onChange={handleChange}
              rows={4}
              placeholder="Ex: Palco 15x10m, Tensão 220V, Piso flutuante, 48 dimmers."
              required
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg focus:ring-red-500 focus:border-red-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Rodapé e Botão de Submissão */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-red-700 text-white rounded-lg shadow-md hover:bg-red-800 transition-colors font-medium"
            >
              <Save size={20} /> {isEditing ? 'Guardar Alterações' : 'Criar Sala'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}