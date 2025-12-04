// app/page.tsx
"use client";

import React from 'react';
import { TeatrosDummy } from '@/app/utils/data/teatroDummyData';
import { useRouter } from 'next/navigation';
import { Building2, X } from 'lucide-react';

export default function SimulacaoLoginPage() {
  const router = useRouter();

  // Função que simula o login e redireciona para o dashboard do teatro selecionado
  const handleLogin = (teatroId: string) => {
    // Na implementação real com Supabase, seria aqui que o JWT ou a sessão seria definida.
  console.log("tste",teatroId)
    // Simulação de redirecionamento para o dashboard com o ID do teatro
    router.push(`/fteatro/dashboard/teatro/${teatroId}/spaces`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-950">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800">

        <h2 className="text-3xl font-extrabold text-center text-red-700 dark:text-red-500 flex items-center justify-center gap-3">
          <Building2 size={32} />
          Gestão de Teatros
        </h2>

        <p className="text-center text-slate-600 dark:text-slate-400">
          Selecione o teatro para simular o acesso de Direção/Gestão.
        </p>

        <div className="space-y-4">
          {TeatrosDummy.map(teatro => (
            <button
              key={teatro.id}
              onClick={() => handleLogin(teatro.id)}
              className={`w-full flex items-center justify-between p-4 rounded-lg font-bold transition-colors shadow-md ${
                teatro.spaces.length === 0
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  : 'bg-red-700 text-white hover:bg-red-800'
              }`}
            >
              <span>{teatro.name}</span>
              <span className="text-sm font-medium">
                                {teatro.spaces.length === 0 ? 'Sem Salas' : `${teatro.spaces.length} Salas`}
                            </span>
            </button>
          ))}
        </div>

        <div className="text-center text-xs text-slate-400 dark:text-slate-600 pt-4 border-t border-slate-100 dark:border-slate-800">
          *Simulação de Acesso de Direção.
        </div>
      </div>
    </div>
  );
}