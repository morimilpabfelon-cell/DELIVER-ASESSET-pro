import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
const distDirectory = join(repositoryRoot, 'dist');
const routeManifestPath = join(repositoryRoot, 'src', 'routes.json');
const siteOrigin = 'https://morimilpabfelon-cell.github.io/DELIVER-ASESSET-pro';

const routes = JSON.parse(await readFile(routeManifestPath, 'utf8'));
const rootHtml = await readFile(join(distDirectory, 'index.html'), 'utf8');

for (const route of routes) {
  if (route.path === '/') continue;

  const relativeDirectory = route.path.replace(/^\/+|\/+$/g, '');
  const outputDirectory = join(distDirectory, relativeDirectory);
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(join(outputDirectory, 'index.html'), rootHtml, 'utf8');
}

await writeFile(join(distDirectory, '404.html'), rootHtml, 'utf8');
await writeFile(join(distDirectory, '.nojekyll'), '', 'utf8');

const sitemapEntries = routes
  .map((route) => `  <url><loc>${siteOrigin}${route.path === '/' ? '/' : route.path}</loc></url>`)
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

console.log(`Generadas ${routes.length} rutas corporativas, 404, sitemap y robots.`);
