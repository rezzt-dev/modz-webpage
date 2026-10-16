# CHANGELOG

## SIN PUBLICAR / UNRELEASED

### CASTELLANO

#### AÑADIDO
- incorpora el catálogo público filtrable y las fichas de proyecto en `web-project/src/app/`, con estados de carga, vacío y error y acceso a lanzamientos publicados.
- incorpora consultas públicas restringidas a contenido publicado y validación de enlaces externos en `web-project/src/server/projects/public-project-repository.ts` y `web-project/src/lib/public-url.ts`.
- incorpora pruebas de filtros del catálogo y protocolos de enlaces públicos en `web-project/src/features/projects/public-catalog.test.tsx` y `web-project/src/lib/public-url.test.ts`.
- incorpora el panel privado de proyectos en `web-project/src/app/admin/` con navegación, métricas, estados de carga y error, listado filtrable y formularios para crear y editar proyectos y lanzamientos.
- incorpora acciones de servidor y un repositorio transaccional en `web-project/src/features/projects/` y `web-project/src/server/projects/` para validar, guardar, sincronizar y eliminar proyectos junto con sus versiones, loaders y archivos.
- incorpora el modelo relacional de proyectos y lanzamientos en `web-project/src/db/schema/index.ts`, su conexión PostgreSQL en `web-project/src/db/index.ts` y la migración inicial de `web-project/drizzle/`.
- incorpora validación tipada con Zod y pruebas de esquemas en `web-project/src/features/projects/project-schema.ts` y `web-project/src/features/projects/project-schema.test.ts`, incluyendo slugs, URLs y versiones duplicadas.
- incorpora la identidad visual del panel, el wordmark de `web-project/src/components/brand/wordmark.tsx` y los estados globales de interfaz en `web-project/src/app/globals.css`.
- incorpora anime.js, temas, notificaciones, caché de cliente, estado de url, fechas, drag-and-drop, carga de archivos y plugins oficiales de tailwind css como complementos de frontend para la nueva base.
- incorpora un proveedor cliente mínimo para temas, tanstack query, nuqs, sonner y herramientas de desarrollo cargadas bajo demanda.
- incorpora en `web-project/` la base full-stack de la nueva versión con next.js, typescript, tailwind css, shadcn/ui, postgresql, drizzle orm, better auth, internacionalización y herramientas automatizadas de calidad.
- incorpora configuración inicial para eslint, prettier, knip, vitest, testing library y playwright, junto con validación tipada del entorno y scripts de base de datos.
- incorpora las guías de commits, pull requests, releases y markdown en `.docs/guidelines/` para documentar el flujo de trabajo del repositorio.
- incorpora las skills de frontend, diseño, shadcn y patrones de composición de react en `.docs/skills/` como material de apoyo para el desarrollo.
- incorpora la documentación operativa completa en `agents.md`, `claude.md`, `readme.md` y `security.md` para agentes, colaboradores y github.
- incorpora la licencia de uso y las condiciones de distribución en `license.md`.

#### CAMBIADO
- rediseña la identidad visual de `web-project/` con tipografía `jetbrains mono`, componentes industriales monocromáticos, portada, panel y estilos adaptables a móvil.
- actualiza `web-project/README.md` con las rutas y condiciones de publicación del catálogo.
- actualiza `web-project/README.md` para documentar la separación entre proyectos y lanzamientos, la migración inicial y el carácter todavía no público del panel de gestión.
- documenta `modz-web/` como aplicación de referencia y `web-project/` como base de la futura versión profesional.
- reorganiza la aplicación web completa dentro de `modz-web/`, incluyendo su configuración de vite, código fuente, recursos públicos y dependencias.
- actualiza las guías de formato y el flujo documental para conservar la ortografía correcta y las rutas reales del repositorio.

#### CORREGIDO
- normaliza la conexión local de postgresql en `web-project/src/db/database-url.ts`, `web-project/src/db/index.ts` y `web-project/.env.example` para evitar `AggregateError` repetidos cuando la base de datos no está disponible.

#### ELIMINADO
- elimina del directorio raíz los ficheros de la aplicación que ahora se mantienen bajo `modz-web/`.

#### SEGURIDAD
- elimina el fichero raíz `.env` que contenía credenciales administrativas y mantiene el panel sin exposición pública hasta integrar la autenticación del servidor.
- prepara validación de variables privadas y exclusión de secretos para la nueva base, sin exponer todavía rutas de autenticación ni operaciones administrativas.

### ENGLISH

#### ADDED
- add the filterable public catalog and project detail pages under `web-project/src/app/`, including loading, empty and error states and access to published releases.
- add public queries restricted to published content and external link validation in `web-project/src/server/projects/public-project-repository.ts` and `web-project/src/lib/public-url.ts`.
- add catalog filter and public URL protocol tests in `web-project/src/features/projects/public-catalog.test.tsx` and `web-project/src/lib/public-url.test.ts`.
- add the private project dashboard under `web-project/src/app/admin/` with navigation, metrics, loading and error states, filterable listings, and forms to create and edit projects and releases.
- add server actions and a transactional repository under `web-project/src/features/projects/` and `web-project/src/server/projects/` to validate, save, synchronize, and delete projects together with their versions, loaders, and files.
- add the relational project and release model in `web-project/src/db/schema/index.ts`, its PostgreSQL connection in `web-project/src/db/index.ts`, and the initial migration under `web-project/drizzle/`.
- add typed Zod validation and schema tests in `web-project/src/features/projects/project-schema.ts` and `web-project/src/features/projects/project-schema.test.ts`, including slugs, URLs, and duplicate versions.
- add the dashboard visual identity, the wordmark in `web-project/src/components/brand/wordmark.tsx`, and global interface states in `web-project/src/app/globals.css`.
- add anime.js, themes, notifications, client caching, url state, dates, drag-and-drop, file selection, and official tailwind css plugins as frontend extensions for the new foundation.
- add a minimal client provider for themes, tanstack query, nuqs, sonner, and development tools loaded on demand.
- add the full-stack foundation for the new version under `web-project/` with next.js, typescript, tailwind css, shadcn/ui, postgresql, drizzle orm, better auth, internationalization, and automated quality tooling.
- add initial eslint, prettier, knip, vitest, testing library, and playwright configuration together with typed environment validation and database scripts.
- add commit, pull request, release, and markdown guidelines under `.docs/guidelines/` to document the repository workflow.
- add frontend, design, shadcn, and react composition pattern skills under `.docs/skills/` as development support material.
- add complete operational documentation in `agents.md`, `claude.md`, `readme.md`, and `security.md` for agents, contributors, and github.
- add the usage license and distribution terms in `license.md`.

#### CHANGED
- redesign the visual identity of `web-project/` with `jetbrains mono`, monochrome industrial components, a home page, an admin panel and responsive styles.
- update `web-project/README.md` with catalog routes and publication conditions.
- update `web-project/README.md` to document the separation between projects and releases, the initial migration, and the dashboard's still-private status.
- document `modz-web/` as the reference application and `web-project/` as the foundation for the future professional version.
- reorganize the complete web application under `modz-web/`, including its Vite configuration, source code, public assets, and dependencies.
- update the formatting guidelines and documentation workflow to preserve correct spelling and the repository's actual paths.

#### FIXED
- normalize the local postgresql connection in `web-project/src/db/database-url.ts`, `web-project/src/db/index.ts`, and `web-project/.env.example` to avoid repeated `AggregateError` failures when the database is unavailable.

#### REMOVED
- remove the application files from the repository root now maintained under `modz-web/`.

#### SECURITY
- remove the root `.env` file containing administrative credentials and keep the dashboard private until server authentication is integrated.
- prepare private environment validation and secret exclusion for the new foundation without exposing authentication routes or administrative operations yet.
