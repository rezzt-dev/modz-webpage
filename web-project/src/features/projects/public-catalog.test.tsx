import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { ProjectSummary } from "./project-schema";
import { PublicCatalog } from "./public-catalog";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: React.ComponentProps<"a">) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const projects: ProjectSummary[] = [
  {
    id: "1",
    slug: "compact-villagers",
    name: "Compact Villagers",
    summary: "Gestión de aldeanos en un solo bloque.",
    type: "mod",
    status: "published",
    visibility: "public",
    iconUrl: null,
    featured: true,
    updatedAt: new Date("2026-01-01"),
    releaseCount: 1,
    latestVersion: "1.0.0",
    latestGameVersions: ["1.21.8"],
    latestLoaders: ["neoforge"],
  },
  {
    id: "2",
    slug: "server-tools",
    name: "Server Tools",
    summary: "Utilidades para servidores.",
    type: "plugin",
    status: "published",
    visibility: "public",
    iconUrl: null,
    featured: false,
    updatedAt: new Date("2026-01-01"),
    releaseCount: 1,
    latestVersion: "2.0.0",
    latestGameVersions: ["1.20.4"],
    latestLoaders: ["paper"],
  },
];

afterEach(() => vi.restoreAllMocks());

describe("PublicCatalog", () => {
  it("filters by text and category and can clear an empty result", async () => {
    const user = userEvent.setup();
    render(<PublicCatalog projects={projects} />);

    const results = screen.getByRole("region", { name: "Explora el índice" });
    expect(within(results).getByText("Compact Villagers")).toBeInTheDocument();
    expect(within(results).getByText("Server Tools")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Plugin" }));
    expect(screen.queryByText("Compact Villagers")).not.toBeInTheDocument();
    expect(screen.getByText("Server Tools")).toBeInTheDocument();

    await user.type(
      screen.getByRole("searchbox", { name: "Buscar proyectos" }),
      "sin resultados",
    );
    expect(
      await screen.findByText("No encontramos coincidencias"),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "LIMPIAR FILTROS" }));
    expect(screen.getByText("Compact Villagers")).toBeInTheDocument();
  });

  it("explains the empty catalog without showing useless filters", () => {
    render(<PublicCatalog projects={[]} />);
    expect(
      screen.getByText("El índice está en preparación"),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "LIMPIAR FILTROS" }),
    ).not.toBeInTheDocument();
  });
});
