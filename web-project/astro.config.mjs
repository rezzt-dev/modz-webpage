import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "static",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        onwarn(warning, defaultHandler) {
          // Zod 4 ships harmless PURE comments that Rollup cannot place.
          if (
            warning.code === "INVALID_ANNOTATION" &&
            warning.id?.includes("/zod/")
          )
            return;
          defaultHandler(warning);
        },
      },
    },
  },
  server: { host: "127.0.0.1", port: 3000 },
});
