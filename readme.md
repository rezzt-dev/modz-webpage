# MODZ WEBPAGE

modz.dev es un catálogo de proyectos del ecosistema de minecraft. la aplicación actual está en `web-project/` y utiliza astro para generar un sitio estático, react para las interacciones y supabase para autenticación y datos.

## INICIO RÁPIDO

```bash
cd web-project
pnpm install
cp .env.example .env.local
pnpm dev
```

consulta [la guía del proyecto](web-project/README.md) para configurar supabase, migrar la base de datos y desplegar el contenido de `dist/` en un hosting estático.

## ESTRUCTURA

- `web-project/src/pages/`: rutas estáticas de astro.
- `web-project/src/features/projects/`: catálogo y panel de proyectos.
- `web-project/src/lib/`: cliente de supabase, consultas y utilidades.
- `web-project/supabase/migrations/`: esquema, políticas rls y funciones de escritura.
- `.docs/`: guías de diseño y colaboración.

la aplicación anterior está conservada en el historial de git y en `.docs/project-old-version/` como referencia. no se necesita php, next.js ni un servidor de aplicación para la versión actual.
