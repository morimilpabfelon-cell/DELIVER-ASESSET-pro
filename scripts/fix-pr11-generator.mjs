import { readFile, writeFile, rm } from 'node:fs/promises';

const path = 'scripts/apply-pr11.mjs';
let source = await readFile(path, 'utf8');

function replaceSection(startMarker, endMarker, replacement, label) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  if (start < 0 || end < 0) throw new Error(`No se encontró la sección ${label}`);
  source = source.slice(0, start) + replacement + source.slice(end);
}

const validateReplacement = `await write('scripts/validate-routes.mjs', [
  "import { readFile } from 'node:fs/promises';",
  '',
  "const routes = JSON.parse(await readFile(new URL('../src/routes.json', import.meta.url), 'utf8'));",
  'const errors = [];',
  'const ids = new Set();',
  'const paths = new Set();',
  'for (const [index, route] of routes.entries()) {',
  "  if (!route || typeof route !== 'object') { errors.push('Ruta inválida en índice ' + index); continue; }",
  "  for (const field of ['id', 'path', 'title', 'description']) if (typeof route[field] !== 'string' || !route[field].trim()) errors.push('Ruta ' + index + ' sin ' + field + ' válido');",
  "  if (ids.has(route.id)) errors.push('ID duplicado: ' + route.id);",
  "  if (paths.has(route.path)) errors.push('Path duplicado: ' + route.path);",
  '  ids.add(route.id); paths.add(route.path);',
  "  if (route.path !== '/' && (!route.path.startsWith('/') || !route.path.endsWith('/'))) errors.push('Path no canónico: ' + route.path);",
  '}',
  "if (routes.filter((route) => route.path === '/').length !== 1) errors.push('Debe existir una única ruta de inicio');",
  "if (errors.length) throw new Error(errors.join('\\\\n'));",
  "console.log('Contrato de rutas válido: ' + routes.length + ' rutas únicas.');",
  '',
].join('\\n'));\n\n`;
replaceSection(
  "await write('scripts/validate-routes.mjs'",
  "await write('scripts/write-build-metadata.mjs'",
  validateReplacement,
  'validate-routes',
);

const metadataReplacement = `await write('scripts/write-build-metadata.mjs', [
  "import { readFile, writeFile } from 'node:fs/promises';",
  "import { join } from 'node:path';",
  "import { fileURLToPath } from 'node:url';",
  '',
  "const root = fileURLToPath(new URL('../', import.meta.url));",
  "const dist = join(root, 'dist');",
  "const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));",
  "const routes = JSON.parse(await readFile(join(root, 'src', 'routes.json'), 'utf8'));",
  "const sha = (process.env.BUILD_SHA || 'local').trim().toLowerCase();",
  "if (sha !== 'local' && !/^[a-f0-9]{40}$/.test(sha)) throw new Error('BUILD_SHA inválido: ' + sha);",
  "if (process.env.CI && sha === 'local') throw new Error('CI debe proporcionar BUILD_SHA');",
  "const release = { sha, version: pkg.version, basePath: '/DELIVER-ASESSET-pro/', routeCount: routes.length };",
  "await writeFile(join(dist, 'release.json'), JSON.stringify(release, null, 2) + '\\\\n', 'utf8');",
  "const indexPath = join(dist, 'index.html');",
  "let html = await readFile(indexPath, 'utf8');",
  "html = html.replace(/<meta name=\\\"deliver-build-sha\\\" content=\\\"[^\\\"]*\\\" \\\\/>/, '<meta name=\\\"deliver-build-sha\\\" content=\\\"' + sha + '\\\" />');",
  "await writeFile(indexPath, html, 'utf8');",
  "console.log('Metadatos de build generados para ' + sha + '.');",
  '',
].join('\\n'));\n\n`;
replaceSection(
  "await write('scripts/write-build-metadata.mjs'",
  "await write('scripts/verify-quality-baseline.mjs'",
  metadataReplacement,
  'write-build-metadata',
);

const unsafeJoin = "errors.join('\\n')";
const safeJoin = "errors.join('\\\\n')";
source = source.replaceAll(unsafeJoin, safeJoin);

await writeFile(path, source, 'utf8');
await rm('scripts/fix-pr11-generator.mjs');
console.log('Generador PR11 corregido: validadores sin plantillas anidadas.');
