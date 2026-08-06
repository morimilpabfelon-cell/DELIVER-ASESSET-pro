import { readFile, writeFile } from 'node:fs/promises';

async function read(path) { return readFile(path, 'utf8'); }
async function write(path, content) { await writeFile(path, content.endsWith('\n') ? content : `${content}\n`); }

async function replaceRequired(path, from, to) {
  const source = await read(path);
  if (!source.includes(from)) throw new Error(`Marcador ausente en ${path}: ${from.slice(0, 80)}`);
  await write(path, source.replace(from, to));
}

async function replaceBetween(path, startMarker, endMarker, replacement) {
  const source = await read(path);
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  if (start < 0 || end < 0) throw new Error(`Sección no encontrada en ${path}`);
  await write(path, `${source.slice(0, start)}${replacement}${source.slice(end)}`);
}

async function appendOnce(path, marker, content) {
  const source = await read(path);
  if (source.includes(marker)) return;
  await write(path, `${source.trimEnd()}\n\n${content.trim()}\n`);
}

const motionSource = `export type MotionMode = 'enhanced' | 'reduced' | 'static';

export function clampRevealIndex(index: number, maximum = 6): number {
  if (!Number.isFinite(index) || index <= 0) return 0;
  const safeMaximum = Number.isFinite(maximum) ? Math.max(0, Math.floor(maximum)) : 0;
  return Math.min(Math.floor(index), safeMaximum);
}

export function getRevealDelay(index: number, step = 70, maximum = 6): number {
  const safeStep = Number.isFinite(step) ? Math.max(0, step) : 0;
  return clampRevealIndex(index, maximum) * safeStep;
}

export function resolveMotionMode(reduceMotion: boolean, supportsObserver: boolean): MotionMode {
  if (reduceMotion) return 'reduced';
  return supportsObserver ? 'enhanced' : 'static';
}
`;

const motionTests = `import { describe, expect, it } from 'vitest';
import { clampRevealIndex, getRevealDelay, resolveMotionMode } from './motion';

describe('motion contract', () => {
  it('clamps reveal indices to safe whole values', () => {
    expect(clampRevealIndex(-2)).toBe(0);
    expect(clampRevealIndex(Number.NaN)).toBe(0);
    expect(clampRevealIndex(2.9)).toBe(2);
    expect(clampRevealIndex(20, 4)).toBe(4);
    expect(clampRevealIndex(2, -1)).toBe(0);
    expect(clampRevealIndex(2, Number.POSITIVE_INFINITY)).toBe(0);
  });

  it('calculates bounded stagger delays without negative timing', () => {
    expect(getRevealDelay(0)).toBe(0);
    expect(getRevealDelay(3)).toBe(210);
    expect(getRevealDelay(10, 80, 4)).toBe(320);
    expect(getRevealDelay(3, -20)).toBe(0);
    expect(getRevealDelay(3, Number.NaN)).toBe(0);
  });

  it('resolves enhanced, reduced and static modes explicitly', () => {
    expect(resolveMotionMode(false, true)).toBe('enhanced');
    expect(resolveMotionMode(true, true)).toBe('reduced');
    expect(resolveMotionMode(false, false)).toBe('static');
    expect(resolveMotionMode(true, false)).toBe('reduced');
  });
});
`;

await write('src/motion.ts', motionSource);
await write('src/motion.test.ts', motionTests);

const editorialReplacement = `const operationSteps = [
  { id: 'customer', index: '01', role: 'Customer', action: 'Solicita', detail: 'Define la necesidad y conserva visibilidad.' },
  { id: 'business', index: '02', role: 'Business', action: 'Prepara', detail: 'Confirma y coordina la preparación.' },
  { id: 'rider', index: '03', role: 'Rider', action: 'Mueve', detail: 'Ejecuta la recogida y la entrega.' },
  { id: 'control', index: '04', role: 'Control', action: 'Supervisa', detail: 'Atiende excepciones con acceso restringido.' },
] as const;

export function EditorialNetwork() {
  return (
    <figure className="editorial-network operation-scene hero-entrance hero-entrance--visual" aria-labelledby="editorial-network-caption">
      <div className="editorial-network__art operation-scene__canvas">
        <img className="operation-scene__texture" src={assetHref('brand/city-network.svg')} alt="" aria-hidden="true" />
        <div className="operation-scene__district" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => <span className={\`operation-scene__block operation-scene__block--\${index + 1}\`} key={index} />)}
        </div>
        <svg className="operation-scene__route" viewBox="0 0 640 500" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path className="operation-scene__route-base" d="M72 390 C142 318 154 154 276 150 S414 326 566 108" vectorEffect="non-scaling-stroke" />
          <path className="operation-scene__route-active" d="M72 390 C142 318 154 154 276 150 S414 326 566 108" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="operation-scene__stations" aria-hidden="true">
          {operationSteps.map((step) => (
            <div className={\`operation-scene__station operation-scene__station--\${step.id}\`} key={step.id}>
              <span>{step.index}</span><strong>{step.role}</strong><small>{step.action}</small>
            </div>
          ))}
        </div>
        <span className="operation-scene__courier" aria-hidden="true"><i /></span>
        <div className="operation-scene__signal" aria-hidden="true"><span>RED OPERATIVA</span><strong>Contexto en movimiento</strong></div>
      </div>
      <figcaption className="editorial-network__legend" id="editorial-network-caption" data-motion-group="network-legend">
        {operationSteps.map((step) => (
          <a key={step.id} href={appRoute(step.id)} data-reveal="up">
            <span>{step.index}</span><strong>{step.role}</strong><small>{step.action}</small>
          </a>
        ))}
      </figcaption>
    </figure>
  );
}

export function OperationalJourney() {
  return (
    <div className="journey-flow" data-motion-group="operational-journey">
      <div className="journey-flow__track" aria-hidden="true"><span /></div>
      <ol className="journey-grid">
        {operationSteps.map((step, index) => (
          <li className={\`journey-flow__step journey-flow__step--\${index + 1}\`} key={step.id} data-reveal="up">
            <span>{step.index}</span><strong>{step.role} {step.action.toLowerCase()}</strong><p>{step.detail}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

`;

await replaceBetween('src/components.tsx', 'export function EditorialNetwork()', 'function CustomerVisual()', `${editorialReplacement}function CustomerVisual()`);

await replaceRequired(
  'src/pages.tsx',
  '  EditorialNetwork,\n  PageHero,',
  '  EditorialNetwork,\n  OperationalJourney,\n  PageHero,',
);
await replaceRequired(
  'src/pages.tsx',
  '        <ol className="journey-grid">\n          <li><span>01</span><strong>Customer solicita</strong><p>Define la necesidad y conserva visibilidad.</p></li>\n          <li><span>02</span><strong>Business prepara</strong><p>Confirma y coordina la preparación.</p></li>\n          <li><span>03</span><strong>Rider mueve</strong><p>Ejecuta la recogida y la entrega.</p></li>\n          <li><span>04</span><strong>Control supervisa</strong><p>Atiende excepciones con acceso restringido.</p></li>\n        </ol>',
  '        <OperationalJourney />',
);
await replaceRequired('src/pages.tsx', '<div className="service-grid">', '<div className="service-grid" data-motion-group="services">');

const oldReveal = `function useRevealAnimations() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.documentElement.classList.add('motion-ready');

    if (reduceMotion || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return () => document.documentElement.classList.remove('motion-ready');
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove('motion-ready');
    };
  }, []);
}`;
const newReveal = `function useRevealAnimations() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const supportsObserver = 'IntersectionObserver' in window;
    const root = document.documentElement;

    root.classList.add('motion-ready');
    const setMode = () => {
      root.dataset.motion = resolveMotionMode(preference.matches, supportsObserver);
      return root.dataset.motion;
    };
    const revealAll = () => elements.forEach((element) => element.classList.add('is-visible'));

    for (const element of elements) {
      const group = element.closest<HTMLElement>('[data-motion-group]');
      const siblings = group ? Array.from(group.querySelectorAll<HTMLElement>('[data-reveal]')) : [];
      const index = group ? Math.max(0, siblings.indexOf(element)) : 0;
      element.style.setProperty('--reveal-delay', \`${getRevealDelay(index)}ms\`);
    }

    const mode = setMode();
    if (mode !== 'enhanced') revealAll();

    const observer = mode === 'enhanced'
      ? new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add('is-visible');
            observer?.unobserve(entry.target);
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
      )
      : null;

    elements.forEach((element) => observer?.observe(element));
    const handlePreferenceChange = () => {
      if (setMode() !== 'enhanced') revealAll();
    };
    preference.addEventListener('change', handlePreferenceChange);

    return () => {
      observer?.disconnect();
      preference.removeEventListener('change', handlePreferenceChange);
      elements.forEach((element) => element.style.removeProperty('--reveal-delay'));
      root.classList.remove('motion-ready');
      delete root.dataset.motion;
    };
  }, []);
}`;
await replaceRequired('src/main.tsx', "import './styles.css';", "import { getRevealDelay, resolveMotionMode } from './motion';\nimport './styles.css';");
await replaceRequired('src/main.tsx', oldReveal, newReveal);

const motionCss = `/* PR #12 — Editorial rendering and motion system */
:root {
  --motion-fast: 180ms;
  --motion-base: 700ms;
  --motion-slow: 1100ms;
  --motion-route: 7600ms;
  --motion-stagger: 70ms;
  --ease-standard: cubic-bezier(.2, .7, .2, 1);
  --ease-emphasized: cubic-bezier(.16, 1, .3, 1);
}

.motion-ready [data-reveal] {
  transition-duration: var(--motion-base);
  transition-timing-function: var(--ease-emphasized);
  transition-delay: var(--reveal-delay, 0ms);
}

.operation-scene__canvas {
  position: relative;
  min-height: 520px;
  isolation: isolate;
  overflow: hidden;
  background:
    linear-gradient(145deg, rgb(255 255 255 / 92%), rgb(244 233 198 / 72%)),
    var(--surface-warm);
  perspective: 1000px;
}
.operation-scene__canvas::before {
  position: absolute;
  z-index: 1;
  inset: 0;
  background:
    linear-gradient(90deg, rgb(21 81 216 / 8%) 1px, transparent 1px),
    linear-gradient(rgb(21 81 216 / 8%) 1px, transparent 1px);
  background-size: 44px 44px;
  content: '';
  mask-image: linear-gradient(to bottom, black, transparent 92%);
}
.operation-scene__texture {
  position: absolute;
  z-index: 0;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: .13;
  filter: saturate(.8) contrast(1.05);
}
.operation-scene__district {
  position: absolute;
  z-index: 2;
  top: 4%;
  left: 8%;
  display: grid;
  width: 84%;
  height: 80%;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  transform: rotateX(58deg) rotateZ(-28deg) translate3d(2%, 4%, 0);
  transform-style: preserve-3d;
}
.operation-scene__block {
  min-height: 92px;
  border: 1px solid rgb(17 17 17 / 9%);
  border-radius: 14px;
  background: white;
  box-shadow: 14px 18px 0 rgb(21 81 216 / 8%);
  transform: translateZ(16px);
}
.operation-scene__block:nth-child(3n + 1) { background: var(--cream); transform: translateZ(34px); }
.operation-scene__block:nth-child(4n + 2) { background: var(--brand-accent); transform: translateZ(52px); }
.operation-scene__block:nth-child(5n) { background: rgb(21 81 216 / 14%); transform: translateZ(26px); }
.operation-scene__block--2,
.operation-scene__block--7 { grid-row: span 2; }
.operation-scene__block--5,
.operation-scene__block--10 { grid-column: span 2; }
.operation-scene__route {
  position: absolute;
  z-index: 4;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}
.operation-scene__route-base,
.operation-scene__route-active {
  fill: none;
  stroke-linecap: square;
  stroke-linejoin: bevel;
}
.operation-scene__route-base { stroke: rgb(17 17 17 / 18%); stroke-width: 12; }
.operation-scene__route-active {
  stroke: var(--editorial-red);
  stroke-width: 6;
  stroke-dasharray: 18 14;
  animation: operation-route var(--motion-route) linear infinite;
}
.operation-scene__stations { position: absolute; z-index: 6; inset: 0; pointer-events: none; }
.operation-scene__station {
  position: absolute;
  display: grid;
  min-width: 112px;
  gap: 2px;
  padding: 11px 13px;
  border: 1px solid rgb(17 17 17 / 14%);
  border-radius: 12px;
  color: var(--ink);
  background: rgb(255 255 255 / 94%);
  box-shadow: var(--shadow-sm);
  transform: translate3d(0, 0, 0);
  animation: station-breathe var(--motion-slow) var(--ease-standard) both;
}
.operation-scene__station span { color: var(--editorial-red); font-size: 9px; font-weight: 800; }
.operation-scene__station strong { font-size: 12px; }
.operation-scene__station small { color: var(--text-muted); font-size: 9px; }
.operation-scene__station--customer { bottom: 13%; left: 5%; }
.operation-scene__station--business { top: 23%; left: 31%; animation-delay: var(--motion-stagger); }
.operation-scene__station--rider { right: 23%; bottom: 20%; animation-delay: calc(var(--motion-stagger) * 2); }
.operation-scene__station--control { top: 8%; right: 4%; color: white; background: rgb(17 17 17 / 94%); animation-delay: calc(var(--motion-stagger) * 3); }
.operation-scene__station--control small { color: rgb(255 255 255 / 62%); }
.operation-scene__courier {
  position: absolute;
  z-index: 7;
  top: 0;
  left: 0;
  width: 26px;
  height: 20px;
  border: 3px solid white;
  border-radius: 6px;
  background: var(--editorial-red);
  box-shadow: 0 7px 18px rgb(17 17 17 / 24%);
  offset-path: path('M 72 390 C 142 318 154 154 276 150 S 414 326 566 108');
  offset-rotate: auto 0deg;
  animation: operation-travel var(--motion-route) linear infinite;
}
.operation-scene__courier i { position: absolute; top: 4px; left: 7px; width: 7px; height: 7px; border: 2px solid white; transform: rotate(45deg); }
.operation-scene__signal {
  position: absolute;
  z-index: 8;
  right: 22px;
  bottom: 20px;
  display: grid;
  gap: 4px;
  padding: 13px 15px;
  border-left: 4px solid var(--brand-accent);
  color: white;
  background: var(--brand-primary);
  box-shadow: var(--shadow-sm);
}
.operation-scene__signal span { font-size: 8px; font-weight: 800; letter-spacing: .1em; }
.operation-scene__signal strong { font-size: 12px; }

.journey-flow { position: relative; }
.journey-flow__track {
  position: absolute;
  z-index: 0;
  top: 36px;
  right: 6%;
  left: 6%;
  height: 4px;
  overflow: hidden;
  background: rgb(255 255 255 / 14%);
}
.journey-flow__track span {
  display: block;
  width: 42%;
  height: 100%;
  background: var(--brand-accent);
  animation: journey-progress calc(var(--motion-route) * .8) var(--ease-standard) infinite;
}
.journey-flow .journey-grid { position: relative; z-index: 1; }
.journey-flow__step { transition: transform var(--motion-fast) var(--ease-standard), border-color var(--motion-fast) ease, background var(--motion-fast) ease; }
.journey-flow__step:hover { border-color: var(--brand-accent); background: rgb(255 255 255 / 9%); transform: translateY(-6px); }

.hero__content > * { animation: hero-copy-enter var(--motion-slow) var(--ease-emphasized) both; }
.hero__content > :nth-child(2) { animation-delay: var(--motion-stagger); }
.hero__content > :nth-child(3) { animation-delay: calc(var(--motion-stagger) * 2); }
.hero__content > :nth-child(4) { animation-delay: calc(var(--motion-stagger) * 3); }
.hero__content > :nth-child(5) { animation-delay: calc(var(--motion-stagger) * 4); }

.product-visual .tracking-line i,
.product-visual .route-point,
.product-visual .control-map span { animation: interface-pulse 1800ms var(--ease-standard) infinite; }
.product-visual .tracking-line i:nth-child(2),
.product-visual .control-map span:nth-child(2) { animation-delay: 220ms; }
.product-visual .tracking-line i:nth-child(3),
.product-visual .control-map span:nth-child(3) { animation-delay: 440ms; }
.product-visual .route-path { background-size: 24px 24px; animation: route-shift 2400ms linear infinite; }
.product-visual .merchant-card,
.product-visual .next-stop,
.product-visual .order-board article,
.product-visual .alert-stack article { transition: transform var(--motion-fast) var(--ease-standard), box-shadow var(--motion-fast) ease; }
.product-visual .merchant-card:hover,
.product-visual .next-stop:hover,
.product-visual .order-board article:hover,
.product-visual .alert-stack article:hover { transform: translateY(-3px); box-shadow: var(--shadow-sm); }

@keyframes operation-route { to { stroke-dashoffset: -128; } }
@keyframes operation-travel { from { offset-distance: 0%; } to { offset-distance: 100%; } }
@keyframes station-breathe { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
@keyframes journey-progress { 0% { transform: translateX(-110%); } 55%, 100% { transform: translateX(250%); } }
@keyframes hero-copy-enter { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
@keyframes interface-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.16); } }
@keyframes route-shift { to { background-position: 48px 0; } }

@media (max-width: 820px) {
  .operation-scene__canvas { min-height: 470px; }
  .operation-scene__district { width: 96%; left: 2%; transform: rotateX(60deg) rotateZ(-25deg) scale(.92); }
  .operation-scene__station { min-width: 92px; padding: 9px 10px; }
  .operation-scene__station--business { top: 27%; left: 26%; }
  .operation-scene__station--rider { right: 16%; bottom: 22%; }
  .operation-scene__signal { right: 14px; bottom: 14px; }
}

@media (max-width: 560px) {
  .operation-scene__canvas { min-height: 420px; }
  .operation-scene__station { min-width: 82px; }
  .operation-scene__station small { display: none; }
  .operation-scene__station--customer { bottom: 8%; left: 3%; }
  .operation-scene__station--business { top: 26%; left: 21%; }
  .operation-scene__station--rider { right: 8%; bottom: 24%; }
  .operation-scene__station--control { top: 7%; right: 2%; }
  .operation-scene__signal { display: none; }
  .journey-flow__track { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .operation-scene__route-active,
  .operation-scene__courier,
  .operation-scene__station,
  .journey-flow__track span,
  .hero__content > *,
  .product-visual .tracking-line i,
  .product-visual .route-point,
  .product-visual .control-map span,
  .product-visual .route-path { animation: none !important; }
  .operation-scene__courier { offset-distance: 58%; }
}
`;
await appendOnce('src/styles.css', '/* PR #12 — Editorial rendering and motion system */', motionCss);

await replaceRequired('vitest.config.ts', "include: ['src/routing.ts']", "include: ['src/routing.ts', 'src/motion.ts']");
await replaceRequired('stryker.config.mjs', "mutate: ['src/routing.ts']", "mutate: ['src/routing.ts', 'src/motion.ts']");

const motionDoc = `# Sistema de render editorial y movimiento

## Propósito

El movimiento explica cómo Customer, Business, Rider y Control participan en una operación. No simula pedidos reales, cobertura, tiempos ni actividad comercial.

## Arquitectura

- \`src/motion.ts\`: contrato puro para modo de movimiento y stagger.
- \`useRevealAnimations\`: un único observador para revelados por viewport.
- \`EditorialNetwork\`: escena urbana editorial con trayecto SVG y estaciones funcionales.
- \`OperationalJourney\`: secuencia compartida del recorrido operativo.
- CSS: solo \`transform\`, \`opacity\`, \`stroke-dashoffset\` y \`offset-distance\` para animaciones principales.

## Modos

- \`enhanced\`: IntersectionObserver y movimiento explicativo.
- \`reduced\`: contenido visible sin animación continua.
- \`static\`: fallback cuando IntersectionObserver no existe.

## Presupuestos

- CSS compilado: máximo 60 KB.
- JavaScript compilado principal: máximo 280 KB.
- Sin vídeos, WebGL ni librerías de animación.
- Sin sourcemaps públicos.
- Sin cambios de layout requeridos para completar la animación.

## Evidencia

El gate instrumentado comprueba escena, trayecto, modo reducido, activos, contraste, navegación y ausencia del aro del hero. Mutation testing incluye el módulo de movimiento.
`;
await write('docs/MOTION-SYSTEM.md', motionDoc);

await replaceRequired(
  'scripts/verify-public-site.mjs',
  "'product-visual', 'prefers-reduced-motion', 'sitemap.xml'];",
  "'product-visual', 'prefers-reduced-motion', 'sitemap.xml', 'operation-scene', 'journey-flow', 'data-motion'];",
);
await replaceRequired(
  'scripts/verify-public-site.mjs',
  "const sourcePages = await readFile(join(repositoryRoot, 'src', 'pages.tsx'), 'utf8');",
  "const sourcePages = await readFile(join(repositoryRoot, 'src', 'pages.tsx'), 'utf8');\nconst sourceMain = await readFile(join(repositoryRoot, 'src', 'main.tsx'), 'utf8');\nconst sourceMotion = await readFile(join(repositoryRoot, 'src', 'motion.ts'), 'utf8');",
);
await replaceRequired(
  'scripts/verify-public-site.mjs',
  "for (const obsoleteNavigationRule of ['overflow-x: auto', 'margin-inline: -18px']) {",
  `const motionRequirements = ['operation-scene__route-active', 'operation-scene__courier', 'journey-flow__track', 'prefers-reduced-motion: reduce'];
for (const requirement of motionRequirements) if (!sourceCss.includes(requirement)) errors.push(\`Contrato de movimiento incompleto: \${requirement}\`);
for (const requirement of ['getRevealDelay', 'resolveMotionMode', "root.dataset.motion ="]) if (!sourceMain.includes(requirement)) errors.push(\`Integración de movimiento ausente: \${requirement}\`);
for (const requirement of ['clampRevealIndex', 'getRevealDelay', 'resolveMotionMode']) if (!sourceMotion.includes(requirement)) errors.push(\`Módulo de movimiento incompleto: \${requirement}\`);
const compiledCss = files.filter((file) => file.endsWith('.css'));
const compiledJs = files.filter((file) => file.endsWith('.js'));
for (const file of compiledCss) if ((await stat(file)).size > 60_000) errors.push(\`CSS supera 60 KB: \${file.replace(distDirectory, 'dist')}\`);
for (const file of compiledJs) if ((await stat(file)).size > 280_000) errors.push(\`JavaScript supera 280 KB: \${file.replace(distDirectory, 'dist')}\`);

for (const obsoleteNavigationRule of ['overflow-x: auto', 'margin-inline: -18px']) {`,
);
await replaceRequired(
  'scripts/verify-public-site.mjs',
  "['ARCHITECTURE.md', 'CORPORATE-SITE.md', 'DESIGN-SYSTEM.md', 'BRAND-SOURCE.md', 'ROADMAP.md']",
  "['ARCHITECTURE.md', 'CORPORATE-SITE.md', 'DESIGN-SYSTEM.md', 'BRAND-SOURCE.md', 'ROADMAP.md', 'MOTION-SYSTEM.md']",
);
await replaceRequired(
  'scripts/verify-public-site.mjs',
  'hero sin aro, activos públicos resolubles, contraste de aplicaciones y navegación móvil accesible.',
  'hero sin aro, render editorial, movimiento reducido, presupuestos de bundle, activos públicos resolubles, contraste de aplicaciones y navegación móvil accesible.',
);

const motionBrowserBlock = `
  report.motion = await evaluate(client, \`(() => {
    const root = document.documentElement;
    const route = document.querySelector('.operation-scene__route-active');
    const courier = document.querySelector('.operation-scene__courier');
    const scene = document.querySelector('.operation-scene__canvas');
    return {
      mode: root.dataset.motion,
      routeAnimation: getComputedStyle(route).animationName,
      courierAnimation: getComputedStyle(courier).animationName,
      sceneHeight: scene.getBoundingClientRect().height,
      stations: document.querySelectorAll('.operation-scene__station').length,
      journeySteps: document.querySelectorAll('.journey-flow__step').length,
    };
  })()\`);
  assert(report.motion.mode === 'enhanced', 'El modo de movimiento mejorado no se activó');
  assert(report.motion.routeAnimation === 'operation-route', 'El trayecto editorial no está animado');
  assert(report.motion.courierAnimation === 'operation-travel', 'El movimiento operativo no está animado');
  assert(report.motion.sceneHeight >= 400, 'La escena editorial perdió altura útil');
  assert(report.motion.stations === 4 && report.motion.journeySteps === 4, 'La narrativa no conserva las cuatro responsabilidades');

  await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await navigate(client, homeUrl, 390, 844, true);
  report.reducedMotion = await evaluate(client, \`(() => ({
    mode: document.documentElement.dataset.motion,
    routeAnimation: getComputedStyle(document.querySelector('.operation-scene__route-active')).animationName,
    courierAnimation: getComputedStyle(document.querySelector('.operation-scene__courier')).animationName,
    hiddenReveals: [...document.querySelectorAll('[data-reveal]')].filter((element) => getComputedStyle(element).opacity === '0').length,
  }))()\`);
  assert(report.reducedMotion.mode === 'reduced', 'prefers-reduced-motion no activa el modo reducido');
  assert(report.reducedMotion.routeAnimation === 'none' && report.reducedMotion.courierAnimation === 'none', 'El modo reducido conserva animaciones continuas');
  assert(report.reducedMotion.hiddenReveals === 0, 'El modo reducido oculta contenido');
  await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
`;
await replaceRequired(
  'scripts/verify-mobile-navigation.mjs',
  "  assert(report.heroDecoration.position === 'static' && report.heroDecoration.overflow === 'visible' && report.heroDecoration.isolation === 'auto', 'Quedó CSS de soporte del aro');\n",
  "  assert(report.heroDecoration.position === 'static' && report.heroDecoration.overflow === 'visible' && report.heroDecoration.isolation === 'auto', 'Quedó CSS de soporte del aro');\n" + motionBrowserBlock,
);
await replaceRequired(
  'scripts/verify-mobile-navigation.mjs',
  'Web verificada en Chrome: hero sin aro, activos públicos, contraste, foco, teclado, cierre, estado activo y responsive.',
  'Web verificada en Chrome: render editorial, movimiento y modo reducido, hero sin aro, activos públicos, contraste, foco, teclado, cierre, estado activo y responsive.',
);

await appendOnce(
  'docs/TECH-DEBT.md',
  'TD-006',
  '| TD-006 | El render editorial se valida por estructura, estilos computados y presupuestos, sin comparación pixel a pixel | Medio | Añadir snapshots visuales deterministas para escritorio, tablet, móvil y modo reducido |',
);

console.log('PR #12 aplicado: escena editorial, recorrido operativo, motion tokens, pruebas y presupuestos.');
