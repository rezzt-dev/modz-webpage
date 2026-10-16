import { ArrowDown, ArrowUpRight, Box, Boxes, Command } from "lucide-react";

import { SiteShell } from "@/components/public/site-shell";
import { PublicCatalog } from "@/features/projects/public-catalog";
import { listPublicProjects } from "@/lib/projects-api";
import { useEffect, useState } from "react";

export default function Home() {
  const [projects, setProjects] = useState<
    Awaited<ReturnType<typeof listPublicProjects>>
  >([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const load = () => {
    setState("loading");
    listPublicProjects()
      .then((data) => {
        setProjects(data);
        setState("ready");
      })
      .catch(() => setState("error"));
  };
  useEffect(() => {
    load();
  }, []);
  return (
    <SiteShell>
      <section
        className="site-hero site-container"
        aria-labelledby="hero-title"
      >
        <div className="hero-main">
          <p className="eyebrow hero-eyebrow">
            <span className="signal-dot" /> MODZ / MINECRAFT ECOSYSTEM
          </p>
          <h1 id="hero-title">
            Crea fuera de
            <br />
            <em>los límites.</em>
          </h1>
          <p className="hero-description">
            Mods, plugins y herramientas para llevar cada mundo un poco más
            lejos. Descubre proyectos con la información que importa.
          </p>
          <a href="#catalogo" className="hero-cta">
            EXPLORAR PROYECTOS <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <div className="hero-bottom-line">
            <span>01 / DESCUBRIR</span>
            <span>
              DESPLÁZATE PARA EXPLORAR <ArrowDown size={14} />
            </span>
          </div>
        </div>
        <div className="hero-aside" aria-hidden="true">
          <div className="hero-aside-top">
            <span>MODZ_SYSTEM // 001</span>
            <Command size={17} />
          </div>
          <div className="hero-diagram">
            <span className="diagram-cross cross-one">+</span>
            <span className="diagram-cross cross-two">+</span>
            <span className="diagram-orbit orbit-one" />
            <span className="diagram-orbit orbit-two" />
            <span className="diagram-core">
              <Boxes size={74} strokeWidth={0.8} />
            </span>
            <span className="diagram-label label-one">PROJECTS / 01</span>
            <span className="diagram-label label-two">PROJECT_DATA</span>
          </div>
          <div className="hero-aside-bottom">
            <span>EXPLORE / BUILD / REPEAT</span>
            <Box size={16} />
          </div>
        </div>
      </section>
      <div className="site-container">
        <div className="hero-ticker">
          <span>MODS</span>
          <span>+</span>
          <span>PLUGINS</span>
          <span>+</span>
          <span>DATAPACKS</span>
          <span>+</span>
          <span>RESOURCE PACKS</span>
          <span>+</span>
          <span>MODPACKS</span>
        </div>
      </div>
      {state === "error" ? (
        <section
          id="catalogo"
          className="site-container catalog-error"
          role="alert"
        >
          <span className="eyebrow">02 / DIRECTORIO</span>
          <h2>No se pudo cargar el índice.</h2>
          <p>
            La conexión con el catálogo no está disponible ahora. Vuelve a
            intentarlo en unos instantes.
          </p>
          <button type="button" onClick={load} className="text-action">
            REINTENTAR <ArrowUpRight size={16} />
          </button>
        </section>
      ) : state === "loading" ? (
        <div
          id="catalogo"
          className="site-container catalog-empty"
          role="status"
        >
          Cargando proyectos…
        </div>
      ) : (
        <PublicCatalog projects={projects} />
      )}
    </SiteShell>
  );
}
