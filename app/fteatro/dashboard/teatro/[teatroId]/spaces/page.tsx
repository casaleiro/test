// app/dashboard/teatro/[teatroId]/spaces/page.tsx
import { TeatrosDummy } from "@/app/utils/data/teatroDummyData";
import SpacesClientContent from './_components/SpacesClientContent';

interface SpacesPageProps {
  params: Promise<{
    teatroId: string; // ⚠️ AGORA É teatroId OUTRA VEZ
  }>;
}

export default async function SpacesPage({ params }: SpacesPageProps) {
  // 1. Resolver a Promise
  const resolvedParams = await params;
  const { teatroId } = resolvedParams;

  // 2. Procurar os dados
  const currentTeatro = TeatrosDummy.find(t => t.id === teatroId) || TeatrosDummy.find(t => t.id === 'teatro-vazio')!;

  // 3. Passar para o cliente
  return (
    <SpacesClientContent
      teatroId={currentTeatro.id}
      teatroName={currentTeatro.name}
      initialSpaces={currentTeatro.spaces}
    />
  );
}