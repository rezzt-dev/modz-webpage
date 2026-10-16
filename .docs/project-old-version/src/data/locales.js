const resources = {
  en: {
    header: {
      browse: '/BROWSE',
      publishers: '/PUBLISHERS',
      docs: '/DOCS',
      status: 'STATUS: ONLINE',
      login: 'LOGIN'
    },
    home: {
      subtitle: 'High-end technical assets for the Minecraft ecosystem. // v2.0.4-stable',
      searchPlaceholder: 'FILTER BY NAME, TAG, OR AUTHOR...',
      filters: 'FILTERS:',
      all: 'ALL',
      mods: 'MODS',
      plugins: 'PLUGINS',
      datapacks: 'DATAPACKS',
      loadMore: 'FETCH_MORE_RESULTS.BIN',
      noResults: 'NO_RESULTS_FOUND_IN_INDEX'
    },
    project: {
      back: 'BACK_TO_INDEX',
      download: 'DOWNLOAD_BUILD',
      releaseDate: 'RELEASE_DATE',
      version: 'VERSION',
      license: 'LICENSE',
      manifest: 'PROJECT_MANIFEST',
      launcher: 'LAUNCHER',
      environment: 'ENVIRONMENT',
      dependency: 'DEPENDENCY',
      sourceLinks: 'SOURCE_LINKS',
      repo: 'REPOSITORY (GITHUB)',
      issues: 'ISSUE_TRACKER',
      techDocs: 'TECHNICAL_DOCS',
      problem: 'PROBLEM_SCOPE',
      solution: 'IMPLEMENTATION_STRATEGY',
      systemLog: 'SYSTEM_LOG',
      error: 'ERROR: ENTRY_NOT_FOUND'
    },
    privacy: {
      title: 'Privacy Protocol',
      lastUpdated: 'Last Updated: 2026.02.05',
      s1_title: '01. Data Collection',
      s1_desc: 'We collect minimal data necessary for operational integrity. This includes standard access logs, browser user-agent strings, and IP addresses for security auditing. No personal identifiable information (PII) is harvested without explicit consent.',
      s2_title: '02. Local Storage',
      s2_desc: 'This application utilizes client-side LocalStorage persistence for user preferences (theme, filters, session tokens). This data resides solely on your device and is not synchronized to external servers unless explicitly required for account functionality.',
      s3_title: '03. External Dependencies',
      s3_desc: 'Resources may be loaded from third-party content delivery networks (CDNs) including Google Fonts and unpkg. Requests to these services are subject to their respective privacy policies.',
      s4_title: '04. Contact',
      s4_desc: 'For security inquiries or data removal requests, contact security@rezzt.dev.'
    },
    terms: {
      title: 'Terms of Service',
      effectiveDate: 'Effective Date: 2026.02.05',
      s1_title: '01. Acceptance',
      s1_desc: 'By accessing modz.dev, you agree to abide by these terms. This interface is provided "as is" without warranty of availability or uptime guarantees.',
      s2_title: '02. Usage License',
      s2_desc: 'Permission is granted to temporarily download copies of the materials (information or software) on this site for personal, non-commercial transitory viewing only.',
      s2_list1: 'Modify or copy the materials;',
      s2_list2: 'Use the materials for any commercial purpose;',
      s2_list3: 'Attempt to decompile or reverse engineer any proprietary software;',
      s3_title: '03. Liability',
      s3_desc: 'In no event shall modz.dev or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit) arising out of the use or inability to use the materials on this site.',
      s4_title: '04. Revisions',
      s4_desc: 'We may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.'
    },
    footer: {
      desc: 'A technical index for high-end Minecraft modifications. Designed for performance and precision navigation.',
      rights: 'REZZT.DEV',
      terms: 'TERMS',
      privacy: 'PRIVACY',
      latency: 'LATENCY: 14MS // SERVER: EU-WEST-1'
    },
    auth: {
      identify: 'Identify',
      subtitle: 'SECURE_TERMINAL_ACCESS // V3.1',
      username: 'USERNAME',
      password: 'PASSWORD',
      placeholderUser: 'ENTER_ID...',
      placeholderPass: '••••••••',
      authenticate: 'AUTHENTICATE',
      error: 'ACCESS_DENIED // INVALID_CREDENTIALS',
      logout: 'LOGOUT'
    },
    dashboard: {
      title: 'Admin Console',
      subtitle: 'MANAGE_RESOURCES // ENTRIES',
      export: 'EXPORT_JSON',
      import: 'IMPORT_JSON',
      newEntry: 'NEW ENTRY',
      downloadTemplate: 'DOWNLOAD_JSON_TEMPLATE',
      noData: 'NO_DATA',
      columns: {
        id: 'ID',
        title: 'TITLE',
        type: 'TYPE',
        version: 'VERSION',
        actions: 'ACTIONS'
      },
      actions: {
        edit: 'EDIT',
        del: 'DEL',
        confirmDelete: 'CONFIRM_DELETION?'
      },
      importSuccess: 'IMPORT_SUCCESS',
      importError: 'IMPORT_FAILED: INVALID_JSON'
    },
    editor: {
      root: 'ROOT',
      editEntry: 'EDIT_ENTRY',
      newEntry: 'NEW_ENTRY',
      createContent: 'Create Content',
      cancel: 'CREATE CANCEL',
      desc: 'Populate the fields below to deploy a new resource to the repository. Ensure all technical specifications match the target environment.',
      s1: '01 / IDENTITY',
      projectTitle: 'PROJECT TITLE',
      category: 'CATEGORY',
      shortDesc: 'SHORT DESCRIPTION',
      iconSelector: 'ICON SELECTOR',
      selected: 'Selected:',
      s2: '02 / DOCUMENTATION',
      problemStatement: 'PROBLEM STATEMENT',
      proposedSolution: 'PROPOSED SOLUTION',
      s3: '03 / PARAMETERS',
      launcherType: 'LAUNCHER TYPE',
      version: 'VERSION',
      environment: 'ENVIRONMENT',
      dependency: 'DEPENDENCY',
      filePath: 'FILE PATH / DOWNLOAD URL',
      pathHint: 'Relative path to public folder (e.g. /my-mod.jar) or external link. Supports .jar, .zip',
      update: 'UPDATE_RESOURCE',
      deploy: 'DEPLOY_RESOURCE',
      notFound: 'ERROR_NOT_FOUND'
    }
  },
  es: {
    header: {
      browse: '/EXPLORAR',
      publishers: '/PUBLISHADORES',
      docs: '/DOCUMENTACION',
      status: 'ESTADO: ONLINE',
      login: 'ACCEDER'
    },
    home: {
      subtitle: 'Activos técnicos de alta gama para el ecosistema de Minecraft. // v2.0.4-estable',
      searchPlaceholder: 'FILTRAR POR NOMBRE, ETIQUETA O AUTOR...',
      filters: 'FILTROS:',
      all: 'TODOS',
      mods: 'MODS',
      plugins: 'PLUGINS',
      datapacks: 'DATAPACKS',
      loadMore: 'OBTENER_MAS_RESULTADOS.BIN',
      noResults: 'NO_SE_ENCONTRARON_RESULTADOS_EN_EL_INDICE'
    },
    project: {
      back: 'VOLVER_AL_INDICE',
      download: 'DESCARGAR_BUILD',
      releaseDate: 'FECHA_LANZAMIENTO',
      version: 'VERSION',
      license: 'LICENCIA',
      manifest: 'MANIFIESTO_DEL_PROYECTO',
      launcher: 'LANZADOR',
      environment: 'ENTORNO',
      dependency: 'DEPENDENCIA',
      sourceLinks: 'ENLACES_FUENTE',
      repo: 'REPOSITORIO (GITHUB)',
      issues: 'RASTREADOR_DE_PROBLEMAS',
      techDocs: 'DOCS_TECNICA',
      problem: 'ALCANCE_DEL_PROBLEMA',
      solution: 'ESTRATEGIA_DE_IMPLEMENTACION',
      systemLog: 'REGISTRO_DEL_SISTEMA',
      error: 'ERROR: ENTRADA_NO_ENCONTRADA'
    },
    privacy: {
      title: 'Protocolo de Privacidad',
      lastUpdated: 'Última actualización: 2026.02.05',
      s1_title: '01. Recopilación de Datos',
      s1_desc: 'Recopilamos los datos mínimos necesarios para la integridad operativa. Esto incluye registros de acceso estándar, cadenas de agente de usuario y direcciones IP para auditorías de seguridad. No se recolecta información de identificación personal (PII) sin consentimiento explícito.',
      s2_title: '02. Almacenamiento Local',
      s2_desc: 'Esta aplicación utiliza persistencia de LocalStorage del lado del cliente para las preferencias del usuario (tema, filtros, tokens de sesión). Estos datos residen únicamente en su dispositivo y no se sincronizan con servidores externos a menos que sea explícitamente necesario para la funcionalidad de la cuenta.',
      s3_title: '03. Dependencias Externas',
      s3_desc: 'Los recursos pueden cargarse desde redes de entrega de contenido (CDN) de terceros, incluidas Google Fonts y unpkg. Las solicitudes a estos servicios están sujetas a sus respectivas políticas de privacidad.',
      s4_title: '04. Contacto',
      s4_desc: 'Para consultas de seguridad o solicitudes de eliminación de datos, contacte a security@rezzt.dev.'
    },
    terms: {
      title: 'Términos de Servicio',
      effectiveDate: 'Fecha de vigencia: 2026.02.05',
      s1_title: '01. Aceptación',
      s1_desc: 'Al acceder a modz.dev, usted acepta cumplir con estos términos. Esta interfaz se proporciona "tal cual" sin garantía de disponibilidad o tiempo de actividad.',
      s2_title: '02. Licencia de Uso',
      s2_desc: 'Se otorga permiso para descargar temporalmente copias de los materiales (información o software) en este sitio solo para visualización transitoria personal y no comercial.',
      s2_list1: 'Modificar o copiar los materiales;',
      s2_list2: 'Usar los materiales para cualquier propósito comercial;',
      s2_list3: 'Intentar descompilar o aplicar ingeniería inversa a cualquier software propietario;',
      s3_title: '03. Responsabilidad',
      s3_desc: 'En ningún caso modz.dev o sus proveedores serán responsables de ningún daño (incluidos, entre otros, daños por pérdida de datos o ganancias) que surjan del uso o la imposibilidad de usar los materiales en este sitio.',
      s4_title: '04. Revisiones',
      s4_desc: 'Podemos revisar estos términos de servicio para su sitio web en cualquier momento sin previo aviso. Al utilizar este sitio web, usted acepta estar sujeto a la versión actual de estos términos de servicio.'
    },
    footer: {
      desc: 'Un índice técnico para modificaciones de Minecraft de alta gama. Diseñado para rendimiento y precisión en la navegación.',
      rights: 'REZZT.DEV',
      terms: 'TERMINOS',
      privacy: 'PRIVACIDAD',
      latency: 'LATENCIA: 14MS // SERVIDOR: EU-WEST-1'
    },
    auth: {
      identify: 'Identificarse',
      subtitle: 'ACCESO_TERMINAL_SEGURO // V3.1',
      username: 'USUARIO',
      password: 'PASSWORD',
      placeholderUser: 'ENTRAR_ID...',
      placeholderPass: '••••••••',
      authenticate: 'AUTENTICAR',
      error: 'ACCESO_DENEGADO // CREDENCIALES_INVALIDAS',
      logout: 'CERRAR SESION'
    },
    dashboard: {
      title: 'Consola de Admin',
      subtitle: 'GESTIONAR_RECURSOS // ENTRADAS',
      export: 'EXPORTAR_JSON',
      import: 'IMPORTAR_JSON',
      newEntry: 'NUEVA ENTRADA',
      downloadTemplate: 'DESCARGAR_PLANTILLA_JSON',
      noData: 'SIN_DATOS',
      columns: {
        id: 'ID',
        title: 'TITULO',
        type: 'TIPO',
        version: 'VERSION',
        actions: 'ACCIONES'
      },
      actions: {
        edit: 'EDITAR',
        del: 'BORRAR',
        confirmDelete: '¿CONFIRMAR_BORRADO?'
      },
      importSuccess: 'IMPORTACION_EXITOSA',
      importError: 'FALLO_IMPORTACION: JSON_INVALIDO'
    },
    editor: {
      root: 'RAIZ',
      editEntry: 'EDITAR_ENTRADA',
      newEntry: 'NUEVA_ENTRADA',
      createContent: 'Crear Contenido',
      cancel: 'CANCELAR CREACION',
      desc: 'Complete los campos a continuación para implementar un nuevo recurso en el repositorio. Asegúrese de que todas las especificaciones técnicas coincidan con el entorno de destino.',
      s1: '01 / IDENTIDAD',
      projectTitle: 'TITULO DEL PROYECTO',
      category: 'CATEGORIA',
      shortDesc: 'DESCRIPCION CORTA',
      iconSelector: 'SELECTOR DE ICONOS',
      selected: 'Seleccionado:',
      s2: '02 / DOCUMENTACION',
      problemStatement: 'PLANTEAMIENTO DEL PROBLEMA',
      proposedSolution: 'SOLUCION PROPUESTA',
      s3: '03 / PARAMETROS',
      launcherType: 'TIPO DE LANZADOR',
      version: 'VERSION',
      environment: 'ENTORNO',
      dependency: 'DEPENDENCIA',
      filePath: 'RUTA DE ARCHIVO / URL DESCARGA',
      pathHint: 'Ruta relativa a carpeta pública (ej. /mi-mod.jar) o enlace externo. Soporta .jar, .zip',
      update: 'ACTUALIZAR_RECURSO',
      deploy: 'IMPLEMENTAR_RECURSO',
      notFound: 'ERROR_NO_ENCONTRADO'
    }
  }
};

let currentLang = localStorage.getItem('modz_lang') || 'en';
const listeners = [];

export function t(key) {
  const keys = key.split('.');
  let value = resources[currentLang];

  for (const k of keys) {
    if (value && value[k]) {
      value = value[k];
    } else {
      return key; // Fallback to key if not found
    }
  }
  return value;
}

export function getCurrentLang() {
  return currentLang;
}

export function setLanguage(lang) {
  if (resources[lang]) {
    currentLang = lang;
    localStorage.setItem('modz_lang', lang);
    notifyListeners();
  }
}

export function subscribe(listener) {
  listeners.push(listener);
}

function notifyListeners() {
  listeners.forEach(fn => fn());
}
