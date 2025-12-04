import React from 'react';
import TeatroLayoutClient from './_components/TeatroLayoutClient'; // Importa o novo cliente

interface TeatroLayoutProps {
  children: React.ReactNode;
  params: Promise<{ teatroId: string }>;
}

export default async function TeatroLayout({ children, params }: TeatroLayoutProps) {
  // 1. Resolver os parâmetros no servidor
  const resolvedParams = await params;
  const { teatroId } = resolvedParams;

  // 2. Passar tudo para o componente cliente que gere a interatividade
  return (
    <TeatroLayoutClient teatroId={teatroId}>
      {children}
    </TeatroLayoutClient>
  );
}