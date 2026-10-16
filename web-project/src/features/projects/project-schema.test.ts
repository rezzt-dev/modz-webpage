import { z } from "zod";
import { describe, expect, it } from "vitest";

import { projectInputSchema } from "./project-schema";

const validProject = {
  name: "Sodium Extras",
  slug: "sodium-extras",
  summary: "Mejoras de rendimiento para una experiencia más fluida.",
  description: "",
  type: "mod",
  status: "draft",
  visibility: "public",
  iconUrl: "",
  sourceUrl: "https://github.com/example/project",
  issuesUrl: "",
  license: "MIT",
  clientSide: "required",
  serverSide: "unsupported",
  featured: false,
  releases: [
    {
      version: "2.0.0",
      name: "Sodium Extras 2.0",
      changelog: "Primera versión estable.",
      channel: "release",
      status: "published",
      gameVersions: ["1.21.4", "1.21.5"],
      loaders: ["fabric", "neoforge"],
      downloadUrl: "https://example.com/sodium-extras.jar",
      filename: "sodium-extras-2.0.0.jar",
    },
  ],
} as const;

describe("projectInputSchema", () => {
  it("acepta un proyecto con compatibilidad múltiple", () => {
    const result = projectInputSchema.safeParse(validProject);
    expect(result.success).toBe(true);
  });

  it("acepta proyectos en borrador sin lanzamientos", () => {
    const result = projectInputSchema.safeParse({
      ...validProject,
      releases: [],
    });
    expect(result.success).toBe(true);
  });

  it("rechaza slugs y enlaces de descarga no válidos", () => {
    const result = projectInputSchema.safeParse({
      ...validProject,
      slug: "Slug Con Espacios",
      releases: [{ ...validProject.releases[0], downloadUrl: "archivo.jar" }],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = z.flattenError(result.error).fieldErrors;
      expect(fields.slug).toBeDefined();
      expect(fields.releases).toBeDefined();
    }
  });

  it("rechaza números de versión duplicados dentro del proyecto", () => {
    const result = projectInputSchema.safeParse({
      ...validProject,
      releases: [validProject.releases[0], { ...validProject.releases[0] }],
    });
    expect(result.success).toBe(false);
  });
});
