# INSTRUCCIONES DEL REPOSITORIO

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
