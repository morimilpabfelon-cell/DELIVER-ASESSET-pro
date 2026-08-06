import { readFile, rm, writeFile } from 'node:fs/promises';

function replaceRequired(source, search, replacement, label) {
  if (!source.includes(search)) {
    throw new Error(`No se encontró el bloque requerido: ${label}`);
  }
  return source.replace(search, replacement);
}

const sitePath = 'src/site.ts';
let site = await readFile(sitePath, 'utf8');
site = replaceRequired(
  site,
  `export function siteHref(path: string): string {\n`,
  `export function assetHref(path: string): string {\n  const normalizedPath = path.replace(/^\\/+/, '');\n  return \`${'${baseUrl}'}${'${normalizedPath}'}\`;\n}\n\nexport function siteHref(path: string): string {\n`,
  'assetHref antes de siteHref',
);
await writeFile(sitePath, site, 'utf8');

const componentsPath = 'src/components.tsx';
let components = await readFile(componentsPath, 'utf8');
components = replaceRequired(
  components,
  `import { appRoute, products, siteHref, type AppId, type CorporateRoute } from './site';`,
  `import { appRoute, assetHref, products, siteHref, type AppId, type CorporateRoute } from './site';`,
  'importación de assetHref',
);
components = replaceRequired(
  components,
  `src={siteHref('/brand/deliver-assets-mark.png')}`,
  `src={assetHref('brand/deliver-assets-mark.png')}`,
  'logo mediante assetHref',
);
components = replaceRequired(
  components,
  `src={siteHref('/brand/city-network.svg')}`,
  `src={assetHref('brand/city-network.svg')}`,
  'ilustración mediante assetHref',
);
await writeFile(componentsPath, components, 'utf8');

const pagesPath = 'src/pages.tsx';
let pages = await readFile(pagesPath, 'utf8');
pages = replaceRequired(
  pages,
  `className="application-grid application-grid--light"`,
  `className="application-grid"`,
  'eliminación de application-grid--light',
);
await writeFile(pagesPath, pages, 'utf8');

const stylesPath = 'src/styles.css';
let styles = await readFile(stylesPath, 'utf8');
styles = replaceRequired(
  styles,
  `.application-grid--light .application-card { background: var(--surface-warm); }\n`,
  ``,
  'regla de fondo que anulaba Rider y Control',
);
await writeFile(stylesPath, styles, 'utf8');

const publicVerifierPath = 'scripts/verify-public-site.mjs';
let publicVerifier = await readFile(publicVerifierPath, 'utf8');
publicVerifier = replaceRequired(
  publicVerifier,
  `'network-node', 'route-packet'];`,
  `'network-node', 'route-packet', 'deliver-assets-mark.png/', 'city-network.svg/'];`,
  'URLs de activos con slash final prohibidas',
);
publicVerifier = replaceRequired(
  publicVerifier,
  `const sourceCss = await readFile(join(repositoryRoot, 'src', 'styles.css'), 'utf8');\nconst sourceComponents = await readFile(join(repositoryRoot, 'src', 'components.tsx'), 'utf8');`,
  `const sourceCss = await readFile(join(repositoryRoot, 'src', 'styles.css'), 'utf8');\nconst sourceComponents = await readFile(join(repositoryRoot, 'src', 'components.tsx'), 'utf8');\nconst sourceSite = await readFile(join(repositoryRoot, 'src', 'site.ts'), 'utf8');\nconst sourcePages = await readFile(join(repositoryRoot, 'src', 'pages.tsx'), 'utf8');\nif (!sourceSite.includes('export function assetHref')) errors.push('Falta el resolvedor exclusivo para activos públicos');\nif (sourceComponents.includes("siteHref('/brand/")) errors.push('Un activo público todavía usa siteHref');\nif (sourceCss.includes('application-grid--light') || sourcePages.includes('application-grid--light')) errors.push('La variante de cuadrícula obsoleta todavía está presente');`,
  'contrato de activos y cuadrícula',
);
publicVerifier = replaceRequired(
  publicVerifier,
  `console.log(\`Contrato verificado: ${'${routes.length}'} rutas, ${'${files.length}'} archivos, ${'${declaredCssVariables.size}'} variables CSS, tres activos de marca y navegación móvil accesible.\`);`,
  `console.log(\`Contrato verificado: ${'${routes.length}'} rutas, ${'${files.length}'} archivos, ${'${declaredCssVariables.size}'} variables CSS, activos públicos resolubles, contraste de aplicaciones y navegación móvil accesible.\`);`,
  'mensaje del contrato',
);
await writeFile(publicVerifierPath, publicVerifier, 'utf8');

const browserVerifierPath = 'scripts/verify-mobile-navigation.mjs';
let browserVerifier = await readFile(browserVerifierPath, 'utf8');
browserVerifier = replaceRequired(
  browserVerifier,
  `      if (!await pathExists(filePath)) filePath = join(distDirectory, '404.html');\n\n      const body = await readFile(filePath);\n      response.writeHead(200, {`,
  `      if (!await pathExists(filePath)) {\n        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });\n        response.end('Not found');\n        return;\n      }\n\n      const body = await readFile(filePath);\n      response.writeHead(200, {`,
  '404 real para archivos inexistentes',
);
browserVerifier = replaceRequired(
  browserVerifier,
  `  const homeUrl = \`${'${origin}'}${'${siteBase}'}\`;\n  const contactUrl = \`${'${origin}'}${'${siteBase}'}contact/\`;`,
  `  const homeUrl = \`${'${origin}'}${'${siteBase}'}\`;\n  const appsUrl = \`${'${origin}'}${'${siteBase}'}apps/\`;\n  const contactUrl = \`${'${origin}'}${'${siteBase}'}contact/\`;`,
  'URL de aplicaciones para QA',
);
browserVerifier = replaceRequired(
  browserVerifier,
  `  assert(JSON.stringify(report.mobileInitial.labels) === JSON.stringify(['Empresa', 'Servicios', 'Aplicaciones', 'Seguridad', 'Noticias', 'Contacto']), 'El menú no contiene los seis destinos canónicos');\n\n  await evaluate(client, "document.querySelector('.mobile-nav-toggle').click()");`,
  `  assert(JSON.stringify(report.mobileInitial.labels) === JSON.stringify(['Empresa', 'Servicios', 'Aplicaciones', 'Seguridad', 'Noticias', 'Contacto']), 'El menú no contiene los seis destinos canónicos');\n\n  await waitFor(client, "[...document.images].every((image) => image.complete)");\n  report.publicAssets = await evaluate(client, \`(() => {\n    const logo = document.querySelector('.site-header .brand-mark__symbol');\n    const hero = document.querySelector('.editorial-network__art img');\n    return {\n      logoSrc: logo?.getAttribute('src'),\n      logoWidth: logo?.naturalWidth ?? 0,\n      logoHeight: logo?.naturalHeight ?? 0,\n      heroSrc: hero?.getAttribute('src'),\n      heroWidth: hero?.naturalWidth ?? 0,\n      heroHeight: hero?.naturalHeight ?? 0,\n    };\n  })()\`);\n  assert(report.publicAssets.logoWidth > 0 && report.publicAssets.logoHeight > 0, 'El logo público no carga');\n  assert(report.publicAssets.heroWidth > 0 && report.publicAssets.heroHeight > 0, 'La ilustración editorial no carga');\n  assert(!report.publicAssets.logoSrc.endsWith('/'), 'La URL del logo termina en slash');\n  assert(!report.publicAssets.heroSrc.endsWith('/'), 'La URL de la ilustración termina en slash');\n\n  await evaluate(client, "document.querySelector('.mobile-nav-toggle').click()");`,
  'verificación real de imágenes',
);
browserVerifier = replaceRequired(
  browserVerifier,
  `  await navigate(client, contactUrl, 1440, 900, false);\n  report.contactDesktop = await evaluate(client,`,
  `  await navigate(client, appsUrl, 1440, 900, false);\n  report.applicationCards = await evaluate(client, \`(() => Object.fromEntries(\n    ['customer', 'business', 'rider', 'control'].map((id) => {\n      const card = document.querySelector(\`.application-card--\${id}\`);\n      const heading = card.querySelector('h3');\n      const body = card.querySelector('p:not(.eyebrow)');\n      return [id, {\n        background: getComputedStyle(card).backgroundColor,\n        heading: getComputedStyle(heading).color,\n        body: getComputedStyle(body).color,\n      }];\n    }),\n  ))()\`);\n  assert(report.applicationCards.customer.background === 'rgb(255, 255, 255)', 'Customer perdió su fondo blanco');\n  assert(report.applicationCards.business.background === 'rgb(255, 198, 47)', 'Business perdió su fondo amarillo');\n  assert(report.applicationCards.rider.background === 'rgb(255, 51, 40)', 'Rider perdió su fondo rojo');\n  assert(report.applicationCards.control.background === 'rgb(17, 17, 17)', 'Control perdió su fondo oscuro');\n  assert(report.applicationCards.rider.heading === 'rgb(255, 255, 255)' && report.applicationCards.rider.body === 'rgb(255, 255, 255)', 'Rider no conserva texto legible');\n  assert(report.applicationCards.control.heading === 'rgb(255, 255, 255)' && report.applicationCards.control.body === 'rgb(255, 255, 255)', 'Control no conserva texto legible');\n\n  await navigate(client, contactUrl, 1440, 900, false);\n  report.contactDesktop = await evaluate(client,`,
  'contraste de tarjetas de aplicaciones',
);
browserVerifier = replaceRequired(
  browserVerifier,
  `console.log('Navegación móvil verificada en Chrome: foco, teclado, cierre, estado activo y responsive.');`,
  `console.log('Web verificada en Chrome: activos públicos, contraste, foco, teclado, cierre, estado activo y responsive.');`,
  'mensaje final de Chrome',
);
await writeFile(browserVerifierPath, browserVerifier, 'utf8');

const docsPath = 'docs/CORPORATE-SITE.md';
let docs = await readFile(docsPath, 'utf8');
docs += `\n\n## Activos públicos y contraste\n\n- Las rutas corporativas utilizan \`siteHref()\` y conservan slash final.\n- Los archivos de \`public/\` utilizan \`assetHref()\` y nunca reciben slash final después de la extensión.\n- El build debe abrir logo e ilustración en Chrome y comprobar dimensiones naturales mayores que cero.\n- Customer, Business, Rider y Control mantienen fondos blanco, amarillo, rojo y negro respectivamente.\n- Una variante de cuadrícula no puede anular el fondo de una aplicación sin actualizar también su contrato de contraste.\n`;
await writeFile(docsPath, docs, 'utf8');

await rm('scripts/apply-production-visual-fixes-pr9.mjs');
await rm('.github/workflows/one-time-pr9-production-fixes.yml');
await rm('.github/pr9-trigger.txt');

console.log('Migración PR9 aplicada; archivos temporales eliminados.');
