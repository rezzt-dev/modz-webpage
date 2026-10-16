# MODZ WEBPAGE

modz.dev es un índice web para descubrir, consultar y administrar proyectos del ecosistema de minecraft. el repositorio conserva la aplicación anterior como referencia y desarrolla una nueva versión con catálogo público y gestión de lanzamientos.

<p align="center">
  <strong>un catálogo técnico ligero para mods, plugins y datapacks.</strong>
</p>

## CONTENIDO

- `modz-web/`: aplicación anterior con vite, recursos estáticos, datos iniciales y api php opcional.
- `web-project/`: nueva aplicación full-stack con catálogo público, panel de proyectos, next.js, typescript, postgresql y herramientas de calidad.
- `modz-web/src/pages/`: vistas de inicio, detalle, autenticación, administración, privacidad y términos.
- `modz-web/src/components/`: componentes reutilizables de cabecera, pie, tarjetas y formularios.
- `modz-web/src/services/`: gestión del catálogo y autenticación del panel.
- `modz-web/public/api/`: endpoint php y archivo json utilizado para la persistencia en servidor.
- `.docs/guidelines/`: reglas de markdown, commits, pull requests, merges y releases.
- `.docs/skills/`: material de apoyo para desarrollo de frontend, diseño, accesibilidad y documentación.
- `agents.md` y `claude.md`: instrucciones operativas para agentes y colaboradores.
- `changelog.md`: historial de cambios en castellano e inglés.
- `license.md`: condiciones de uso y distribución del repositorio.
- `security.md`: riesgos conocidos, prácticas de desarrollo y proceso de reporte.

## CARACTERÍSTICAS

- catálogo público de proyectos con filtrado por categoría y búsqueda.
- vista de detalle con descripción, problema, solución, versión, entorno, dependencia y enlace de descarga.
- rutas hash para navegación sin configuración adicional del servidor: `#/`, `#/login`, `#/mod/<id>`, `#/admin`, `#/admin/create`, `#/admin/edit/<id>`, `#/privacy` y `#/terms`.
- interfaz en castellano e inglés mediante `modz-web/src/data/locales.js`.
- fallback automático a `modz-web/src/data/projects.json` cuando la api no está disponible.
- panel autenticado para crear, editar, eliminar, importar y exportar proyectos.
- persistencia opcional mediante `modz-web/public/api/projects.php` y `modz-web/public/api/projects.json`.

## REQUISITOS

- node.js y npm para el desarrollo y la compilación.
- un navegador moderno con soporte para javascript, `fetch` y `sessionStorage`.
- php y un servidor web compatible si se desea utilizar la api de persistencia.

los requisitos y comandos del nuevo proyecto se documentan en `web-project/README.md`.

## INSTALACIÓN

```bash
cd modz-web
npm install
```

## DESARROLLO

```bash
npm run dev
```

vite mostrará la dirección local en la terminal. la aplicación intentará cargar primero `/api/projects.php`; si la solicitud falla o la respuesta no es json, cargará `src/data/projects.json`.

## COMPILACIÓN Y PREVISUALIZACIÓN

```bash
npm run build
npm run preview
```

el resultado de producción se genera en `modz-web/dist/`. este directorio es generado y no debe versionarse.

## CONFIGURACIÓN

para el desarrollo local, las credenciales del panel se leen mediante las variables `VITE_ADMIN_USER` y `VITE_ADMIN_PASS`.

```dotenv
VITE_ADMIN_USER="example-admin"
VITE_ADMIN_PASS="example-password"
```

estas variables `VITE_*` se incorporan al cliente durante la compilación de vite. no son secretos adecuados para producción, no deben contener credenciales reales y no deben publicarse en commits, capturas o incidencias. consulta `security.md` antes de configurar un despliegue.

## ARQUITECTURA DE DATOS

el servicio `ProjectManager` sigue este flujo:

1. intenta obtener el catálogo desde `/api/projects.php`.
2. si la api no responde con json válido, utiliza `modz-web/src/data/projects.json`.
3. las operaciones del panel actualizan el estado en memoria.
4. las operaciones de escritura intentan enviar el catálogo completo mediante `POST` a la api php.
5. si la api no está disponible, los cambios solo permanecen en memoria y pueden exportarse como json.

el archivo público `modz-web/public/api/projects.json` forma parte del contenido servido por la api. si se utiliza la persistencia, el servidor debe garantizar permisos de escritura controlados y evitar que el archivo sea accesible para modificaciones directas.

## ADMINISTRACIÓN

las rutas bajo `/admin` están protegidas por una comprobación de autenticación en el cliente. el flujo actual guarda un valor en `sessionStorage` y la api valida un token compartido. esta implementación es funcional para desarrollo controlado, pero no debe considerarse un sistema de autenticación de producción.

para trabajar de forma segura:

- utiliza valores ficticios en entornos locales y rota cualquier credencial que haya sido expuesta.
- no subas `.env`, tokens ni datos sensibles al repositorio.
- configura la api detrás de `https` y restringe sus orígenes permitidos.
- sustituye el token compartido por sesiones de servidor o tokens de corta duración antes de publicar el panel.

## CONTRIBUIR

antes de modificar el proyecto, lee `agents.md` o `claude.md` y las guías aplicables de `.docs/guidelines/`. para cambios de interfaz, accesibilidad o documentación, revisa también las skills correspondientes en `.docs/skills/`.

antes de abrir una pull request:

- ejecuta `npm run build` desde `modz-web/`.
- revisa el diff y confirma que no incluye `.env`, `node_modules/` ni `dist/`.
- actualiza `changelog.md` con las categorías existentes cuando el cambio lo requiera.
- documenta cualquier limitación de seguridad o compatibilidad introducida.
- usa el formato de commit, pull request y release definido en las guías del repositorio.

el proyecto no define actualmente un script de pruebas automatizadas en `package.json`; por eso, la compilación y la revisión manual de las rutas afectadas forman parte de la validación mínima.

## LICENCIA Y AVISOS

el uso y la distribución del proyecto están sujetos a `license.md`. minecraft, mojang y microsoft son marcas de sus respectivos titulares; este proyecto no está afiliado ni respaldado por ellos. los proyectos enlazados desde el catálogo pueden tener licencias independientes.

## CONTACTO Y SEGURIDAD

para reportes de seguridad, sigue el procedimiento privado descrito en `security.md`. para el código y los cambios generales, utiliza el repositorio oficial de github: <https://github.com/rezzt-dev/modz-webpage>.
