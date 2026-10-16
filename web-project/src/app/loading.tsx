import { SiteShell } from "@/components/public/site-shell";

export default function Loading() {
  return (
    <SiteShell>
      <div
        className="site-container site-loading"
        aria-label="Cargando catálogo"
        role="status"
      >
        <div className="site-skeleton short" />
        <div className="site-skeleton heading" />
        <div className="site-skeleton body" />
        <div className="site-skeleton panel" />
      </div>
    </SiteShell>
  );
}
