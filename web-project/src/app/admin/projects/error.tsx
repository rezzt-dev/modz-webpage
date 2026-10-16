"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ProjectsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="max-w-md text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-red-400/10 text-red-300">
          <AlertTriangle className="size-5" />
        </span>
        <h1 className="mt-5 text-xl font-semibold">Algo no ha salido bien</h1>
        <p className="mt-2 text-sm leading-relaxed text-white/40">
          No hemos podido preparar esta vista. Puedes reintentar sin perder los
          cambios guardados.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-emerald-200"
        >
          <RotateCcw className="size-3.5" /> Reintentar
        </button>
      </div>
    </div>
  );
}
