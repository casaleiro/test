"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';

interface NavItemProps {
    href: string;
    icon: LucideIcon;
    label: string;
    isCollapsed: boolean;
    onClick?: () => void;
}

export default function NavItem({ href, icon: Icon, label, isCollapsed, onClick }: NavItemProps) {
    const pathname = usePathname();

    // Lógica para saber se o link está ativo (exato ou parcial)
    // Se for a raiz (/), tem de ser exato. Se for sub-rota, pode ser parcial.
    const isActive = href === '/' || href.endsWith('spaces')
        ? pathname === href
        : pathname.startsWith(href);

    const showText = !isCollapsed;

    return (
        <Link
            href={href}
            onClick={(e) => {
                e.stopPropagation(); // Impede que o clique no link expanda a sidebar (se tiver essa lógica no pai)
                if (onClick) onClick();
            }}
            className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative
                ${isActive
                ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}
                ${isCollapsed ? 'justify-center' : ''}
            `}
            title={isCollapsed ? label : ""} // Tooltip nativo simples como fallback
        >
            <Icon size={20} className="flex-shrink-0" />

            {/* Texto com animação de entrada */}
            {showText && (
                <span className="animate-in fade-in slide-in-from-left-2 duration-200 whitespace-nowrap overflow-hidden">
                    {label}
                </span>
            )}

            {/* Tooltip Personalizado (Aparece ao lado quando colapsado) */}
            {isCollapsed && (
                <div className="absolute left-14 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
                    {label}
                </div>
            )}
        </Link>
    );
}