import { z } from "zod";

export const PROJECT_TYPES = [
  "mod",
  "plugin",
  "datapack",
  "resourcepack",
  "modpack",
] as const;
export const PROJECT_STATUSES = ["draft", "published", "archived"] as const;
export const PROJECT_VISIBILITIES = ["public", "unlisted", "private"] as const;
export const SIDE_SUPPORT = ["required", "optional", "unsupported"] as const;
export const RELEASE_CHANNELS = ["release", "beta", "alpha"] as const;
export const RELEASE_STATUSES = ["draft", "published", "archived"] as const;
export const KNOWN_LOADERS = [
  "fabric",
  "forge",
  "neoforge",
  "quilt",
  "paper",
  "purpur",
  "vanilla",
] as const;

const optionalUrl = z.union([
  z.literal(""),
  z.url("Introduce una URL válida."),
]);

export const releaseInputSchema = z.object({
  id: z.uuid().optional(),
  version: z.string().trim().min(1, "La versión es obligatoria.").max(40),
  name: z.string().trim().min(1, "El nombre es obligatorio.").max(100),
  changelog: z.string().trim().max(20_000).default(""),
  channel: z.enum(RELEASE_CHANNELS),
  status: z.enum(RELEASE_STATUSES),
  gameVersions: z
    .array(z.string().trim().min(1).max(30))
    .min(1, "Añade al menos una versión de Minecraft.")
    .max(30),
  loaders: z
    .array(z.string().trim().min(1).max(30))
    .min(1, "Añade al menos un loader.")
    .max(15),
  downloadUrl: z.url("Introduce una URL de descarga válida."),
  filename: z.string().trim().max(180).default(""),
});

export const projectInputSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "El nombre debe tener al menos 2 caracteres.")
      .max(80),
    slug: z
      .string()
      .trim()
      .min(2, "El slug debe tener al menos 2 caracteres.")
      .max(80)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Usa minúsculas, números y guiones.",
      ),
    summary: z
      .string()
      .trim()
      .min(10, "El resumen debe tener al menos 10 caracteres.")
      .max(220),
    description: z.string().trim().max(50_000).default(""),
    type: z.enum(PROJECT_TYPES),
    status: z.enum(PROJECT_STATUSES),
    visibility: z.enum(PROJECT_VISIBILITIES),
    iconUrl: optionalUrl,
    sourceUrl: optionalUrl,
    issuesUrl: optionalUrl,
    license: z.string().trim().max(80).default(""),
    clientSide: z.enum(SIDE_SUPPORT),
    serverSide: z.enum(SIDE_SUPPORT),
    featured: z.boolean().default(false),
    releases: z.array(releaseInputSchema).max(50),
  })
  .superRefine((project, context) => {
    const versions = new Set<string>();
    project.releases.forEach((release, index) => {
      const normalized = release.version.toLowerCase();
      if (versions.has(normalized)) {
        context.addIssue({
          code: "custom",
          message: "No puede haber dos lanzamientos con la misma versión.",
          path: ["releases", index, "version"],
        });
      }
      versions.add(normalized);
    });
  });

export type ProjectInput = z.infer<typeof projectInputSchema>;
export type ReleaseInput = z.infer<typeof releaseInputSchema>;

export type ProjectSummary = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  type: ProjectInput["type"];
  status: ProjectInput["status"];
  visibility: ProjectInput["visibility"];
  iconUrl: string | null;
  featured: boolean;
  updatedAt: Date;
  releaseCount: number;
  latestVersion: string | null;
  latestGameVersions: string[];
  latestLoaders: string[];
};

export type ProjectDetail = Omit<
  ProjectInput,
  "iconUrl" | "sourceUrl" | "issuesUrl"
> & {
  id: string;
  iconUrl: string;
  sourceUrl: string;
  issuesUrl: string;
  createdAt: Date;
  updatedAt: Date;
};
