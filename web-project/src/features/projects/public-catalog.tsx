"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { ProjectMark } from "@/components/public/project-mark";
import { projectTypeLabels } from "./project-labels";
import type { ProjectSummary } from "./project-schema";

type Category = ProjectSummary["type"] | "all";
const categories: Category[] = [
  "all",
  "mod",
  "plugin",
  "datapack",
  "resourcepack",
  "modpack",
];

export function PublicCatalog({ projects }: { projects: ProjectSummary[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("all");
  const [loader, setLoader] = useState("all");
  const deferredQuery = useDeferredValue(query);

  const loaders = useMemo(
    () =>
      [...new Set(projects.flatMap((project) => project.latestLoaders))].sort(),
    [projects],
  );
  const filtered = useMemo(() => {
    const term = deferredQuery.trim().toLocaleLowerCase("es");
    return projects.filter((project) => {
      const matchesText =
        !term ||
        [
          project.name,
          project.summary,
          project.latestVersion ?? "",
          ...project.latestGameVersions,
          ...project.latestLoaders,
        ].some((value) => value.toLocaleLowerCase("es").includes(term));
      return (
        matchesText &&
        (category === "all" || project.type === category) &&
        (loader === "all" || project.latestLoaders.includes(loader))
      );
    });
  }, [projects, deferredQuery, category, loader]);

  const clearFilters = () => {
    setQuery("");
    setCategory("all");
    setLoader("all");
  };

  return (
    <section
      id="catalogo"
      className="catalog-section site-container"
      aria-labelledby="catalog-title"
    >
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">
            <span>02</span> / DIRECTORIO
          </p>
          <h2 id="catalog-title">
            Explora el índice
            <span className="title-cursor" aria-hidden="true">
              _
            </span>
          </h2>
          <p>Proyectos, versiones y compatibilidad en un solo lugar.</p>
        </div>
        <div className="catalog-total">
          <strong>{projects.length.toString().padStart(2, "0")}</strong>
          <span>
            PROYECTOS
            <br />
            PUBLICADOS
          </span>
        </div>
      </div>
      <div className="catalog-workspace">
        <aside className="catalog-sidebar" aria-label="Filtros del catálogo">
          <div className="catalog-sidebar-heading">
            <SlidersHorizontal size={16} /> <span>REFINAR BÚSQUEDA</span>
          </div>
          {projects.length > 0 ? (
            <div className="filter-group">
              <p className="filter-label">TIPO DE PROYECTO</p>
              <div className="filter-options">
                {categories.map((value) => {
                  const count =
                    value === "all"
                      ? projects.length
                      : projects.filter((project) => project.type === value)
                          .length;
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-label={
                        value === "all" ? "Todos" : projectTypeLabels[value]
                      }
                      aria-pressed={category === value}
                      onClick={() => setCategory(value)}
                      className="filter-option"
                    >
                      <span>
                        {value === "all" ? "Todos" : projectTypeLabels[value]}
                      </span>
                      <span>{count.toString().padStart(2, "0")}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="catalog-sidebar-empty">
              Los filtros estarán disponibles cuando se publique el primer
              proyecto.
            </p>
          )}
          {loaders.length > 0 ? (
            <div className="filter-group">
              <label className="filter-label" htmlFor="loader-filter">
                LOADER
              </label>
              <select
                id="loader-filter"
                value={loader}
                onChange={(event) => setLoader(event.target.value)}
                className="catalog-select"
              >
                <option value="all">Todos los loaders</option>
                {loaders.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          <p className="catalog-sidebar-note">
            ÍNDICE / MODZ.DEV
            <br />
            DATOS ACTUALIZADOS DESDE EL CATÁLOGO
          </p>
        </aside>
        <div className="catalog-main">
          <div className="catalog-toolbar">
            <label className="catalog-search">
              <Search size={18} aria-hidden="true" />
              <span className="sr-only">Buscar proyectos</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar proyectos, versiones..."
                type="search"
                disabled={projects.length === 0}
              />
              <span className="catalog-search-hint" aria-hidden="true">
                ⌕
              </span>
            </label>
            <span className="catalog-result-count" aria-live="polite">
              {filtered.length.toString().padStart(2, "0")} RESULTADOS
            </span>
          </div>
          {filtered.length > 0 ? (
            <div className="project-grid">
              {filtered.map((project, index) => (
                <Link
                  href={`/projects/${project.slug}` as Route}
                  key={project.id}
                  className="project-tile"
                >
                  <div className="project-tile-top">
                    <span>
                      {(index + 1).toString().padStart(2, "0")} /{" "}
                      {projectTypeLabels[project.type].toUpperCase()}
                    </span>
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </div>
                  <ProjectMark type={project.type} iconUrl={project.iconUrl} />
                  <h3>{project.name}</h3>
                  <p className="project-tile-summary">{project.summary}</p>
                  <div className="project-tile-bottom">
                    <span>
                      {project.latestGameVersions[0]
                        ? `MC ${project.latestGameVersions[0]}`
                        : "VERSIÓN PENDIENTE"}
                    </span>
                    <span>
                      {project.latestLoaders[0]?.toUpperCase() ?? "UNIVERSAL"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="catalog-empty" role="status">
              <span className="catalog-empty-icon">
                {projects.length === 0 ? "[ 00 ]" : "[ ∅ ]"}
              </span>
              <h3>
                {projects.length === 0
                  ? "El índice está en preparación"
                  : "No encontramos coincidencias"}
              </h3>
              <p>
                {projects.length === 0
                  ? "Los proyectos publicados aparecerán aquí con sus versiones y compatibilidad."
                  : "Prueba otra búsqueda o cambia los filtros para seguir explorando."}
              </p>
              {projects.length > 0 ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-action"
                >
                  <X size={15} /> LIMPIAR FILTROS
                </button>
              ) : null}
            </div>
          )}
          {filtered.length > 0 ? (
            <p className="catalog-end">
              <span>FIN DEL ÍNDICE</span>
              <ArrowRight size={14} />
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
