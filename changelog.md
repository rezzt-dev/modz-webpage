# CHANGELOG

## SIN PUBLICAR / UNRELEASED

### CASTELLANO

#### AÑADIDO
- incorpora anime.js, temas, notificaciones, caché de cliente, estado de url, fechas, drag-and-drop, carga de archivos y plugins oficiales de tailwind css como complementos de frontend para la nueva base.
- incorpora un proveedor cliente mínimo para temas, tanstack query, nuqs, sonner y herramientas de desarrollo cargadas bajo demanda.
- incorpora en `web-project/` la base full-stack de la nueva versión con next.js, typescript, tailwind css, shadcn/ui, postgresql, drizzle orm, better auth, internacionalización y herramientas automatizadas de calidad.
- incorpora configuración inicial para eslint, prettier, knip, vitest, testing library y playwright, junto con validación tipada del entorno y scripts de base de datos.
- incorpora las guías de commits, pull requests, releases y markdown en `.docs/guidelines/` para documentar el flujo de trabajo del repositorio.
- incorpora las skills de frontend, diseño, shadcn y patrones de composición de react en `.docs/skills/` como material de apoyo para el desarrollo.
- incorpora la documentación operativa completa en `agents.md`, `claude.md`, `readme.md` y `security.md` para agentes, colaboradores y github.
- incorpora la licencia de uso y las condiciones de distribución en `license.md`.

#### CAMBIADO
- documenta `modz-web/` como aplicación de referencia y `web-project/` como base de la futura versión profesional.
- reorganiza la aplicación web completa dentro de `modz-web/`, incluyendo su configuración de vite, código fuente, recursos públicos y dependencias.
- actualiza las guías de formato y el flujo documental para conservar la ortografía correcta y las rutas reales del repositorio.

#### ELIMINADO
- elimina del directorio raíz los ficheros de la aplicación que ahora se mantienen bajo `modz-web/`.

#### SEGURIDAD
- prepara validación de variables privadas y exclusión de secretos para la nueva base, sin exponer todavía rutas de autenticación ni operaciones administrativas.

### ENGLISH

#### ADDED
- add anime.js, themes, notifications, client caching, url state, dates, drag-and-drop, file selection, and official tailwind css plugins as frontend extensions for the new foundation.
- add a minimal client provider for themes, tanstack query, nuqs, sonner, and development tools loaded on demand.
- add the full-stack foundation for the new version under `web-project/` with next.js, typescript, tailwind css, shadcn/ui, postgresql, drizzle orm, better auth, internationalization, and automated quality tooling.
- add initial eslint, prettier, knip, vitest, testing library, and playwright configuration together with typed environment validation and database scripts.
- add commit, pull request, release, and markdown guidelines under `.docs/guidelines/` to document the repository workflow.
- add frontend, design, shadcn, and react composition pattern skills under `.docs/skills/` as development support material.
- add complete operational documentation in `agents.md`, `claude.md`, `readme.md`, and `security.md` for agents, contributors, and github.
- add the usage license and distribution terms in `license.md`.

#### CHANGED
- document `modz-web/` as the reference application and `web-project/` as the foundation for the future professional version.
- reorganize the complete web application under `modz-web/`, including its Vite configuration, source code, public assets, and dependencies.
- update the formatting guidelines and documentation workflow to preserve correct spelling and the repository's actual paths.

#### REMOVED
- remove the application files from the repository root now maintained under `modz-web/`.

#### SECURITY
- prepare private environment validation and secret exclusion for the new foundation without exposing authentication routes or administrative operations yet.
