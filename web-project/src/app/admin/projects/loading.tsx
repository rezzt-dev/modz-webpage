export default function ProjectsLoading() {
  return (
    <div className="animate-pulse" aria-label="Cargando proyectos">
      <div className="h-3 w-24 rounded bg-white/8" />
      <div className="mt-4 h-10 w-72 rounded bg-white/8" />
      <div className="mt-3 h-4 w-full max-w-xl rounded bg-white/5" />
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="h-32 rounded-2xl border border-white/6 bg-white/[0.025]"
          />
        ))}
      </div>
      <div className="mt-10 h-80 rounded-2xl border border-white/6 bg-white/[0.025]" />
    </div>
  );
}
