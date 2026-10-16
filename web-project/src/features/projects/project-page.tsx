import { Link } from "@/components/link";
import { useEffect, useState } from "react";
import type { ProjectDetail } from "@/features/projects/project-schema";
import {
  ArrowLeft,
  ArrowUpRight,
  CodeXml,
  Download,
  PackageOpen,
} from "lucide-react";

import { ProjectMark } from "@/components/public/project-mark";
import { SiteShell } from "@/components/public/site-shell";
import { projectTypeLabels } from "@/features/projects/project-labels";
import { getPublicProjectBySlug } from "@/lib/projects-api";

export default function ProjectPage() {
  const slug =
    typeof window === "undefined"
      ? ""
      : (new URLSearchParams(window.location.search).get("slug") ?? "");
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  useEffect(() => {
    if (!slug) {
      setState("ready");
      return;
    }
    getPublicProjectBySlug(slug)
      .then((data) => {
        setProject(data);
        setState("ready");
      })
      .catch(() => setState("error"));
  }, [slug]);
  if (state === "loading")
    return (
      <SiteShell>
        <div className="site-container detail-state" role="status">
          Cargando proyecto…
        </div>
      </SiteShell>
    );
  if (state === "error")
    return (
      <SiteShell>
        <div className="site-container detail-state" role="alert">
          <h1>No se pudo abrir el proyecto.</h1>
          <button
            className="text-action"
            onClick={() => window.location.reload()}
          >
            REINTENTAR
          </button>
        </div>
      </SiteShell>
    );
  if (project) document.title = `${project.name} · modz`;
  if (!project)
    return (
      <SiteShell>
        <div className="site-container detail-state">
          <h1>Proyecto no encontrado</h1>
          <Link href="/" className="text-action">
            VOLVER AL ÍNDICE
          </Link>
        </div>
      </SiteShell>
    );
  const releases = project.releases;
  const latest = releases[0];
  return (
    <SiteShell>
      <div className="site-container detail-page">
        <nav aria-label="Ruta de navegación" className="detail-breadcrumb">
          <Link href="/">ÍNDICE</Link>
          <span>/</span>
          <span>{projectTypeLabels[project.type].toUpperCase()}</span>
          <span>/</span>
          <span aria-current="page">{project.name.toUpperCase()}</span>
        </nav>
        <div className="detail-hero">
          <div className="detail-title-block">
            <div className="detail-kicker">
              <ProjectMark type={project.type} iconUrl={project.iconUrl} />
              <span>
                {projectTypeLabels[project.type].toUpperCase()} / PROYECTO
                PUBLICADO
              </span>
            </div>
            <h1>
              {project.name}
              <span className="title-cursor" aria-hidden="true">
                _
              </span>
            </h1>
            <p>{project.summary}</p>
          </div>
          <div className="detail-hero-action">
            {latest?.downloadUrl ? (
              <a
                href={latest.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-cta"
              >
                <Download size={17} /> DESCARGAR {latest.version.toUpperCase()}
              </a>
            ) : (
              <span className="detail-unavailable" aria-disabled="true">
                SIN DESCARGA DISPONIBLE
              </span>
            )}
            <span>VERSIÓN ACTUAL / {latest?.version ?? "PENDIENTE"}</span>
          </div>
        </div>
        <div className="detail-content">
          <aside className="detail-manifest">
            <p className="eyebrow">01 / FICHA TÉCNICA</p>
            <dl>
              <div>
                <dt>TIPO</dt>
                <dd>{projectTypeLabels[project.type]}</dd>
              </div>
              <div>
                <dt>LICENCIA</dt>
                <dd>{project.license || "No especificada"}</dd>
              </div>
              <div>
                <dt>CLIENTE</dt>
                <dd>
                  {project.clientSide === "required"
                    ? "Necesario"
                    : project.clientSide === "optional"
                      ? "Opcional"
                      : "No compatible"}
                </dd>
              </div>
              <div>
                <dt>SERVIDOR</dt>
                <dd>
                  {project.serverSide === "required"
                    ? "Necesario"
                    : project.serverSide === "optional"
                      ? "Opcional"
                      : "No compatible"}
                </dd>
              </div>
              <div>
                <dt>LOADERS</dt>
                <dd>{latest?.loaders.join(", ") || "Sin datos"}</dd>
              </div>
              <div>
                <dt>MINECRAFT</dt>
                <dd>{latest?.gameVersions.join(", ") || "Sin datos"}</dd>
              </div>
            </dl>
            {project.sourceUrl || project.issuesUrl ? (
              <div className="detail-links">
                <p className="filter-label">ENLACES</p>
                {project.sourceUrl ? (
                  <a
                    href={project.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <CodeXml size={15} /> CÓDIGO FUENTE{" "}
                    <ArrowUpRight size={14} />
                  </a>
                ) : null}
                {project.issuesUrl ? (
                  <a
                    href={project.issuesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    INCIDENCIAS <ArrowUpRight size={14} />
                  </a>
                ) : null}
              </div>
            ) : null}
          </aside>
          <div className="detail-main">
            <section className="detail-description">
              <p className="eyebrow">02 / ACERCA DEL PROYECTO</p>
              <h2>Qué hace</h2>
              <p>{project.description || project.summary}</p>
            </section>
            <section className="detail-releases">
              <div className="detail-section-heading">
                <div>
                  <p className="eyebrow">03 / DESCARGAS</p>
                  <h2>Lanzamientos</h2>
                </div>
                <span>
                  {releases.length.toString().padStart(2, "0")} VERSIONES
                </span>
              </div>
              {releases.length ? (
                <div className="release-list">
                  {releases.map((release) => (
                    <article
                      key={release.id ?? release.version}
                      className="release-row"
                    >
                      <div>
                        <span className="release-version">
                          {release.version}
                        </span>
                        <span className="release-channel">
                          {release.channel.toUpperCase()}
                        </span>
                        <p>
                          {release.gameVersions.join(" · ")} /{" "}
                          {release.loaders.join(" · ")}
                        </p>
                        {release.changelog ? (
                          <p className="release-notes">{release.changelog}</p>
                        ) : null}
                      </div>
                      {release.downloadUrl ? (
                        <a
                          href={release.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Descargar ${project.name} ${release.version}`}
                        >
                          <Download size={18} />
                        </a>
                      ) : (
                        <span aria-disabled="true">—</span>
                      )}
                    </article>
                  ))}
                </div>
              ) : (
                <div className="release-empty">
                  <PackageOpen size={23} />
                  <p>Aún no hay lanzamientos públicos para este proyecto.</p>
                </div>
              )}
            </section>
          </div>
        </div>
        <Link href="/#catalogo" className="detail-back">
          <ArrowLeft size={16} /> VOLVER AL ÍNDICE
        </Link>
      </div>
    </SiteShell>
  );
}
