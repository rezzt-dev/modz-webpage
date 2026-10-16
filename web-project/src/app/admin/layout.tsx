import Link from "next/link";
import { FolderKanban, LayoutGrid, Settings, Users } from "lucide-react";

import { Wordmark } from "@/components/brand/wordmark";

const navigation = [
  {
    href: "/admin/projects",
    label: "Proyectos",
    icon: FolderKanban,
    active: true,
    disabled: false,
  },
  {
    href: "#",
    label: "Resumen",
    icon: LayoutGrid,
    active: false,
    disabled: true,
  },
  { href: "#", label: "Usuarios", icon: Users, active: false, disabled: true },
  {
    href: "#",
    label: "Ajustes",
    icon: Settings,
    active: false,
    disabled: true,
  },
] as const;

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-screen bg-[#070807] text-[#f4f5f3]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-white/8 bg-[#090a09] lg:flex lg:flex-col">
        <div className="flex h-20 items-center border-b border-white/8 px-7">
          <Wordmark />
        </div>
        <div className="px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.2em] text-white/35 uppercase">
            Workspace
          </p>
          <nav className="space-y-1" aria-label="Navegación del panel">
            {navigation.map((item) => {
              const Icon = item.icon;
              return item.disabled ? (
                <span
                  key={item.label}
                  aria-disabled="true"
                  className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/25"
                >
                  <Icon className="size-4" />
                  {item.label}
                  <span className="ml-auto text-[9px] tracking-wider uppercase">
                    Pronto
                  </span>
                </span>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={item.active ? "page" : undefined}
                  className="flex items-center gap-3 rounded-lg bg-white/8 px-3 py-2.5 text-sm font-medium text-white ring-1 ring-white/8"
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto border-t border-white/8 p-5">
          <div className="rounded-xl border border-white/8 bg-white/[0.025] p-4">
            <p className="text-xs font-medium text-white">Área privada</p>
            <p className="mt-1 text-[11px] leading-relaxed text-white/40">
              El acceso de colaboradores se habilitará manualmente.
            </p>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/8 bg-[#070807]/90 px-5 backdrop-blur-xl sm:px-8 lg:h-20 lg:px-10">
          <Wordmark className="lg:hidden" />
          <div className="hidden lg:block">
            <p className="text-xs font-medium text-white/35">
              Panel de administración
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-medium text-white">Administrador</p>
              <p className="text-[10px] text-white/35">Acceso local</p>
            </div>
            <span className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/8 text-xs font-semibold">
              AD
            </span>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1480px] p-5 sm:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
