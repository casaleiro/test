"use client";

import React, { useState, use } from 'react';
import { ProjetosDummy } from '@/app/utils/data/projectsDummyData';
import ProjectHeader from './_components/ProjectHeader';
import ProjectNavbar, { ProjectTab } from './_components/ProjectNavbar';

// Imports dos conteúdos das tabs
import TabOverview from './_components/tabs/TabOverview';
import TabSchedule from './_components/tabs/TabSchedule';
import TabTeam from './_components/tabs/TabTeam';
import TabLogistics from './_components/tabs/TabLogistics';
import TabFiles from './_components/tabs/TabFiles';
import TabBudget from './_components/tabs/TabBudget';

export default function ProjectDetailPage({ params }: { params: Promise<{ projectId: string, teatroId: string }> }) {
    const { projectId } = use(params);
    const [activeTab, setActiveTab] = useState<ProjectTab>('overview');

    const project = ProjetosDummy.find(p => p.id === projectId);

    if (!project) return <div className="p-10 text-center">Projeto não encontrado.</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            {/* 1. Header Fixo */}
            <div>
                <ProjectHeader project={project} />
                <ProjectNavbar activeTab={activeTab} onChange={setActiveTab} />
            </div>

            {/* 2. Conteúdo Dinâmico */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 min-h-[400px]">
                {activeTab === 'overview' && <TabOverview project={project} />}
                {activeTab === 'schedule' && <TabSchedule project={project} />}
                {activeTab === 'team' && <TabTeam project={project} />}
                {activeTab === 'logistics' && <TabLogistics project={project} />}
                {activeTab === 'files' && <TabFiles project={project} />}
                {activeTab === 'budget' && <TabBudget project={project} />}
            </div>
        </div>
    );
}