"use client";

import { useState, type SyntheticEvent } from "react";
import { Link } from "@/components/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  ChevronDown,
  CirclePlus,
  ExternalLink,
  FileArchive,
  GripVertical,
  Info,
  LoaderCircle,
  PackageOpen,
  Trash2,
} from "lucide-react";

import { projectInputSchema } from "./project-schema";
import { saveProject } from "@/lib/projects-api";
import { z } from "zod";
import {
  PROJECT_STATUSES,
  PROJECT_TYPES,
  PROJECT_VISIBILITIES,
  RELEASE_CHANNELS,
  RELEASE_STATUSES,
  SIDE_SUPPORT,
  type ProjectDetail,
  type ReleaseInput,
} from "./project-schema";
import {
  projectStatusLabels,
  projectTypeLabels,
  sideSupportLabels,
  visibilityLabels,
} from "./project-labels";

const fieldClass =
  "mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/25 px-3 text-sm text-white placeholder:text-white/20 focus:border-neutral-300/50 focus:outline-none focus:ring-2 focus:ring-neutral-300/10 disabled:cursor-not-allowed disabled:opacity-50";
const textareaClass = `${fieldClass} h-auto min-h-28 resize-y py-3 leading-relaxed`;
const labelClass = "text-xs font-medium text-white/65";

const emptyRelease = (): ReleaseInput => ({
  id: crypto.randomUUID(),
  version: "",
  name: "",
  changelog: "",
  channel: "release",
  status: "draft",
  gameVersions: [],
  loaders: [],
  downloadUrl: "",
  filename: "",
});

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function FieldError({ errors }: { errors: string[] | undefined }) {
  return errors?.length ? (
    <p className="mt-1.5 text-[11px] text-red-300">{errors[0]}</p>
  ) : null;
}

function Section({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-6 border-t border-white/8 py-8 lg:grid-cols-[230px_1fr] lg:gap-12 lg:py-10">
      <div>
        <p className="text-[10px] font-semibold tracking-[0.2em] text-neutral-300/70 uppercase">
          {number}
        </p>
        <h2 className="mt-2 text-sm font-semibold">{title}</h2>
        <p className="mt-2 text-xs leading-relaxed text-white/35">
          {description}
        </p>
      </div>
      <div>{children}</div>
    </section>
  );
}

function ReleaseEditor({
  release,
  index,
  total,
  onChange,
  onRemove,
  onMove,
}: {
  release: ReleaseInput;
  index: number;
  total: number;
  onChange: (next: ReleaseInput) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
}) {
  const [gameVersions, setGameVersions] = useState(
    release.gameVersions.join(", "),
  );
  const [loaders, setLoaders] = useState(release.loaders.join(", "));
  const update = <Key extends keyof ReleaseInput>(
    key: Key,
    value: ReleaseInput[Key],
  ) => onChange({ ...release, [key]: value });

  return (
    <details
      open={index === 0}
      className="group overflow-hidden rounded-xl border border-white/8 bg-black/15"
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-4 marker:hidden">
        <GripVertical className="size-4 text-white/20" />
        <span className="grid size-8 place-items-center rounded-lg bg-white/6 text-[10px] font-semibold text-white/50">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium">
            {release.name || "Nuevo lanzamiento"}
          </p>
          <p className="mt-0.5 text-[10px] text-white/30">
            {release.version || "Versión sin definir"} · {release.channel}
          </p>
        </div>
        <div
          className="flex items-center gap-1"
          onClick={(event) => event.preventDefault()}
        >
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(-1)}
            aria-label="Subir lanzamiento"
            className="grid size-7 place-items-center rounded-md text-white/30 hover:bg-white/6 hover:text-white disabled:opacity-20"
          >
            <ArrowUp className="size-3.5" />
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={() => onMove(1)}
            aria-label="Bajar lanzamiento"
            className="grid size-7 place-items-center rounded-md text-white/30 hover:bg-white/6 hover:text-white disabled:opacity-20"
          >
            <ArrowDown className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            aria-label="Eliminar lanzamiento"
            className="grid size-7 place-items-center rounded-md text-white/30 hover:bg-red-400/10 hover:text-red-300"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
        <ChevronDown className="size-4 text-white/30 transition group-open:rotate-180" />
      </summary>
      <div className="grid gap-5 border-t border-white/8 p-4 sm:grid-cols-2 sm:p-5">
        <label className={labelClass}>
          Nombre del lanzamiento
          <input
            required
            value={release.name}
            onChange={(e) => update("name", e.target.value)}
            className={fieldClass}
            placeholder="Velocity 2.1"
          />
        </label>
        <label className={labelClass}>
          Versión
          <input
            required
            value={release.version}
            onChange={(e) => update("version", e.target.value)}
            className={fieldClass}
            placeholder="2.1.0"
          />
        </label>
        <label className={labelClass}>
          Canal
          <select
            value={release.channel}
            onChange={(e) =>
              update("channel", e.target.value as ReleaseInput["channel"])
            }
            className={fieldClass}
          >
            {RELEASE_CHANNELS.map((value) => (
              <option key={value} value={value}>
                {value === "release"
                  ? "Estable"
                  : value === "beta"
                    ? "Beta"
                    : "Alpha"}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          Estado
          <select
            value={release.status}
            onChange={(e) =>
              update("status", e.target.value as ReleaseInput["status"])
            }
            className={fieldClass}
          >
            {RELEASE_STATUSES.map((value) => (
              <option key={value} value={value}>
                {projectStatusLabels[value]}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          Versiones de Minecraft
          <input
            required
            value={gameVersions}
            onChange={(e) => {
              setGameVersions(e.target.value);
              update(
                "gameVersions",
                e.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              );
            }}
            className={fieldClass}
            placeholder="1.21.4, 1.21.5"
          />
          <span className="mt-1.5 block text-[10px] font-normal text-white/30">
            Separa varias versiones con comas.
          </span>
        </label>
        <label className={labelClass}>
          Loaders
          <input
            required
            value={loaders}
            onChange={(e) => {
              setLoaders(e.target.value);
              update(
                "loaders",
                e.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              );
            }}
            className={fieldClass}
            placeholder="fabric, neoforge"
          />
          <span className="mt-1.5 block text-[10px] font-normal text-white/30">
            Admite loaders nuevos sin cambios de código.
          </span>
        </label>
        <label className={`${labelClass} sm:col-span-2`}>
          URL de descarga
          <div className="relative">
            <ExternalLink className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-white/25" />
            <input
              required
              type="url"
              value={release.downloadUrl}
              onChange={(e) => update("downloadUrl", e.target.value)}
              className={`${fieldClass} pl-9`}
              placeholder="https://cdn.example.com/mod.jar"
            />
          </div>
        </label>
        <label className={labelClass}>
          Nombre del archivo
          <input
            value={release.filename}
            onChange={(e) => update("filename", e.target.value)}
            className={fieldClass}
            placeholder="velocity-2.1.0.jar"
          />
        </label>
        <label className={`${labelClass} sm:col-span-2`}>
          Notas de versión
          <textarea
            value={release.changelog}
            onChange={(e) => update("changelog", e.target.value)}
            className={textareaClass}
            placeholder="Cambios, correcciones y notas de compatibilidad…"
          />
        </label>
      </div>
    </details>
  );
}

export function ProjectForm({ project }: { project?: ProjectDetail }) {
  const [state, setState] = useState<{
    status: "idle" | "error";
    message: string;
    fieldErrors?: Record<string, string[]>;
  }>({ status: "idle", message: "" });
  const [pending, setPending] = useState(false);
  const [name, setName] = useState(project?.name ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(project));
  const [releases, setReleases] = useState<ReleaseInput[]>(
    project?.releases ?? [],
  );

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    const parsed = projectInputSchema.safeParse({
      name: data.get("name"),
      slug: data.get("slug"),
      summary: data.get("summary"),
      description: data.get("description"),
      type: data.get("type"),
      status: data.get("status"),
      visibility: data.get("visibility"),
      iconUrl: data.get("iconUrl") ?? "",
      sourceUrl: data.get("sourceUrl") ?? "",
      issuesUrl: data.get("issuesUrl") ?? "",
      license: data.get("license") ?? "",
      clientSide: data.get("clientSide"),
      serverSide: data.get("serverSide"),
      featured: data.get("featured") === "on",
      releases,
    });
    if (!parsed.success) {
      setState({
        status: "error",
        message: "Revisa los campos indicados antes de guardar.",
        fieldErrors: z.flattenError(parsed.error).fieldErrors,
      });
      return;
    }
    setPending(true);
    setState({ status: "idle", message: "" });
    try {
      await saveProject(project?.id ?? null, parsed.data);
      window.location.assign(
        `/admin/projects/?result=${project ? "updated" : "created"}`,
      );
    } catch (error) {
      const code =
        typeof error === "object" && error && "code" in error
          ? error.code
          : null;
      setState({
        status: "error",
        message:
          code === "23505"
            ? "Ya existe un proyecto o una versión con ese identificador."
            : "No se pudo guardar el proyecto. Comprueba la conexión y tus permisos e inténtalo de nuevo.",
      });
      setPending(false);
    }
  }

  const updateRelease = (index: number, next: ReleaseInput) =>
    setReleases((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? next : item)),
    );
  const moveRelease = (index: number, direction: -1 | 1) => {
    setReleases((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target]!, next[index]!];
      return next;
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-5 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 text-xs text-white/35 transition hover:text-white"
          >
            <ArrowLeft className="size-3.5" /> Volver a proyectos
          </Link>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight">
            {project ? `Editar ${project.name}` : "Crear proyecto"}
          </h1>
          <p className="mt-2 text-sm text-white/40">
            {project
              ? "Actualiza la ficha y administra sus lanzamientos."
              : "Configura la ficha principal; podrás ampliarla en cualquier momento."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="inline-flex h-10 items-center rounded-lg px-4 text-xs text-white/45 hover:bg-white/5 hover:text-white"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-10 min-w-36 items-center justify-center gap-2 rounded-lg bg-white px-4 text-xs font-semibold text-black hover:bg-neutral-200 disabled:cursor-wait disabled:opacity-55"
          >
            {pending ? (
              <>
                <LoaderCircle className="size-3.5 animate-spin" /> Guardando…
              </>
            ) : (
              <>
                <Check className="size-3.5" />{" "}
                {project ? "Guardar cambios" : "Crear proyecto"}
              </>
            )}
          </button>
        </div>
      </div>

      {state.status === "error" ? (
        <div
          role="alert"
          className="mb-3 flex items-start gap-3 rounded-xl border border-red-400/15 bg-red-400/[0.05] p-4 text-xs text-red-200"
        >
          <Info className="mt-0.5 size-4 shrink-0" />
          <div>
            <p className="font-medium">No se han guardado los cambios</p>
            <p className="mt-1 text-red-200/65">{state.message}</p>
          </div>
        </div>
      ) : null}

      <Section
        number="01 / IDENTIDAD"
        title="Información principal"
        description="Datos con los que el proyecto aparecerá en el catálogo y los buscadores."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            Nombre
            <input
              name="name"
              required
              minLength={2}
              maxLength={80}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              className={fieldClass}
              placeholder="Journey Map Tools"
            />
            <FieldError errors={state.fieldErrors?.name} />
          </label>
          <label className={labelClass}>
            Slug
            <input
              name="slug"
              required
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              className={fieldClass}
              placeholder="journey-map-tools"
            />
            <FieldError errors={state.fieldErrors?.slug} />
          </label>
          <label className={labelClass}>
            Tipo
            <select
              name="type"
              defaultValue={project?.type ?? "mod"}
              className={fieldClass}
            >
              {PROJECT_TYPES.map((value) => (
                <option key={value} value={value}>
                  {projectTypeLabels[value]}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            URL del icono
            <input
              name="iconUrl"
              type="url"
              defaultValue={project?.iconUrl}
              className={fieldClass}
              placeholder="https://…/icon.png"
            />
            <FieldError errors={state.fieldErrors?.iconUrl} />
          </label>
          <label className={`${labelClass} sm:col-span-2`}>
            Resumen
            <input
              name="summary"
              required
              minLength={10}
              maxLength={220}
              defaultValue={project?.summary}
              className={fieldClass}
              placeholder="Una descripción breve y clara del valor del proyecto."
            />
            <FieldError errors={state.fieldErrors?.summary} />
          </label>
          <label className={`${labelClass} sm:col-span-2`}>
            Descripción
            <textarea
              name="description"
              defaultValue={project?.description}
              className={`${textareaClass} min-h-40`}
              placeholder="Describe qué hace, cómo se utiliza y qué lo diferencia…"
            />
          </label>
        </div>
      </Section>

      <Section
        number="02 / DISTRIBUCIÓN"
        title="Publicación y acceso"
        description="Controla el estado del contenido y quién podrá encontrarlo en el portal."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            Estado
            <select
              name="status"
              defaultValue={project?.status ?? "draft"}
              className={fieldClass}
            >
              {PROJECT_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {projectStatusLabels[value]}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Visibilidad
            <select
              name="visibility"
              defaultValue={project?.visibility ?? "public"}
              className={fieldClass}
            >
              {PROJECT_VISIBILITIES.map((value) => (
                <option key={value} value={value}>
                  {visibilityLabels[value]}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Licencia
            <input
              name="license"
              defaultValue={project?.license}
              className={fieldClass}
              placeholder="MIT, ARR, LGPL-3.0…"
            />
          </label>
          <label className="flex items-center gap-3 self-end rounded-lg border border-white/8 bg-black/15 px-4 py-3 text-xs text-white/55">
            <input
              name="featured"
              type="checkbox"
              defaultChecked={project?.featured}
              className="size-4 rounded border-white/20 bg-black text-neutral-300 focus:ring-neutral-300/25"
            />{" "}
            Destacar en el catálogo
          </label>
          <label className={labelClass}>
            Código fuente
            <input
              name="sourceUrl"
              type="url"
              defaultValue={project?.sourceUrl}
              className={fieldClass}
              placeholder="https://github.com/…"
            />
            <FieldError errors={state.fieldErrors?.sourceUrl} />
          </label>
          <label className={labelClass}>
            Seguimiento de errores
            <input
              name="issuesUrl"
              type="url"
              defaultValue={project?.issuesUrl}
              className={fieldClass}
              placeholder="https://github.com/…/issues"
            />
            <FieldError errors={state.fieldErrors?.issuesUrl} />
          </label>
        </div>
      </Section>

      <Section
        number="03 / ENTORNO"
        title="Compatibilidad"
        description="Indica en qué lado debe instalarse. Cada lanzamiento define sus versiones y loaders."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            Cliente
            <select
              name="clientSide"
              defaultValue={project?.clientSide ?? "optional"}
              className={fieldClass}
            >
              {SIDE_SUPPORT.map((value) => (
                <option key={value} value={value}>
                  {sideSupportLabels[value]}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Servidor
            <select
              name="serverSide"
              defaultValue={project?.serverSide ?? "optional"}
              className={fieldClass}
            >
              {SIDE_SUPPORT.map((value) => (
                <option key={value} value={value}>
                  {sideSupportLabels[value]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Section>

      <Section
        number="04 / LANZAMIENTOS"
        title="Versiones y archivos"
        description="Crea versiones independientes con sus propios loaders, versiones de Minecraft y enlace de descarga."
      >
        <div className="space-y-3">
          {releases.map((release, index) => (
            <ReleaseEditor
              key={release.id ?? `new-${index}`}
              release={release}
              index={index}
              total={releases.length}
              onChange={(next) => updateRelease(index, next)}
              onRemove={() =>
                setReleases((current) =>
                  current.filter((_, itemIndex) => itemIndex !== index),
                )
              }
              onMove={(direction) => moveRelease(index, direction)}
            />
          ))}
          {releases.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 px-6 py-10 text-center">
              <PackageOpen className="mx-auto size-5 text-white/25" />
              <p className="mt-3 text-xs font-medium">
                Todavía no hay lanzamientos
              </p>
              <p className="mt-1 text-[11px] text-white/35">
                Puedes guardar el proyecto como borrador y añadirlos después.
              </p>
            </div>
          ) : null}
          <FieldError errors={state.fieldErrors?.releases} />
          <button
            type="button"
            disabled={releases.length >= 50}
            onClick={() =>
              setReleases((current) => [...current, emptyRelease()])
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/12 py-3 text-xs text-white/45 transition hover:border-white/25 hover:bg-white/[0.025] hover:text-white disabled:opacity-30"
          >
            <CirclePlus className="size-3.5" /> Añadir lanzamiento
          </button>
        </div>
      </Section>

      <div className="flex flex-col items-center justify-between gap-4 border-t border-white/8 py-8 sm:flex-row">
        <p className="flex items-center gap-2 text-[11px] text-white/30">
          <FileArchive className="size-3.5" /> Los enlaces externos podrán
          migrarse a archivos alojados sin cambiar el modelo.
        </p>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-10 min-w-40 items-center justify-center gap-2 rounded-lg bg-white px-4 text-xs font-semibold text-black hover:bg-neutral-200 disabled:cursor-wait disabled:opacity-55"
        >
          {pending ? (
            <>
              <LoaderCircle className="size-3.5 animate-spin" /> Guardando…
            </>
          ) : (
            <>
              <Check className="size-3.5" /> Guardar proyecto
            </>
          )}
        </button>
      </div>
    </form>
  );
}
