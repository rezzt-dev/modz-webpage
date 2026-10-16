import {
  projectInputSchema,
  type ProjectDetail,
  type ProjectInput,
  type ProjectSummary,
  type ReleaseInput,
} from "@/features/projects/project-schema";
import { publicHttpUrl } from "@/lib/public-url";
import { requireSupabase } from "./supabase";

type Row = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  type: ProjectInput["type"];
  status: ProjectInput["status"];
  visibility: ProjectInput["visibility"];
  icon_url: string | null;
  source_url: string | null;
  issues_url: string | null;
  license: string | null;
  client_side: ProjectInput["clientSide"];
  server_side: ProjectInput["serverSide"];
  featured: boolean;
  created_at: string;
  updated_at: string;
  project_releases: Array<{
    id: string;
    version: string;
    name: string;
    changelog: string;
    channel: ReleaseInput["channel"];
    status: ReleaseInput["status"];
    sort_order: number;
    release_game_versions: Array<{ game_version: string }>;
    release_loaders: Array<{ loader: string }>;
    release_files: Array<{
      url: string;
      filename: string | null;
      primary: boolean;
    }>;
  }>;
};
const selection =
  "*, project_releases(*, release_game_versions(game_version), release_loaders(loader), release_files(url, filename, primary))";

function releases(row: Row, publicOnly: boolean): ReleaseInput[] {
  return row.project_releases
    .filter((release) => !publicOnly || release.status === "published")
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((release) => ({
      id: release.id,
      version: release.version,
      name: release.name,
      changelog: release.changelog,
      channel: release.channel,
      status: release.status,
      gameVersions: release.release_game_versions.map(
        (item) => item.game_version,
      ),
      loaders: release.release_loaders.map((item) => item.loader),
      downloadUrl:
        (publicOnly
          ? publicHttpUrl(
              release.release_files.find((file) => file.primary)?.url,
            )
          : release.release_files.find((file) => file.primary)?.url) ?? "",
      filename:
        release.release_files.find((file) => file.primary)?.filename ?? "",
    }));
}
function summary(row: Row, publicOnly: boolean): ProjectSummary {
  const items = releases(row, publicOnly);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    summary: row.summary,
    type: row.type,
    status: row.status,
    visibility: row.visibility,
    iconUrl: publicHttpUrl(row.icon_url),
    featured: row.featured,
    updatedAt: new Date(row.updated_at),
    releaseCount: items.length,
    latestVersion: items[0]?.version ?? null,
    latestGameVersions: items[0]?.gameVersions ?? [],
    latestLoaders: items[0]?.loaders ?? [],
  };
}
function detail(row: Row, publicOnly: boolean): ProjectDetail {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    summary: row.summary,
    description: row.description,
    type: row.type,
    status: row.status,
    visibility: row.visibility,
    featured: row.featured,
    iconUrl: publicHttpUrl(row.icon_url) ?? "",
    sourceUrl: publicHttpUrl(row.source_url) ?? "",
    issuesUrl: publicHttpUrl(row.issues_url) ?? "",
    license: row.license ?? "",
    clientSide: row.client_side,
    serverSide: row.server_side,
    releases: releases(row, publicOnly),
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}
export async function listPublicProjects(): Promise<ProjectSummary[]> {
  const { data, error } = await requireSupabase()
    .from("projects")
    .select(selection)
    .eq("status", "published")
    .eq("visibility", "public")
    .order("featured", { ascending: false })
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data as Row[]).map((row) => summary(row, true));
}
export async function getPublicProjectBySlug(
  slug: string,
): Promise<ProjectDetail | null> {
  const { data, error } = await requireSupabase().rpc("get_public_project", {
    project_slug: slug,
  });
  if (error) throw error;
  return data ? detail(data as Row, true) : null;
}
export async function listProjects(): Promise<ProjectSummary[]> {
  const { data, error } = await requireSupabase()
    .from("projects")
    .select(selection)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data as Row[]).map((row) => summary(row, false));
}
export async function getProject(id: string): Promise<ProjectDetail | null> {
  const { data, error } = await requireSupabase()
    .from("projects")
    .select(selection)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? detail(data as Row, false) : null;
}
export async function saveProject(
  id: string | null,
  input: ProjectInput,
): Promise<string> {
  const validated = projectInputSchema.parse(input);
  const { data, error } = await requireSupabase().rpc("save_project", {
    project_id: id,
    payload: validated,
  });
  if (error) throw error;
  return data as string;
}
export async function deleteProject(id: string): Promise<void> {
  const { error } = await requireSupabase().rpc("delete_project", {
    project_id: id,
  });
  if (error) throw error;
}
