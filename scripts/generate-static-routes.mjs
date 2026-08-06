import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
const distDirectory = join(repositoryRoot, 'dist');
const routeManifestPath = join(repositoryRoot, 'src', 'routes.json');
const siteOrigin = 'https://morimilpabfelon-cell.github.io/DELIVER-ASESSET-pro';

const routes = JSON.parse(await readFile(routeManifestPath, 'utf8'));
const templateHtml = await readFile(join(distDirectory, 'index.html'), 'utf8');

function escapeAttribute(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function routeUrl(route) {
  return `${siteOrigin}${route.path}`;
}

function renderRouteHtml(route) {
  const title = escapeAttribute(route.title);
  const description = escapeAttribute(route.description);
  const canonical = escapeAttribute(routeUrl(route));

  return templateHtml
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${description}" />`)
    .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${canonical}" />`);
}

for (const route of routes) {
  const routeHtml = renderRouteHtml(route);

  if (route.path === '/') {
    await writeFile(join(distDirectory, 'index.html'), routeHtml, 'utf8');
    continue;
  }

  const relativeDirectory = route.path.replace(/^\/+|\/+$/g, '');
  const outputDirectory = join(distDirectory, relativeDirectory);
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(join(outputDirectory, 'index.html'), routeHtml, 'utf8');
}

const notFoundRoute = {
  path: '/404.html',
  title: 'Página no encontrada — DELIVER ASSETS',
  description: 'La ruta solicitada no existe en el sitio corporativo de DELIVER ASSETS.',
};

await writeFile(join(distDirectory, '404.html'), renderRouteHtml(notFoundRoute), 'utf8');
await writeFile(join(distDirectory, '.nojekyll'), '', 'utf8');

const sitemapEntries = routes
  .map((route) => `  <url><loc>${routeUrl(route)}</loc></url>`)
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Sitemap: ${siteOrigin}/sitemap.xml
`;

await writeFile(join(distDirectory, 'sitemap.xml'), sitemap, 'utf8');
await writeFile(join(distDirectory, 'robots.txt'), robots, 'utf8');
await writeFile(
  join(distDirectory, 'route-manifest.json'),
  JSON.stringify(routes, null, 2),
  'utf8',
);

console.log(`Generadas ${routes.length} rutas corporativas con metadatos, 404, sitemap y robots.`);
