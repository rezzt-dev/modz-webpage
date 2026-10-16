import "server-only";

import { and, asc, desc, eq, inArray, ne } from "drizzle-orm";

import { db } from "@/db";
import {
  projectReleases,
  projects,
  releaseGameVersions,
  releaseLoaders,
} from "@/db/schema";
import type {
  ProjectDetail,
  ProjectSummary,
} from "@/features/projects/project-schema";
import { publicHttpUrl } from "@/lib/public-url";
import { getProject } from "./project-repository";

export async function listPublicProjects(): Promise<ProjectSummary[]> {
  const rows = await db
    .select()
    .from(projects)
    .where(
      and(eq(projects.status, "published"), eq(projects.visibility, "public")),
    )
    .orderBy(desc(projects.featured), desc(projects.updatedAt));
  if (rows.length === 0) return [];

  const releases = await db
    .select()
    .from(projectReleases)
    .where(
      and(
        inArray(
          projectReleases.projectId,
          rows.map(({ id }) => id),
        ),
        eq(projectReleases.status, "published"),
      ),
    )
    .orderBy(asc(projectReleases.sortOrder));
  const releaseIds = releases.map(({ id }) => id);
  const [gameVersions, loaders] = releaseIds.length
    ? await Promise.all([
        db
          .select()
          .from(releaseGameVersions)
          .where(inArray(releaseGameVersions.releaseId, releaseIds)),
        db
          .select()
          .from(releaseLoaders)
          .where(inArray(releaseLoaders.releaseId, releaseIds)),
      ])
    : [[], []];

  return rows.map((row) => {
    const publishedReleases = releases.filter(
      (release) => release.projectId === row.id,
    );
    const latest = publishedReleases[0];
    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      summary: row.summary,
      type: row.type,
      status: row.status,
      visibility: row.visibility,
      iconUrl: publicHttpUrl(row.iconUrl),
      featured: row.featured,
      updatedAt: row.updatedAt,
      releaseCount: publishedReleases.length,
      latestVersion: latest?.version ?? null,
      latestGameVersions: latest
        ? gameVersions
            .filter(({ releaseId }) => releaseId === latest.id)
            .map(({ gameVersion }) => gameVersion)
        : [],
      latestLoaders: latest
        ? loaders
            .filter(({ releaseId }) => releaseId === latest.id)
            .map(({ loader }) => loader)
        : [],
    };
  });
}

export async function getPublicProjectBySlug(
  slug: string,
): Promise<ProjectDetail | null> {
  const [row] = await db
    .select({ id: projects.id })
    .from(projects)
    .where(
      and(
        eq(projects.slug, slug),
        eq(projects.status, "published"),
        ne(projects.visibility, "private"),
      ),
    )
    .limit(1);
  if (!row) return null;
  const project = await getProject(row.id);
  if (!project) return null;
  return {
    ...project,
    iconUrl: publicHttpUrl(project.iconUrl) ?? "",
    sourceUrl: publicHttpUrl(project.sourceUrl) ?? "",
    issuesUrl: publicHttpUrl(project.issuesUrl) ?? "",
    releases: project.releases
      .filter((release) => release.status === "published")
      .map((release) => ({
        ...release,
        downloadUrl: publicHttpUrl(release.downloadUrl) ?? "",
      })),
  };
}
