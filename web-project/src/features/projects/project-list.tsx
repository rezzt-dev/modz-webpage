"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link } from "@/components/link";
import {
  Archive,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  Clock3,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";

import { deleteProject } from "@/lib/projects-api";
import { projectStatusLabels, projectTypeLabels } from "./project-labels";
import type { ProjectSummary } from "./project-schema";

const statusIcons = {
  draft: Clock3,
  published: CheckCircle2,
  archived: Archive,
};

function ProjectIcon({ project }: { project: ProjectSummary }) {
  if (project.iconUrl) {
    return (
      <span
        aria-hidden="true"
        className="size-11 shrink-0 rounded-xl bg-white/8 bg-cover bg-center ring-1 ring-white/10"
        style={{
          backgroundImage: `url(${JSON.stringify(project.iconUrl).slice(1, -1)})`,
        }}
      />
    );
  }
  return (
    <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.035]">
      <Boxes className="size-5 text-white/45" />
    </span>
  );
}

function DeleteProject({
  project,
  onDeleted,
}: {
  project: ProjectSummary;
  onDeleted: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !pending) setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open, pending]);
  async function handleDelete(event: React.SyntheticEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      await deleteProject(project.id);
      onDeleted(project.id);
      setOpen(false);
    } catch {
      setError("No se pudo eliminar el proyecto. Inténtalo de nuevo.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-300 transition hover:bg-red-500/10"
      >
        <Trash2 className="size-3.5" /> Eliminar
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111311] p-6 shadow-2xl"
          >
            <div className="grid size-10 place-items-center rounded-full bg-red-500/10 text-red-300">
              <Trash2 className="size-4" />
            </div>
            <h2 id="delete-title" className="mt-5 text-lg font-semibold">
              Eliminar {project.name}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/50">
              Se eliminarán también todos sus lanzamientos y archivos asociados.
              Esta acción no se puede deshacer.
            </p>
            {error ? (
              <p className="mt-4 text-xs text-red-300">{error}</p>
            ) : null}
            <form
              onSubmit={handleDelete}
              className="mt-6 flex justify-end gap-3"
            >
              <button
                type="button"
                disabled={pending}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-2 text-xs text-white/55 hover:bg-white/5 hover:text-white disabled:opacity-40"
              >
                Cancelar
              </button>
              <button
                disabled={pending}
                className="rounded-lg bg-red-500 px-4 py-2 text-xs font-semibold text-white hover:bg-red-400 disabled:cursor-wait disabled:opacity-50"
              >
                {pending ? "Eliminando…" : "Eliminar proyecto"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function ProjectList({
  projects,
  onDeleted,
}: {
  projects: ProjectSummary[];
  onDeleted: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [menu, setMenu] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesStatus = status === "all" || project.status === status;
      const matchesQuery =
        !needle ||
        project.name.toLowerCase().includes(needle) ||
        project.slug.includes(needle) ||
        project.summary.toLowerCase().includes(needle);
      return matchesStatus && matchesQuery;
    });
  }, [deferredQuery, projects, status]);

  return (
    <section className="rounded-2xl border border-white/8 bg-white/[0.018]">
      <div className="flex flex-col gap-3 border-b border-white/8 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/30" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre, slug o descripción…"
            className="h-10 w-full rounded-lg border border-white/8 bg-black/20 pr-3 pl-9 text-sm text-white placeholder:text-white/25 focus:border-white/25 focus:outline-none"
          />
        </div>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-10 rounded-lg border border-white/8 bg-[#0b0c0b] px-3 text-xs text-white/65 focus:border-white/25 focus:outline-none"
        >
          <option value="all">Todos los estados</option>
          <option value="published">Publicados</option>
          <option value="draft">Borradores</option>
          <option value="archived">Archivados</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="px-6 py-20 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl border border-white/8 bg-white/[0.025]">
            <Search className="size-5 text-white/30" />
          </span>
          <h2 className="mt-4 text-sm font-semibold">
            No hay proyectos que coincidan
          </h2>
          <p className="mt-1 text-xs text-white/40">
            Prueba con otros términos o limpia los filtros.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-white/6">
          {filtered.map((project) => {
            const StatusIcon = statusIcons[project.status];
            return (
              <article
                key={project.id}
                className="group grid gap-4 p-4 transition hover:bg-white/[0.025] md:grid-cols-[minmax(260px,1.5fr)_1fr_1fr_120px_40px] md:items-center md:px-5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <ProjectIcon project={project} />
                  <div className="min-w-0">
                    <Link
                      href={`/admin/projects/edit/?id=${project.id}`}
                      className="inline-flex max-w-full items-center gap-1.5 font-medium text-white hover:underline"
                    >
                      <span className="truncate">{project.name}</span>
                      <ArrowUpRight className="size-3.5 opacity-0 transition group-hover:opacity-50" />
                    </Link>
                    <p className="mt-0.5 truncate text-xs text-white/35">
                      /{project.slug} · {projectTypeLabels[project.type]}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] tracking-wider text-white/25 uppercase md:hidden">
                    Compatibilidad
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1.5 md:mt-0">
                    {project.latestGameVersions.slice(0, 2).map((version) => (
                      <span
                        key={version}
                        className="rounded-md bg-white/6 px-2 py-1 text-[10px] text-white/55"
                      >
                        {version}
                      </span>
                    ))}
                    {project.latestLoaders.slice(0, 2).map((loader) => (
                      <span
                        key={loader}
                        className="rounded-md border border-white/8 px-2 py-1 text-[10px] text-white/45 capitalize"
                      >
                        {loader}
                      </span>
                    ))}
                    {!project.latestVersion ? (
                      <span className="text-xs text-white/25">
                        Sin lanzamientos
                      </span>
                    ) : null}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] tracking-wider text-white/25 uppercase md:hidden">
                    Última versión
                  </p>
                  <p className="mt-1 text-xs text-white/65 md:mt-0">
                    {project.latestVersion ?? "—"}
                  </p>
                  <p className="mt-0.5 text-[10px] text-white/30">
                    {project.releaseCount}{" "}
                    {project.releaseCount === 1
                      ? "lanzamiento"
                      : "lanzamientos"}
                  </p>
                </div>
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.025] px-2.5 py-1 text-[10px] text-white/55">
                  <StatusIcon className="size-3" />{" "}
                  {projectStatusLabels[project.status]}
                </span>
                <div className="relative justify-self-end">
                  <button
                    type="button"
                    aria-label={`Acciones de ${project.name}`}
                    aria-expanded={menu === project.id}
                    onClick={() =>
                      setMenu(menu === project.id ? null : project.id)
                    }
                    className="grid size-8 place-items-center rounded-lg text-white/35 hover:bg-white/8 hover:text-white"
                  >
                    <MoreHorizontal className="size-4" />
                  </button>
                  {menu === project.id ? (
                    <div className="absolute right-0 z-10 mt-1 w-36 overflow-hidden rounded-lg border border-white/10 bg-[#151715] py-1 shadow-xl">
                      <Link
                        href={`/admin/projects/edit/?id=${project.id}`}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-white/65 hover:bg-white/5 hover:text-white"
                      >
                        <Pencil className="size-3.5" /> Editar
                      </Link>
                      <DeleteProject project={project} onDeleted={onDeleted} />
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
