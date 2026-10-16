# MODZ WEB

catálogo de proyectos de minecraft con páginas estáticas en astro, componentes react y datos gestionados en supabase.

## DESARROLLO

```bash
pnpm install
cp .env.example .env.local
pnpm dev
pnpm check
```

configura `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_PUBLISHABLE_KEY` con los valores públicos del proyecto de supabase. la clave de servicio nunca debe incluirse en el frontend.

## PREPARAR SUPABASE

1. ejecuta, en este orden, `supabase/migrations/202610160001_initial.sql` y `supabase/migrations/202610160002_security_and_api.sql` desde el editor sql de supabase o mediante su cli.
2. desactiva el registro público por correo en la configuración de autenticación.
3. crea o invita a cada administrador desde el panel de supabase.
4. concede acceso con `insert into public.admin_members (user_id) values ('uuid-del-usuario');` usando el identificador de `auth.users`.
5. configura las urls del sitio y las urls de redirección permitidas en supabase auth para el dominio final.

las políticas rls permiten leer proyectos publicados y públicos. los proyectos no listados solo se consultan por slug conocido; los privados y los borradores permanecen fuera de la api pública. las escrituras requieren sesión de administrador y se realizan en una única transacción mediante funciones sql. no se necesita servidor propio ni claves privadas en el hosting.

si ya existe una base con el esquema de drizzle, aplica únicamente la segunda migración. haz una copia de seguridad antes de cualquier migración en producción.

## RUTAS

- `/`: catálogo público con búsqueda y filtros.
- `/projects/?slug=mi-proyecto`: ficha pública y descargas publicadas.
- `/admin/projects/`: inicio de sesión y biblioteca privada.
- `/admin/projects/new/`: creación de proyecto.
- `/admin/projects/edit/?id=uuid`: edición de proyecto.

las consultas usan parámetros porque un hosting estático no puede generar rutas nuevas a partir de proyectos añadidos después de compilar. el servidor estático debe servir los archivos `index.html` de cada directorio. el archivo `404.html` redirige las antiguas fichas `/projects/slug` y las antiguas rutas de edición si el hosting utiliza páginas de error personalizadas.

## DESPLIEGUE

```bash
pnpm build
```

sube el contenido de `dist/` al hosting estático. configura las dos variables `PUBLIC_*` durante la compilación. `pnpm check` ejecuta tipos, lint, tests y build. comprueba los flujos reales contra tu proyecto de supabase antes de publicar: sesión, permisos, alta, edición, borrado, proyectos no listados y enlaces de descarga.
