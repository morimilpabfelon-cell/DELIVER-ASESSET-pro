export function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
}

export function assetHrefFrom(baseUrl: string, path: string): string {
  const normalizedPath = path.replace(/^\/+/, '');
  if (!normalizedPath || normalizedPath.split('/').includes('..')) {
    throw new Error('La ruta del activo debe ser relativa y no puede atravesar directorios.');
  }
  return `${normalizeBaseUrl(baseUrl)}${normalizedPath}`;
}

export function siteHrefFrom(baseUrl: string, path: string): string {
  if (path.startsWith('#')) return path;
  const [rawPath, ...hashParts] = path.split('#');
  const normalizedPath = rawPath === '/'
    ? ''
    : `${rawPath.replace(/^\/+|\/+$/g, '')}/`;
  const hash = hashParts.length > 0 ? `#${hashParts.join('#')}` : '';
  return `${normalizeBaseUrl(baseUrl)}${normalizedPath}${hash}`;
}

export function normalizeCorporatePathFrom(baseUrl: string, pathname: string, origin: string): string {
  const basePath = new URL(normalizeBaseUrl(baseUrl), origin).pathname.replace(/\/$/, '');
  let path = pathname;
  if (basePath && (path === basePath || path.startsWith(`${basePath}/`))) {
    path = path.slice(basePath.length);
  }
  if (!path || path === '/') return '/';
  return `/${path.replace(/^\/+|\/+$/g, '')}/`;
}

export function getAllowedQueryValue<T extends string>(search: string, key: string, allowed: readonly T[]): T | null {
  const requested = new URLSearchParams(search).get(key);
  return requested && allowed.includes(requested as T) ? requested as T : null;
}
