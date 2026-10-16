"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { projectInputSchema } from "./project-schema";
import {
  createProject,
  deleteProject,
  updateProject,
} from "@/server/projects/project-repository";

export type ProjectActionState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: Record<string, string[]> | undefined;
};

export const initialProjectActionState: ProjectActionState = {
  status: "idle",
  message: "",
};

function databaseMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  ) {
    return "Ya existe un proyecto o una versión con ese identificador.";
  }
  return "No se pudo guardar el proyecto. Comprueba la conexión e inténtalo de nuevo.";
}

function parseProjectForm(formData: FormData) {
  const releasesRaw = formData.get("releases");
  let releases: unknown = [];
  try {
    releases = JSON.parse(typeof releasesRaw === "string" ? releasesRaw : "[]");
  } catch {
    return {
      success: false as const,
      message: "Los lanzamientos contienen datos no válidos.",
    };
  }

  const result = projectInputSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    type: formData.get("type"),
    status: formData.get("status"),
    visibility: formData.get("visibility"),
    iconUrl: formData.get("iconUrl") ?? "",
    sourceUrl: formData.get("sourceUrl") ?? "",
    issuesUrl: formData.get("issuesUrl") ?? "",
    license: formData.get("license") ?? "",
    clientSide: formData.get("clientSide"),
    serverSide: formData.get("serverSide"),
    featured: formData.get("featured") === "on",
    releases,
  });

  if (!result.success) {
    return {
      success: false as const,
      message: "Revisa los campos indicados antes de guardar.",
      fieldErrors: z.flattenError(result.error).fieldErrors,
    };
  }
  return { success: true as const, data: result.data };
}

export async function saveProjectAction(
  projectId: string | null,
  _previousState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const parsed = parseProjectForm(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.message,
      fieldErrors: parsed.fieldErrors,
    };
  }

  let savedId: string;
  try {
    if (projectId) {
      const updated = await updateProject(projectId, parsed.data);
      if (!updated)
        return { status: "error", message: "El proyecto ya no existe." };
      savedId = projectId;
    } else {
      savedId = await createProject(parsed.data);
    }
  } catch (error) {
    return { status: "error", message: databaseMessage(error) };
  }

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${savedId}`);
  redirect(`/admin/projects?result=${projectId ? "updated" : "created"}`);
}

export async function deleteProjectAction(
  projectId: string,
  previousState: ProjectActionState,
): Promise<ProjectActionState> {
  void previousState;
  try {
    const deleted = await deleteProject(projectId);
    if (!deleted)
      return { status: "error", message: "El proyecto ya no existe." };
    revalidatePath("/admin/projects");
    return { status: "success", message: "Proyecto eliminado correctamente." };
  } catch {
    return {
      status: "error",
      message: "No se pudo eliminar el proyecto. Inténtalo de nuevo.",
    };
  }
}
