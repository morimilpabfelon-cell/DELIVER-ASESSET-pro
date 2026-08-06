import { describe, expect, it } from 'vitest';
import { assetHrefFrom, getAllowedQueryValue, normalizeBaseUrl, normalizeCorporatePathFrom, siteHrefFrom } from './routing';

describe('normalizeBaseUrl', () => {
  it('añade un único slash final', () => {
    expect(normalizeBaseUrl('/repo')).toBe('/repo/');
    expect(normalizeBaseUrl('/repo/')).toBe('/repo/');
  });
});

describe('assetHrefFrom', () => {
  it('resuelve activos sin slash después de la extensión', () => {
    expect(assetHrefFrom('/repo/', '/brand/logo.png')).toBe('/repo/brand/logo.png');
  });

  it('rechaza rutas vacías o con traversal', () => {
    expect(() => assetHrefFrom('/repo/', '')).toThrow();
    expect(() => assetHrefFrom('/repo/', '../secret.txt')).toThrow();
  });
});

describe('siteHrefFrom', () => {
  it('conserva rutas canónicas y hashes completos', () => {
    expect(siteHrefFrom('/repo', '/')).toBe('/repo/');
    expect(siteHrefFrom('/repo/', '/apps/customer/#estado#detalle')).toBe('/repo/apps/customer/#estado#detalle');
    expect(siteHrefFrom('/repo/', '#contenido')).toBe('#contenido');
  });
});

describe('normalizeCorporatePathFrom', () => {
  it('retira únicamente el segmento base completo', () => {
    expect(normalizeCorporatePathFrom('/repo/', '/repo/apps', 'https://example.test')).toBe('/apps/');
    expect(normalizeCorporatePathFrom('/repo/', '/repo-old/apps', 'https://example.test')).toBe('/repo-old/apps/');
    expect(normalizeCorporatePathFrom('/repo/', '/repo', 'https://example.test')).toBe('/');
  });
});

describe('getAllowedQueryValue', () => {
  it('acepta solo valores incluidos en el contrato', () => {
    const allowed = ['customer', 'business'] as const;
    expect(getAllowedQueryValue('?app=customer', 'app', allowed)).toBe('customer');
    expect(getAllowedQueryValue('?app=control', 'app', allowed)).toBeNull();
    expect(getAllowedQueryValue('', 'app', allowed)).toBeNull();
  });
});
