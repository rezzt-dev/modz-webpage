import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const projectType = pgEnum("project_type", [
  "mod",
  "plugin",
  "datapack",
  "resourcepack",
  "modpack",
]);

export const projectStatus = pgEnum("project_status", [
  "draft",
  "published",
  "archived",
]);

export const projectVisibility = pgEnum("project_visibility", [
  "public",
  "unlisted",
  "private",
]);

export const sideSupport = pgEnum("side_support", [
  "required",
  "optional",
  "unsupported",
]);

export const releaseChannel = pgEnum("release_channel", [
  "release",
  "beta",
  "alpha",
]);

export const releaseStatus = pgEnum("release_status", [
  "draft",
  "published",
  "archived",
]);

export const fileKind = pgEnum("file_kind", ["external", "hosted"]);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    summary: text("summary").notNull(),
    description: text("description").notNull().default(""),
    type: projectType("type").notNull(),
    status: projectStatus("status").notNull().default("draft"),
    visibility: projectVisibility("visibility").notNull().default("public"),
    iconUrl: text("icon_url"),
    sourceUrl: text("source_url"),
    issuesUrl: text("issues_url"),
    license: text("license"),
    clientSide: sideSupport("client_side").notNull().default("optional"),
    serverSide: sideSupport("server_side").notNull().default("optional"),
    featured: boolean("featured").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("projects_slug_unique").on(table.slug),
    index("projects_status_updated_idx").on(table.status, table.updatedAt),
  ],
);

export const projectReleases = pgTable(
  "project_releases",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    version: text("version").notNull(),
    name: text("name").notNull(),
    changelog: text("changelog").notNull().default(""),
    channel: releaseChannel("channel").notNull().default("release"),
    status: releaseStatus("status").notNull().default("draft"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("project_releases_project_version_unique").on(
      table.projectId,
      table.version,
    ),
    index("project_releases_project_order_idx").on(
      table.projectId,
      table.sortOrder,
    ),
  ],
);

export const releaseGameVersions = pgTable(
  "release_game_versions",
  {
    releaseId: uuid("release_id")
      .notNull()
      .references(() => projectReleases.id, { onDelete: "cascade" }),
    gameVersion: text("game_version").notNull(),
  },
  (table) => [primaryKey({ columns: [table.releaseId, table.gameVersion] })],
);

export const releaseLoaders = pgTable(
  "release_loaders",
  {
    releaseId: uuid("release_id")
      .notNull()
      .references(() => projectReleases.id, { onDelete: "cascade" }),
    loader: text("loader").notNull(),
  },
  (table) => [primaryKey({ columns: [table.releaseId, table.loader] })],
);

export const releaseFiles = pgTable(
  "release_files",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    releaseId: uuid("release_id")
      .notNull()
      .references(() => projectReleases.id, { onDelete: "cascade" }),
    displayName: text("display_name").notNull(),
    kind: fileKind("kind").notNull().default("external"),
    url: text("url").notNull(),
    filename: text("filename"),
    sha512: text("sha512"),
    sizeBytes: integer("size_bytes"),
    primary: boolean("primary").notNull().default(true),
  },
  (table) => [index("release_files_release_idx").on(table.releaseId)],
);

export type ProjectRow = typeof projects.$inferSelect;
export type NewProjectRow = typeof projects.$inferInsert;
