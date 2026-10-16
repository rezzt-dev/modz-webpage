# SEGURIDAD

## ALCANCE

este documento describe el modelo de seguridad actual de `modz-webpage`, los riesgos conocidos y el proceso recomendado para reportar vulnerabilidades. no sustituye una auditoría, una revisión de infraestructura ni una configuración segura del servidor.

## ESTADO ACTUAL

la aplicación es una spa de vite con un panel de administración en el cliente y una api php opcional. el catálogo público se puede leer mediante `GET`; las operaciones de escritura se realizan mediante `POST` con un token enviado en `X-Auth-Token`.

la autenticación actual es una protección mínima para desarrollo:

- `AuthService` compara `VITE_ADMIN_USER` y `VITE_ADMIN_PASS` en el navegador.
- el valor de la contraseña se guarda en `sessionStorage` como `auth_token`.
- `projects.php` compara el token recibido con un valor compartido en el servidor.
- la autorización de las rutas `/admin` se realiza en el cliente y no constituye un control de acceso del servidor.

## RIESGOS CONOCIDOS

### CREDENCIALES EXPUESTAS

el archivo `.env` contiene credenciales de administración y está incluido en el repositorio. además, la misma credencial aparece como valor de respaldo en `modz-web/public/api/projects.php`. estos valores deben considerarse comprometidos.

acciones necesarias:

- rota inmediatamente las credenciales y el token del servidor.
- elimina `.env` del control de versiones y añade una regla específica para impedir su reaparición.
- revisa el historial de git y elimina los secretos mediante un procedimiento de limpieza adecuado si el repositorio se ha compartido.
- invalida cualquier sesión o token emitido con los valores expuestos.

### SECRETOS EN EL CLIENTE

las variables con prefijo `VITE_` se incorporan al bundle generado por vite. cualquier persona que descargue la aplicación puede inspeccionarlas, por lo que no deben utilizarse para proteger recursos o credenciales reales.

### TOKEN EN `sessionStorage`

guardar la contraseña o un token de larga duración en `sessionStorage` deja el valor disponible para javascript ejecutado en el mismo origen. un xss podría leerlo y utilizarlo mientras la sesión siga activa.

### API PHP Y CORS

la api refleja el origen recibido en `Access-Control-Allow-Origin` y habilita credenciales. esta configuración puede permitir orígenes no confiables si el servidor se publica sin una capa adicional de control.

### VALIDACIÓN Y ESCRITURA DE DATOS

`projects.php` aplica una sanitización básica antes de escribir el json. no debe tratarse como sustituto de validación por esquema, autorización por operación, escape contextual en la interfaz, límites de tamaño o protección contra condiciones de carrera.

el endpoint escribe sobre un archivo json servido públicamente. el servidor debe limitar permisos, proteger la ruta y evitar que el archivo contenga secretos o información personal.

## REQUISITOS MÍNIMOS DE DESPLIEGUE

antes de publicar el panel o la api:

- sirve todo el sitio mediante `https`.
- mueve las credenciales a un gestor de secretos o variables de entorno exclusivas del servidor.
- reemplaza la autenticación compartida por sesiones de servidor o tokens de corta duración con rotación y revocación.
- valida la autorización en el servidor para cada operación de escritura.
- restringe `Access-Control-Allow-Origin` a una lista explícita de dominios confiables.
- desactiva respuestas de depuración y no expongas rutas internas, tokens ni trazas.
- valida el catálogo contra un esquema y limita el tamaño de las solicitudes.
- protege `modz-web/public/api/projects.json` contra escritura directa y configura copias de seguridad.
- establece cabeceras de seguridad, incluida una política de seguridad de contenidos adecuada.
- revisa dependencias con `npm audit` y actualízalas siguiendo una ventana de mantenimiento controlada.

## PRÁCTICAS PARA CONTRIBUIDORES

- no copies credenciales, tokens, cookies, datos personales ni respuestas sensibles en código, markdown, issues, commits o capturas.
- utiliza valores ficticios como `example-token` en ejemplos.
- revisa `modz-web/src/services/AuthService.js`, `modz-web/src/services/ProjectManager.js` y `modz-web/public/api/projects.php` como una unidad cuando cambie la autenticación o la persistencia.
- valida que el contenido procedente del catálogo se escape correctamente antes de insertarlo en html.
- registra los cambios de seguridad en la categoría `SECURITY` de `changelog.md`.
- describe en la pull request el riesgo, la mitigación, el alcance y las limitaciones pendientes.

## REPORTE RESPONSABLE

no publiques vulnerabilidades explotables ni secretos en issues públicas. abre un reporte privado en el repositorio de github o contacta al mantenedor a través de un canal privado disponible en <https://github.com/rezzt-dev/modz-webpage>.

incluye, sin adjuntar secretos reales:

- una descripción breve y el componente afectado.
- pasos mínimos para reproducir el problema.
- impacto estimado y condiciones necesarias para explotarlo.
- versiones, rutas o commits afectados.
- una propuesta de mitigación si la tienes.

el mantenedor debe confirmar la recepción, limitar la difusión del reporte, rotar cualquier secreto expuesto y coordinar la corrección antes de publicar detalles técnicos.

## LIMITACIÓN

hasta que se complete la migración a autenticación y autorización en servidor, el panel debe considerarse una herramienta de desarrollo o de uso interno controlado, no un área administrativa apta para exposición pública.
