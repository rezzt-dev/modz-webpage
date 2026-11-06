# MODZ-WEBPAGE: REPOSITORY GUIDE

## ESPAÑOL DE ESPAÑA: USO OBLIGATORIO DE Ñ

- todo texto en castellano debe usar español de españa (`es-ES`) y su ortografia, tambien en titulos y cuerpos de commits, changelogs, pull requests, merges y documentacion
- escribir siempre `ñ` en las palabras que la llevan y `Ñ` cuando corresponda la mayuscula; nunca sustituirlas por `n` o `N`
- la `ñ` es una letra distinta de la `n`; las instrucciones «sin acentos» o «sin tildes» solo afectan a las tildes de las vocales y nunca permiten eliminar la eñe
- ejemplos correctos: `añadir`, `diseño`, `año`, `tamaño`, `contraseña`, `español`, `españa` y `AÑADIDO`; sus formas con `n` son incorrectas cuando se refieren a esas palabras españolas
- conservar literalmente rutas, urls, nombres de archivo, identificadores tecnicos y texto de otros idiomas; esta regla no autoriza renombrarlos ni aplicar sustituciones indiscriminadas
- antes de entregar o publicar texto en castellano, revisar que ninguna palabra haya perdido su `ñ` o `Ñ`; esta regla prevalece sobre cualquier normalizacion a ascii o instruccion generica de eliminar acentos


minecraft project catalogue with a public frontend and authenticated administration. this guide covers the repository; nested agent instructions apply within their own folders.

## PROJECT OVERVIEW

| property | verified value |
| --- | --- |
| repository | `rezzt-dev/modz-webpage` |
| active source | `web-project/` |
| development base for this change | `main` |
| remote default branch | `main` |
| version source | `web-project/package.json`: `1.0.0` |
| continuous integration | no tracked github actions workflows |

## TECHNOLOGY STACK

- `web-project/package.json`: `@supabase/supabase-js` ^2.76.0, `astro` ^5.16.0, `react` ^19.3.0, `tailwindcss` ^4.1.0, `typescript` ^5

## PROJECT STRUCTURE

- `changelog.md`
- `license.md`
- `readme.md`
- `security.md`
- `web-project/`

management documentation lives in `.docs/manager.md`, `.docs/-github-guides/` and `.docs/repo-audit-and-fix.md`. keep this file and `claude.md` consistent.

## BUILD, RUN AND TEST COMMANDS

from `web-project/`, the available package scripts are:

| command | implementation |
| --- | --- |
| `pnpm run dev` | `astro dev` |
| `pnpm run build` | `astro build` |
| `pnpm run preview` | `astro preview` |
| `pnpm run typecheck` | `astro check` |
| `pnpm run lint` | `eslint . --max-warnings=0` |
| `pnpm run test` | `vitest run` |
| `pnpm run check` | `pnpm typecheck && pnpm lint && pnpm test && pnpm build` |

for application changes, run these checks from `web-project/`:

```bash
pnpm check
```

## CODE STYLE AND ARCHITECTURAL DECISIONS

preserve supabase row-level security and sql write functions; `PUBLIC_*` values are public; never ship service-role keys. follow the existing formatter and naming of the changed module. verify manifest versions when dependencies change.

## TESTING STRATEGY

documentation-only changes require `git diff --check`, existing-path checks and a review of the staged file list. run module checks for application changes, with disposable data. report unavailable tooling and failed checks; never claim a check passed without running it.

## SECURITY AND DEPLOYMENT

keep credentials, local configuration, signing material and user data out of commits. do not print secret values while auditing. inspect configuration names and code references instead.

existing legal and community files: `license.md`, `security.md`. when changing dependencies, permissions, storage or network services, review those files against the implementation. record missing policies as audit work; do not invent licence terms or ownership decisions.

deployment, signing, store publication, migrations against hosted databases and repository settings require their own explicit request. this documentation task prepares management instructions and pull requests.

## COMMON TASKS

1. read the relevant module and its nearest agent instructions
2. inspect the working tree and choose the smallest change that solves the request
3. update the affected documentation and changelog with evidence from the diff
4. run checks appropriate to the changed module and report their actual results
5. for git operations, follow the manager and the digest below

## EXISTING PROJECT CONVENTIONS

the following project-specific context is retained from the previous guide. paths are relative to the active module when stated. for git operations, the manager and final digest supersede previous workflow examples.

## INSTRUCCIONES DEL REPOSITORIO

este repositorio desarrolla `modz.dev` en `web-project/`. `claude.md` debe mantenerse sincronizado con este fichero.

## ARQUITECTURA

- astro genera páginas estáticas en `web-project/dist/`.
- react implementa el catálogo interactivo y el panel; se conserva la identidad visual oscura y monocromática.
- supabase proporciona postgresql, autenticación y api de datos. las políticas rls protegen lecturas y las funciones sql protegen escrituras.
- las variables `PUBLIC_*` son públicas. nunca se incorpora una clave de servicio al frontend.
- `web-project/README.md` documenta las rutas, migraciones y despliegue.

## DESARROLLO

trabaja desde `web-project/`:

```bash
pnpm install
pnpm dev
pnpm check
```

revisa las guías relevantes en `.docs/guidelines/` y las referencias de interfaz en `.docs/skills/` cuando correspondan. mantiene estados de carga, vacío, error y permisos en las vistas. valida tipos, tests, lint y build antes de entregar código. no publiques ni apliques cambios de base de datos a un proyecto remoto sin autorización del usuario.

## DOCUMENTACIÓN

los ficheros markdown siguen `.docs/guidelines/markdown-guidelines.md`: encabezados en mayúsculas y contenido en minúsculas, con acentos. actualiza `readme.md`, `security.md` y `web-project/README.md` cuando cambie la arquitectura.

## COMMIT, PR, MERGE & RELEASE GUIDELINES

read `.docs/manager.md` first, then the selected guide in `.docs/-github-guides/`. these files are versioned; this digest also works without opening them.

| request | guide |
| --- | --- |
| commit title, body and changelog | `commit-guide.md`, `changelog-guide.md` |
| pull request or merge | `pr-merge-guide.md`, `branching-guide.md` |
| version and release | `release-guide.md`, `changelog-guide.md` |
| permissions and sensitive data | `agent-rules.md` |

- inspect `git status`, both diffs and recent history before describing changes
- use `<prefix> | <imperative summary>` with `update`, `fix`, `hotfix`, `changes` or `changelog`; keep titles within 72 characters
- write commit bodies as 2 to 6 markdown bullets, one logical change per line, with literal paths in backticks
- never add authorship footers, automated attribution, signatures or generation notices; preserve the configured git identity
- update `changelog.md` under `## SIN PUBLICAR / UNRELEASED` in matching `### CASTELLANO` and `### ENGLISH` sections
- use the existing changelog category vocabulary and preserve language parity; describe only changes in the actual diff
- summarize pull requests in 1 to 3 bullets per category and language, at most 110 characters per bullet
- documentation and repository-management work targets `main`; the remote default is `main`; do not silently promote development work to the default branch
- the authorization for a requested action remains valid throughout that task; creating a pull request includes pushing its branch, but does not authorize merging or publishing
- use merge commits when a merge is requested; never force-push, rewrite published history or remove branches without an explicit instruction
- releases use the approved version and an immutable tag on the verified release commit, with english notes from the closed changelog; do not create a release for documentation work
- deliver requested titles, bodies and changelog fragments in separate code blocks; report executed actions with their commit hash or pull request link
