import { access, readFile, readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
const distDirectory = join(repositoryRoot, 'dist');
const routes = JSON.parse(await readFile(join(repositoryRoot, 'src', 'routes.json'), 'utf8'));
const textExtensions = new Set(['.html', '.css', '.js', '.json', '.xml', '.txt']);

async function collectTextFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectTextFiles(entryPath));
    } else if (textExtensions.has(extname(entry.name))) {
      files.push(entryPath);
    }
  }

  return files;
}

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

const files = await collectTextFiles(distDirectory);
const contents = await Promise.all(files.map((file) => readFile(file, 'utf8')));
const bundle = contents.join('\n');

const forbiddenTerms = [
  'DA-24736',
  'S/ 18.90',
  'Prototipo público',
  'Este repositorio',
  'backend central todavía no implementado',
  'Vista conceptual · sin funciones operativas',
  'launch-notice',
  'app-orbit',
  'city-scene',
  'Una red. Cuatro aplicaciones.',
  'href="?app=',
  "href:'?app=",
];

const requiredTerms = [
  'Mover la ciudad.',
  'Una red visible.',
  'Infraestructura digital para coordinar comercio y movimiento.',
  'Comunicaciones oficiales, cuando exista algo que comunicar.',
  'La seguridad empieza por limitar correctamente el sistema.',
  'DELIVER Customer',
  'DELIVER Business',
  'DELIVER Rider',
  'DELIVER Control',
  'network-scene',
  'page-hero',
  'product-visual',
  'prefers-reduced-motion',
  'sitemap.xml',
];

const errors = [];
const forbiddenFound = forbiddenTerms.filter((term) => bundle.includes(term));
const requiredMissing = requiredTerms.filter((term) => !bundle.includes(term));

if (forbiddenFound.length > 0) {
  errors.push(`Contenido o código obsoleto encontrado: ${forbiddenFound.join(', ')}`);
}
if (requiredMissing.length > 0) {
  errors.push(`Contrato corporativo incompleto: ${requiredMissing.join(', ')}`);
}

for (const route of routes) {
  const routeDirectory = route.path === '/'
    ? distDirectory
    : join(distDirectory, route.path.replace(/^\/+|\/+$/g, ''));
  const routeIndex = join(routeDirectory, 'index.html');
  if (!await pathExists(routeIndex)) {
    errors.push(`Ruta estática ausente: ${route.path}`);
  }
}

for (const requiredFile of ['404.html', 'sitemap.xml', 'robots.txt', 'route-manifest.json']) {
  if (!await pathExists(join(distDirectory, requiredFile))) {
    errors.push(`Archivo de publicación ausente: ${requiredFile}`);
  }
}

const sitemap = await readFile(join(distDirectory, 'sitemap.xml'), 'utf8');
for (const route of routes) {
  if (!sitemap.includes(route.path)) {
    errors.push(`Sitemap sin ruta: ${route.path}`);
  }
}

const sourceCss = (
  await Promise.all([
    readFile(join(repositoryRoot, 'src', 'styles.css'), 'utf8'),
    readFile(join(repositoryRoot, 'src', 'brand-alignment.css'), 'utf8'),
  ])
).join('\n');

const declaredCssVariables = new Set(
  [...sourceCss.matchAll(/(?:^|[;{])\s*--([a-z0-9-]+)\s*:/gim)].map((match) => match[1]),
);
const usedCssVariables = new Set(
  [...sourceCss.matchAll(/var\(\s*--([a-z0-9-]+)/gi)].map((match) => match[1]),
);
const unusedCssVariables = [...declaredCssVariables]
  .filter((variable) => !usedCssVariables.has(variable))
  .sort();

if (unusedCssVariables.length > 0) {
  errors.push(`Variables CSS declaradas sin consumo: ${unusedCssVariables.map((variable) => `--${variable}`).join(', ')}`);
}

const obsoleteDocument = join(repositoryRoot, 'docs', 'PRODUCT-STORYTELLING.md');
if (await pathExists(obsoleteDocument)) {
  errors.push('Documento de etapa obsoleto todavía presente: docs/PRODUCT-STORYTELLING.md');
}

for (const requiredDocument of ['ARCHITECTURE.md', 'CORPORATE-SITE.md', 'DESIGN-SYSTEM.md', 'BRAND-SOURCE.md', 'ROADMAP.md']) {
  if (!await pathExists(join(repositoryRoot, 'docs', requiredDocument))) {
    errors.push(`Documento de gobierno ausente: docs/${requiredDocument}`);
  }
}

if (errors.length > 0) {
  throw new Error(errors.join('\n'));
}

console.log(`Contrato corporativo verificado: ${routes.length} rutas, ${files.length} archivos compilados y ${declaredCssVariables.size} variables CSS activas.`);
