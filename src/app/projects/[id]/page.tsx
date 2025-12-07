'use client';

import { useParams } from 'next/navigation';
import ProjectDetailView from '@/components/dashboard/ProjectDetailView';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  return (
    <div className="container mx-auto p-6">
      <ProjectDetailView projectId={projectId} />
    </div>
  );
}
