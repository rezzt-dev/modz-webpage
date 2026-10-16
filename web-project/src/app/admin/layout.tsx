import Link from "next/link";
import { ArrowLeft, ArrowUpRight, FolderKanban } from "lucide-react";

import { Wordmark } from "@/components/brand/wordmark";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="admin-shell min-h-screen">
      <aside className="admin-sidebar">
        <Link
          href="/"
          className="admin-sidebar-brand"
          aria-label="Volver al sitio"
        >
          <Wordmark />
        </Link>
        <p className="admin-nav-label">ESPACIO DE TRABAJO / 01</p>
        <nav aria-label="Navegación del panel">
          <Link href="/admin/projects" className="admin-nav-item">
            <FolderKanban size={17} /> Proyectos <span>↗</span>
          </Link>
        </nav>
        <div className="admin-sidebar-bottom">
          <span className="signal-dot" /> PANEL DE GESTIÓN{" "}
          <p>Contenido, versiones y archivos del catálogo.</p>
        </div>
      </aside>
      <div className="admin-content">
        <header className="admin-header">
          <div className="admin-mobile-brand">
            <Link href="/">
              <Wordmark />
            </Link>
          </div>
          <span className="admin-header-location">
            MODZ / ADMIN / PROYECTOS
          </span>
          <div className="admin-header-links">
            <Link href="/admin/projects">PROYECTOS</Link>
            <Link href="/" target="_blank" rel="noopener noreferrer">
              VER SITIO <ArrowUpRight size={14} />
            </Link>
          </div>
        </header>
        <main className="admin-main">
          <div className="admin-mobile-back">
            <Link href="/">
              <ArrowLeft size={14} /> VOLVER AL SITIO
            </Link>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
