import { readFile, rm, writeFile } from 'node:fs/promises';

const cssPath = 'src/styles.css';
let css = await readFile(cssPath, 'utf8');
const ring = /\.hero::before\s*\{[\s\S]*?\}\n/;
if (!ring.test(css)) throw new Error('No se encontró .hero::before');
css = css.replace(ring, '');
const heroStart = css.indexOf('.hero {');
const heroEnd = css.indexOf('\n}', heroStart);
if (heroStart < 0 || heroEnd < 0) throw new Error('No se encontró el bloque .hero');
const heroBlock = css.slice(heroStart, heroEnd + 2)
  .replace('  position: relative;\n', '')
  .replace('  overflow: hidden;\n', '')
  .replace('  isolation: isolate;\n', '');
css = css.slice(0, heroStart) + heroBlock + css.slice(heroEnd + 2);
await writeFile(cssPath, css, 'utf8');

const staticPath = 'scripts/verify-public-site.mjs';
let staticCheck = await readFile(staticPath, 'utf8');
const staticMarker = "if (sourceCss.includes('application-grid--light') || sourcePages.includes('application-grid--light')) errors.push('La variante de cuadrícula obsoleta todavía está presente');\n";
if (!staticCheck.includes(staticMarker)) throw new Error('No se encontró el marcador estático');
staticCheck = staticCheck.replace(staticMarker, staticMarker + "for (const term of ['.hero::before', 'border: 92px solid rgb(21 81 216 / 5%)', 'width: 620px', 'height: 620px']) if (sourceCss.includes(term)) errors.push(`Aro obsoleto presente: ${term}`);\n");
staticCheck = staticCheck.replace('activos públicos resolubles, contraste de aplicaciones y navegación móvil accesible.', 'hero sin aro, activos públicos resolubles, contraste de aplicaciones y navegación móvil accesible.');
await writeFile(staticPath, staticCheck, 'utf8');

const browserPath = 'scripts/verify-mobile-navigation.mjs';
let browserCheck = await readFile(browserPath, 'utf8');
const browserMarker = "  assert(!report.publicAssets.heroSrc.endsWith('/'), 'La URL de la ilustración termina en slash');\n";
if (!browserCheck.includes(browserMarker)) throw new Error('No se encontró el marcador de Chrome');
const heroCheck = "\n  report.heroDecoration = await evaluate(client, `(() => { const hero = document.querySelector('.hero'); const pseudo = getComputedStyle(hero, '::before'); const style = getComputedStyle(hero); return { content: pseudo.content, border: pseudo.borderTopWidth, position: style.position, overflow: style.overflow, isolation: style.isolation }; })()`);\n  assert(['none', 'normal'].includes(report.heroDecoration.content), 'El pseudo-elemento circular del hero todavía existe');\n  assert(report.heroDecoration.border === '0px', 'El borde circular del hero todavía existe');\n  assert(report.heroDecoration.position === 'static' && report.heroDecoration.overflow === 'visible' && report.heroDecoration.isolation === 'auto', 'Quedó CSS de soporte del aro');\n";
browserCheck = browserCheck.replace(browserMarker, browserMarker + heroCheck);
browserCheck = browserCheck.replace('Web verificada en Chrome: activos públicos, contraste, foco, teclado, cierre, estado activo y responsive.', 'Web verificada en Chrome: hero sin aro, activos públicos, contraste, foco, teclado, cierre, estado activo y responsive.');
await writeFile(browserPath, browserCheck, 'utf8');

const docsPath = 'docs/CORPORATE-SITE.md';
let docs = await readFile(docsPath, 'utf8');
docs += '\n\n## Hero sin aro decorativo\n\n- El hero de Inicio no utiliza pseudo-elementos circulares, anillos ni manchas de fondo.\n- `.hero::before` está prohibido por el contrato estático y por Chrome.\n- `position`, `overflow` e `isolation` no se conservan cuando solo sostenían esa decoración.\n';
await writeFile(docsPath, docs, 'utf8');

await rm('scripts/apply-pr10.mjs');
await rm('.github/workflows/one-time-pr10.yml');
console.log('PR10 aplicado y archivos temporales eliminados.');
