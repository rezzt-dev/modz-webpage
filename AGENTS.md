# Agent Guide for MODZ.DEV

This document is written for AI coding agents. It describes the project architecture, build process, code conventions, and important operational details. The project README (`README.md`) is the human-facing overview; this file supplements it with implementation-level context.

---

## Project Overview

**MODZ.DEV** is a single-page frontend for cataloging and managing Minecraft modifications, plugins, and datapacks. It is a client-side rendered web application built with vanilla JavaScript (ES6 modules), Vite, and TailwindCSS. A small PHP 8.x backend in `public/api/` provides a read/write JSON flat-file API for the project catalog.

Key characteristics:

- No frontend framework (React, Vue, etc.) is used. Components are plain functions that return DOM nodes.
- Routing is hash-based (`#/`, `#/mod/123`, `#/admin`, etc.).
- Data is stored in `public/api/projects.json` on the server and mirrored locally in `src/data/projects.json` for development fallback.
- The UI supports English and Spanish through a custom i18n module.
- The visual style is a dark, high-contrast "terminal" aesthetic.

---

## Technology Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | Vanilla JavaScript (ES modules) | No JSX, no framework. Components build real DOM nodes. |
| Build Tool | Vite 7.x | `npm run dev`, `npm run build`, `npm run preview`. |
| Styling | TailwindCSS 4.x | Configured via `postcss.config.js` and `src/styles/style.css` (`@theme`, `@import "tailwindcss"`). |
| Icons | Google Material Icons | Loaded from Google Fonts CDN in `src/styles/style.css`. |
| Backend API | PHP 8.x | `public/api/projects.php` reads/writes `public/api/projects.json`. |
| Data | JSON | Flat-file database; human-readable and portable. |
| i18n | Custom module | `src/data/locales.js` manages English (`en`) and Spanish (`es`) strings. |

There is no `vite.config.js`, `tailwind.config.js`, or test runner configured.

---

## Project Structure

```
.
├── index.html              # Vite entry point; loads /src/main.js
├── package.json            # Node scripts and dev dependencies
├── postcss.config.js       # Tailwind + autoprefixer PostCSS plugins
├── .env                    # VITE_ADMIN_USER and VITE_ADMIN_PASS (sensitive; not committed)
├── public/
│   ├── api/
│   │   ├── projects.php    # PHP read/write API
│   │   ├── projects.json   # Server-side flat-file database
│   │   └── .htaccess       # Apache security headers and access rules
│   └── vite.svg            # Public static asset
├── src/
│   ├── main.js             # Application bootstrap: loading state, layout, router init
│   ├── router/
│   │   └── index.js        # Hash-based router, route guards, dynamic routes
│   ├── components/         # Reusable UI components (DOM-node factories)
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   ├── ProjectCard.js
│   │   ├── LoginModal.js
│   │   └── MaterialIconPicker.js
│   ├── pages/              # Route-level view components
│   │   ├── Home.js
│   │   ├── ProjectDetail.js
│   │   ├── Login.js
│   │   ├── AdminDashboard.js
│   │   ├── AdminEditor.js
│   │   ├── Privacy.js
│   │   └── Terms.js
│   ├── services/           # Business logic and state
│   │   ├── ProjectManager.js
│   │   └── AuthService.js
│   ├── data/
│   │   ├── projects.json   # Local fallback/seed data
│   │   ├── locales.js      # i18n strings and helpers
│   │   └── materialIcons.js # Icon picker inventory
│   ├── styles/
│   │   └── style.css       # Tailwind theme, custom scrollbar, Material Icons reset
│   ├── counter.js          # Unused Vite sample utility
│   └── javascript.svg      # Unused sample asset
└── dist/                   # Production build output
```

---

## Build and Development Commands

All commands run from the project root.

```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev

# Create an optimized production build in /dist
npm run build

# Preview the production build locally
npm run preview
```

### Local Development Notes

- `npm run dev` serves the frontend only. The PHP API is not executed by Vite.
- `ProjectManager.initialize()` attempts to fetch `/api/projects.php`. If that fails (network error, 404, wrong content type), it falls back to `src/data/projects.json` and logs a warning.
- For full local testing of the admin write flow, you need a PHP-capable web server (Apache/Nginx + PHP-FPM) serving the `public/api/` directory.

---

## Runtime Architecture

### Application Bootstrap (`src/main.js`)

1. Renders a loading spinner inside `#app`.
2. Calls `projectManager.initialize()` to load project data.
3. Replaces `#app` with the page shell: header, `<main id="content">`, footer.
4. Starts the router on `#content`.

### Router (`src/router/index.js`)

- Hash-based routing (`window.location.hash`).
- Route map:
  - `#/` → `Home`
  - `#/view` → `ProjectDetail` (uses `projectManager.getCurrentProject()`)
  - `#/mod/:id` → `ProjectDetail` with `{ id }`
  - `#/admin` → `AdminDashboard` (auth-guarded)
  - `#/admin/create` → `AdminEditor`
  - `#/admin/edit/:id` → `AdminEditor` with `{ id }`
  - `#/login` → `Login`
  - `#/privacy` → `Privacy`
  - `#/terms` → `Terms`
- Unauthenticated users trying to access `/admin*` are redirected to `#/login`.
- Components are invoked as `await Component(params)` and must return a DOM `Node`.

### State Management

There is no global state library. Two singleton-like services hold state:

- **`ProjectManager`** (`src/services/ProjectManager.js`)
  - Holds the array of projects in memory.
  - Loads from `/api/projects.php` on initialization, falling back to `src/data/projects.json`.
  - Provides `getAll()`, `getById(id)`, `save(project)`, `delete(id)`, `exportJSON()`, `importJSON(jsonString)`.
  - Persists changes via `POST /api/projects.php` with `X-Auth-Token` header.
  - Hidden projects are filtered out for anonymous users in `getAll()`.
  - Has a simple pub/sub pattern (`subscribe`/`notify`) so UI re-renders when data changes.

- **`AuthService`** (`src/services/AuthService.js`)
  - Reads credentials from `import.meta.env.VITE_ADMIN_USER` and `import.meta.env.VITE_ADMIN_PASS`.
  - On successful login, stores the raw password in `sessionStorage` under `auth_token` and sends it as the API token.
  - `isAuthenticated()` checks for a non-empty token in `sessionStorage`.

### Component Conventions

- Components are default-exported functions that create and return DOM elements.
- Most components use an inner `render()` function that rebuilds `innerHTML` or appends child nodes.
- Components subscribe to locale changes (`subscribe(render)`) and/or project changes (`projectManager.subscribe(render)`) to update when language or data changes.
- Event listeners are re-attached inside `render()` because the DOM is recreated.
- Inline SVG icons are used throughout instead of an icon library.

### Internationalization (`src/data/locales.js`)

- Translation strings are nested objects keyed by language (`en`, `es`).
- `t('home.subtitle')` resolves the nested path.
- `setLanguage(lang)` updates `localStorage.modz_lang` and notifies all subscribers.
- `getCurrentLang()` returns the active language code.

---

## Backend API (`public/api/projects.php`)

A small PHP script that acts as a JSON read/write endpoint.

- **GET** `/api/projects.php`: returns the contents of `projects.json`.
- **POST** `/api/projects.php`: expects a JSON array of projects in the request body, validates an `X-Auth-Token` header, sanitizes the payload, and overwrites `projects.json`.
- Sanitization removes `<script>` tags, `on*` event attributes, and HTML-encodes strings.
- CORS headers are emitted for cross-origin development scenarios.
- The `.htaccess` file in the same directory blocks direct access to JSON files and project config files while allowing `projects.php`.

### Deployment Notes

- The `public/api/` directory must be served by a PHP-enabled web server.
- `public/api/projects.json` needs write permissions (e.g., `chmod 775`) for the web server user.
- The `.env` file in the project root is consumed at build time by Vite for the frontend only; the PHP backend has its own hardcoded placeholder token and admin password hash.

---

## Code Style Guidelines

- Use ES modules (`import`/`export`).
- Use absolute Vite-style imports from the project root where appropriate: `/src/styles/style.css`, `/src/router/index.js`, etc.
- Components should return a DOM `Node` (usually a `document.createElement('div')`).
- Keep components functional and avoid classes except for service singletons.
- Tailwind utility classes are used for nearly all styling; custom CSS lives in `src/styles/style.css` under `@layer base` or `@layer components`.
- UI text must be added to both `en` and `es` objects in `src/data/locales.js`.
- Use `t('key.subkey')` for all user-facing strings.
- Prefer uppercase/technical copy style consistent with the existing "terminal" aesthetic.

---

## Testing

There is currently no automated test suite. Verification is manual:

1. `npm run dev` and confirm the project list loads.
2. Test search and filters (type, launcher) on the home page.
3. Click a project card and confirm detail view renders.
4. Log in using credentials from `.env`, create/edit/delete a project, and confirm persistence via export.
5. Run `npm run build` and confirm no Vite errors and that `dist/` is generated.

---

## Security Considerations

When modifying code, be aware of the following security properties and limitations:

- **Authentication is client-side only for the frontend.** `AuthService` compares credentials against build-time environment variables. A determined user can inspect the bundled code. Treat the admin area as a convenience layer, not a high-security boundary.
- **The auth token is the admin password.** It is stored in `sessionStorage` and sent in the `X-Auth-Token` header. Avoid logging it or exposing it in error messages.
- **PHP backend has a hardcoded admin password.** `public/api/projects.php` contains a plaintext admin password and a placeholder token comment. For production, this should be moved to an environment variable or secret store.
- **Input sanitization is basic.** The PHP `sanitizeRecursive()` function strips `<script>` tags, `on*` attributes, and applies `htmlspecialchars()`. It is not a replacement for a proper HTML sanitizer such as HTMLPurifier if richer content is allowed.
- **CORS is permissive.** The PHP script reflects the request origin and allows credentials. Review this before deploying to a public domain.
- **`.env` is ignored by Git** and contains secrets. Do not commit it.
- **`.htaccess` blocks direct `.json` access** but assumes Apache with `mod_headers` and `mod_access_compat`/`mod_authz_host`. Verify behavior on your target server.

---

## Common Tasks

### Add a New Page

1. Create a component in `src/pages/MyPage.js` that returns a DOM node.
2. Import it in `src/router/index.js` and add a route in the `routes` object or a dynamic matcher.
3. Add any new UI text to `src/data/locales.js` under both `en` and `es`.

### Add a New Project Field

1. Update the JSON schema in `src/data/projects.json` and `public/api/projects.json`.
2. Update `src/pages/AdminEditor.js` to collect the new field.
3. Update `src/pages/ProjectDetail.js` and/or `src/components/ProjectCard.js` to display it.
4. Update the JSON template in `src/pages/AdminDashboard.js` if admins should see it.

### Change Styling

- Global theme colors/fonts: `src/styles/style.css` (`@theme` block).
- Component-specific layout: Tailwind utility classes inside each component.

### Deploy

1. Run `npm run build`.
2. Upload the contents of `dist/` to the web server root.
3. Upload `public/api/` to a PHP-enabled path and ensure `projects.json` is writable.
4. Set `VITE_ADMIN_USER` and `VITE_ADMIN_PASS` in the environment before building (they are baked into the bundle).
