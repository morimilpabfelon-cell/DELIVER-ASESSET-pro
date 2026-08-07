import { createServer } from 'node:http';
import { createServer as createNetServer } from 'node:net';
import { access, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
const distDirectory = join(repositoryRoot, 'dist');
const siteBase = '/DELIVER-ASESSET-pro/';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function pathExists(path) {
  try { await access(path); return true; } catch { return false; }
}

async function freePort() {
  return await new Promise((resolve, reject) => {
    const server = createNetServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : null;
      server.close((error) => error ? reject(error) : resolve(port));
    });
  });
}

function contentType(path) {
  const extension = extname(path).toLowerCase();
  return {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
  }[extension] ?? 'application/octet-stream';
}

async function createStaticServer() {
  const server = createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url ?? '/', 'http://127.0.0.1');
      if (!requestUrl.pathname.startsWith(siteBase)) {
        response.writeHead(404).end('Not found');
        return;
      }

      const relativePath = decodeURIComponent(requestUrl.pathname.slice(siteBase.length));
      const safePath = normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, '');
      let filePath = join(distDirectory, safePath || 'index.html');
      if (await pathExists(filePath) && (await stat(filePath)).isDirectory()) filePath = join(filePath, 'index.html');
      if (!await pathExists(filePath)) {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Not found');
        return;
      }

      response.writeHead(200, {
        'Content-Type': contentType(filePath),
        'Cache-Control': 'no-store',
      });
      response.end(await readFile(filePath));
    } catch (error) {
      response.writeHead(500).end(error instanceof Error ? error.message : 'Server error');
    }
  });

  const port = await freePort();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolve);
  });
  return { server, origin: `http://127.0.0.1:${port}` };
}

async function findBrowser() {
  const candidates = [
    process.env.CHROME_PATH,
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);

  for (const candidate of candidates) if (await pathExists(candidate)) return candidate;
  throw new Error('No se encontró Chrome o Chromium para la prueba de movimiento');
}

async function waitForJson(url, timeoutMs = 15_000) {
  const startedAt = Date.now();
  let lastError;
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return await response.json();
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Chrome DevTools no respondió: ${lastError ?? 'timeout'}`);
}

class CdpClient {
  constructor(url) {
    this.socket = new WebSocket(url);
    this.nextId = 0;
    this.pending = new Map();
  }

  async open() {
    await new Promise((resolve, reject) => {
      this.socket.addEventListener('open', resolve, { once: true });
      this.socket.addEventListener('error', reject, { once: true });
    });
    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(String(event.data));
      if (!message.id || !this.pending.has(message.id)) return;
      const { resolve, reject } = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) reject(new Error(`${message.error.code}: ${message.error.message}`));
      else resolve(message.result ?? {});
    });
  }

  send(method, params = {}) {
    const id = ++this.nextId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  close() { this.socket.close(); }
}

async function evaluate(client, expression) {
  const result = await client.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text ?? 'Error evaluando JavaScript');
  return result.result?.value;
}

async function waitFor(client, expression, timeoutMs = 10_000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (await evaluate(client, expression)) return;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(`Condición de navegador no cumplida: ${expression}`);
}

async function navigate(client, url, width, height, mobile) {
  await client.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
  });
  await client.send('Page.navigate', { url });
  await waitFor(client, "document.readyState === 'complete' && !!document.querySelector('.site-header')");
  await waitFor(client, "!!document.documentElement.dataset.motion");
  await new Promise((resolve) => setTimeout(resolve, 120));
}

const sourceCss = await readFile(join(repositoryRoot, 'src', 'motion.css'), 'utf8');
const sourceMain = await readFile(join(repositoryRoot, 'src', 'main.tsx'), 'utf8');
for (const required of [
  'operation-travel',
  'network-scan',
  'journey-flow',
  'prefers-reduced-motion: reduce',
  'offset-distance',
  '--motion-route',
]) assert(sourceCss.includes(required), `Contrato CSS de movimiento incompleto: ${required}`);
for (const required of ["resolveMotionMode", "typeof window.IntersectionObserver === 'function'", 'root.dataset.motion']) {
  assert(sourceMain.includes(required), `Integración de movimiento incompleta: ${required}`);
}
for (const obsolete of ['getRevealDelay', 'clampRevealIndex', 'data-motion-group', '--reveal-delay']) {
  assert(!sourceMain.includes(obsolete) && !sourceCss.includes(obsolete), `Abstracción de movimiento sin consumidor presente: ${obsolete}`);
}
assert(!sourceCss.includes('.hero::before'), 'El sistema de movimiento reintrodujo el aro del hero');

const assetDirectory = join(distDirectory, 'assets');
const assetEntries = await readdir(assetDirectory, { withFileTypes: true });
const bundleReport = {};
for (const entry of assetEntries) {
  if (!entry.isFile()) continue;
  const path = join(assetDirectory, entry.name);
  const size = (await stat(path)).size;
  bundleReport[entry.name] = size;
  if (entry.name.endsWith('.css')) assert(size <= 60_000, `CSS supera 60 KB: ${entry.name} (${size})`);
  if (entry.name.endsWith('.js')) assert(size <= 280_000, `JavaScript supera 280 KB: ${entry.name} (${size})`);
  assert(!entry.name.endsWith('.map'), `Sourcemap público encontrado: ${entry.name}`);
}

const { server, origin } = await createStaticServer();
const browserPath = await findBrowser();
const debugPort = await freePort();
const browser = spawn(browserPath, [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--disable-dev-shm-usage',
  '--disable-background-networking',
  '--remote-allow-origins=*',
  `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=/tmp/deliver-assets-motion-${process.pid}`,
  'about:blank',
], { stdio: 'ignore' });

let client;
try {
  const targets = await waitForJson(`http://127.0.0.1:${debugPort}/json/list`);
  const page = targets.find((target) => target.type === 'page');
  assert(page?.webSocketDebuggerUrl, 'Chrome no expuso una página controlable');
  client = new CdpClient(page.webSocketDebuggerUrl);
  await client.open();
  await client.send('Page.enable');
  await client.send('Runtime.enable');

  const homeUrl = `${origin}${siteBase}`;
  const servicesUrl = `${origin}${siteBase}services/`;
  const report = { bundle: bundleReport };

  await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  await navigate(client, homeUrl, 1440, 900, false);
  report.enhanced = await evaluate(client, `(() => {
    const art = document.querySelector('.editorial-network__art');
    const image = art.querySelector('img');
    const packet = getComputedStyle(art, '::after');
    const scan = getComputedStyle(art, '::before');
    return {
      mode: document.documentElement.dataset.motion,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      packetAnimation: packet.animationName,
      packetWidth: packet.width,
      packetBorder: packet.borderTopWidth,
      scanAnimation: scan.animationName,
      imageAnimation: getComputedStyle(image).animationName,
      artHeight: art.getBoundingClientRect().height,
      legendItems: document.querySelectorAll('.editorial-network__legend a').length,
    };
  })()`);
  assert(report.enhanced.mode === 'enhanced', 'El modo enhanced no se activó');
  assert(!report.enhanced.overflow, 'El render editorial causa overflow horizontal');
  assert(report.enhanced.packetAnimation === 'operation-travel', 'El paquete editorial no se mueve');
  assert(report.enhanced.scanAnimation === 'network-scan', 'La capa urbana no se anima');
  assert(report.enhanced.imageAnimation === 'city-drift', 'La ilustración no tiene profundidad animada');
  assert(report.enhanced.packetBorder === '3px' && report.enhanced.packetWidth === '30px', 'El elemento móvil perdió su forma rectangular');
  assert(report.enhanced.artHeight >= 500 && report.enhanced.legendItems === 4, 'La escena perdió escala o responsabilidades');

  await navigate(client, servicesUrl, 1440, 900, false);
  report.journey = await evaluate(client, `(() => {
    const grid = document.querySelector('.journey-grid');
    return {
      animation: getComputedStyle(grid, '::before').animationName,
      steps: grid.querySelectorAll('li').length,
    };
  })()`);
  assert(report.journey.animation === 'journey-flow', 'El recorrido operativo no está animado');
  assert(report.journey.steps === 4, 'El recorrido no conserva cuatro responsabilidades');

  await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await navigate(client, homeUrl, 390, 844, true);
  report.reduced = await evaluate(client, `(() => {
    const art = document.querySelector('.editorial-network__art');
    return {
      mode: document.documentElement.dataset.motion,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      packetAnimation: getComputedStyle(art, '::after').animationName,
      scanAnimation: getComputedStyle(art, '::before').animationName,
      imageAnimation: getComputedStyle(art.querySelector('img')).animationName,
      hiddenReveals: [...document.querySelectorAll('[data-reveal]')].filter((element) => getComputedStyle(element).opacity === '0').length,
    };
  })()`);
  assert(report.reduced.mode === 'reduced', 'prefers-reduced-motion no activa el modo reduced');
  assert(!report.reduced.overflow, 'El modo reducido causa overflow horizontal');
  assert(report.reduced.packetAnimation === 'none', 'El paquete sigue animado en modo reducido');
  assert(report.reduced.scanAnimation === 'none', 'La capa urbana sigue animada en modo reducido');
  assert(report.reduced.imageAnimation === 'none', 'La ilustración sigue animada en modo reducido');
  assert(report.reduced.hiddenReveals === 0, 'El modo reducido oculta contenido');

  const staticScript = await client.send('Page.addScriptToEvaluateOnNewDocument', {
    source: "Object.defineProperty(window, 'IntersectionObserver', { configurable: true, value: undefined });",
  });
  await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  await navigate(client, homeUrl, 390, 844, true);
  report.static = await evaluate(client, `(() => {
    const art = document.querySelector('.editorial-network__art');
    return {
      mode: document.documentElement.dataset.motion,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      packetAnimation: getComputedStyle(art, '::after').animationName,
      scanAnimation: getComputedStyle(art, '::before').animationName,
      imageAnimation: getComputedStyle(art.querySelector('img')).animationName,
      hiddenReveals: [...document.querySelectorAll('[data-reveal]')].filter((element) => getComputedStyle(element).opacity === '0').length,
    };
  })()`);
  assert(report.static.mode === 'static', 'La ausencia de IntersectionObserver no activa el modo static');
  assert(!report.static.overflow, 'El modo static causa overflow horizontal');
  assert(report.static.packetAnimation === 'none', 'El paquete sigue animado en modo static');
  assert(report.static.scanAnimation === 'none', 'La capa urbana sigue animada en modo static');
  assert(report.static.imageAnimation === 'none', 'La ilustración sigue animada en modo static');
  assert(report.static.hiddenReveals === 0, 'El modo static oculta contenido');
  if (staticScript.identifier) await client.send('Page.removeScriptToEvaluateOnNewDocument', { identifier: staticScript.identifier });

  await mkdir(join(repositoryRoot, 'reports'), { recursive: true });
  await writeFile(join(repositoryRoot, 'reports', 'motion-browser.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  console.log('Render editorial verificado en Chrome: enhanced, journey, reduced, static y presupuestos.');
} finally {
  client?.close();
  browser.kill('SIGTERM');
  await new Promise((resolve) => server.close(resolve));
}
