import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteShell } from "@/components/public/site-shell";

export default function ProjectNotFound() {
  return (
    <SiteShell>
      <div className="site-container detail-state">
        <span className="eyebrow">404 / PROYECTO NO ENCONTRADO</span>
        <h1>Esta entrada no existe.</h1>
        <p>
          Puede que el proyecto haya cambiado de dirección o todavía no esté
          publicado.
        </p>
        <Link href="/" className="text-action">
          <ArrowLeft size={16} /> VOLVER AL ÍNDICE
        </Link>
      </div>
    </SiteShell>
  );
}
