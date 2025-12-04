"use client";

import React, { useState } from 'react';
import SpaceFormModal from '@/app/fteatro/components/SpaceFormModal';
import { SpaceItem } from "@/app/utils/data/teatroDummyData";
// Importa os novos componentes
import NotificationsPanel from './NotificationsPanel';
import NotificationModal from './NotificationModal';
import CalendarControls from './CalendarControls';
import TimelineGrid from './TimelineGrid';

interface SpacesClientContentProps {
  teatroId: string;
  teatroName: string;
  initialSpaces: SpaceItem[];
}

// ⚠️ DADOS DE NOTIFICAÇÕES MELHORADOS
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'alert',
    title: 'Manutenção Urgente',
    msg: 'Projetor da Sala Principal reportou falha.',
    fullDetails: 'O projetor Christie da Sala Principal começou a piscar durante o ensaio da manhã. O código de erro sugere sobreaquecimento ou fim de vida da lâmpada. Requer intervenção imediata antes do espetáculo de Sábado.',
    time: '10 min',
    sender: 'João Técnico',
    read: false,
    attachment: 'https://images.unsplash.com/photo-1517523230415-4ae71aa95922?q=80&w=2835&auto=format&fit=crop' // Foto dummy
  },
  {
    id: 2,
    type: 'info',
    title: 'Nova Reserva Pendente',
    msg: 'Teatro Livre pediu o Estúdio p/ dia 12.',
    fullDetails: 'A companhia "Teatro Livre" submeteu um pedido para usar o Estúdio de Dança no dia 12 de Dezembro, das 14h às 18h, para um casting. Aguarda aprovação da direção.',
    time: '1h',
    sender: 'Sistema de Reservas',
    read: false,
    attachment: null
  },
  {
    id: 3,
    type: 'success',
    title: 'Pagamento Recebido',
    msg: 'Aluguer da Sala Multiusos liquidado.',
    fullDetails: 'O pagamento referente à fatura #FT-2024-003 (Câmara Municipal - Exposição de Fotografia) foi confirmado na conta bancária.',
    time: '3h',
    sender: 'Departamento Financeiro',
    read: true, // Já lida
    attachment: null
  },
];

// Configurações de Cores
const EVENT_COLORS: Record<string, string> = {
  'Technical': 'bg-gray-600 text-white border-gray-700',
  'Rehearsal': 'bg-blue-600 text-white border-blue-700',
  'Performance': 'bg-red-600 text-white border-red-700 shadow-md',
  'Maintenance': 'bg-amber-500 text-white border-amber-600',
  'Event': 'bg-purple-600 text-white border-purple-700',
  'Workshop': 'bg-emerald-600 text-white border-emerald-700',
  'Exhibition': 'bg-pink-600 text-white border-pink-700',
};

const ROOM_COLORS = [
  { bg: 'bg-red-500', bgLight: 'bg-red-50' },
  { bg: 'bg-blue-500', bgLight: 'bg-blue-50' },
  { bg: 'bg-emerald-500', bgLight: 'bg-emerald-50' },
  { bg: 'bg-amber-500', bgLight: 'bg-amber-50' },
  { bg: 'bg-purple-500', bgLight: 'bg-purple-50' }
];

export default function SpacesClientContent({ teatroId, teatroName, initialSpaces }: SpacesClientContentProps) {
  // Estado do Calendário
  const [currentDate, setCurrentDate] = useState(new Date());
  const [zoomLevel, setZoomLevel] = useState(0.5);
  const [daysToShow, setDaysToShow] = useState(3);

  // Estado das Notificações
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [selectedNotification, setSelectedNotification] = useState<any>(null); // Para o modal

  // --- HANDLERS DE NOTIFICAÇÕES ---
  const handleMarkRead = (id: number) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleReply = (id: number) => {
    alert(`Abrir caixa de resposta para a notificação #${id}`);
    // Aqui abririas outro modal ou redirecionarias para o chat
  };

  const handleOpenNotification = (notif: any) => {
    setSelectedNotification(notif);
    // Opcional: Marcar como lida automaticamente ao abrir
    // handleMarkRead(notif.id);
  };

  // --- HANDLERS DE CALENDÁRIO ---
  const handleNextPeriod = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + daysToShow);
    setCurrentDate(d);
  };

  const handlePrevPeriod = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - daysToShow);
    setCurrentDate(d);
  };

  const handleGoToToday = () => setCurrentDate(new Date());

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] bg-slate-50 dark:bg-slate-950 pb-4 overflow-hidden">

      {/* 1. Painel de Notificações (Lista Interativa) */}
      <NotificationsPanel
        notifications={notifications}
        onOpenNotification={handleOpenNotification}
        onMarkRead={handleMarkRead}
        onReply={handleReply}
      />

      {/* 2. Controlos do Calendário */}
      <CalendarControls
        teatroName={teatroName}
        currentDate={currentDate}
        daysToShow={daysToShow}
        zoomLevel={zoomLevel}
        spaces={initialSpaces}
        roomColors={ROOM_COLORS}
        onNextPeriod={handleNextPeriod}
        onPrevPeriod={handlePrevPeriod}
        onGoToToday={handleGoToToday}
        onZoomChange={setZoomLevel}
        onDaysChange={setDaysToShow}
      />

      {/* 3. Grelha do Calendário */}
      <TimelineGrid
        currentDate={currentDate}
        daysToShow={daysToShow}
        zoomLevel={zoomLevel}
        spaces={initialSpaces}
        roomColors={ROOM_COLORS}
        eventColors={EVENT_COLORS}
      />

      {/* Modais */}
      <SpaceFormModal isOpen={false} onClose={()=>{}} initialData={null} onSubmit={()=>{}} />

      {/* ⚠️ MODAL DE DETALHE DA NOTIFICAÇÃO */}
      <NotificationModal
        isOpen={!!selectedNotification}
        notification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
        onMarkRead={handleMarkRead}
        onReply={handleReply}
      />
    </div>
  );
}