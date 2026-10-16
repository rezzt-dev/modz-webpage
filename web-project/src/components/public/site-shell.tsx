import { Link } from "@/components/link";
import { ArrowUpRight, CodeXml } from "lucide-react";

import { Wordmark } from "@/components/brand/wordmark";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell min-h-screen">
      <div className="site-status-bar">
        <span>MODZ / PROJECT INDEX</span>
        <span className="site-status-right">
          <i aria-hidden="true" /> ECOSISTEMA MINECRAFT
        </span>
      </div>
      <header className="site-header">
        <div className="site-container site-header-inner">
          <Link
            href="/"
            aria-label="modz.dev, inicio"
            className="site-brand-link"
          >
            <Wordmark />
          </Link>
          <nav aria-label="Navegación principal" className="site-nav">
            <Link href="/#catalogo">
              EXPLORAR <span>↗</span>
            </Link>
            <a
              href="https://github.com/rezzt-dev/modz-webpage"
              target="_blank"
              rel="noopener noreferrer"
            >
              <CodeXml size={15} aria-hidden="true" /> GITHUB{" "}
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </nav>
        </div>
      </header>
      <main id="main-content">{children}</main>
      <footer className="site-footer">
        <div className="site-container site-footer-inner">
          <div>
            <p className="site-footer-brand">
              MODZ<span>.</span>DEV
            </p>
            <p>Un índice técnico para proyectos del ecosistema Minecraft.</p>
          </div>
          <div className="site-footer-links">
            <a
              href="https://github.com/rezzt-dev/modz-webpage"
              target="_blank"
              rel="noopener noreferrer"
            >
              CÓDIGO FUENTE ↗
            </a>
            <a
              href="https://github.com/rezzt-dev/modz-webpage/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              REPORTAR UN PROBLEMA ↗
            </a>
          </div>
          <span className="site-footer-meta">© MODZ.DEV</span>
        </div>
      </footer>
    </div>
  );
}
