import routeManifest from './routes.json';

export type AppId = 'customer' | 'business' | 'rider' | 'control';
export type Availability = 'Próximamente' | 'Acceso administrado';

export type Platform = {
  name: string;
  use: string;
  availability: Availability;
};

export type Product = {
  id: AppId;
  name: string;
  label: string;
  headline: string;
  summary: string;
  audience: string;
  releaseLabel: Availability;
  capabilities: string[];
  steps: Array<{ title: string; text: string }>;
  platforms: Platform[];
  accessNote: string;
};

export type CorporateRoute = {
  id: string;
  path: string;
  title: string;
  description: string;
};

export type Service = {
  id: string;
  label: string;
  title: string;
  summary: string;
  details: string[];
};

export const routes = routeManifest as CorporateRoute[];
export const appIds: AppId[] = ['customer', 'business', 'rider', 'control'];

const baseUrl = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

export function assetHref(path: string): string {
  const normalizedPath = path.replace(/^\/+/, '');
  return `${baseUrl}${normalizedPath}`;
}

export function siteHref(path: string): string {
  if (path.startsWith('#')) return path;

  const [rawPath, rawHash] = path.split('#');
  const normalizedPath = rawPath === '/'
    ? ''
    : `${rawPath.replace(/^\/+|\/+$/g, '')}/`;
  const hash = rawHash ? `#${rawHash}` : '';

  return `${baseUrl}${normalizedPath}${hash}`;
}

export function normalizeCorporatePath(pathname: string): string {
  const basePath = new URL(baseUrl, window.location.origin).pathname.replace(/\/$/, '');
  let path = pathname;

  if (basePath && path.startsWith(basePath)) {
    path = path.slice(basePath.length);
  }

  if (!path || path === '/') return '/';
  return `/${path.replace(/^\/+|\/+$/g, '')}/`;
}

export function resolveRoute(pathname: string): CorporateRoute | null {
  const normalizedPath = normalizeCorporatePath(pathname);
  return routes.find((route) => route.path === normalizedPath) ?? null;
}

export function appRoute(id: AppId): string {
  return siteHref(`/apps/${id}/`);
}

export function getLegacyAppRedirect(search: string): string | null {
  const requested = new URLSearchParams(search).get('app');
  return appIds.includes(requested as AppId)
    ? appRoute(requested as AppId)
    : null;
}

export const services: Service[] = [
  {
    id: 'commerce',
    label: 'COMERCIO LOCAL',
    title: 'Descubrimiento y operación comercial',
    summary: 'Conecta personas con comercios y organiza el recorrido desde la selección hasta la entrega.',
    details: ['Catálogo y disponibilidad', 'Preparación y coordinación', 'Continuidad entre aplicaciones'],
  },
  {
    id: 'delivery',
    label: 'ENTREGAS',
    title: 'Movimiento bajo demanda',
    summary: 'Coordina recogidas y entregas con responsabilidades visibles para cada participante.',
    details: ['Asignación y ruta', 'Transiciones verificables', 'Gestión de incidencias'],
  },
  {
    id: 'parcel',
    label: 'PAQUETERÍA URBANA',
    title: 'Envíos entre puntos',
    summary: 'Permite plantear movimientos de paquetes sin convertir la web corporativa en una herramienta operativa.',
    details: ['Origen y destino', 'Seguimiento por estados', 'Evidencia de cierre'],
  },
  {
    id: 'operations',
    label: 'INFRAESTRUCTURA',
    title: 'Coordinación operacional',
    summary: 'Mantiene permisos, contexto y trazabilidad entre Customer, Business, Rider y Control.',
    details: ['Roles separados', 'Estados compartidos', 'Supervisión restringida'],
  },
];

export const products: Record<AppId, Product> = {
  customer: {
    id: 'customer',
    name: 'DELIVER Customer',
    label: 'PARA PERSONAS',
    headline: 'Compra, envía y sigue todo desde una sola cuenta.',
    summary: 'Descubre comercios, solicita entregas, envía paquetes y consulta cada avance desde una experiencia diseñada para móvil y escritorio.',
    audience: 'Personas que compran, reciben o envían productos y paquetes.',
    releaseLabel: 'Próximamente',
    capabilities: [
      'Explorar comercios y categorías',
      'Crear pedidos y envíos',
      'Seguir cada operación',
      'Gestionar direcciones',
      'Consultar historial y comprobantes',
      'Resolver dudas e incidencias',
    ],
    steps: [
      { title: 'Descubre', text: 'Encuentra un comercio o selecciona la opción para enviar un paquete.' },
      { title: 'Configura', text: 'Define productos, dirección, horario e instrucciones necesarias.' },
      { title: 'Confirma', text: 'Revisa el resumen antes de continuar con la operación.' },
      { title: 'Sigue', text: 'Consulta estados, actualizaciones y soporte desde la aplicación.' },
    ],
    platforms: [
      { name: 'Android', use: 'Compras, envíos y seguimiento móvil', availability: 'Próximamente' },
      { name: 'iPhone y iPad', use: 'Compras, envíos y seguimiento móvil', availability: 'Próximamente' },
      { name: 'Windows', use: 'Operación y seguimiento en escritorio', availability: 'Próximamente' },
      { name: 'macOS', use: 'Operación y seguimiento en escritorio', availability: 'Próximamente' },
      { name: 'Linux', use: 'Operación y seguimiento en escritorio', availability: 'Próximamente' },
    ],
    accessNote: 'La publicación se realizará por etapas cuando cada cliente supere validación, firma y distribución oficial.',
  },
  business: {
    id: 'business',
    name: 'DELIVER Business',
    label: 'PARA COMERCIOS',
    headline: 'Tu catálogo, tus pedidos y tu operación en un solo lugar.',
    summary: 'Organiza sucursales, prepara pedidos, coordina entregas y mantiene visible la responsabilidad de cada equipo.',
    audience: 'Comercios, sucursales, operadores y equipos de atención.',
    releaseLabel: 'Próximamente',
    capabilities: [
      'Catálogo y disponibilidad',
      'Recepción y preparación de pedidos',
      'Sucursales, usuarios y permisos',
      'Coordinación de entregas',
      'Incidencias y soporte',
      'Reportes para la operación',
    ],
    steps: [
      { title: 'Registra', text: 'Completa el alta de la organización y la validación comercial.' },
      { title: 'Configura', text: 'Define sucursales, catálogo, permisos y reglas de atención.' },
      { title: 'Prepara', text: 'Recibe pedidos y coordina el trabajo de cada equipo.' },
      { title: 'Entrega', text: 'Conecta la preparación con logística y conserva trazabilidad.' },
    ],
    platforms: [
      { name: 'Windows', use: 'Superficie principal para la operación', availability: 'Próximamente' },
      { name: 'macOS', use: 'Superficie principal para la operación', availability: 'Próximamente' },
      { name: 'Linux', use: 'Superficie principal para la operación', availability: 'Próximamente' },
      { name: 'Android', use: 'Acciones rápidas y notificaciones', availability: 'Próximamente' },
      { name: 'iPhone y iPad', use: 'Acciones rápidas y notificaciones', availability: 'Próximamente' },
    ],
    accessNote: 'El alta comercial se habilitará junto con los primeros canales oficiales de distribución.',
  },
  rider: {
    id: 'rider',
    name: 'DELIVER Rider',
    label: 'PARA OPERADORES EN CAMPO',
    headline: 'Cada ruta, cada evidencia y cada siguiente acción.',
    summary: 'Recibe asignaciones, navega, registra transiciones y resuelve incidencias desde una aplicación móvil especializada.',
    audience: 'Riders, conductores y operadores autorizados de recogida y entrega.',
    releaseLabel: 'Próximamente',
    capabilities: [
      'Recepción de asignaciones',
      'Navegación y paradas',
      'Estados de recogida y entrega',
      'Evidencia autorizada',
      'Gestión de incidencias',
      'Continuidad con conectividad limitada',
    ],
    steps: [
      { title: 'Valida', text: 'Completa el proceso de autorización y activa tu acceso.' },
      { title: 'Prepara', text: 'Configura permisos, disponibilidad y condiciones del dispositivo.' },
      { title: 'Ejecuta', text: 'Recibe una asignación y registra cada cambio de estado.' },
      { title: 'Cierra', text: 'Confirma la entrega o escala una incidencia con evidencia.' },
    ],
    platforms: [
      { name: 'Android', use: 'Plataforma móvil prioritaria', availability: 'Próximamente' },
      { name: 'iPhone', use: 'Plataforma móvil complementaria', availability: 'Próximamente' },
    ],
    accessNote: 'La descarga podrá ser pública, pero operar exigirá autorización e identidad verificadas.',
  },
  control: {
    id: 'control',
    name: 'DELIVER Control',
    label: 'PARA OPERACIÓN AUTORIZADA',
    headline: 'Supervisión y respuesta con permisos, contexto y trazabilidad.',
    summary: 'Observa operaciones, atiende incidencias y conserva evidencia de decisiones sensibles desde una superficie institucional restringida.',
    audience: 'Equipos internos y organizaciones expresamente autorizadas.',
    releaseLabel: 'Acceso administrado',
    capabilities: [
      'Supervisión operacional',
      'Gestión de incidencias',
      'Auditoría y trazabilidad',
      'Gestión de riesgo',
      'Soporte y escalamiento',
      'Configuración restringida',
    ],
    steps: [
      { title: 'Invita', text: 'Una organización autorizada asigna acceso a un usuario.' },
      { title: 'Verifica', text: 'Se validan identidad, rol y dispositivo.' },
      { title: 'Supervisa', text: 'El operador accede únicamente a las funciones permitidas.' },
      { title: 'Audita', text: 'Las decisiones críticas conservan contexto y evidencia.' },
    ],
    platforms: [
      { name: 'Escritorio autorizado', use: 'Distribución administrada por organización', availability: 'Acceso administrado' },
      { name: 'Navegador interno', use: 'Acceso protegido cuando sea necesario', availability: 'Acceso administrado' },
    ],
    accessNote: 'Control no tendrá una descarga pública abierta. El acceso dependerá de organización, rol y dispositivo aprobados.',
  },
};
