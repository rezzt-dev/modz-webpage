# MODZ WEB

base técnica de la nueva versión de `modz.dev`. este directorio contiene únicamente el esqueleto del proyecto y las herramientas necesarias para desarrollar el catálogo, el panel de administración y la gestión privada de usuarios.

## REQUISITOS

- node.js compatible con el rango declarado en `package.json`.
- pnpm `12.13.0`.
- postgresql para persistencia local y de producción.

## INSTALACIÓN

```bash
pnpm install
cp .env.example .env.local
```

los valores de `.env.example` son solo referencias locales. genera un secreto de autenticación propio y no publiques `.env.local`.

## COMANDOS

```bash
pnpm dev
pnpm check
pnpm build
pnpm test:e2e:install
pnpm test:e2e
pnpm db:generate
pnpm db:migrate
pnpm db:studio
```

`pnpm check` ejecuta lint, comprobación de tipos, tests unitarios y formato. los tests e2e se mantienen separados; `pnpm test:e2e:install` instala chromium la primera vez.

## STACK

- next.js con app router, react server components y rutas tipadas.
- react y typescript en modo estricto.
- tailwind css y shadcn/ui con tokens semánticos.
- postgresql, drizzle orm y drizzle kit.
- better auth para sesiones de servidor y creación privada de usuarios.
- zod, react hook form y validación de entorno tipada.
- next-intl para castellano e inglés.
- vitest, testing library y playwright.
- eslint, prettier, knip y pnpm con builds de dependencias autorizados explícitamente.

## COMPLEMENTOS DE FRONTEND

- anime.js para animaciones modulares; debe cargarse solo en componentes cliente y respetar `prefers-reduced-motion`.
- next-themes para temas claro, oscuro y del sistema sin destellos de hidratación.
- sonner para notificaciones accesibles y consistentes.
- tanstack query y sus devtools para caché, mutaciones y sincronización de datos interactivos.
- nuqs para búsqueda, filtros y paginación persistidos en la url.
- date-fns para fechas sin incorporar una librería monolítica.
- dnd kit para ordenar versiones, capturas o elementos del panel con soporte accesible.
- react dropzone para seleccionar y validar archivos mediante arrastre o teclado.
- plugins oficiales de formularios y tipografía de tailwind css; formularios usa la estrategia por clases para no alterar globalmente los controles de shadcn/ui.

los complementos pesados o interactivos se importarán únicamente desde el módulo que los necesite. anime.js admite subrutas para conservar el tree shaking y tanstack query mantiene un cliente independiente por sesión del navegador.

## ESTRUCTURA

```text
web-project/
├── e2e/                 # pruebas de flujos completos
├── public/images/       # recursos públicos del producto
├── src/app/             # rutas, layouts y estados de next.js
├── src/components/ui/   # componentes base de shadcn/ui
├── src/db/schema/       # esquema relacional y migraciones generadas
├── src/features/        # módulos de dominio por funcionalidad
├── src/i18n/            # configuración y mensajes de idiomas
├── src/lib/             # utilidades y configuración compartida
├── src/server/          # consultas, acciones y servicios solo de servidor
└── src/test/            # configuración y utilidades de tests
```

## DECISIONES DE ARQUITECTURA

el catálogo antiguo almacena una versión y un launcher directamente en cada proyecto. el nuevo modelo deberá separar el proyecto de sus lanzamientos para permitir varias versiones de minecraft, loaders, archivos y enlaces por mod sin duplicar el contenido principal.

la autenticación antigua expone credenciales en el cliente y usa un token compartido. better auth y postgresql sustituyen esa base por sesiones de servidor. el alta pública deberá permanecer deshabilitada; los usuarios con acceso al panel serán creados o invitados manualmente por un administrador.

la interfaz se implementará por módulos y usará componentes de servidor por defecto. los componentes de cliente quedarán limitados a interacciones que necesiten estado o apis del navegador.
