import { useCallback, useEffect, useState, type SyntheticEvent } from "react";
import { LoaderCircle, LogOut } from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import { ProjectForm } from "./project-form";
import ProjectsPage from "./admin-projects-page";
import { getProject } from "@/lib/projects-api";
import { requireSupabase } from "@/lib/supabase";
import type { ProjectDetail } from "./project-schema";

type Mode = "list" | "new" | "edit";

export default function AdminApp({ mode }: { mode: Mode }) {
  const [state, setState] = useState<
    "loading" | "login" | "ready" | "denied" | "error"
  >("loading");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [missing, setMissing] = useState(false);

  const load = useCallback(async () => {
    setState("loading");
    try {
      const client = requireSupabase();
      const {
        data: { user },
        error: authError,
      } = await client.auth.getUser();
      if (authError || !user) {
        setState("login");
        return;
      }
      const { data, error } = await client
        .from("admin_members")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        setState("denied");
        return;
      }
      if (mode === "edit") {
        const id = new URLSearchParams(window.location.search).get("id");
        if (!id) {
          setMissing(true);
          setState("ready");
          return;
        }
        const item = await getProject(id);
        setProject(item);
        setMissing(!item);
      }
      setState("ready");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "No se pudo conectar con Supabase.",
      );
      setState("error");
    }
  }, [mode]);
  useEffect(() => {
    void load();
  }, [load]);

  async function signIn(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setMessage("");
    try {
      const { error } = await requireSupabase().auth.signInWithPassword({
        email: String(form.get("email")),
        password: String(form.get("password")),
      });
      if (error) throw error;
      await load();
    } catch {
      setMessage(
        "No se pudo iniciar sesión. Comprueba las credenciales e inténtalo de nuevo.",
      );
    } finally {
      setPending(false);
    }
  }
  async function signOut() {
    await requireSupabase().auth.signOut();
    setState("login");
  }
  if (state !== "ready")
    return (
      <div className="admin-shell grid min-h-screen place-items-center p-6">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.025] p-7">
          <a href="/" className="text-xs text-white/40">
            ← VOLVER AL SITIO
          </a>
          <h1 className="mt-5 text-2xl font-semibold">Acceso al panel</h1>
          {state === "loading" ? (
            <p
              role="status"
              className="mt-5 flex items-center gap-2 text-sm text-white/50"
            >
              <LoaderCircle className="size-4 animate-spin" /> Verificando
              acceso…
            </p>
          ) : null}
          {state === "login" ? (
            <form onSubmit={signIn} className="mt-6 space-y-4">
              <label className="block text-xs text-white/60">
                Correo electrónico
                <input
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-black/30 px-3 text-white"
                />
              </label>
              <label className="block text-xs text-white/60">
                Contraseña
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-black/30 px-3 text-white"
                />
              </label>
              <button
                disabled={pending}
                className="h-10 w-full rounded-lg bg-white text-xs font-semibold text-black disabled:opacity-50"
              >
                {pending ? "Accediendo…" : "Entrar"}
              </button>
            </form>
          ) : null}
          {state === "denied" ? (
            <p className="mt-4 text-sm text-white/50">
              Tu cuenta no tiene acceso al panel. Solicita acceso al
              administrador.
            </p>
          ) : null}
          {state === "error" ? (
            <button
              type="button"
              onClick={() => void load()}
              className="mt-5 text-xs underline"
            >
              Reintentar
            </button>
          ) : null}
          {message ? (
            <p role="alert" className="mt-4 text-xs text-red-300">
              {message}
            </p>
          ) : null}
          {state === "denied" ? (
            <button
              type="button"
              onClick={() => void signOut()}
              className="mt-5 text-xs underline"
            >
              Cerrar sesión
            </button>
          ) : null}
        </div>
      </div>
    );
  return (
    <AdminLayout>
      <div className="mb-5 flex justify-end">
        <button
          type="button"
          onClick={() => void signOut()}
          className="flex items-center gap-2 text-xs text-white/40 hover:text-white"
        >
          <LogOut className="size-3.5" /> Cerrar sesión
        </button>
      </div>
      {mode === "list" ? (
        <ProjectsPage />
      ) : mode === "new" ? (
        <ProjectForm />
      ) : missing ? (
        <div role="alert" className="py-20 text-center">
          <h1>Proyecto no encontrado</h1>
          <a
            href="/admin/projects/"
            className="mt-5 inline-block text-xs underline"
          >
            Volver a proyectos
          </a>
        </div>
      ) : project ? (
        <ProjectForm project={project} />
      ) : null}
    </AdminLayout>
  );
}
