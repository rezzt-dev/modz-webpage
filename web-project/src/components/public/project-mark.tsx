import { Box, Braces, Boxes, Layers3, Package, Puzzle } from "lucide-react";
import type { ProjectSummary } from "@/features/projects/project-schema";
import { publicHttpUrl } from "@/lib/public-url";

const marks = {
  mod: Box,
  plugin: Puzzle,
  datapack: Braces,
  resourcepack: Layers3,
  modpack: Boxes,
};

export function ProjectMark({
  type,
  iconUrl,
}: {
  type: ProjectSummary["type"];
  iconUrl?: string | null;
}) {
  const Icon = marks[type] ?? Package;
  const safeIconUrl = publicHttpUrl(iconUrl);
  return (
    <span className="project-mark" aria-hidden="true">
      {safeIconUrl ? (
        <img
          src={safeIconUrl}
          alt=""
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : null}
      <Icon size={30} strokeWidth={1.4} />
    </span>
  );
}
