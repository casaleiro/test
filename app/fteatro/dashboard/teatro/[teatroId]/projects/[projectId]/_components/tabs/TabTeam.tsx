"use client";

import React from "react";
import { User, Users, Calendar, Clock, MapPin } from "lucide-react";
import { Projeto } from "@/app/types/projeto";

export default function TabTeam({ project }: { project: Projeto }) {
  // Função para encontrar os dados da pessoa pelo ID
  const getTeamMembersForSession = (staffIds: string[]) => {
    if (!staffIds || staffIds.length === 0) return [];
    return project.equipaDetalhada.filter((p) => staffIds.includes(p.id));
  };

  return (
    <div className="animate-in fade-in duration-300 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-bold text-lg text-slate-800 dark:text-white">
          Escala de Equipa por Sessão
        </h3>
        <button className="text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-sm hover:opacity-90">
          <Users size={16} /> Gerir Escalas
        </button>
      </div>

      {project.sessoes.length === 0 ? (
        <div className="text-center py-10 text-slate-500 italic">
          Sem sessões criadas.
        </div>
      ) : (
        <div className="space-y-8 relative">
          {/* Linha Vertical da Timeline */}
          <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800 -z-10"></div>

          {project.sessoes.map((sessao, idx) => {
            const team = getTeamMembersForSession(sessao.staffIds);
            const sessionDate = new Date(sessao.data);

            return (
              <div key={idx} className="relative pl-12 group">
                {/* Bolinha da Timeline */}
                <div className="absolute left-0 top-0 w-10 h-10 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-full flex flex-col items-center justify-center text-[10px] font-bold text-slate-500 z-10 group-hover:border-red-500 group-hover:text-red-500 transition-colors">
                  <span>{sessionDate.getDate()}</span>
                  <span className="uppercase text-[8px]">
                    {sessionDate
                      .toLocaleDateString("pt-PT", { month: "short" })
                      .replace(".", "")}
                  </span>
                </div>

                {/* Cartão da Sessão */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:shadow-md transition-shadow">
                  {/* Cabeçalho da Sessão */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3 gap-2">
                    <div>
                      <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                        {sessao.nome}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {sessao.horaInicio} -{" "}
                          {sessao.horaFim}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {sessao.localId}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 w-fit">
                      {team.length} Pessoas
                    </div>
                  </div>

                  {/* Grelha de Pessoas */}
                  {team.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {team.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                        >
                          {/* Avatar */}
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden mr-3 border border-slate-100 dark:border-slate-600">
                              {member.fotoUrl ? (
                                <img
                                  src={member.fotoUrl}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User size={18} className="text-slate-400" />
                              )}
                            </div>
                            {/* Estado (Ponto colorido) */}
                            <div
                              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                                member.estado === "Confirmado"
                                  ? "bg-green-500"
                                  : "bg-amber-500"
                              }`}
                              title={member.estado}
                            ></div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm text-slate-800 dark:text-white truncate">
                              {member.nome}
                            </div>
                            <div className="text-xs text-slate-500 truncate">
                              {member.cargo}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-lg">
                      <p className="text-sm text-slate-400">
                        Ainda não há equipa escalada para esta sessão.
                      </p>
                      <button className="mt-2 text-xs font-bold text-red-600 hover:underline">
                        + Adicionar Pessoas
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
