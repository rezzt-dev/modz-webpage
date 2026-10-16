# INSTRUCCIONES DEL REPOSITORIO

este fichero es la guía operativa principal para claude y para cualquier agente de desarrollo que trabaje en `modz-webpage`. `agents.md` contiene la misma información para otros agentes. ambos ficheros deben mantenerse sincronizados cuando cambien las reglas del proyecto.

## OBJETIVO Y ALCANCE

el proyecto publica `modz.dev`, una aplicación web para mostrar y administrar proyectos. estas instrucciones cubren el desarrollo local, la revisión de cambios, la documentación, la seguridad y el flujo de github.

las reglas de este fichero se aplican junto con las instrucciones del sistema, del usuario y de los directorios concretos. si existe una instrucción más específica en una carpeta hija, se aplica a los ficheros de esa carpeta después de estas reglas.

## CARGA OBLIGATORIA DE DOCUMENTACIÓN Y SKILLS

antes de modificar código, documentación o configuración, claude debe:

- revisar `claude.md` o `agents.md`, según el agente que esté ejecutando el trabajo;
- consultar los ficheros relevantes de `.docs/guidelines/`;
- acceder siempre a la ruta `.docs/skills/...` y leer el `SKILL.md` de cada skill aplicable antes de implementar o revisar una interfaz, una animación, una revisión visual o contenido de documentación;
- tratar `.docs/skills/` como el catálogo local disponible, sin asumir que una skill está activa por su nombre solamente;
- comprobar también si la skill tiene `references/`, `AGENTS.md`, `README.md` o documentación complementaria que sea necesaria para el caso.

el catálogo actual es:

| skill | uso principal | entrada |
| --- | --- | --- |
| `frontend-design` | crear interfaces distintivas y listas para producción | `.docs/skills/frontend-design/SKILL.md` |
| `impeccable` | auditar, pulir y mejorar ux, accesibilidad y diseño | `.docs/skills/impeccable/SKILL.md` |
| `shadcn` | consultar patrones, cli, mcp y registry de shadcn | `.docs/skills/shadcn/SKILL.md` |
| `vercel-composition-patterns` | composición de componentes react | `.docs/skills/vercel-composition-patterns/SKILL.md` |
| `vercel-react-best-practices` | rendimiento y buenas prácticas de react | `.docs/skills/vercel-react-best-practices/SKILL.md` |
| `vercel-react-view-transitions` | transiciones nativas y shared elements | `.docs/skills/vercel-react-view-transitions/SKILL.md` |
| `web-design-guidelines` | revisión de interfaces y accesibilidad | `.docs/skills/web-design-guidelines/SKILL.md` |
| `writing-guidelines` | revisión de redacción y tono | `.docs/skills/writing-guidelines/SKILL.md` |

las skills de react, shadcn o view transitions son material de referencia: la aplicación actual usa javascript vanilla con vite. no se debe introducir react, next.js o una dependencia nueva solo por seguir una skill.

## ESTRUCTURA DEL REPOSITORIO

```text
.
├── .docs/
│   ├── guidelines/       # reglas detalladas de markdown, commits y github
│   └── skills/           # skills locales para agentes de desarrollo
├── agents.md             # instrucciones principales para agentes
├── claude.md             # instrucciones equivalentes para claude
├── readme.md             # documentación pública del repositorio
├── security.md           # límites y prácticas de seguridad
├── changelog.md          # historial bilingüe de cambios
├── license.md            # licencia y avisos legales
└── modz-web/
    ├── public/api/       # api php y datos publicables
    ├── public/           # recursos servidos directamente
    ├── src/components/   # componentes de interfaz reutilizables
    ├── src/pages/        # vistas asociadas a rutas
    ├── src/services/     # datos, autenticación y persistencia
    ├── src/router/       # router basado en hash
    ├── src/data/         # datos iniciales y traducciones
    ├── src/styles/       # estilos globales
    ├── index.html
    ├── package.json
    └── package-lock.json
```

`modz-web/dist/` y `modz-web/node_modules/` son artefactos locales ignorados. no se editan ni se incluyen en commits.

## DESARROLLO LOCAL

los comandos se ejecutan desde `modz-web/`:

```bash
npm install
npm run dev
npm run build
npm run preview
```

`npm run build` es la comprobación mínima obligatoria antes de entregar cambios de código. si se cambia el comportamiento del servidor, hay que probar también `modz-web/public/api/projects.php` en un servidor php compatible; vite por sí solo no ejecuta php.

no hay suite de tests automatizados configurada actualmente. la verificación manual debe cubrir la ruta afectada, navegación directa por hash, estados vacíos o de error, responsive, teclado y consola del navegador.

## ARQUITECTURA Y FLUJO DE DATOS

- `src/main.js` inicializa `projectManager`, monta header/footer y arranca el router.
- `src/router/index.js` usa rutas hash como `#/`, `#/login`, `#/view`, `#/mod/<id>`, `#/admin`, `#/admin/create`, `#/admin/edit/<id>`, `#/privacy` y `#/terms`.
- las rutas `/admin` requieren `AuthService.isAuthenticated()` y redirigen a `#/login` si no hay sesión.
- `ProjectManager` intenta leer `/api/projects.php` y usa `src/data/projects.json` como fallback de desarrollo.
- las altas, ediciones y eliminaciones envían el listado completo al endpoint php mediante `POST` y el header `X-Auth-Token`.
- el proyecto seleccionado se conserva en `sessionStorage` con la clave `modz_current_project_id`.
- la sesión usa `sessionStorage` con la clave `auth_token`; no es una sesión de servidor robusta.
- los componentes devuelven nodos dom y las páginas reciben parámetros de ruta cuando corresponde.

al añadir una funcionalidad, conserva la separación entre páginas, componentes, servicios y datos. evita colocar lógica de persistencia o autenticación dentro de componentes visuales.

## REGLAS DE IMPLEMENTACIÓN

- usa javascript modular compatible con el `type: module` existente;
- reutiliza componentes y variables de estilo antes de crear duplicados;
- mantén el enrutado basado en hash salvo que exista una decisión explícita para migrarlo;
- no rompas el fallback local cuando el api no esté disponible;
- valida y escapa entradas externas en el punto adecuado; no confíes en el filtrado visual;
- no añadas credenciales, tokens, secretos ni datos privados al repositorio;
- no cambies dependencias sin justificarlo en `changelog.md`;
- conserva la compatibilidad responsive, el foco visible, el contraste y la navegación por teclado;
- respeta `prefers-reduced-motion` cuando añadas animaciones;
- no uses una skill de react para convertir esta aplicación a react sin una petición explícita.

## SEGURIDAD

el fichero `.env` contiene credenciales de administración y actualmente está versionado. esto es un riesgo: no copies sus valores en documentación, código, issues, commits ni pull requests. cualquier trabajo de seguridad debe solicitar la rotación de esas credenciales y migrar los secretos fuera del repositorio.

el endpoint php contiene además un token de respaldo en código y recibe el token de sesión desde el navegador. considéralo una limitación conocida, no una implementación de autenticación de producción. los cambios de autenticación deben revisar `src/services/AuthService.js`, `src/services/ProjectManager.js` y `public/api/projects.php` juntos.

para un cambio que pueda afectar a seguridad, registra el impacto en `security.md`, añade una entrada en la categoría `SECURITY` de `changelog.md` y describe la mitigación en la pull request.

## REGLAS DE MARKDOWN

se aplica `.docs/guidelines/markdown-guidelines.md` a todos los ficheros markdown:

- el contenido va en minúsculas y conserva los acentos ortográficos;
- los títulos y encabezados van en mayúsculas, con sus acentos y `Ñ` cuando corresponda;
- nombres propios, marcas y siglas van en minúsculas en el contenido salvo que sean código literal;
- rutas, comandos, nombres de fichero, identificadores, urls, ramas y tags dentro de código se conservan literalmente;
- escribe párrafos cortos, listas coherentes y enlaces que realmente existan;
- no dejes documentación vacía ni texto de relleno.

## CHANGELOG

`changelog.md` es la fuente de verdad para commits de publicación, pull requests, merges y releases. mantiene secciones bilingües con estas categorías, en este orden y solo cuando tengan entradas:

1. `ADDED` / `AÑADIDO`
2. `CHANGED` / `CAMBIADO`
3. `FIXED` / `CORREGIDO`
4. `REMOVED` / `ELIMINADO`
5. `SECURITY` / `SEGURIDAD`

cada item debe ser una sola línea, estar escrito en imperativo y poner rutas, comandos e identificadores entre backticks. durante el desarrollo se actualiza `## SIN PUBLICAR / UNRELEASED`. al cerrar una versión se cambia por `## [x.y.z] - aaaa-mm-dd`.

## COMMITS

la guía completa está en `.docs/guidelines/commit-guidelines.md`. el título obligatorio es:

```text
<prefijo> | <resumen corto en imperativo>
```

los únicos prefijos son `update`, `fix`, `hotfix`, `changes` y `changelog`. el cuerpo es una lista markdown no numerada, con un item por bloque lógico y sin saltos internos. al solicitar un mensaje de commit, presenta bloques de código separados para el título, el cuerpo y el fragmento de changelog.

usa `update` por defecto para trabajo funcional o documental, `fix` para correcciones normales, `hotfix` solo para urgencias de producción, `changes` para estructura/configuración/dependencias y `changelog` cuando el único objetivo sea cerrar o editar el changelog.

## PULL REQUESTS, MERGES Y RELEASES

aplica `.docs/guidelines/pr-merge-release-guidelines.md`:

- una pr normal reutiliza el formato del commit: `<prefijo> | <resumen corto en imperativo>`;
- una pr de publicación usa `release version <x.y.z> - <resumen corto en imperativo>`;
- la descripción de la pr copia los bloques `### CASTELLANO` y `### ENGLISH` relevantes del changelog, sin inventar un formato paralelo;
- los cambios marcados `[online]` o `[offline]` se conservan;
- los merges usan un merge commit con `--no-ff`; no se usa squash ni rebase para fusionar;
- las releases de github son solo en inglés y usan `v<x.y.z> — <resumen corto en inglés, minúsculas, sin acentos>`;
- el cuerpo de la release copia `### ENGLISH` de la versión cerrada y el tag es `v<x.y.z>`;
- las fechas se escriben como `aaaa-mm-dd`.

## CHECKLIST DE ENTREGA

antes de terminar, claude debe comprobar:

- ha leído esta guía y las skills locales aplicables desde `.docs/skills/...`;
- ha revisado el diff completo y no ha sobrescrito cambios ajenos;
- `npm run build` termina correctamente si se tocó la aplicación;
- no se han añadido secretos, artefactos, `node_modules` ni `dist`;
- se han actualizado `changelog.md` y la documentación afectada;
- la interfaz funciona con teclado, en móvil y con movimiento reducido cuando aplique;
- el título y el cuerpo de commit, pr o release cumplen las reglas anteriores.

si una comprobación no puede ejecutarse, indícalo explícitamente con el motivo y el riesgo residual.
