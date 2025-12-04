"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Package,
  Check,
  Plus,
  Minus,
  Search,
  AlertCircle,
  Info,
  Filter,
  Link as LinkIcon,
  Copy,
  X,
} from "lucide-react";
import { PessoasDummy } from "@/app/utils/data/peopleDummyData";

// --- MOCK DATA ---
const EquipamentosDummy = [
  { id: "eq-1", name: "Microfone Shure SM58", type: "Som", totalStock: 10 },
  { id: "eq-2", name: "Projetor Laser 10k", type: "Vídeo", totalStock: 2 },
  { id: "eq-3", name: "Mesa de Luz GrandMA", type: "Luz", totalStock: 1 },
  { id: "eq-4", name: "Cadeira de Orquestra", type: "Palco", totalStock: 50 },
  { id: "eq-5", name: "Walkie Talkie", type: "Comunicação", totalStock: 12 },
  { id: "eq-6", name: "Cabo XLR 10m", type: "Som", totalStock: 30 },
];

export default function StepResources({ data, updateData }: any) {
  // --- SAFETY CHECK ---
  const safeSessions = data?.sessoes || [];

  // --- ESTADOS ---
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const [activeMode, setActiveMode] = useState<"staff" | "equipment">("staff");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // Estados para o Modal de "Copiar/Vincular"
  const [pendingSessionId, setPendingSessionId] = useState<string | null>(null);
  const [showCopyModal, setShowCopyModal] = useState(false);

  // --- HELPERS LÓGICOS ---
  const timeToDec = (t: string) => {
    if (!t) return 0;
    const [h, m] = t.split(":").map(Number);
    return h + m / 60;
  };

  // --- LÓGICA DE SELEÇÃO DE SESSÃO (COM INTERCEÇÃO) ---
  const handleSessionClick = (targetId: string) => {
    if (selectedSessionId === targetId) {
      setSelectedSessionId(null);
      return;
    }

    if (!selectedSessionId) {
      setSelectedSessionId(targetId);
      return;
    }

    const sourceSession = safeSessions.find(
      (s: any) => s.id === selectedSessionId
    );
    const targetSession = safeSessions.find((s: any) => s.id === targetId);

    const sourceHasData =
      sourceSession?.staffIds?.length > 0 ||
      sourceSession?.equipamentoIds?.length > 0;
    const targetIsEmpty =
      !targetSession?.staffIds?.length &&
      !targetSession?.equipamentoIds?.length;

    if (sourceHasData && targetIsEmpty) {
      setPendingSessionId(targetId);
      setShowCopyModal(true);
    } else {
      setSelectedSessionId(targetId);
    }
  };

  // --- LÓGICA DE COPIAR / VINCULAR ---
  const handleCopyDecision = (type: "none" | "copy" | "link") => {
    if (!selectedSessionId || !pendingSessionId) return;

    const sourceSession = safeSessions.find(
      (s: any) => s.id === selectedSessionId
    );
    let updatedSessions = [...safeSessions];

    if (type === "copy") {
      updatedSessions = updatedSessions.map((s) => {
        if (s.id === pendingSessionId) {
          return {
            ...s,
            staffIds: [...sourceSession.staffIds],
            equipamentoIds: [...sourceSession.equipamentoIds],
            resourceGroupId: null,
          };
        }
        return s;
      });
    } else if (type === "link") {
      const groupId = sourceSession.resourceGroupId || `group-${Date.now()}`;
      updatedSessions = updatedSessions.map((s) => {
        if (s.id === selectedSessionId) {
          return { ...s, resourceGroupId: groupId };
        }
        if (s.id === pendingSessionId) {
          return {
            ...s,
            staffIds: [...sourceSession.staffIds],
            equipamentoIds: [...sourceSession.equipamentoIds],
            resourceGroupId: groupId,
          };
        }
        return s;
      });
    }

    updateData({ ...data, sessoes: updatedSessions });
    setSelectedSessionId(pendingSessionId);
    setShowCopyModal(false);
    setPendingSessionId(null);
  };

  // --- DISPONIBILIDADE ---
  const getStaffState = (personId: string) => {
    if (!selectedSessionId)
      return { available: true, reason: "", isSelected: false };

    const currentSession = safeSessions.find(
      (s: any) => s.id === selectedSessionId
    );
    if (!currentSession)
      return { available: true, reason: "", isSelected: false };

    const isSelected = currentSession.staffIds?.includes(personId);

    const conflict = safeSessions.find((s: any) => {
      if (s.id === selectedSessionId) return false;
      if (
        currentSession.resourceGroupId &&
        s.resourceGroupId === currentSession.resourceGroupId
      )
        return false;
      if (!s.staffIds?.includes(personId)) return false;
      if (s.data !== currentSession.data) return false;

      const tStart = timeToDec(currentSession.horaInicio);
      const tEnd = timeToDec(currentSession.horaFim);
      const sStart = timeToDec(s.horaInicio);
      const sEnd = timeToDec(s.horaFim);
      return tStart < sEnd && tEnd > sStart;
    });

    if (conflict) {
      return {
        available: false,
        reason: `Ocupado na sessão "${conflict.nome}"`,
        isSelected,
      };
    }
    return { available: true, reason: "", isSelected };
  };

  const getEquipmentState = (eqId: string, totalStock: number) => {
    if (!selectedSessionId)
      return { maxStock: 0, reason: "", currentAssigned: 0 };

    const currentSession = safeSessions.find(
      (s: any) => s.id === selectedSessionId
    );
    if (!currentSession) return { maxStock: 0, reason: "", currentAssigned: 0 };

    const currentAssigned =
      currentSession.equipamentoIds?.filter((id: string) => id === eqId)
        .length || 0;

    let usedGloballyAtTime = 0;
    const tStart = timeToDec(currentSession.horaInicio);
    const tEnd = timeToDec(currentSession.horaFim);

    safeSessions.forEach((s: any) => {
      if (s.id === selectedSessionId) return;
      if (s.data !== currentSession.data) return;
      const sStart = timeToDec(s.horaInicio);
      const sEnd = timeToDec(s.horaFim);

      if (tStart < sEnd && tEnd > sStart) {
        const count =
          s.equipamentoIds?.filter((id: string) => id === eqId).length || 0;
        usedGloballyAtTime += count;
      }
    });

    const availableHere = totalStock - usedGloballyAtTime;

    return {
      maxStock: Math.max(0, availableHere),
      reason: "",
      currentAssigned,
    };
  };

  // --- UPDATE DATA ---
  const updateSessionData = (updater: (session: any) => any) => {
    if (!selectedSessionId) return;
    const currentSession = safeSessions.find(
      (s: any) => s.id === selectedSessionId
    );
    const groupId = currentSession?.resourceGroupId;

    const newSessions = safeSessions.map((s: any) => {
      if (
        s.id === selectedSessionId ||
        (groupId && s.resourceGroupId === groupId)
      ) {
        return updater(s);
      }
      return s;
    });
    updateData({ ...data, sessoes: newSessions });
  };

  const handleToggleStaff = (personId: string, available: boolean) => {
    if (!available) return;
    updateSessionData((s) => {
      let newStaff = [...(s.staffIds || [])];
      if (newStaff.includes(personId)) {
        newStaff = newStaff.filter((id) => id !== personId);
      } else {
        newStaff.push(personId);
      }
      return { ...s, staffIds: newStaff };
    });
  };

  const handleUpdateQuantity = (eqId: string, delta: number) => {
    updateSessionData((s) => {
      let newEquip = [...(s.equipamentoIds || [])];
      if (delta > 0) {
        newEquip.push(eqId);
      } else {
        const index = newEquip.indexOf(eqId);
        if (index > -1) newEquip.splice(index, 1);
      }
      return { ...s, equipamentoIds: newEquip };
    });
  };

  // --- FILTROS (CORRIGIDO) ---
  const categories = useMemo(() => {
    const source = activeMode === "staff" ? PessoasDummy : EquipamentosDummy;
    const key = activeMode === "staff" ? "cargo" : "type";
    // @ts-ignore
    const unique = [...new Set(source.map((item) => item[key]))];
    return ["Todos", ...unique];
  }, [activeMode]);

  // FILTRO PARA PESSOAS
  const filteredStaff = useMemo(() => {
    return PessoasDummy.filter((p) => {
      const matchesSearch = (p.nome || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "Todos" || p.cargo === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // FILTRO PARA EQUIPAMENTO
  const filteredEquip = useMemo(() => {
    return EquipamentosDummy.filter((e) => {
      const matchesSearch = (e.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "Todos" || e.type === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // --- RENDER ---
  return (
    <div className="flex gap-6 h-[650px] animate-in slide-in-from-right-4 relative">
      {/* --- MODAL COPY --- */}
      {showCopyModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-xl">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-2xl w-[400px] border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
            <h3 className="text-lg font-bold mb-2 text-slate-800 dark:text-white">
              Sessão Vazia
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              A sessão selecionada não tem recursos. O que queres fazer?
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleCopyDecision("link")}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors text-left"
              >
                <div className="p-2 bg-white rounded-full">
                  <LinkIcon size={16} />
                </div>
                <div>
                  <div className="font-bold text-sm">
                    Vincular e Sincronizar
                  </div>
                  <div className="text-[10px] opacity-80">
                    Alterações afetam ambas.
                  </div>
                </div>
              </button>
              <button
                onClick={() => handleCopyDecision("copy")}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors text-left"
              >
                <div className="p-2 bg-slate-100 rounded-full">
                  <Copy size={16} />
                </div>
                <div>
                  <div className="font-bold text-sm">Apenas Copiar</div>
                  <div className="text-[10px] opacity-80">
                    Copia dados, mantém independentes.
                  </div>
                </div>
              </button>
              <button
                onClick={() => handleCopyDecision("none")}
                className="w-full p-2 text-sm text-slate-400 hover:text-slate-600 font-medium"
              >
                Começar do zero
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ESQUERDA */}
      <div className="w-1/3 flex flex-col border-r border-slate-200 dark:border-slate-800 pr-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white">
            Sessões
          </h3>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
            {safeSessions.length}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pb-2">
          {safeSessions.map((s: any) => {
            const isSelected = selectedSessionId === s.id;
            const hasLink = !!s.resourceGroupId;
            return (
              <div
                key={s.id}
                onClick={() => handleSessionClick(s.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all relative group ${
                  isSelected
                    ? "bg-blue-50 border-blue-500 shadow-sm ring-1 ring-blue-500 dark:bg-blue-900/20"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3 w-full">
                    <div
                      className={`w-4 h-4 mt-1 rounded border flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-blue-500 border-blue-500"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div className="font-bold text-sm text-slate-800 dark:text-slate-200">
                          {s.nome}
                        </div>
                        {hasLink && (
                          <LinkIcon
                            size={12}
                            className="text-blue-400"
                            aria-label="Vinculada"
                          />
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {s.data} • {s.horaInicio}-{s.horaFim}
                      </div>
                      {(s.staffIds?.length > 0 ||
                        s.equipamentoIds?.length > 0) && (
                        <div className="flex gap-2 mt-2">
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 flex items-center gap-1">
                            <Users size={10} /> {s.staffIds?.length || 0}
                          </span>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 flex items-center gap-1">
                            <Package size={10} />{" "}
                            {s.equipamentoIds?.length || 0}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DIREITA */}
      <div className="w-2/3 pl-2 flex flex-col bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => {
                setActiveMode("staff");
                setSearchTerm("");
                setSelectedCategory("Todos");
              }}
              className={`flex-1 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                activeMode === "staff"
                  ? "bg-slate-800 text-white shadow-lg"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              <Users size={16} /> Equipa
            </button>
            <button
              onClick={() => {
                setActiveMode("equipment");
                setSearchTerm("");
                setSelectedCategory("Todos");
              }}
              className={`flex-1 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                activeMode === "equipment"
                  ? "bg-slate-800 text-white shadow-lg"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              <Package size={16} /> Material
            </button>
          </div>
          <div className="flex gap-2">
            <div className="relative min-w-[140px]">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Filter size={14} />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder={
                  activeMode === "staff"
                    ? "Pesquisar nome..."
                    : "Pesquisar equipamento..."
                }
                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar relative pb-20">
          {!selectedSessionId && (
            <div className="absolute inset-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-slate-400">
              <AlertCircle size={40} className="mb-3 opacity-50" />
              <p className="font-bold text-slate-600 dark:text-slate-300">
                Nenhuma sessão selecionada
              </p>
              <p className="text-sm">Seleciona uma sessão à esquerda.</p>
            </div>
          )}

          {activeMode === "staff" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredStaff.map((p) => {
                const { available, reason, isSelected } = getStaffState(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() =>
                      handleToggleStaff(p.id, available || isSelected)
                    }
                    className={`relative group flex items-center p-3 rounded-xl border transition-all duration-200 select-none ${
                      !available && !isSelected
                        ? "bg-slate-100 dark:bg-slate-800 border-slate-100 dark:border-slate-800 opacity-60 grayscale cursor-not-allowed"
                        : isSelected
                        ? "bg-blue-50 border-blue-500 ring-1 ring-blue-500 shadow-md dark:bg-blue-900/20 dark:border-blue-500 cursor-pointer"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 hover:shadow-sm cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                          isSelected
                            ? "bg-blue-200 text-blue-700"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {p.fotoUrl ? (
                          <img
                            src={p.fotoUrl}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          p.nome[0]
                        )}
                      </div>
                      <div className="min-w-0">
                        <div
                          className={`font-bold text-sm truncate ${
                            isSelected
                              ? "text-blue-900 dark:text-blue-100"
                              : "text-slate-800 dark:text-white"
                          }`}
                        >
                          {p.nome}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {p.cargo}
                        </div>
                        {!available && !isSelected && (
                          <div className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-0.5">
                            <Info size={10} /> Ocupado
                          </div>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute top-3 right-3 text-blue-500 bg-white dark:bg-slate-800 rounded-full p-0.5 shadow-sm">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                    {!available && !isSelected && (
                      <div className="absolute left-1/2 -translate-x-1/2 mt-12 z-50 hidden group-hover:block bg-slate-800 text-white text-xs p-2 rounded shadow-lg whitespace-nowrap pointer-events-none">
                        {reason}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeMode === "equipment" && (
            <div className="space-y-2">
              {filteredEquip.map((eq) => {
                const { maxStock, reason, currentAssigned } = getEquipmentState(
                  eq.id,
                  eq.totalStock
                );
                const remaining = maxStock;
                const isSoldOut = maxStock <= 0;
                return (
                  <div
                    key={eq.id}
                    className={`group flex items-center justify-between p-3 rounded-lg border transition-all ${
                      isSoldOut && currentAssigned === 0
                        ? "bg-slate-100 border-slate-100 opacity-60 grayscale cursor-not-allowed"
                        : currentAssigned > 0
                        ? "bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-700"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                        <Package size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-800">
                          {eq.name}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-slate-500">{eq.type}</span>
                          {!isSoldOut && (
                            <span
                              className={`${
                                remaining === 0
                                  ? "text-amber-600"
                                  : "text-green-600"
                              } font-bold bg-white px-1 rounded border`}
                            >
                              {remaining} disponíveis
                            </span>
                          )}
                        </div>
                        {isSoldOut && currentAssigned === 0 && (
                          <div className="text-[10px] text-red-500 font-bold mt-0.5">
                            Esgotado
                          </div>
                        )}
                      </div>
                    </div>
                    {reason && currentAssigned === 0 && (
                      <div className="absolute right-10 mt-8 z-50 hidden group-hover:block bg-black text-white text-xs p-2 rounded shadow-lg whitespace-nowrap">
                        {reason}
                      </div>
                    )}
                    <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-1">
                      <button
                        disabled={currentAssigned === 0}
                        onClick={() => handleUpdateQuantity(eq.id, -1)}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 disabled:opacity-30"
                      >
                        <Minus size={14} />
                      </button>
                      <span
                        className={`w-4 text-center text-sm font-bold ${
                          currentAssigned > 0
                            ? "text-amber-600"
                            : "text-slate-300"
                        }`}
                      >
                        {currentAssigned}
                      </span>
                      <button
                        disabled={remaining === 0}
                        onClick={() => handleUpdateQuantity(eq.id, 1)}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 disabled:opacity-30"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
