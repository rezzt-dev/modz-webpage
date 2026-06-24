# INFORMACION GENERAL DEL PROYECTO MODZ.DEV

este documento recoge una vision global del proyecto **MODZ.DEV**, un frontal web para catalogar y gestionar modificaciones, plugins y datapacks de minecraft. su objetivo es servir como referencia rapida para cualquier persona que necesite entender el alcance, la arquitectura y el funcionamiento del sistema sin adentrarse en el codigo fuente detallado.

---

## 1. DESCRIPCION DEL PROYECTO Y STACK TECNOLOGICO

### 1.1. PROPOSITO

MODZ.DEV es una aplicacion web de pagina unica (SPA) pensada para ofrecer un catalogo publico de proyectos relacionados con minecraft. permite listar, buscar, filtrar y consultar el detalle de cada entrada, ademas de contar con un area administrativa protegida donde gestionar el contenido del catalogo. la aplicacion prioriza la simplicidad, el rendimiento y un estilo visual oscuro y tecnico inspirado en terminales.

### 1.2. TECNOLOGIAS PRINCIPALES

el proyecto se apoya en un stack deliberadamente ligero. el frontal esta construido con javascript moderno en forma de modulos ES6, sin utilizar frameworks como react o vue. la navegacion se gestiona mediante rutas basadas en hash. el estilado corre a cargo de tailwindcss, mientras que vite se encarga del empaquetado y del servidor de desarrollo. los iconos provienen de google material icons, cargados desde su CDN oficial.

en el lado del servidor, un backend reducido escrito en PHP 8.x expone una API JSON de lectura y escritura. los datos se almacenan en un archivo plano de tipo JSON, lo que hace que el sistema sea portable, facil de inspeccionar y sencillo de desplegar en entornos modestos.

### 1.3. CARACTERISTICAS DESTACADAS

la aplicacion soporta ingles y espanol mediante un sistema de internacionalizacion propio. los proyectos pueden marcarse como visibles u ocultos para el publico general. el panel de administracion permite crear, editar, eliminar y exportar proyectos, y los cambios se persisten en el archivo JSON del servidor a traves de la API PHP.

---

## 2. ARQUITECTURA Y FLUJO DE DATOS

### 2.1. INICIO DE LA APLICACION

cuando un usuario accede a la aplicacion, `src/main.js` muestra inicialmente un indicador de carga mientras solicita los datos del catalogo. una vez que la informacion esta disponible, construye el esqueleto de la pagina —cabecera, contenido principal y pie— e inicializa el router sobre el contenedor central. a partir de ese momento, los cambios de ruta se resuelven sin recargar la pagina.

### 2.2. ENRUTAMIENTO BASADO EN HASH

el router utiliza el fragmento de la URL (`window.location.hash`) para decidir que vista renderizar. las rutas principales incluyen la pagina de inicio, el detalle de un proyecto, la vista de administracion, el editor de proyectos y las paginas estaticas de privacidad y terminos. las rutas bajo `/admin` estan protegidas: si el usuario no ha iniciado sesion, el sistema lo redirige automaticamente a la pantalla de login.

### 2.3. GESTION DEL ESTADO

el estado de la aplicacion se mantiene en dos servicios principales que actuan de forma similar a singletons. por un lado, `ProjectManager` almacena en memoria el listado de proyectos, ofrece metodos para consultar, guardar y eliminar entradas, y notifica a los componentes suscritos cuando los datos cambian. por otro lado, `AuthService` gestiona la autenticacion del administrador, validando las credenciales contra variables de entorno inyectadas en el bundle y conservando el token de sesion en `sessionStorage`.

### 2.4. PERSISTENCIA Y SINCRONIZACION

los datos se cargan inicialmente desde `/api/projects.php`. si esta peticion falla —por ejemplo, porque el servidor PHP no este disponible durante el desarrollo local— la aplicacion utiliza `src/data/projects.json` como copia de seguridad. cuando un administrador guarda cambios, estos se envian mediante `POST` al mismo endpoint PHP, junto con un token de autenticacion en la cabecera correspondiente. el backend sanitiza el contenido recibido y sobrescribe el archivo JSON del servidor.

---

## 3. ESTRUCTURA DEL PROYECTO Y COMPONENTES CLAVE

### 3.1. ORGANIZACION DE CARPETAS

el repositorio separa claramente el codigo fuente del frontal, los recursos estaticos, el backend y la configuracion del entorno. la carpeta `src/` contiene toda la logica del cliente: componentes, paginas, servicios, datos y estilos. la carpeta `public/api/` alberga el script PHP, la base de datos JSON y las reglas de apache. en la raiz se encuentran los archivos de configuracion de vite, postcss y las variables de entorno.

### 3.2. COMPONENTES REUTILIZABLES

la interfaz se construye a partir de funciones que devuelven nodos del DOM. entre los componentes compartidos se encuentran la cabecera, el pie de pagina, la tarjeta de proyecto, el modal de inicio de sesion y el selector de iconos. cada componente puede suscribirse a cambios de idioma o de datos para volver a renderizarse cuando sea necesario.

### 3.3. PAGINAS PRINCIPALES

las vistas de nivel de ruta se organizan en `src/pages/`. la pagina de inicio presenta el listado completo con busqueda y filtros. la vista de detalle muestra la informacion ampliada de un proyecto. el dashboard de administracion resume las acciones disponibles para los usuarios autenticados, mientras que el editor permite crear o modificar proyectos. tambien existen paginas informativas de privacidad y terminos de uso.

### 3.4. BACKEND Y API

el archivo `public/api/projects.php` actua como unico punto de entrada para la gestion de datos. responde a peticiones `GET` devolviendo el catalogo completo y a peticiones `POST` actualizandolo tras validar el token. el archivo `.htaccess` restringe el acceso directo a archivos JSON y a configuraciones sensibles. para un despliegue funcional, el directorio `public/api/` debe residir en un servidor web con soporte para PHP.

---

## 4. DESPLIEGUE, SEGURIDAD Y CONSIDERACIONES OPERATIVAS

### 4.1. CONSTRUCCION Y PUESTA EN PRODUCCION

el proceso de despliegue comienza ejecutando el comando de build de vite, que genera una version optimizada de la aplicacion en la carpeta `dist/`. el contenido de `dist/` debe subirse a la raiz del servidor web. por separado, el directorio `public/api/` debe copiarse a una ruta accesible por PHP, asegurando que el archivo `projects.json` tenga permisos de escritura para el usuario del servidor web.

### 4.2. VARIABLES DE ENTORNO

las credenciales del administrador se definen en el archivo `.env` mediante las variables `VITE_ADMIN_USER` y `VITE_ADMIN_PASS`. estos valores se incorporan al bundle durante la compilacion, por lo que deben configurarse antes de ejecutar el build. el archivo `.env` esta excluido del control de versiones y no debe incluirse nunca en el repositorio.

### 4.3. CONSIDERACIONES DE SEGURIDAD

la autenticacion del frontal se realiza unicamente en el cliente, comparando credenciales contra valores presentes en el bundle. esto la hace adecuada como capa de conveniencia, pero no constituye un perimetro de alta seguridad. el token de autenticacion enviado al backend es la propia contrasena de administrador, almacenada en `sessionStorage`; conviene evitar registrarla o mostrarla en mensajes de error.

el backend PHP incluye una contrasena de administrador incrustada directamente en el codigo, lo cual deberia reemplazarse por variables de entorno en entornos productivos. la sanitizacion de entradas es basica: elimina etiquetas `<script>`, atributos `on*` y aplica `htmlspecialchars`, pero no sustituye a un sanitizer HTML completo si se preve permitir contenido mas rico. ademas, la configuracion CORS es permisiva y debe revisarse antes de exponer el servicio publicamente.

### 4.4. MANTENIMIENTO HABITUAL

el mantenimiento del proyecto suele implicar actualizar el catalogo de proyectos a traves del panel de administracion, ajustar textos en ambos idiomas dentro de `src/data/locales.js`, o modificar estilos en `src/styles/style.css` y en las clases de tailwind de cada componente. antes de cualquier cambio importante se recomienda verificar la aplicacion en modo desarrollo con `npm run dev` y, posteriormente, comprobar que el build se genera sin errores.
