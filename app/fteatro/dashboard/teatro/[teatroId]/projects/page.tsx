import React from 'react';
import ProjectListClient from './_components/ProjectListClient';

export default async function ProjectsPage({ params }: { params: Promise<{ teatroId: string }> }) {
    const { teatroId } = await params;
    return <ProjectListClient teatroId={teatroId} />;
}