import { connection } from "next/server";
import { notFound } from "next/navigation";

import { ProjectForm } from "@/features/projects/project-form";
import { getProject } from "@/server/projects/project-repository";

export default async function EditProjectPage({
  params,
}: PageProps<"/admin/projects/[projectId]">) {
  await connection();
  const { projectId } = await params;
  const project = await getProject(projectId);
  if (!project) notFound();
  return <ProjectForm project={project} />;
}
