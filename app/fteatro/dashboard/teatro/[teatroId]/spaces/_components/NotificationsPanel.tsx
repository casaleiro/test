"use client";

import React from 'react';
import { Bell, AlertCircle, CheckCircle, Info, Mail, CheckCheck, ChevronRight } from 'lucide-react';

interface NotificationsPanelProps {
  notifications: any[];
  onOpenNotification: (notification: any) => void;
  onMarkRead: (id: number) => void;
  onReply: (id: number) => void;
}

export default function NotificationsPanel({ notifications, onOpenNotification, onMarkRead, onReply }: NotificationsPanelProps) {

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="bg-slate-900 border-b border-slate-800 flex-shrink-0 z-30 shadow-md">
      <div className="max-w-[1920px] mx-auto p-4 flex flex-col xl:flex-row gap-6 items-start">

        {/* 1. CABEÇALHO DA SECÇÃO (Fica à esquerda em ecrãs grandes) */}
        <div className="flex xl:flex-col items-center xl:items-start justify-between xl:justify-center min-w-[220px] w-full xl:w-auto gap-4">
          <div>
            <div className="flex items-center gap-2 font-bold text-sm text-white mb-1">
              <div className="relative">
                <Bell size={20} className="text-red-500" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border border-slate-900"></span>
                )}
              </div>
              <span className="tracking-wide">NOTIFICAÇÕES</span>
            </div>
            <p className="text-xs text-slate-400">Tens {unreadCount} mensagens novas.</p>
          </div>

          {/* Botão extra para limpar tudo ou ver histórico (opcional) */}
          <button className="text-[10px] text-slate-500 hover:text-white underline transition-colors">
            Ver Histórico
          </button>
        </div>

        {/* 2. LISTA VERTICAL DE NOTIFICAÇÕES */}
        <div className="flex-1 w-full">
          {/* max-h-[140px] limita a altura a aprox 2 notificações e meia.
                       overflow-y-auto permite fazer scroll dentro desta caixinha se houverem muitas.
                    */}
          <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
            {notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => onOpenNotification(notif)}
                className={`
                                    relative group flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all duration-200
                                    ${notif.read
                  ? 'bg-slate-800/30 border-slate-700/30 opacity-60 hover:opacity-100'
                  : 'bg-slate-800 border-slate-700 hover:border-slate-500 hover:bg-slate-700'
                }
                                `}
              >
                {/* Ícone */}
                <div className={`p-1.5 rounded-full flex-shrink-0 ${
                  notif.type === 'alert' ? 'bg-red-500/10 text-red-500' :
                    notif.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {notif.type === 'alert' ? <AlertCircle size={16}/> : notif.type === 'success' ? <CheckCircle size={16}/> : <Info size={16}/>}
                </div>

                {/* Texto */}
                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="min-w-0">
                    <p className={`text-xs font-bold truncate ${notif.read ? 'text-slate-400' : 'text-slate-200'}`}>
                      {notif.title} <span className="font-normal text-slate-500 mx-1">-</span> <span className="font-normal text-slate-400">{notif.msg}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[9px] text-slate-500 whitespace-nowrap">{notif.time}</span>
                    {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                  </div>
                </div>

                {/* Ações Rápidas (Só aparecem no Hover) */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 pl-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); onReply(notif.id); }}
                    className="p-1.5 bg-slate-600 hover:bg-blue-600 text-white rounded shadow-sm"
                    title="Responder"
                  >
                    <Mail size={12}/>
                  </button>
                  {!notif.read && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onMarkRead(notif.id); }}
                      className="p-1.5 bg-slate-600 hover:bg-green-600 text-white rounded shadow-sm"
                      title="Marcar como lida"
                    >
                      <CheckCheck size={12}/>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}