import Link from "next/link";
import { connection } from "next/server";
import { Archive, CheckCircle2, CirclePlus, FolderKanban } from "lucide-react";

import { ProjectList } from "@/features/projects/project-list";
import type { ProjectSummary } from "@/features/projects/project-schema";
import { listProjects } from "@/server/projects/project-repository";

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof FolderKanban;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.018] p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-white/40">{label}</p>
        <Icon className="size-4 text-white/25" />
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-white">
        {value.toString().padStart(2, "0")}
      </p>
    </div>
  );
}

export default async function ProjectsPage({
  searchParams,
}: PageProps<"/admin/projects">) {
  await connection();
  const { result } = await searchParams;
  let projects: ProjectSummary[] = [];
  let loadError = false;
  try {
    projects = await listProjects();
  } catch {
    loadError = true;
  }

  const published = projects.filter(
    ({ status }) => status === "published",
  ).length;
  const archived = projects.filter(
    ({ status }) => status === "archived",
  ).length;

  return (
    <>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.18em] text-emerald-300/75 uppercase">
            <span className="size-1.5 rounded-full bg-emerald-300" /> Biblioteca
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Gestión de proyectos
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/40">
            Organiza tus mods, plugins y packs con lanzamientos independientes
            para cada loader y versión de Minecraft.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-xs font-semibold text-black transition hover:bg-emerald-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <CirclePlus className="size-4" /> Nuevo proyecto
        </Link>
      </div>

      {result === "created" || result === "updated" ? (
        <div
          role="status"
          className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-300/15 bg-emerald-300/[0.06] px-4 py-3 text-xs text-emerald-200"
        >
          <CheckCircle2 className="size-4" /> Proyecto{" "}
          {result === "created" ? "creado" : "actualizado"} correctamente.
        </div>
      ) : null}

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Proyectos totales"
          value={projects.length}
          icon={FolderKanban}
        />
        <Stat label="Publicados" value={published} icon={CheckCircle2} />
        <Stat label="Archivados" value={archived} icon={Archive} />
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Todos los proyectos</h2>
            <p className="mt-1 text-xs text-white/35">
              {projects.length} en el espacio de trabajo
            </p>
          </div>
        </div>
        {loadError ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-400/15 bg-red-400/[0.04] px-6 py-16 text-center"
          >
            <h2 className="text-sm font-semibold text-red-200">
              No se pudo cargar la biblioteca
            </h2>
            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-white/40">
              Comprueba que PostgreSQL está disponible y que la variable
              DATABASE_URL es correcta. La interfaz seguirá disponible cuando
              recuperes la conexión.
            </p>
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.015] px-6 py-20 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl border border-white/8 bg-white/[0.025]">
              <FolderKanban className="size-5 text-white/30" />
            </span>
            <h2 className="mt-4 text-sm font-semibold">
              Tu biblioteca está vacía
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-white/40">
              Crea el primer proyecto y añade sus lanzamientos para empezar a
              construir el catálogo.
            </p>
            <Link
              href="/admin/projects/new"
              className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-xs font-medium hover:bg-white/5"
            >
              <CirclePlus className="size-3.5" /> Crear proyecto
            </Link>
          </div>
        ) : (
          <ProjectList projects={projects} />
        )}
      </div>
    </>
  );
}
