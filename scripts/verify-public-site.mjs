import { access, readFile, readdir, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
const distDirectory = join(repositoryRoot, 'dist');
const routes = JSON.parse(await readFile(join(repositoryRoot, 'src', 'routes.json'), 'utf8'));
const textExtensions = new Set(['.html', '.css', '.js', '.json', '.xml', '.txt', '.svg']);

async function collectTextFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectTextFiles(entryPath));
    else if (textExtensions.has(extname(entry.name))) files.push(entryPath);
  }
  return files;
}

async function pathExists(path) {
  try { await access(path); return true; } catch { return false; }
}

function inspectPng(buffer, label) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (!buffer.subarray(0, 8).equals(signature)) throw new Error(`PNG inválido: ${label}`);
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20), bitDepth: buffer[24], colorType: buffer[25] };
}

const files = await collectTextFiles(distDirectory);
const contents = await Promise.all(files.map((file) => readFile(file, 'utf8')));
const bundle = contents.join('\n');
const forbiddenTerms = ['DA-24736', 'S/ 18.90', 'Prototipo público', 'Este repositorio', 'backend central todavía no implementado', 'Vista conceptual · sin funciones operativas', 'launch-notice', 'app-orbit', 'city-scene', 'Una red. Cuatro aplicaciones.', 'href="?app=', "href:'?app=", 'data:image/', 'base64,', 'brand-alignment.css', 'network-scene', 'network-node', 'route-packet'];
const requiredTerms = ['Mover la ciudad.', 'Una red visible.', 'Infraestructura digital para coordinar comercio y movimiento.', 'Comunicaciones oficiales, cuando exista algo que comunicar.', 'La seguridad empieza por limitar correctamente el sistema.', 'DELIVER Customer', 'DELIVER Business', 'DELIVER Rider', 'DELIVER Control', 'editorial-network', 'brand/deliver-assets-mark.png', 'brand/city-network.svg', 'brand/og-brand.png', 'og:image', 'twitter:image', 'page-hero', 'product-visual', 'prefers-reduced-motion', 'sitemap.xml'];
const errors = [];
const forbiddenFound = forbiddenTerms.filter((term) => bundle.includes(term));
const requiredMissing = requiredTerms.filter((term) => !bundle.includes(term));
if (forbiddenFound.length > 0) errors.push(`Contenido o código obsoleto encontrado: ${forbiddenFound.join(', ')}`);
if (requiredMissing.length > 0) errors.push(`Contrato corporativo incompleto: ${requiredMissing.join(', ')}`);

for (const route of routes) {
  const routeDirectory = route.path === '/' ? distDirectory : join(distDirectory, route.path.replace(/^\/+|\/+$/g, ''));
  if (!await pathExists(join(routeDirectory, 'index.html'))) errors.push(`Ruta estática ausente: ${route.path}`);
}
for (const requiredFile of ['404.html', 'sitemap.xml', 'robots.txt', 'route-manifest.json']) {
  if (!await pathExists(join(distDirectory, requiredFile))) errors.push(`Archivo de publicación ausente: ${requiredFile}`);
}
const sitemap = await readFile(join(distDirectory, 'sitemap.xml'), 'utf8');
for (const route of routes) if (!sitemap.includes(route.path)) errors.push(`Sitemap sin ruta: ${route.path}`);

const logoPath = join(distDirectory, 'brand', 'deliver-assets-mark.png');
const ogPath = join(distDirectory, 'brand', 'og-brand.png');
const illustrationPath = join(distDirectory, 'brand', 'city-network.svg');
for (const assetPath of [logoPath, ogPath, illustrationPath]) if (!await pathExists(assetPath)) errors.push(`Activo de marca ausente: ${assetPath.replace(distDirectory, 'dist')}`);
if (await pathExists(logoPath)) {
  const buffer = await readFile(logoPath);
  const info = inspectPng(buffer, 'deliver-assets-mark.png');
  if (info.width !== 96 || info.height !== 73 || info.bitDepth !== 8 || ![4, 6].includes(info.colorType)) errors.push(`Logo fuera de contrato: ${JSON.stringify(info)}`);
  if ((await stat(logoPath)).size > 32_000) errors.push('Logo superior a 32 KB');
}
if (await pathExists(ogPath)) {
  const buffer = await readFile(ogPath);
  const info = inspectPng(buffer, 'og-brand.png');
  if (info.width !== 1200 || info.height !== 630) errors.push(`Open Graph fuera de contrato: ${JSON.stringify(info)}`);
  if ((await stat(ogPath)).size > 300_000) errors.push('Open Graph superior a 300 KB');
}
if (await pathExists(illustrationPath) && (await stat(illustrationPath)).size > 80_000) errors.push('Ilustración editorial superior a 80 KB');

const sourceCss = await readFile(join(repositoryRoot, 'src', 'styles.css'), 'utf8');
const sourceComponents = await readFile(join(repositoryRoot, 'src', 'components.tsx'), 'utf8');
const navigationRequirements = [
  'id="site-navigation"',
  'aria-controls="site-navigation"',
  'aria-expanded={mobileMenuOpen}',
  "event.key === 'Escape'",
  "event.key !== 'Tab'",
  'mobile-nav-scrim',
  'site-nav__contact',
  "currentRoute?.id === 'contact' ? 'page'",
  "document.documentElement.classList.add('mobile-nav-open')",
];
const missingNavigationRequirements = navigationRequirements.filter((requirement) => !sourceComponents.includes(requirement));
if (missingNavigationRequirements.length > 0) errors.push(`Contrato de navegación móvil incompleto: ${missingNavigationRequirements.join(', ')}`);
for (const obsoleteNavigationRule of ['overflow-x: auto', 'margin-inline: -18px']) {
  if (sourceCss.includes(obsoleteNavigationRule)) errors.push(`Regla móvil obsoleta presente: ${obsoleteNavigationRule}`);
}
const declaredCssVariables = new Set([...sourceCss.matchAll(/(?:^|[;{])\s*--([a-z0-9-]+)\s*:/gim)].map((match) => match[1]));
const usedCssVariables = new Set([...sourceCss.matchAll(/var\(\s*--([a-z0-9-]+)/gi)].map((match) => match[1]));
const unusedCssVariables = [...declaredCssVariables].filter((variable) => !usedCssVariables.has(variable)).sort();
if (unusedCssVariables.length > 0) errors.push(`Variables CSS declaradas sin consumo: ${unusedCssVariables.map((variable) => `--${variable}`).join(', ')}`);

for (const obsoletePath of ['docs/PRODUCT-STORYTELLING.md', 'src/brand-alignment.css']) {
  if (await pathExists(join(repositoryRoot, obsoletePath))) errors.push(`Archivo obsoleto presente: ${obsoletePath}`);
}
for (const requiredDocument of ['ARCHITECTURE.md', 'CORPORATE-SITE.md', 'DESIGN-SYSTEM.md', 'BRAND-SOURCE.md', 'ROADMAP.md']) {
  if (!await pathExists(join(repositoryRoot, 'docs', requiredDocument))) errors.push(`Documento de gobierno ausente: docs/${requiredDocument}`);
}
if (errors.length > 0) throw new Error(errors.join('\n'));
console.log(`Contrato verificado: ${routes.length} rutas, ${files.length} archivos, ${declaredCssVariables.size} variables CSS, tres activos de marca y navegación móvil accesible.`);
