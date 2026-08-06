import { createServer } from 'node:http';
import { createServer as createNetServer } from 'node:net';
import { access, readFile, stat } from 'node:fs/promises';
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
      if (!await pathExists(filePath)) filePath = join(distDirectory, '404.html');

      const body = await readFile(filePath);
      response.writeHead(200, {
        'Content-Type': contentType(filePath),
        'Cache-Control': 'no-store',
      });
      response.end(body);
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
  throw new Error('No se encontró Chrome o Chromium para la prueba de navegación');
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

  close() {
    this.socket.close();
  }
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
  await new Promise((resolve) => setTimeout(resolve, 100));
}

async function key(client, keyName, modifiers = 0) {
  const keyCodes = { Tab: 9, Escape: 27 };
  await client.send('Input.dispatchKeyEvent', {
    type: 'keyDown',
    key: keyName,
    code: keyName,
    windowsVirtualKeyCode: keyCodes[keyName],
    modifiers,
  });
  await client.send('Input.dispatchKeyEvent', {
    type: 'keyUp',
    key: keyName,
    code: keyName,
    windowsVirtualKeyCode: keyCodes[keyName],
    modifiers,
  });
  await new Promise((resolve) => setTimeout(resolve, 80));
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
  `--user-data-dir=/tmp/deliver-assets-nav-${process.pid}`,
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
  await client.send('Input.setIgnoreInputEvents', { ignore: false });

  const homeUrl = `${origin}${siteBase}`;
  const contactUrl = `${origin}${siteBase}contact/`;
  const report = {};

  await navigate(client, homeUrl, 390, 844, true);
  report.mobileInitial = await evaluate(client, `(() => {
    const toggle = document.querySelector('.mobile-nav-toggle');
    const nav = document.querySelector('#site-navigation');
    return {
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      toggleDisplay: getComputedStyle(toggle).display,
      expanded: toggle.getAttribute('aria-expanded'),
      navDisplay: getComputedStyle(nav).display,
      labels: [...nav.querySelectorAll('a')].map((link) => link.textContent.trim()),
    };
  })()`);
  assert(!report.mobileInitial.overflow, 'La página móvil presenta desbordamiento horizontal');
  assert(report.mobileInitial.toggleDisplay !== 'none', 'El botón de menú no es visible en móvil');
  assert(report.mobileInitial.expanded === 'false', 'El menú inicia con aria-expanded incorrecto');
  assert(report.mobileInitial.navDisplay === 'none', 'El panel móvil inicia visible');
  assert(JSON.stringify(report.mobileInitial.labels) === JSON.stringify(['Empresa', 'Servicios', 'Aplicaciones', 'Seguridad', 'Noticias', 'Contacto']), 'El menú no contiene los seis destinos canónicos');

  await evaluate(client, "document.querySelector('.mobile-nav-toggle').click()");
  await waitFor(client, "document.querySelector('.mobile-nav-toggle').getAttribute('aria-expanded') === 'true'");
  await waitFor(client, "document.activeElement?.textContent?.trim() === 'Empresa'");
  report.mobileOpen = await evaluate(client, `(() => ({
    navDisplay: getComputedStyle(document.querySelector('#site-navigation')).display,
    activeText: document.activeElement?.textContent?.trim(),
    locked: document.documentElement.classList.contains('mobile-nav-open'),
    contactDisplay: getComputedStyle(document.querySelector('.site-nav__contact')).display,
    scrim: !!document.querySelector('.mobile-nav-scrim'),
  }))()`);
  assert(report.mobileOpen.navDisplay === 'grid', 'El panel móvil no se muestra como grid');
  assert(report.mobileOpen.activeText === 'Empresa', 'El foco no entra al primer enlace al abrir');
  assert(report.mobileOpen.locked, 'El fondo no queda bloqueado al abrir el menú');
  assert(report.mobileOpen.contactDisplay !== 'none', 'Contacto no es visible dentro del menú móvil');
  assert(report.mobileOpen.scrim, 'El fondo exterior del menú no está presente');

  await evaluate(client, "document.querySelector('.mobile-nav-toggle').focus()");
  await key(client, 'Tab', 8);
  assert(await evaluate(client, "document.activeElement?.textContent?.trim()") === 'Contacto', 'Shift+Tab no cicla desde el botón al último enlace');
  await key(client, 'Tab');
  assert((await evaluate(client, "document.activeElement?.classList.contains('mobile-nav-toggle')")) === true, 'Tab no cicla desde el último enlace al botón');

  await key(client, 'Escape');
  report.afterEscape = await evaluate(client, `(() => ({
    expanded: document.querySelector('.mobile-nav-toggle').getAttribute('aria-expanded'),
    focused: document.activeElement?.classList.contains('mobile-nav-toggle'),
    locked: document.documentElement.classList.contains('mobile-nav-open'),
    scrim: !!document.querySelector('.mobile-nav-scrim'),
  }))()`);
  assert(report.afterEscape.expanded === 'false', 'Escape no cierra el menú');
  assert(report.afterEscape.focused, 'Escape no devuelve el foco al botón');
  assert(!report.afterEscape.locked && !report.afterEscape.scrim, 'Escape no limpia el bloqueo o el fondo exterior');

  await evaluate(client, "document.querySelector('.mobile-nav-toggle').click()");
  await waitFor(client, "!!document.querySelector('.mobile-nav-scrim')");
  await evaluate(client, "document.querySelector('.mobile-nav-scrim').click()");
  await waitFor(client, "document.querySelector('.mobile-nav-toggle').getAttribute('aria-expanded') === 'false'");
  assert((await evaluate(client, "document.activeElement?.classList.contains('mobile-nav-toggle')")) === true, 'El clic exterior no devuelve el foco al botón');

  await navigate(client, contactUrl, 390, 844, true);
  await evaluate(client, "document.querySelector('.mobile-nav-toggle').click()");
  await waitFor(client, "document.querySelector('.mobile-nav-toggle').getAttribute('aria-expanded') === 'true'");
  report.contactMobile = await evaluate(client, `(() => ({
    current: document.querySelector('.site-nav__contact').getAttribute('aria-current'),
    display: getComputedStyle(document.querySelector('.site-nav__contact')).display,
    desktopButton: getComputedStyle(document.querySelector('.button--header')).display,
  }))()`);
  assert(report.contactMobile.current === 'page', 'Contacto no está activo en el menú móvil');
  assert(report.contactMobile.display !== 'none', 'Contacto está oculto en el menú móvil');
  assert(report.contactMobile.desktopButton === 'none', 'El botón desktop no se oculta en móvil');

  await navigate(client, contactUrl, 1440, 900, false);
  report.contactDesktop = await evaluate(client, `(() => ({
    overflow: document.documentElement.scrollWidth > window.innerWidth,
    toggle: getComputedStyle(document.querySelector('.mobile-nav-toggle')).display,
    navContact: getComputedStyle(document.querySelector('.site-nav__contact')).display,
    button: getComputedStyle(document.querySelector('.button--header')).display,
    current: document.querySelector('.button--header').getAttribute('aria-current'),
  }))()`);
  assert(!report.contactDesktop.overflow, 'La página Contacto presenta desbordamiento en desktop');
  assert(report.contactDesktop.toggle === 'none', 'El botón móvil aparece en desktop');
  assert(report.contactDesktop.navContact === 'none', 'Contacto se duplica dentro del nav desktop');
  assert(report.contactDesktop.button !== 'none' && report.contactDesktop.current === 'page', 'El botón Contacto desktop no muestra estado activo');

  await navigate(client, homeUrl, 900, 900, false);
  report.tablet = await evaluate(client, `(() => ({
    overflow: document.documentElement.scrollWidth > window.innerWidth,
    toggle: getComputedStyle(document.querySelector('.mobile-nav-toggle')).display,
    contact: getComputedStyle(document.querySelector('.button--header')).display,
    wrap: getComputedStyle(document.querySelector('.site-nav')).flexWrap,
  }))()`);
  assert(!report.tablet.overflow, 'La navegación tablet presenta desbordamiento horizontal');
  assert(report.tablet.toggle === 'none', 'El control móvil aparece por encima de 820 px');
  assert(report.tablet.contact !== 'none', 'Contacto desaparece en tablet');
  assert(report.tablet.wrap === 'wrap', 'La navegación tablet no permite ajuste de línea');

  console.log(JSON.stringify(report, null, 2));
  console.log('Navegación móvil verificada en Chrome: foco, teclado, cierre, estado activo y responsive.');
} finally {
  client?.close();
  browser.kill('SIGTERM');
  await new Promise((resolve) => server.close(resolve));
}
