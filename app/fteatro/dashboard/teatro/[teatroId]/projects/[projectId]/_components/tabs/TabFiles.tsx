import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Projeto } from '@/app/types/projeto';

export default function TabFiles({ project }: { project: Projeto }) {

    const getFileIcon = (type: string) => {
        switch(type) {
            case 'PDF': return <div className="w-10 h-10 bg-red-100 text-red-600 rounded flex items-center justify-center font-bold text-xs">PDF</div>;
            case 'DOC': return <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded flex items-center justify-center font-bold text-xs">DOC</div>;
            case 'IMG': return <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded flex items-center justify-center font-bold text-xs">IMG</div>;
            case 'XLS': return <div className="w-10 h-10 bg-green-100 text-green-600 rounded flex items-center justify-center font-bold text-xs">XLS</div>;
            default: return <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded flex items-center justify-center font-bold text-xs">FILE</div>;
        }
    };

    return (
        <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">Documentação</h3>
                <button className="text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2 dark:text-white"><FileText size={14}/> Upload</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.ficheiros?.map((file) => (
                    <div key={file.id} className="flex items-start p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-shadow bg-white dark:bg-slate-800/50">
                        {getFileIcon(file.tipo)}
                        <div className="ml-3 flex-1 min-w-0">
                            <div className="font-bold text-sm text-slate-900 dark:text-white truncate" title={file.nome}>{file.nome}</div>
                            <div className="text-xs text-slate-400 mt-1">{file.dataUpload} • {file.tamanho}</div>
                        </div>
                        <button className="text-slate-400 hover:text-blue-600"><Download size={16}/></button>
                    </div>
                ))}
            </div>
        </div>
    );
}