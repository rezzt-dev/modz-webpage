# CHANGELOG

## SIN PUBLICAR / UNRELEASED

### CASTELLANO

#### AÑADIDO
- incorpora la nueva aplicación estática de `web-project/` con astro, react, tailwind css y rutas públicas y privadas preparadas para hosting sin servidor.
- incorpora el cliente de supabase en `web-project/src/lib/supabase.ts` y las consultas del catálogo y del panel en `web-project/src/lib/projects-api.ts`.
- incorpora autenticación por correo para el panel y control de acceso mediante `public.admin_members`.
- incorpora migraciones de supabase en `web-project/supabase/migrations/` con el esquema relacional, políticas rls y funciones atómicas para guardar y eliminar proyectos.
- incorpora estados de carga, vacío, error, éxito y acceso denegado en el catálogo, las fichas públicas y el panel de administración.
- incorpora redirecciones compatibles desde las rutas antiguas mediante `web-project/src/pages/404.astro`.
- incorpora pruebas unitarias de filtros, validación de proyectos y protocolos de enlaces públicos en `web-project/src/features/projects/` y `web-project/src/lib/`.

#### CAMBIADO
- sustituye next.js, drizzle orm, postgresql local y better auth por astro estático y supabase gestionado.
- adapta el formulario, el listado y la ficha de proyectos para trabajar con consultas rpc y sesiones de supabase desde el navegador.
- reorganiza estilos, layouts, páginas y componentes para conservar la identidad visual monocromática y mejorar la adaptación móvil.
- actualiza `README.md`, `readme.md`, `agents.md`, `claude.md` y `security.md` con la arquitectura, las migraciones y el despliegue estático.
- actualiza `.env.example` para usar `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

#### CORREGIDO
- corrige la exposición de proyectos no listados para que solo se consulten mediante slug conocido y no aparezcan en el catálogo general.
- corrige el guardado de proyectos y lanzamientos para ejecutarlo dentro de una transacción sql con validación de permisos y datos.
- corrige el desbordamiento horizontal del ticker del catálogo en pantallas pequeñas y añade rutas de fallback para enlaces antiguos.

#### ELIMINADO
- elimina la infraestructura de next.js, drizzle orm, better auth y la conexión directa a postgresql del proyecto nuevo.
- elimina la aplicación antigua, su api php y sus credenciales compartidas del árbol activo del repositorio.

#### SEGURIDAD
- protege lecturas y escrituras mediante políticas rls, funciones sql con `security definer` y comprobación de pertenencia a `admin_members`.
- restringe las funciones de escritura de supabase a usuarios autenticados y revoca su ejecución pública y anónima.
- documenta la rotación de las credenciales antiguas y evita incluir claves privadas en el bundle del sitio estático.

### ENGLISH

#### ADDED
- add the new static application under `web-project/` with astro, react, tailwind css, and public and private routes for serverless hosting.
- add the supabase client in `web-project/src/lib/supabase.ts` and catalog and dashboard queries in `web-project/src/lib/projects-api.ts`.
- add email authentication for the dashboard and access control through `public.admin_members`.
- add supabase migrations under `web-project/supabase/migrations/` with the relational schema, rls policies, and atomic project write and delete functions.
- add loading, empty, error, success, and access denied states to the catalog, public project pages, and administration dashboard.
- add backwards compatible redirects from legacy routes through `web-project/src/pages/404.astro`.
- add unit tests for filters, project validation, and public URL protocols under `web-project/src/features/projects/` and `web-project/src/lib/`.

#### CHANGED
- replace next.js, drizzle orm, local postgresql, and better auth with static astro and managed supabase.
- adapt the project form, list, and detail page to use supabase rpc queries and browser sessions.
- reorganize styles, layouts, pages, and components to preserve the monochrome visual identity and improve mobile behavior.
- update `README.md`, `readme.md`, `agents.md`, `claude.md`, and `security.md` with the architecture, migrations, and static deployment workflow.
- update `.env.example` to use `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

#### FIXED
- fix unlisted project exposure so unlisted entries are fetched only by a known slug and never included in the general catalog.
- fix project and release persistence by executing validated writes inside a protected sql transaction.
- fix horizontal ticker overflow on small screens and add fallback routes for legacy links.

#### REMOVED
- remove the next.js, drizzle orm, better auth, and direct postgresql infrastructure from the new project.
- remove the legacy application, its php api, and shared credentials from the active repository tree.

#### SECURITY
- secure reads and writes with rls policies, `security definer` sql functions, and `admin_members` membership checks.
- restrict supabase write functions to authenticated users and revoke public and anonymous execution.
- document rotation of legacy credentials and prevent private keys from entering the static site bundle.
