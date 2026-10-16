# SEGURIDAD

la aplicación actual está en `web-project/`. es un sitio estático que utiliza la clave publicable de supabase en el navegador. esta clave es pública; la autorización depende de las políticas rls y de las funciones sql incluidas en `web-project/supabase/migrations/`.

## CREDENCIALES ANTERIORES

la aplicación anterior incluyó credenciales de administración en archivos del repositorio y en su api php. deben considerarse comprometidas y no reutilizarse en supabase ni en ningún despliegue nuevo. rota cualquier contraseña compartida con aquella versión.

## ACCESO AL PANEL

- el registro público debe estar desactivado en supabase auth.
- las cuentas se crean o invitan manualmente y se autorizan insertando su uuid en `public.admin_members`.
- el frontend comprueba la sesión para mostrar el panel. la base de datos repite la autorización en cada operación de escritura.
- `save_project` y `delete_project` usan transacciones de postgresql y rechazan usuarios que no pertenecen a `admin_members`.
- nunca publiques una clave de servicio o credenciales de administrador en variables `PUBLIC_*`, repositorios o archivos del sitio.

## DATOS PÚBLICOS

las políticas rls muestran en consultas generales solo proyectos publicados y públicos, junto con sus lanzamientos publicados. la función `get_public_project` permite consultar un proyecto publicado y no listado si se conoce su slug. borradores y proyectos privados no se entregan al público. las urls se validan y se filtran antes de mostrarse como enlaces.

## DESPLIEGUE

aplica las migraciones en orden y revisa las políticas rls tras cualquier cambio de esquema. configura el dominio y las urls permitidas en supabase auth. conserva copias de seguridad de la base de datos. comprueba los permisos con una sesión anónima, una cuenta sin acceso y una cuenta administradora antes de publicar.

para reportar una vulnerabilidad, usa un canal privado del repositorio en <https://github.com/rezzt-dev/modz-webpage>.
