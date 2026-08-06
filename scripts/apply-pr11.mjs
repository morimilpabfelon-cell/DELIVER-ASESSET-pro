import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';

async function read(path) { return readFile(path, 'utf8'); }
async function write(path, content) { await mkdir(path.includes('/') ? path.slice(0, path.lastIndexOf('/')) : '.', { recursive: true }); await writeFile(path, content, 'utf8'); }
function mustReplace(source, search, replacement, label) {
  if (!source.includes(search)) throw new Error(`No se encontró el marcador: ${label}`);
  return source.replace(search, replacement);
}

const packagePath = 'package.json';
const packageJson = JSON.parse(await read(packagePath));
packageJson.engines = { node: '22.23.x', npm: '10.9.x' };
packageJson.packageManager = 'npm@10.9.8';
packageJson.scripts = {
  dev: 'vite',
  typecheck: 'tsc',
  lint: 'eslint . --max-warnings=0',
  'validate:routes': 'node scripts/validate-routes.mjs',
  'test:unit': 'vitest run',
  'test:coverage': 'vitest run --coverage',
  'test:mutation': 'stryker run',
  'generate:release': 'node scripts/write-build-metadata.mjs',
  'generate:routes': 'node scripts/generate-static-routes.mjs',
  'verify:site': 'node scripts/verify-public-site.mjs',
  'verify:quality': 'node scripts/verify-quality-baseline.mjs',
  'verify:browser': 'node scripts/verify-mobile-navigation.mjs',
  'verify:mobile-nav': 'npm run verify:browser',
  'build:site': 'vite build && npm run generate:release && npm run generate:routes && npm run verify:site && npm run verify:quality && npm run verify:browser',
  build: 'npm run validate:routes && npm run typecheck && npm run lint && npm run test:coverage && npm run build:site',
  quality: 'npm run build',
  'security:audit': 'npm audit --omit=dev --audit-level=high',
  preview: 'vite preview',
};
await write(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);

let vite = await read('vite.config.ts');
vite = mustReplace(vite, "  build: {\n    sourcemap: true,\n  },", "  build: {\n    target: 'es2022',\n    sourcemap: false,\n  },", 'configuración de sourcemaps');
await write('vite.config.ts', vite);

let indexHtml = await read('index.html');
indexHtml = mustReplace(indexHtml, '    <meta name="theme-color" content="#1551d8" />\n', '    <meta name="theme-color" content="#1551d8" />\n    <meta name="deliver-build-sha" content="development" />\n', 'metadato de build');
await write('index.html', indexHtml);

await write('src/routing.ts', `export function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith('/') ? baseUrl : \`${'${baseUrl}'}/\`;
}

export function assetHrefFrom(baseUrl: string, path: string): string {
  const normalizedPath = path.replace(/^\\/+/, '');
  if (!normalizedPath || normalizedPath.split('/').includes('..')) {
    throw new Error('La ruta del activo debe ser relativa y no puede atravesar directorios.');
  }
  return \`${'${normalizeBaseUrl(baseUrl)}${normalizedPath}'}\`;
}

export function siteHrefFrom(baseUrl: string, path: string): string {
  if (path.startsWith('#')) return path;
  const [rawPath, ...hashParts] = path.split('#');
  const normalizedPath = rawPath === '/'
    ? ''
    : \`${'${rawPath.replace(/^\\/+|\\/+$/g, \'\')}'}/\`;
  const hash = hashParts.length > 0 ? \`#${'${hashParts.join(\'#\')}'}\` : '';
  return \`${'${normalizeBaseUrl(baseUrl)}${normalizedPath}${hash}'}\`;
}

export function normalizeCorporatePathFrom(baseUrl: string, pathname: string, origin: string): string {
  const basePath = new URL(normalizeBaseUrl(baseUrl), origin).pathname.replace(/\\/$/, '');
  let path = pathname;
  if (basePath && (path === basePath || path.startsWith(\`${'${basePath}'}/\`))) {
    path = path.slice(basePath.length);
  }
  if (!path || path === '/') return '/';
  return \`/${'${path.replace(/^\\/+|\\/+$/g, \'\')}'}/\`;
}

export function getAllowedQueryValue<T extends string>(search: string, key: string, allowed: readonly T[]): T | null {
  const requested = new URLSearchParams(search).get(key);
  return requested && allowed.includes(requested as T) ? requested as T : null;
}
`);

let site = await read('src/site.ts');
site = mustReplace(site, "import routeManifest from './routes.json';\n", "import routeManifest from './routes.json';\nimport { assetHrefFrom, getAllowedQueryValue, normalizeBaseUrl, normalizeCorporatePathFrom, siteHrefFrom } from './routing';\n", 'import de routing');
const oldHelpers = `const baseUrl = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : \`${'${import.meta.env.BASE_URL}'}/\`;

export function assetHref(path: string): string {
  const normalizedPath = path.replace(/^\\/+/, '');
  return \`${'${baseUrl}${normalizedPath}'}\`;
}

export function siteHref(path: string): string {
  if (path.startsWith('#')) return path;

  const [rawPath, rawHash] = path.split('#');
  const normalizedPath = rawPath === '/'
    ? ''
    : \`${'${rawPath.replace(/^\\/+|\\/+$/g, \'\')}'}/\`;
  const hash = rawHash ? \`#${'${rawHash}'}\` : '';

  return \`${'${baseUrl}${normalizedPath}${hash}'}\`;
}

export function normalizeCorporatePath(pathname: string): string {
  const basePath = new URL(baseUrl, window.location.origin).pathname.replace(/\\/$/, '');
  let path = pathname;

  if (basePath && path.startsWith(basePath)) {
    path = path.slice(basePath.length);
  }

  if (!path || path === '/') return '/';
  return \`/${'${path.replace(/^\\/+|\\/+$/g, \'\')}'}/\`;
}`;
const newHelpers = `const baseUrl = normalizeBaseUrl(import.meta.env.BASE_URL);

export function assetHref(path: string): string {
  return assetHrefFrom(baseUrl, path);
}

export function siteHref(path: string): string {
  return siteHrefFrom(baseUrl, path);
}

export function normalizeCorporatePath(pathname: string): string {
  return normalizeCorporatePathFrom(baseUrl, pathname, window.location.origin);
}`;
site = mustReplace(site, oldHelpers, newHelpers, 'helpers de rutas');
site = mustReplace(site, `export function getLegacyAppRedirect(search: string): string | null {
  const requested = new URLSearchParams(search).get('app');
  return appIds.includes(requested as AppId)
    ? appRoute(requested as AppId)
    : null;
}`, `export function getLegacyAppRedirect(search: string): string | null {
  const requested = getAllowedQueryValue(search, 'app', appIds);
  return requested ? appRoute(requested) : null;
}`, 'redirect legado');
await write('src/site.ts', site);

await write('src/routing.test.ts', `import { describe, expect, it } from 'vitest';
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
`);

let components = await read('src/components.tsx');
for (const name of ['customer', 'business', 'rider', 'control']) {
  const before = `className="product-visual product-visual--${name === 'business' || name === 'control' ? 'desktop' : 'phone'} product-visual--${name}" aria-label=`;
  const after = `className="product-visual product-visual--${name === 'business' || name === 'control' ? 'desktop' : 'phone'} product-visual--${name}" role="img" aria-label=`;
  components = mustReplace(components, before, after, `rol accesible ${name}`);
}
await write('src/components.tsx', components);

await write('vitest.config.ts', `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    reporters: ['default', 'junit'],
    outputFile: 'reports/unit-junit.xml',
    coverage: {
      provider: 'v8',
      include: ['src/routing.ts'],
      reporter: ['text', 'json-summary', 'lcov'],
      reportsDirectory: 'coverage',
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85,
        statements: 90,
      },
    },
  },
});
`);

await write('stryker.config.mjs', `export default {
  mutate: ['src/routing.ts'],
  testRunner: 'vitest',
  coverageAnalysis: 'perTest',
  reporters: ['clear-text', 'progress', 'html', 'json'],
  thresholds: { high: 90, low: 80, break: 80 },
  concurrency: 2,
  timeoutMS: 10000,
  vitest: { configFile: 'vitest.config.ts' },
};
`);

await write('eslint.config.js', `import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
  { ignores: ['dist/**', 'coverage/**', 'reports/**', '.stryker-tmp/**'] },
  { ...js.configs.recommended, files: ['**/*.mjs', 'eslint.config.js'], languageOptions: { globals: globals.node } },
  ...tseslint.configs.recommended.map((config) => ({ ...config, files: ['src/**/*.{ts,tsx}', '*.ts'] })),
  {
    files: ['src/**/*.{ts,tsx}', '*.ts'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { 'react-hooks': reactHooks, 'jsx-a11y': jsxA11y },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
    },
  },
);
`);

await write('scripts/validate-routes.mjs', `import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const routes = JSON.parse(await readFile(new URL('../src/routes.json', import.meta.url), 'utf8'));
const errors = [];
const ids = new Set();
const paths = new Set();
for (const [index, route] of routes.entries()) {
  if (!route || typeof route !== 'object') { errors.push(\`Ruta inválida en índice ${'${index}'}\`); continue; }
  for (const field of ['id', 'path', 'title', 'description']) if (typeof route[field] !== 'string' || !route[field].trim()) errors.push(\`Ruta ${'${index}'} sin ${'${field}'} válido\`);
  if (ids.has(route.id)) errors.push(\`ID duplicado: ${'${route.id}'}\`);
  if (paths.has(route.path)) errors.push(\`Path duplicado: ${'${route.path}'}\`);
  ids.add(route.id); paths.add(route.path);
  if (route.path !== '/' && (!route.path.startsWith('/') || !route.path.endsWith('/'))) errors.push(\`Path no canónico: ${'${route.path}'}\`);
}
if (routes.filter((route) => route.path === '/').length !== 1) errors.push('Debe existir una única ruta de inicio');
if (errors.length) throw new Error(errors.join('\n'));
console.log(\`Contrato de rutas válido: ${'${routes.length}'} rutas únicas.\`);
`);

await write('scripts/write-build-metadata.mjs', `import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');
const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
const routes = JSON.parse(await readFile(join(root, 'src', 'routes.json'), 'utf8'));
const sha = (process.env.BUILD_SHA || 'local').trim().toLowerCase();
if (sha !== 'local' && !/^[a-f0-9]{40}$/.test(sha)) throw new Error(\`BUILD_SHA inválido: ${'${sha}'}\`);
if (process.env.CI && sha === 'local') throw new Error('CI debe proporcionar BUILD_SHA');
const release = { sha, version: pkg.version, basePath: '/DELIVER-ASESSET-pro/', routeCount: routes.length };
await writeFile(join(dist, 'release.json'), `${'${JSON.stringify(release, null, 2)}'}\n`, 'utf8');
const indexPath = join(dist, 'index.html');
let html = await readFile(indexPath, 'utf8');
html = html.replace(/<meta name="deliver-build-sha" content="[^"]*" \/>/, \`<meta name="deliver-build-sha" content="${'${sha}'}" />\`);
await writeFile(indexPath, html, 'utf8');
console.log(\`Metadatos de build generados para ${'${sha}'}.\`);
`);

await write('scripts/verify-quality-baseline.mjs', `import { access, readFile, readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');
const errors = [];
async function exists(path) { try { await access(path); return true; } catch { return false; } }
async function collect(directory) { const entries = await readdir(directory, { withFileTypes: true }); const files = []; for (const entry of entries) { const path = join(directory, entry.name); files.push(...(entry.isDirectory() ? await collect(path) : [path])); } return files; }

for (const required of ['package-lock.json', '.nvmrc', '.npmrc', 'vitest.config.ts', 'stryker.config.mjs', 'eslint.config.js', 'docs/ENGINEERING-DOCTRINE.md', 'docs/TECH-DEBT.md']) if (!await exists(join(root, required))) errors.push(\`Falta ${'${required}'}\`);
const files = await collect(dist);
const maps = files.filter((file) => extname(file) === '.map');
if (maps.length) errors.push(\`Sourcemaps públicos encontrados: ${'${maps.join(", ")}'}\`);
const releasePath = join(dist, 'release.json');
if (!await exists(releasePath)) errors.push('Falta dist/release.json');
else {
  const release = JSON.parse(await readFile(releasePath, 'utf8'));
  if (release.sha !== 'local' && !/^[a-f0-9]{40}$/.test(release.sha)) errors.push('SHA de release inválido');
  const htmlFiles = files.filter((file) => file.endsWith('.html'));
  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf8');
    if (!html.includes(\`<meta name="deliver-build-sha" content="${'${release.sha}'}" />\`)) errors.push(\`HTML sin SHA correcto: ${'${file}'}\`);
  }
}
const components = await readFile(join(root, 'src', 'components.tsx'), 'utf8');
if ((components.match(/role="img"/g) || []).length < 4) errors.push('Las cuatro vistas conceptuales no tienen semántica de imagen');
const site = await readFile(join(root, 'src', 'site.ts'), 'utf8');
if (!site.includes("from './routing'")) errors.push('Las rutas no están separadas en un módulo puro');
const vite = await readFile(join(root, 'vite.config.ts'), 'utf8');
if (!vite.includes('sourcemap: false')) errors.push('Vite no desactiva sourcemaps de producción');
for (const workflow of ['.github/workflows/ci.yml', '.github/workflows/pages.yml']) {
  const content = await readFile(join(root, workflow), 'utf8');
  if (content.includes('npm install')) errors.push(\`${'${workflow}'} usa npm install\`);
  if (!content.includes('npm ci')) errors.push(\`${'${workflow}'} no usa npm ci\`);
}
const pages = await readFile(join(root, '.github/workflows/pages.yml'), 'utf8');
for (const marker of ['types: [closed]', 'release.json', 'EXPECTED_SHA']) if (!pages.includes(marker)) errors.push(\`Pages sin marcador: ${'${marker}'}\`);
if (errors.length) throw new Error(errors.join('\n'));
console.log('Baseline de calidad verificado: lockfile, build identificable, sin sourcemaps, CI reproducible y despliegue verificable.');
`);

await write('.nvmrc', '22.23.1\n');
await write('.npmrc', 'engine-strict=true\nsave-exact=true\npackage-lock=true\nfund=false\n');

let gitignore = await read('.gitignore');
for (const entry of ['coverage/', 'reports/', '.stryker-tmp/']) if (!gitignore.includes(entry)) gitignore += `\n${'${entry}'}`;
await write('.gitignore', `${'${gitignore.trim()}'}\n`);

await write('.github/workflows/ci.yml', `name: CI

on:
  pull_request:
  push:
    branches: [main]

concurrency:
  group: ci-${'${{ github.ref }}'}
  cancel-in-progress: true

permissions:
  contents: read

jobs:
  quality:
    runs-on: ubuntu-24.04
    timeout-minutes: 20
    env:
      BUILD_SHA: ${'${{ github.event.pull_request.head.sha || github.sha }}'}
    steps:
      - name: Checkout
        uses: actions/checkout@d23441a48e516b6c34aea4fa41551a30e30af803
      - name: Setup Node
        uses: actions/setup-node@249970729cb0ef3589644e2896645e5dc5ba9c38
        with:
          node-version: 22.23.1
          cache: npm
      - name: Install locked dependencies
        run: npm ci --no-audit --no-fund
      - name: Quality gates
        run: npm run quality
      - name: Production dependency audit
        run: npm run security:audit
      - name: Upload evidence
        if: always()
        uses: actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02
        with:
          name: quality-evidence
          path: |
            dist
            coverage
            reports
          retention-days: 14
          if-no-files-found: warn

  mutation:
    needs: quality
    runs-on: ubuntu-24.04
    timeout-minutes: 20
    steps:
      - name: Checkout
        uses: actions/checkout@d23441a48e516b6c34aea4fa41551a30e30af803
      - name: Setup Node
        uses: actions/setup-node@249970729cb0ef3589644e2896645e5dc5ba9c38
        with:
          node-version: 22.23.1
          cache: npm
      - name: Install locked dependencies
        run: npm ci --no-audit --no-fund
      - name: Mutation testing
        run: npm run test:mutation
      - name: Upload mutation report
        if: always()
        uses: actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02
        with:
          name: mutation-report
          path: reports/mutation
          retention-days: 14
          if-no-files-found: warn
`);

await write('.github/workflows/pages.yml', `name: Deploy GitHub Pages

on:
  push:
    branches: [main]
  pull_request:
    types: [closed]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    if: github.event_name != 'pull_request' || github.event.pull_request.merged == true
    runs-on: ubuntu-24.04
    timeout-minutes: 20
    outputs:
      sha: ${'${{ steps.revision.outputs.sha }}'}
    steps:
      - name: Checkout main
        uses: actions/checkout@d23441a48e516b6c34aea4fa41551a30e30af803
        with:
          ref: main
      - name: Resolve deployed revision
        id: revision
        run: echo "sha=$(git rev-parse HEAD)" >> "$GITHUB_OUTPUT"
      - name: Setup Node
        uses: actions/setup-node@249970729cb0ef3589644e2896645e5dc5ba9c38
        with:
          node-version: 22.23.1
          cache: npm
      - name: Install locked dependencies
        run: npm ci --no-audit --no-fund
      - name: Build verified site
        env:
          BUILD_SHA: ${'${{ steps.revision.outputs.sha }}'}
        run: npm run quality
      - name: Configure Pages
        uses: actions/configure-pages@v5
      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    if: github.event_name != 'pull_request' || github.event.pull_request.merged == true
    environment:
      name: github-pages
      url: ${'${{ steps.deployment.outputs.page_url }}'}
    runs-on: ubuntu-24.04
    needs: build
    outputs:
      page_url: ${'${{ steps.deployment.outputs.page_url }}'}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4

  verify-production:
    needs: [build, deploy]
    runs-on: ubuntu-24.04
    timeout-minutes: 10
    steps:
      - name: Verify deployed SHA and critical assets
        env:
          PAGE_URL: ${'${{ needs.deploy.outputs.page_url }}'}
          EXPECTED_SHA: ${'${{ needs.build.outputs.sha }}'}
        run: |
          base="${'${PAGE_URL%/}'}/"
          for attempt in $(seq 1 24); do
            release="$(curl -fsSL --connect-timeout 10 "${'${base}'}release.json?sha=${'${EXPECTED_SHA}'}" 2>/dev/null || true)"
            actual="$(RELEASE="$release" node -e "try{process.stdout.write(JSON.parse(process.env.RELEASE).sha||'')}catch{}")"
            html="$(curl -fsSL --connect-timeout 10 "${'${base}'}?sha=${'${EXPECTED_SHA}'}" 2>/dev/null || true)"
            if [ "$actual" = "$EXPECTED_SHA" ] && printf '%s' "$html" | grep -q "deliver-build-sha.*$EXPECTED_SHA" \
              && curl -fsSL -o /dev/null "${'${base}'}brand/deliver-assets-mark.png?sha=${'${EXPECTED_SHA}'}" \
              && curl -fsSL -o /dev/null "${'${base}'}brand/city-network.svg?sha=${'${EXPECTED_SHA}'}"; then
              echo "Producción validada en $EXPECTED_SHA"
              exit 0
            fi
            echo "Intento $attempt: Pages todavía sirve '$actual', se espera '$EXPECTED_SHA'"
            sleep 10
          done
          echo "Pages no publicó el SHA esperado" >&2
          exit 1
`);

await write('.github/workflows/codeql.yml', `name: CodeQL

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '17 4 * * 1'

permissions:
  contents: read
  security-events: write

jobs:
  analyze:
    runs-on: ubuntu-24.04
    timeout-minutes: 20
    steps:
      - name: Checkout
        uses: actions/checkout@d23441a48e516b6c34aea4fa41551a30e30af803
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v4.36.0
        with:
          languages: javascript-typescript
      - name: Analyze
        uses: github/codeql-action/analyze@v4.36.0
`);

await write('.github/dependabot.yml', `version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
    open-pull-requests-limit: 5
  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: weekly
    open-pull-requests-limit: 5
`);

await write('.github/pull_request_template.md', `## Alcance
- Objetivo:
- Causa raíz:
- Arquitectura afectada:
- Fuera de alcance:
- Riesgo y rollback:

## Evidencia obligatoria
- [ ] SHA final identificado
- [ ] Compilación reproducible con npm ci
- [ ] TypeScript y ESLint
- [ ] Pruebas unitarias y cobertura
- [ ] Pruebas instrumentadas en Chrome
- [ ] Mutation testing o justificación N/A
- [ ] Auditoría de dependencias y CodeQL
- [ ] Artefacto y digest
- [ ] Despliegue y SHA público verificados
- [ ] Código temporal y deuda revisados
`);

await write('docs/ENGINEERING-DOCTRINE.md', `# Doctrina de ingeniería

Todo cambio se evalúa en estados separados: implementado, verificado, fusionado, desplegado y validado en producción. Ningún estado implica automáticamente el siguiente.

## Gates

1. Alcance, causa raíz, exclusiones, riesgo y rollback.
2. Arquitectura: una fuente de verdad y límites explícitos.
3. Reproducibilidad: Node y npm fijados, package-lock y npm ci.
4. Análisis estático: TypeScript estricto, ESLint y contratos propios.
5. Pruebas: unitarias, cobertura, navegador instrumentado y post-deploy.
6. Mutation testing para lógica pura con score de ruptura mínimo de 80%.
7. Seguridad: auditoría de producción, CodeQL y permisos mínimos.
8. Evidencia: SHA, artefacto, digest, reportes y release.json público.
9. Limpieza: sin workflows temporales, scripts de una ejecución o parches obsoletos.

## Umbrales iniciales

- Líneas, funciones y statements: 90%.
- Ramas: 85%.
- Mutation score: 80% mínimo.
- Vulnerabilidades de producción altas o críticas: cero.

Los umbrales se aplican inicialmente al módulo puro de routing. La cobertura se ampliará por ratchet sin disminuir la línea base.
`);

await write('docs/TECH-DEBT.md', `# Registro de deuda técnica

| ID | Deuda | Riesgo | Criterio de cierre |
|---|---|---|---|
| TD-001 | Cobertura unitaria limitada inicialmente a routing puro | Medio | Incorporar componentes y metadata sin reducir umbrales |
| TD-002 | Google Fonts continúa como dependencia externa | Bajo | Evaluar fuente local versionada o stack del sistema con revisión visual |
| TD-003 | La protección de rama depende de configuración del repositorio | Alto | Exigir CI, mutation y CodeQL como checks obligatorios en main |
| TD-004 | La prueba visual valida estructura y estilos computados, no pixel-diff | Medio | Añadir snapshots visuales estables con tolerancias documentadas |

Toda deuda nueva requiere ID, riesgo y condición verificable de cierre.
`);

let readme = await read('README.md');
readme += `\n\n## Calidad y publicación verificable\n\nEl contrato de ingeniería está en [docs/ENGINEERING-DOCTRINE.md](docs/ENGINEERING-DOCTRINE.md). El build usa dependencias bloqueadas, cobertura, análisis estático, Chrome instrumentado y metadata de release. GitHub Pages solo se considera validado cuando \`release.json\` y el HTML público exponen el SHA esperado.\n\nComandos principales:\n\n\`\`\`bash\nnpm ci\nnpm run quality\nnpm run test:mutation\nnpm run security:audit\n\`\`\`\n`;
await write('README.md', readme);

await rm('scripts/apply-pr11.mjs');
await rm('.github/workflows/one-time-pr11.yml');
console.log('PR11 aplicado; archivos temporales eliminados.');
