"use client";

import React from 'react';
import { X, User, Paperclip, MessageSquare, Check, Calendar, Clock } from 'lucide-react';

interface NotificationModalProps {
  notification: any; // Podes tipar melhor com a interface Notification
  isOpen: boolean;
  onClose: () => void;
  onReply: (id: number) => void;
  onMarkRead: (id: number) => void;
}

export default function NotificationModal({ notification, isOpen, onClose, onReply, onMarkRead }: NotificationModalProps) {
  if (!isOpen || !notification) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">

        {/* Header com Cor do Tipo */}
        <div className={`p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start ${
          notification.type === 'alert' ? 'bg-red-50 dark:bg-red-900/20' :
            notification.type === 'success' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-blue-50 dark:bg-blue-900/20'
        }`}>
          <div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                          notification.type === 'alert' ? 'bg-red-100 text-red-700' :
                            notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                            {notification.type === 'alert' ? 'Atenção' : notification.type === 'success' ? 'Financeiro' : 'Informação'}
                        </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-3">{notification.title}</h3>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-1"><Clock size={12}/> {notification.time}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><User size={12}/> {notification.sender}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <X size={20} className="text-slate-500"/>
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-6 overflow-y-auto">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm mb-6">
            {notification.fullDetails}
          </p>

          {/* Área de Anexo / Foto */}
          {notification.attachment && (
            <div className="mb-6">
              <p className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                <Paperclip size={12}/> Anexo
              </p>
              <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                {/* Simulação de Imagem - Podes usar Image do Next.js aqui */}
                <img
                  src={notification.attachment}
                  alt="Anexo da notificação"
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="p-2 text-xs text-center text-slate-500 italic border-t border-slate-200 dark:border-slate-700">
                  Evidência fotográfica anexada pelo técnico.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé com Ações */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
          {!notification.read && (
            <button
              onClick={() => { onMarkRead(notification.id); onClose(); }}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors"
            >
              <Check size={16} /> Marcar como Lida
            </button>
          )}
          <button
            onClick={() => { onReply(notification.id); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <MessageSquare size={16} /> Responder
          </button>
        </div>
      </div>
    </div>
  );
}