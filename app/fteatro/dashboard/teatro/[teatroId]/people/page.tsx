import React from 'react';
import PeopleListClient from './_components/PeopleListClient';

export default async function PeoplePage() {
    // Aqui no futuro poderias carregar dados da BD
    return (
        <PeopleListClient />
    );
}