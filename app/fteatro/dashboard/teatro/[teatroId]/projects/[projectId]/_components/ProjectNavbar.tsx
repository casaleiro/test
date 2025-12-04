"use client";

import React from 'react';
import { FileText, Calendar, Users, Package, DollarSign } from 'lucide-react';

export type ProjectTab = 'overview' | 'schedule' | 'team' | 'logistics' | 'files' | 'budget';

interface NavbarProps {
    activeTab: ProjectTab;
    onChange: (tab: ProjectTab) => void;
}

export default function ProjectNavbar({ activeTab, onChange }: NavbarProps) {
    const tabs = [
        { id: 'overview', label: 'Visão Geral', icon: FileText },
        { id: 'schedule', label: 'Cronograma', icon: Calendar },
        { id: 'team', label: 'Equipa', icon: Users },
        { id: 'logistics', label: 'Rider & Material', icon: Package },
        { id: 'files', label: 'Documentos', icon: FileText },
        { id: 'budget', label: 'Financeiro', icon: DollarSign },
    ];

    return (
        <div className="flex gap-6 mt-6 border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id as ProjectTab)}
                    className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
                        activeTab === tab.id
                            ? 'border-red-600 text-red-600'
                            : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                    }`}
                >
                    <tab.icon size={16} />
                    {tab.label}
                </button>
            ))}
        </div>
    );
}