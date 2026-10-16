CREATE TYPE "public"."file_kind" AS ENUM('external', 'hosted');
CREATE TYPE "public"."project_status" AS ENUM('draft', 'published', 'archived');
CREATE TYPE "public"."project_type" AS ENUM('mod', 'plugin', 'datapack', 'resourcepack', 'modpack');
CREATE TYPE "public"."project_visibility" AS ENUM('public', 'unlisted', 'private');
CREATE TYPE "public"."release_channel" AS ENUM('release', 'beta', 'alpha');
CREATE TYPE "public"."release_status" AS ENUM('draft', 'published', 'archived');
CREATE TYPE "public"."side_support" AS ENUM('required', 'optional', 'unsupported');
CREATE TABLE "project_releases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"version" text NOT NULL,
	"name" text NOT NULL,
	"changelog" text DEFAULT '' NOT NULL,
	"channel" "release_channel" DEFAULT 'release' NOT NULL,
	"status" "release_status" DEFAULT 'draft' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone
);

CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"summary" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"type" "project_type" NOT NULL,
	"status" "project_status" DEFAULT 'draft' NOT NULL,
	"visibility" "project_visibility" DEFAULT 'public' NOT NULL,
	"icon_url" text,
	"source_url" text,
	"issues_url" text,
	"license" text,
	"client_side" "side_support" DEFAULT 'optional' NOT NULL,
	"server_side" "side_support" DEFAULT 'optional' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone
);

CREATE TABLE "release_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"release_id" uuid NOT NULL,
	"display_name" text NOT NULL,
	"kind" "file_kind" DEFAULT 'external' NOT NULL,
	"url" text NOT NULL,
	"filename" text,
	"sha512" text,
	"size_bytes" integer,
	"primary" boolean DEFAULT true NOT NULL
);

CREATE TABLE "release_game_versions" (
	"release_id" uuid NOT NULL,
	"game_version" text NOT NULL,
	CONSTRAINT "release_game_versions_release_id_game_version_pk" PRIMARY KEY("release_id","game_version")
);

CREATE TABLE "release_loaders" (
	"release_id" uuid NOT NULL,
	"loader" text NOT NULL,
	CONSTRAINT "release_loaders_release_id_loader_pk" PRIMARY KEY("release_id","loader")
);

ALTER TABLE "project_releases" ADD CONSTRAINT "project_releases_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "release_files" ADD CONSTRAINT "release_files_release_id_project_releases_id_fk" FOREIGN KEY ("release_id") REFERENCES "public"."project_releases"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "release_game_versions" ADD CONSTRAINT "release_game_versions_release_id_project_releases_id_fk" FOREIGN KEY ("release_id") REFERENCES "public"."project_releases"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "release_loaders" ADD CONSTRAINT "release_loaders_release_id_project_releases_id_fk" FOREIGN KEY ("release_id") REFERENCES "public"."project_releases"("id") ON DELETE cascade ON UPDATE no action;
CREATE UNIQUE INDEX "project_releases_project_version_unique" ON "project_releases" USING btree ("project_id","version");
CREATE INDEX "project_releases_project_order_idx" ON "project_releases" USING btree ("project_id","sort_order");
CREATE UNIQUE INDEX "projects_slug_unique" ON "projects" USING btree ("slug");
CREATE INDEX "projects_status_updated_idx" ON "projects" USING btree ("status","updated_at");
CREATE INDEX "release_files_release_idx" ON "release_files" USING btree ("release_id");