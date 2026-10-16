import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function ProjectNotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <SearchX className="mx-auto size-8 text-white/25" />
        <h1 className="mt-5 text-xl font-semibold">Proyecto no encontrado</h1>
        <p className="mt-2 text-sm text-white/40">
          Puede que se haya eliminado o que el enlace ya no sea válido.
        </p>
        <Link
          href="/admin/projects"
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-xs hover:bg-white/5"
        >
          <ArrowLeft className="size-3.5" /> Volver a proyectos
        </Link>
      </div>
    </div>
  );
}
