import "server-only";

import { and, asc, desc, eq, inArray, notInArray, sql } from "drizzle-orm";

import { db } from "@/db";
import {
  projectReleases,
  projects,
  releaseFiles,
  releaseGameVersions,
  releaseLoaders,
} from "@/db/schema";
import type {
  ProjectDetail,
  ProjectInput,
  ProjectSummary,
  ReleaseInput,
} from "@/features/projects/project-schema";

function compactUnique(values: string[]) {
  return [...new Set(values.map((value) => value.trim().toLowerCase()))].filter(
    Boolean,
  );
}

async function insertReleases(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  projectId: string,
  releases: ReleaseInput[],
) {
  for (const [sortOrder, release] of releases.entries()) {
    const [created] = await tx
      .insert(projectReleases)
      .values({
        projectId,
        version: release.version,
        name: release.name,
        changelog: release.changelog,
        channel: release.channel,
        status: release.status,
        sortOrder,
        publishedAt: release.status === "published" ? new Date() : null,
      })
      .returning({ id: projectReleases.id });

    if (!created) throw new Error("No se pudo crear el lanzamiento.");

    const gameVersions = compactUnique(release.gameVersions);
    const loaders = compactUnique(release.loaders);

    await Promise.all([
      tx.insert(releaseGameVersions).values(
        gameVersions.map((gameVersion) => ({
          releaseId: created.id,
          gameVersion,
        })),
      ),
      tx.insert(releaseLoaders).values(
        loaders.map((loader) => ({
          releaseId: created.id,
          loader,
        })),
      ),
      tx.insert(releaseFiles).values({
        releaseId: created.id,
        displayName: release.filename || `${release.name} ${release.version}`,
        filename: release.filename || null,
        kind: "external",
        url: release.downloadUrl,
        primary: true,
      }),
    ]);
  }
}

async function syncReleases(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  projectId: string,
  releases: ReleaseInput[],
) {
  const existing = await tx
    .select({ id: projectReleases.id })
    .from(projectReleases)
    .where(eq(projectReleases.projectId, projectId));
  const existingIds = new Set(existing.map(({ id }) => id));
  const retainedIds = releases
    .map(({ id }) => id)
    .filter((id): id is string => Boolean(id && existingIds.has(id)));

  if (retainedIds.length > 0) {
    await tx
      .delete(projectReleases)
      .where(
        and(
          eq(projectReleases.projectId, projectId),
          notInArray(projectReleases.id, retainedIds),
        ),
      );
  } else if (existing.length > 0) {
    await tx
      .delete(projectReleases)
      .where(eq(projectReleases.projectId, projectId));
  }

  await Promise.all(
    retainedIds.map((releaseId) =>
      tx
        .update(projectReleases)
        .set({ version: `__sync__${releaseId}` })
        .where(eq(projectReleases.id, releaseId)),
    ),
  );

  for (const [sortOrder, release] of releases.entries()) {
    if (!release.id || !existingIds.has(release.id)) {
      await insertReleases(tx, projectId, [release]);
      await tx
        .update(projectReleases)
        .set({ sortOrder })
        .where(
          and(
            eq(projectReleases.projectId, projectId),
            eq(projectReleases.version, release.version),
          ),
        );
      continue;
    }
    const releaseId = release.id;

    await tx
      .update(projectReleases)
      .set({
        version: release.version,
        name: release.name,
        changelog: release.changelog,
        channel: release.channel,
        status: release.status,
        sortOrder,
        publishedAt:
          release.status === "published"
            ? sql`coalesce(${projectReleases.publishedAt}, now())`
            : null,
      })
      .where(
        and(
          eq(projectReleases.id, releaseId),
          eq(projectReleases.projectId, projectId),
        ),
      );

    await Promise.all([
      tx
        .delete(releaseGameVersions)
        .where(eq(releaseGameVersions.releaseId, releaseId)),
      tx.delete(releaseLoaders).where(eq(releaseLoaders.releaseId, releaseId)),
      tx.delete(releaseFiles).where(eq(releaseFiles.releaseId, releaseId)),
    ]);

    await Promise.all([
      tx.insert(releaseGameVersions).values(
        compactUnique(release.gameVersions).map((gameVersion) => ({
          releaseId,
          gameVersion,
        })),
      ),
      tx.insert(releaseLoaders).values(
        compactUnique(release.loaders).map((loader) => ({
          releaseId,
          loader,
        })),
      ),
      tx.insert(releaseFiles).values({
        releaseId,
        displayName: release.filename || `${release.name} ${release.version}`,
        filename: release.filename || null,
        kind: "external",
        url: release.downloadUrl,
        primary: true,
      }),
    ]);
  }
}

export async function listProjects(): Promise<ProjectSummary[]> {
  const projectRows = await db
    .select()
    .from(projects)
    .orderBy(desc(projects.updatedAt));
  if (projectRows.length === 0) return [];

  const projectIds = projectRows.map(({ id }) => id);
  const releaseRows = await db
    .select()
    .from(projectReleases)
    .where(inArray(projectReleases.projectId, projectIds))
    .orderBy(asc(projectReleases.sortOrder));
  const releaseIds = releaseRows.map(({ id }) => id);
  const [gameRows, loaderRows] = releaseIds.length
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

  return projectRows.map((project) => {
    const releases = releaseRows.filter(
      (release) => release.projectId === project.id,
    );
    const latest = releases[0];
    return {
      id: project.id,
      slug: project.slug,
      name: project.name,
      summary: project.summary,
      type: project.type,
      status: project.status,
      visibility: project.visibility,
      iconUrl: project.iconUrl,
      featured: project.featured,
      updatedAt: project.updatedAt,
      releaseCount: releases.length,
      latestVersion: latest?.version ?? null,
      latestGameVersions: latest
        ? gameRows
            .filter(({ releaseId }) => releaseId === latest.id)
            .map(({ gameVersion }) => gameVersion)
        : [],
      latestLoaders: latest
        ? loaderRows
            .filter(({ releaseId }) => releaseId === latest.id)
            .map(({ loader }) => loader)
        : [],
    };
  });
}

export async function getProject(id: string): Promise<ProjectDetail | null> {
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);
  if (!project) return null;

  const releases = await db
    .select()
    .from(projectReleases)
    .where(eq(projectReleases.projectId, id))
    .orderBy(asc(projectReleases.sortOrder));
  const releaseIds = releases.map((release) => release.id);
  const [gameRows, loaderRows, fileRows] = releaseIds.length
    ? await Promise.all([
        db
          .select()
          .from(releaseGameVersions)
          .where(inArray(releaseGameVersions.releaseId, releaseIds)),
        db
          .select()
          .from(releaseLoaders)
          .where(inArray(releaseLoaders.releaseId, releaseIds)),
        db
          .select()
          .from(releaseFiles)
          .where(inArray(releaseFiles.releaseId, releaseIds)),
      ])
    : [[], [], []];

  return {
    id: project.id,
    name: project.name,
    slug: project.slug,
    summary: project.summary,
    description: project.description,
    type: project.type,
    status: project.status,
    visibility: project.visibility,
    iconUrl: project.iconUrl ?? "",
    sourceUrl: project.sourceUrl ?? "",
    issuesUrl: project.issuesUrl ?? "",
    license: project.license ?? "",
    clientSide: project.clientSide,
    serverSide: project.serverSide,
    featured: project.featured,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    releases: releases.map((release) => {
      const primaryFile = fileRows.find(
        (file) => file.releaseId === release.id && file.primary,
      );
      return {
        id: release.id,
        version: release.version,
        name: release.name,
        changelog: release.changelog,
        channel: release.channel,
        status: release.status,
        gameVersions: gameRows
          .filter(({ releaseId }) => releaseId === release.id)
          .map(({ gameVersion }) => gameVersion),
        loaders: loaderRows
          .filter(({ releaseId }) => releaseId === release.id)
          .map(({ loader }) => loader),
        downloadUrl: primaryFile?.url ?? "",
        filename: primaryFile?.filename ?? "",
      };
    }),
  };
}

export async function createProject(input: ProjectInput) {
  return db.transaction(async (tx) => {
    const { releases, ...project } = input;
    const [created] = await tx
      .insert(projects)
      .values({
        ...project,
        iconUrl: input.iconUrl || null,
        sourceUrl: input.sourceUrl || null,
        issuesUrl: input.issuesUrl || null,
        license: input.license || null,
        publishedAt: input.status === "published" ? new Date() : null,
      })
      .returning({ id: projects.id });
    if (!created) throw new Error("No se pudo crear el proyecto.");
    await insertReleases(tx, created.id, releases);
    return created.id;
  });
}

export async function updateProject(id: string, input: ProjectInput) {
  return db.transaction(async (tx) => {
    const [updated] = await tx
      .update(projects)
      .set({
        name: input.name,
        slug: input.slug,
        summary: input.summary,
        description: input.description,
        type: input.type,
        status: input.status,
        visibility: input.visibility,
        iconUrl: input.iconUrl || null,
        sourceUrl: input.sourceUrl || null,
        issuesUrl: input.issuesUrl || null,
        license: input.license || null,
        clientSide: input.clientSide,
        serverSide: input.serverSide,
        featured: input.featured,
        updatedAt: new Date(),
        publishedAt:
          input.status === "published"
            ? sql`coalesce(${projects.publishedAt}, now())`
            : null,
      })
      .where(eq(projects.id, id))
      .returning({ id: projects.id });
    if (!updated) return false;

    await syncReleases(tx, id, input.releases);
    return true;
  });
}

export async function deleteProject(id: string) {
  const deleted = await db
    .delete(projects)
    .where(eq(projects.id, id))
    .returning({ id: projects.id });
  return deleted.length > 0;
}
