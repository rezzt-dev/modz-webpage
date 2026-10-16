import type { ProjectInput } from "./project-schema";

export const projectTypeLabels: Record<ProjectInput["type"], string> = {
  mod: "Mod",
  plugin: "Plugin",
  datapack: "Datapack",
  resourcepack: "Resource pack",
  modpack: "Modpack",
};

export const projectStatusLabels: Record<ProjectInput["status"], string> = {
  draft: "Borrador",
  published: "Publicado",
  archived: "Archivado",
};

export const visibilityLabels: Record<ProjectInput["visibility"], string> = {
  public: "Público",
  unlisted: "No listado",
  private: "Privado",
};

export const sideSupportLabels: Record<ProjectInput["clientSide"], string> = {
  required: "Requerido",
  optional: "Opcional",
  unsupported: "No compatible",
};
