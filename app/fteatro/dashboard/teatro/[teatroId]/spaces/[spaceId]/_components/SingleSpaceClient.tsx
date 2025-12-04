import React from 'react';
import { TeatrosDummy, BookingsDummy } from '@/app/utils/data/teatroDummyData';
import SingleSpaceClient from './_components/SingleSpaceClient';

interface PageProps {
    params: Promise<{
        teatroId: string;
        spaceId: string;
    }>;
}

export default async function SingleSpacePage({ params }: PageProps) {
    // 1. Resolver parametros
    const resolvedParams = await params;
    const tId = resolvedParams.teatroId;
    const sId = resolvedParams.spaceId;

    // 2. Buscar Teatro (SEM Fallback para o [0], para evitar dados errados)
    const teatro = TeatrosDummy.find(t => t.id === tId);

    // 3. Buscar Sala (Apenas se o teatro existir)
    const space = teatro ? teatro.spaces.find(s => s.id === sId) : null;

    // 4. Buscar Bookings (Apenas para esta sala específica)
    // Isto garante que as "notificações" (agendamentos) são apenas desta sala
    const spaceBookings = space
        ? BookingsDummy.filter(b => b.spaceId === sId)
        : [];

    // 5. Passar para o cliente
    // Se o teatro ou sala não existirem, passamos null para o cliente tratar o "Empty State"
    return (
        <SingleSpaceClient
            space={space}
            teatroName={teatro?.name || "Teatro Desconhecido"}
            bookings={spaceBookings}
        />
    );
}