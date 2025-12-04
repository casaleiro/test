"use client";

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, Save, Layout, Calendar, Users, CheckCircle } from 'lucide-react';
import { Projeto, SessaoProjeto } from '@/app/types/projeto';

// ⚠️ ESTAS SÃO AS LINHAS QUE FALTAVAM:
import StepGeneral from "@/app/fteatro/dashboard/teatro/[teatroId]/projects/new/_componentes/StepGeneral";
import StepSessions from "@/app/fteatro/dashboard/teatro/[teatroId]/projects/new/_componentes/StepSessions";
import StepResources from "@/app/fteatro/dashboard/teatro/[teatroId]/projects/new/_componentes/StepResources";
import StepReview from "@/app/fteatro/dashboard/teatro/[teatroId]/projects/new/_componentes/StepReview";

export default function NewProjectPage({ params }: { params: Promise<{ teatroId: string }> }) {
    const router = useRouter();

    // Desembrulhar params (Correção do erro de Promise)
    const { teatroId } = use(params);

    const [currentStep, setCurrentStep] = useState(1);

    // --- ESTADO GLOBAL DO NOVO PROJETO ---
    const [projectData, setProjectData] = useState<Partial<Projeto>>({
        nome: '',
        cliente: '',
        tipo: 'Teatro',
        estado: 'Rascunho',
        cor: 'bg-blue-600',
        dataInicio: new Date(),
        dataFim: new Date(),
        sessoes: [] as SessaoProjeto[]
    });

    const steps = [
        { id: 1, title: 'Dados Gerais', icon: Layout },
        { id: 2, title: 'Agenda', icon: Calendar },
        { id: 3, title: 'Recursos', icon: Users },
        { id: 4, title: 'Revisão', icon: CheckCircle }
    ];

    const handleNext = () => {
        if (currentStep < 4) setCurrentStep(c => c + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(c => c - 1);
    };

    const handleFinish = () => {
        console.log("PROJETO GUARDADO:", projectData);
        // Aqui farias o POST para a API
        router.push(`/dashboard/teatro/${teatroId}/projects`);
    };

    return (
        <div className="max-w-6xl mx-auto pb-20">
            {/* Header Wizard */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Novo Projeto</h1>
                <div className="relative flex justify-between items-center px-4 md:px-20">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 -z-10 rounded"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-red-600 -z-10 rounded transition-all duration-500" style={{ width: `${((currentStep - 1) / 3) * 100}%` }}></div>

                    {steps.map((step) => {
                        const isActive = currentStep >= step.id;
                        return (
                            <div key={step.id} className="flex flex-col items-center gap-2 bg-slate-50 dark:bg-slate-950 px-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-red-600 text-white scale-110 shadow-lg' : 'bg-slate-200 text-slate-400'}`}>
                                    <step.icon size={18} />
                                </div>
                                <span className={`text-xs font-bold ${currentStep === step.id ? 'text-red-600' : 'text-slate-400'}`}>{step.title}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Conteúdo */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm min-h-[500px] flex flex-col">
                <div className="flex-1 p-6">
                    {currentStep === 1 && <StepGeneral data={projectData} updateData={setProjectData} />}
                    {currentStep === 2 && <StepSessions data={projectData} updateData={setProjectData} />}
                    {currentStep === 3 && <StepResources data={projectData} updateData={setProjectData} />}
                    {currentStep === 4 && <StepReview data={projectData} />}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between bg-slate-50 dark:bg-slate-800/50 rounded-b-xl">
                    <button onClick={handleBack} disabled={currentStep === 1} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-50 flex items-center gap-2">
                        <ChevronLeft size={18} /> Anterior
                    </button>
                    {currentStep < 4 ? (
                        <button onClick={handleNext} className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold hover:opacity-90 flex items-center gap-2">
                            Próximo <ChevronRight size={18} />
                        </button>
                    ) : (
                        <button onClick={handleFinish} className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 flex items-center gap-2 shadow-lg">
                            <Save size={18} /> Criar Projeto
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}