import { deflateSync, inflateSync } from 'node:zlib';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const markBase64 = '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';

function replaceOrFail(source, pattern, replacement, label) {
  const next = source.replace(pattern, replacement);
  if (next === source) throw new Error(`No se pudo aplicar: ${label}`);
  return next;
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let index = 0; index < 8; index += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, checksum]);
}

function decodeRgbaPng(buffer) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (!buffer.subarray(0, 8).equals(signature)) throw new Error('Logo PNG inválido');
  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idat = [];
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') {
      break;
    }
    offset += length + 12;
  }
  if (bitDepth !== 8 || colorType !== 6) throw new Error(`PNG esperado RGBA 8-bit; recibido ${bitDepth}/${colorType}`);
  const inflated = inflateSync(Buffer.concat(idat));
  const stride = width * 4;
  const rgba = Buffer.alloc(stride * height);
  let inputOffset = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = inflated[inputOffset++];
    for (let x = 0; x < stride; x += 1) {
      const raw = inflated[inputOffset++];
      const left = x >= 4 ? rgba[y * stride + x - 4] : 0;
      const up = y > 0 ? rgba[(y - 1) * stride + x] : 0;
      const upperLeft = y > 0 && x >= 4 ? rgba[(y - 1) * stride + x - 4] : 0;
      let value = raw;
      if (filter === 1) value = (raw + left) & 255;
      else if (filter === 2) value = (raw + up) & 255;
      else if (filter === 3) value = (raw + Math.floor((left + up) / 2)) & 255;
      else if (filter === 4) {
        const predictor = left + up - upperLeft;
        const pa = Math.abs(predictor - left);
        const pb = Math.abs(predictor - up);
        const pc = Math.abs(predictor - upperLeft);
        const nearest = pa <= pb && pa <= pc ? left : pb <= pc ? up : upperLeft;
        value = (raw + nearest) & 255;
      } else if (filter !== 0) throw new Error(`Filtro PNG no soportado: ${filter}`);
      rgba[y * stride + x] = value;
    }
  }
  return { width, height, rgba };
}

function encodeRgbaPng(width, height, rgba) {
  const rows = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * (width * 4 + 1);
    rows[rowOffset] = 0;
    rgba.copy(rows, rowOffset + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(rows, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

function drawOgCard(markBuffer) {
  const width = 1200;
  const height = 630;
  const pixels = Buffer.alloc(width * height * 4);
  const setPixel = (x, y, color, alpha = 255) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const offset = (y * width + x) * 4;
    const sourceAlpha = alpha / 255;
    const destinationAlpha = pixels[offset + 3] / 255;
    const outputAlpha = sourceAlpha + destinationAlpha * (1 - sourceAlpha);
    for (let channel = 0; channel < 3; channel += 1) {
      pixels[offset + channel] = outputAlpha === 0 ? 0 : Math.round((color[channel] * sourceAlpha + pixels[offset + channel] * destinationAlpha * (1 - sourceAlpha)) / outputAlpha);
    }
    pixels[offset + 3] = Math.round(outputAlpha * 255);
  };
  const rect = (x, y, w, h, color) => {
    for (let yy = y; yy < y + h; yy += 1) for (let xx = x; xx < x + w; xx += 1) setPixel(xx, yy, color);
  };
  const circle = (cx, cy, radius, color) => {
    for (let y = -radius; y <= radius; y += 1) for (let x = -radius; x <= radius; x += 1) if (x * x + y * y <= radius * radius) setPixel(cx + x, cy + y, color);
  };
  const line = (x0, y0, x1, y1, thickness, color) => {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (let step = 0; step <= steps; step += 1) {
      const x = Math.round(x0 + (x1 - x0) * step / steps);
      const y = Math.round(y0 + (y1 - y0) * step / steps);
      circle(x, y, thickness, color);
    }
  };
  rect(0, 0, width, height, [250, 243, 223]);
  rect(0, 0, 130, height, [21, 81, 216]);
  rect(130, 500, 1070, 130, [17, 17, 17]);
  rect(210, 95, 390, 315, [255, 249, 233]);
  for (let y = 115; y < 390; y += 24) for (let x = 235; x < 575; x += 24) circle(x, y, 3, [21, 81, 216]);
  circle(330, 250, 108, [255, 198, 47]);
  line(190, 455, 370, 340, 6, [255, 51, 40]);
  line(370, 340, 560, 430, 6, [255, 51, 40]);
  line(560, 430, 790, 245, 6, [255, 51, 40]);
  for (const [x, y] of [[190, 455], [370, 340], [560, 430], [790, 245]]) {
    circle(x, y, 15, [250, 243, 223]);
    circle(x, y, 9, [255, 51, 40]);
  }
  const mark = decodeRgbaPng(markBuffer);
  const scale = 4;
  const originX = 760;
  const originY = 120;
  for (let y = 0; y < mark.height; y += 1) {
    for (let x = 0; x < mark.width; x += 1) {
      const source = (y * mark.width + x) * 4;
      const alpha = mark.rgba[source + 3];
      if (alpha === 0) continue;
      const color = [mark.rgba[source], mark.rgba[source + 1], mark.rgba[source + 2]];
      for (let sy = 0; sy < scale; sy += 1) for (let sx = 0; sx < scale; sx += 1) setPixel(originX + x * scale + sx, originY + y * scale + sy, color, alpha);
    }
  }
  return encodeRgbaPng(width, height, pixels);
}

const brandDirectory = join(root, 'public', 'brand');
await mkdir(brandDirectory, { recursive: true });
const markBuffer = Buffer.from(markBase64, 'base64');
await writeFile(join(brandDirectory, 'deliver-assets-mark.png'), markBuffer);
await writeFile(join(brandDirectory, 'og-brand.png'), drawOgCard(markBuffer));

const cityNetworkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 720" role="img" aria-labelledby="title description">
  <title id="title">Red editorial de DELIVER ASSETS</title>
  <desc id="description">Una ciudad abstracta conecta Customer, Business, Rider y Control mediante una misma ruta.</desc>
  <defs>
    <pattern id="dots" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="2" fill="#1551D8" opacity=".28"/></pattern>
    <pattern id="paper" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0 3h12M0 9h12" stroke="#D8CCAF" stroke-width=".5" opacity=".34"/></pattern>
  </defs>
  <rect width="960" height="720" rx="42" fill="#FFF9E9"/>
  <rect width="960" height="720" rx="42" fill="url(#paper)"/>
  <path d="M62 552H898M132 84V642M392 60V660M676 60V660" stroke="#F4E9C6" stroke-width="48"/>
  <g fill="#1551D8" opacity=".9"><path d="M90 166h142v162H90z"/><path d="M264 116h94v212h-94z"/><path d="M722 122h148v206H722z"/><path d="M612 182h82v146h-82z"/></g>
  <g fill="url(#dots)"><path d="M72 372h212v144H72z"/><path d="M690 370h198v146H690z"/></g>
  <path d="M116 548C238 466 296 522 398 418S574 350 676 424 790 432 858 332" fill="none" stroke="#FF3328" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  <g fill="#FAF3DF" stroke="#FF3328" stroke-width="8"><circle cx="116" cy="548" r="18"/><circle cx="398" cy="418" r="18"/><circle cx="676" cy="424" r="18"/><circle cx="858" cy="332" r="18"/></g>
  <g font-family="Inter,Arial,sans-serif" font-weight="800" font-size="24" fill="#111111">
    <g transform="translate(72 574)"><rect width="188" height="82" rx="14" fill="#FAF3DF" stroke="#D8CCAF"/><text x="20" y="34">CUSTOMER</text><text x="20" y="61" font-size="14" fill="#6F6F69">SOLICITA</text></g>
    <g transform="translate(306 310)"><rect width="188" height="82" rx="14" fill="#FFC62F"/><text x="20" y="34">BUSINESS</text><text x="20" y="61" font-size="14">PREPARA</text></g>
    <g transform="translate(574 468)"><rect width="164" height="82" rx="14" fill="#FF3328"/><text x="20" y="34" fill="#FFFFFF">RIDER</text><text x="20" y="61" font-size="14" fill="#FFFFFF">MUEVE</text></g>
    <g transform="translate(742 222)"><rect width="168" height="82" rx="14" fill="#111111"/><text x="20" y="34" fill="#FFFFFF">CONTROL</text><text x="20" y="61" font-size="14" fill="#FFC62F">SUPERVISA</text></g>
  </g>
  <g transform="translate(390 82)"><rect width="180" height="86" rx="22" fill="#FAF3DF" stroke="#1551D8" stroke-width="4"/><text x="90" y="40" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-weight="800" font-size="22" fill="#1551D8">DELIVER ASSETS</text><text x="90" y="64" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="12" fill="#6F6F69">UNA OPERACIÓN CONECTADA</text></g>
</svg>`;
await writeFile(join(brandDirectory, 'city-network.svg'), cityNetworkSvg, 'utf8');

let components = await readFile(join(root, 'src', 'components.tsx'), 'utf8');
components = replaceOrFail(
  components,
  /export function BrandMark\(\) \{[\s\S]*?\n\}\n\nexport function StatusBadge/,
  `export function BrandMark() {\n  return (\n    <span className="brand-mark" aria-label="DELIVER ASSETS">\n      <img\n        className="brand-mark__symbol"\n        src={siteHref('/brand/deliver-assets-mark.png')}\n        width="96"\n        height="73"\n        alt=""\n        aria-hidden="true"\n      />\n      <span className="brand-mark__wordmark"><strong>DELIVER</strong><span>ASSETS</span></span>\n    </span>\n  );\n}\n\nexport function StatusBadge`,
  'BrandMark con activo versionado',
);
components = replaceOrFail(
  components,
  /export function NetworkScene\(\) \{[\s\S]*?\n\}\n\nfunction CustomerVisual/,
  `export function EditorialNetwork() {\n  const steps = [\n    { id: 'customer', index: '01', role: 'Customer', action: 'Solicita' },\n    { id: 'business', index: '02', role: 'Business', action: 'Prepara' },\n    { id: 'rider', index: '03', role: 'Rider', action: 'Mueve' },\n    { id: 'control', index: '04', role: 'Control', action: 'Supervisa' },\n  ] as const;\n\n  return (\n    <figure className="editorial-network hero-entrance hero-entrance--visual" aria-labelledby="editorial-network-caption">\n      <div className="editorial-network__art">\n        <img src={siteHref('/brand/city-network.svg')} alt="" aria-hidden="true" />\n      </div>\n      <figcaption className="editorial-network__legend" id="editorial-network-caption">\n        {steps.map((step) => (\n          <a key={step.id} href={appRoute(step.id)}>\n            <span>{step.index}</span><strong>{step.role}</strong><small>{step.action}</small>\n          </a>\n        ))}\n      </figcaption>\n    </figure>\n  );\n}\n\nfunction CustomerVisual`,
  'escena editorial',
);
await writeFile(join(root, 'src', 'components.tsx'), components, 'utf8');

let pages = await readFile(join(root, 'src', 'pages.tsx'), 'utf8');
pages = replaceOrFail(pages, '  NetworkScene,', '  EditorialNetwork,', 'import editorial');
pages = replaceOrFail(pages, '<NetworkScene />', '<EditorialNetwork />', 'uso editorial');
await writeFile(join(root, 'src', 'pages.tsx'), pages, 'utf8');

let styles = await readFile(join(root, 'src', 'styles.css'), 'utf8');
styles = replaceOrFail(
  styles,
  `.brand-mark { display: inline-flex; align-items: center; }\n.brand-mark__symbol { display: block; }\n.brand-mark__wordmark { display: flex; align-items: center; }`,
  `.brand-mark { display: inline-flex; align-items: center; gap: 12px; }\n.brand-mark__symbol { display: block; width: 54px; height: auto; flex: 0 0 auto; object-fit: contain; }\n.brand-mark__wordmark { display: flex; align-items: center; gap: .28em; color: var(--brand-primary); line-height: 1.25; white-space: nowrap; }\n.brand-mark__wordmark strong,\n.brand-mark__wordmark span { color: inherit; font-size: 18px; font-weight: 800; }\n.site-footer .brand-mark__wordmark { color: white; }`,
  'estilos de marca',
);
styles = replaceOrFail(
  styles,
  /\n\.network-scene \{[\s\S]*?\.network-node--control i \{ background: var\(--ink\); \}\n/,
  `\n.editorial-network { min-width: 0; margin: 0; }\n.editorial-network__art { position: relative; overflow: hidden; border: 1px solid var(--border-subtle); border-radius: 42px; background: var(--surface-warm); box-shadow: var(--shadow-md); }\n.editorial-network__art::after { position: absolute; inset: 0; border-radius: inherit; background: linear-gradient(135deg, transparent 58%, rgb(255 198 47 / 14%)); content: ''; pointer-events: none; }\n.editorial-network__art img { display: block; width: 100%; height: auto; }\n.editorial-network__legend { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin-top: 12px; }\n.editorial-network__legend a { display: grid; min-height: 92px; align-content: center; gap: 3px; padding: 14px; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); color: var(--ink); background: white; text-decoration: none; transition: transform 180ms var(--ease-out), border-color 180ms ease, box-shadow 180ms ease; }\n.editorial-network__legend a:hover { border-color: var(--brand-primary); transform: translateY(-3px); box-shadow: var(--shadow-sm); }\n.editorial-network__legend span { color: var(--editorial-red); font-size: 10px; font-weight: 800; }\n.editorial-network__legend strong { font-size: 14px; }\n.editorial-network__legend small { color: var(--text-muted); font-size: 11px; }\n`,
  'CSS de diagrama reemplazado',
);
styles = styles
  .replace(/\n@keyframes route-packet \{[\s\S]*?\n\}\n/, '\n')
  .replace(/\n\s*\.network-scene \{ min-height: 520px; \}/g, '')
  .replace(/\n\s*\.network-scene \{ min-height: 480px; \}/g, '')
  .replace(/\n\s*\.network-node \{ min-width: 145px; padding: 12px; \}/g, '')
  .replace(/\n\s*\.network-scene__route \{ inset: 82px 64px; \}/g, '')
  .replace(/\n\s*\.network-scene \{ min-height: 430px; border-radius: 28px; \}/g, '')
  .replace(/\n\s*\.network-scene__route \{ inset: 62px 34px; \}/g, '')
  .replace(/\n\s*\.network-scene__core \{ width: 78px; height: 78px; border-radius: 24px; \}/g, '')
  .replace(/\n\s*\.network-node \{ min-width: 122px; gap: 8px; padding: 10px; \}/g, '')
  .replace(/\n\s*\.network-node i \{ width: 16px; height: 16px; flex-basis: 16px; \}/g, '')
  .replace(/\n\s*\.network-node strong \{ font-size: 11px; \}/g, '')
  .replace(/\n\s*\.network-node small \{ font-size: 9px; \}/g, '');
styles += `\n@media (max-width: 820px) {\n  .editorial-network__legend { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n}\n\n@media (max-width: 560px) {\n  .brand-mark { gap: 9px; }\n  .brand-mark__symbol { width: 44px; }\n  .brand-mark__wordmark strong,\n  .brand-mark__wordmark span { font-size: 15px; }\n  .editorial-network__art { border-radius: 28px; }\n  .editorial-network__legend { grid-template-columns: 1fr 1fr; }\n}\n`;
await writeFile(join(root, 'src', 'styles.css'), styles, 'utf8');
await rm(join(root, 'src', 'brand-alignment.css'));

let html = await readFile(join(root, 'index.html'), 'utf8');
html = replaceOrFail(html, '    <meta name="twitter:card" content="summary" />', `    <meta property="og:image" content="https://morimilpabfelon-cell.github.io/DELIVER-ASESSET-pro/brand/og-brand.png" />\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />\n    <meta property="og:image:alt" content="Composición editorial de DELIVER ASSETS" />\n    <meta name="twitter:card" content="summary_large_image" />\n    <meta name="twitter:image" content="https://morimilpabfelon-cell.github.io/DELIVER-ASESSET-pro/brand/og-brand.png" />`, 'metadatos sociales');
html = replaceOrFail(html, '    <link rel="canonical" href="https://morimilpabfelon-cell.github.io/DELIVER-ASESSET-pro/" />', `    <link rel="canonical" href="https://morimilpabfelon-cell.github.io/DELIVER-ASESSET-pro/" />\n    <link rel="icon" type="image/png" href="/DELIVER-ASESSET-pro/brand/deliver-assets-mark.png" />`, 'favicon');
html = replaceOrFail(html, '    <link rel="stylesheet" href="/src/brand-alignment.css" />\n', '', 'retirar CSS de etapa');
await writeFile(join(root, 'index.html'), html, 'utf8');

const brandSource = `# Fuente canónica de marca\n\n## Figma\n\n- Archivo: \`DELIVER ASSETS — Editorial AI Concept\`\n- File key: \`cUGTTGlTB05xiKLL8NGcwG\`\n- Página del sistema de producción: \`59:2 — Design System Production\`\n- Navegación de referencia: \`59:196 — Desktop Navigation\`\n- Nuevo símbolo raster aprobado para la web: \`277:5\`\n- Wordmark tipográfico de referencia: \`59:198\`\n- Lenguaje material de referencia: \`277:8\`\n\n## Activos web\n\n- \`public/brand/deliver-assets-mark.png\`: exportación transparente del nodo \`277:5\`, recortada mediante un frame temporal que no se conservó en Figma.\n- Tamaño del activo de header: \`96 × 73 px\`, aproximadamente \`9.3 KB\`.\n- Render en desktop: ancho \`54 px\`; render móvil: ancho \`44 px\`.\n- \`public/brand/city-network.svg\`: ilustración editorial original inspirada por grano, halftone y líneas de ruta; no reproduce claims ni métricas de los moodboards.\n- \`public/brand/og-brand.png\`: tarjeta social \`1200 × 630 px\` generada con el símbolo oficial y los colores canónicos.\n\n## Contrato visual\n\n- Wordmark: \`DELIVER ASSETS\` en una sola línea.\n- Familia tipográfica: \`Inter\`.\n- Peso: \`Extra Bold / 800\`.\n- Tamaño: \`18 px\` en desktop y \`15 px\` en móvil.\n- Color principal: \`#1551D8\`.\n- El símbolo conserva transparencia, textura roja y proporción propia.\n\n## Reglas\n\n1. No redibujar ni reinterpretar el símbolo sin una decisión registrada.\n2. No incrustar imágenes raster como base64 dentro de CSS, HTML o JavaScript.\n3. Los activos se versionan bajo \`public/brand/\` y no dependen de URLs temporales de Figma.\n4. Los moodboards con métricas, direcciones, tiempos, cobertura o capacidades no verificadas sirven solo como referencia.\n5. Toda modificación de identidad debe citar los nodos de Figma usados como evidencia.\n6. Al sustituir un activo se elimina su implementación anterior y cualquier selector sin consumidores.\n\n## Historial\n\nEl nodo \`59:197\` y \`src/brand-alignment.css\` fueron reemplazados por \`277:5\` y un activo PNG versionado. El antiguo raster embebido en CSS se eliminó para evitar duplicación, peso oculto y fuentes de verdad paralelas.\n`;
await writeFile(join(root, 'docs', 'BRAND-SOURCE.md'), brandSource, 'utf8');

const verifier = `import { access, readFile, readdir, stat } from 'node:fs/promises';\nimport { extname, join } from 'node:path';\nimport { fileURLToPath } from 'node:url';\n\nconst repositoryRoot = fileURLToPath(new URL('../', import.meta.url));\nconst distDirectory = join(repositoryRoot, 'dist');\nconst routes = JSON.parse(await readFile(join(repositoryRoot, 'src', 'routes.json'), 'utf8'));\nconst textExtensions = new Set(['.html', '.css', '.js', '.json', '.xml', '.txt', '.svg']);\n\nasync function collectTextFiles(directory) {\n  const entries = await readdir(directory, { withFileTypes: true });\n  const files = [];\n  for (const entry of entries) {\n    const entryPath = join(directory, entry.name);\n    if (entry.isDirectory()) files.push(...await collectTextFiles(entryPath));\n    else if (textExtensions.has(extname(entry.name))) files.push(entryPath);\n  }\n  return files;\n}\n\nasync function pathExists(path) {\n  try { await access(path); return true; } catch { return false; }\n}\n\nfunction inspectPng(buffer, label) {\n  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);\n  if (!buffer.subarray(0, 8).equals(signature)) throw new Error(\`PNG inválido: \${label}\`);\n  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20), bitDepth: buffer[24], colorType: buffer[25] };\n}\n\nconst files = await collectTextFiles(distDirectory);\nconst contents = await Promise.all(files.map((file) => readFile(file, 'utf8')));\nconst bundle = contents.join('\\n');\nconst forbiddenTerms = ['DA-24736', 'S/ 18.90', 'Prototipo público', 'Este repositorio', 'backend central todavía no implementado', 'Vista conceptual · sin funciones operativas', 'launch-notice', 'app-orbit', 'city-scene', 'Una red. Cuatro aplicaciones.', 'href="?app=', "href:'?app=", 'data:image/', 'base64,', 'brand-alignment.css', 'network-scene', 'network-node', 'route-packet'];\nconst requiredTerms = ['Mover la ciudad.', 'Una red visible.', 'Infraestructura digital para coordinar comercio y movimiento.', 'Comunicaciones oficiales, cuando exista algo que comunicar.', 'La seguridad empieza por limitar correctamente el sistema.', 'DELIVER Customer', 'DELIVER Business', 'DELIVER Rider', 'DELIVER Control', 'editorial-network', 'brand/deliver-assets-mark.png', 'brand/city-network.svg', 'brand/og-brand.png', 'og:image', 'twitter:image', 'page-hero', 'product-visual', 'prefers-reduced-motion', 'sitemap.xml'];\nconst errors = [];\nconst forbiddenFound = forbiddenTerms.filter((term) => bundle.includes(term));\nconst requiredMissing = requiredTerms.filter((term) => !bundle.includes(term));\nif (forbiddenFound.length > 0) errors.push(\`Contenido o código obsoleto encontrado: \${forbiddenFound.join(', ')}\`);\nif (requiredMissing.length > 0) errors.push(\`Contrato corporativo incompleto: \${requiredMissing.join(', ')}\`);\n\nfor (const route of routes) {\n  const routeDirectory = route.path === '/' ? distDirectory : join(distDirectory, route.path.replace(/^\\/+|\\/+$/g, ''));\n  if (!await pathExists(join(routeDirectory, 'index.html'))) errors.push(\`Ruta estática ausente: \${route.path}\`);\n}\nfor (const requiredFile of ['404.html', 'sitemap.xml', 'robots.txt', 'route-manifest.json']) {\n  if (!await pathExists(join(distDirectory, requiredFile))) errors.push(\`Archivo de publicación ausente: \${requiredFile}\`);\n}\nconst sitemap = await readFile(join(distDirectory, 'sitemap.xml'), 'utf8');\nfor (const route of routes) if (!sitemap.includes(route.path)) errors.push(\`Sitemap sin ruta: \${route.path}\`);\n\nconst logoPath = join(distDirectory, 'brand', 'deliver-assets-mark.png');\nconst ogPath = join(distDirectory, 'brand', 'og-brand.png');\nconst illustrationPath = join(distDirectory, 'brand', 'city-network.svg');\nfor (const assetPath of [logoPath, ogPath, illustrationPath]) if (!await pathExists(assetPath)) errors.push(\`Activo de marca ausente: \${assetPath.replace(distDirectory, 'dist')}\`);\nif (await pathExists(logoPath)) {\n  const buffer = await readFile(logoPath);\n  const info = inspectPng(buffer, 'deliver-assets-mark.png');\n  if (info.width !== 96 || info.height !== 73 || info.bitDepth !== 8 || ![4, 6].includes(info.colorType)) errors.push(\`Logo fuera de contrato: \${JSON.stringify(info)}\`);\n  if ((await stat(logoPath)).size > 32_000) errors.push('Logo superior a 32 KB');\n}\nif (await pathExists(ogPath)) {\n  const buffer = await readFile(ogPath);\n  const info = inspectPng(buffer, 'og-brand.png');\n  if (info.width !== 1200 || info.height !== 630) errors.push(\`Open Graph fuera de contrato: \${JSON.stringify(info)}\`);\n  if ((await stat(ogPath)).size > 300_000) errors.push('Open Graph superior a 300 KB');\n}\nif (await pathExists(illustrationPath) && (await stat(illustrationPath)).size > 80_000) errors.push('Ilustración editorial superior a 80 KB');\n\nconst sourceCss = await readFile(join(repositoryRoot, 'src', 'styles.css'), 'utf8');\nconst declaredCssVariables = new Set([...sourceCss.matchAll(/(?:^|[;{])\\s*--([a-z0-9-]+)\\s*:/gim)].map((match) => match[1]));\nconst usedCssVariables = new Set([...sourceCss.matchAll(/var\\(\\s*--([a-z0-9-]+)/gi)].map((match) => match[1]));\nconst unusedCssVariables = [...declaredCssVariables].filter((variable) => !usedCssVariables.has(variable)).sort();\nif (unusedCssVariables.length > 0) errors.push(\`Variables CSS declaradas sin consumo: \${unusedCssVariables.map((variable) => \`--\${variable}\`).join(', ')}\`);\n\nfor (const obsoletePath of ['docs/PRODUCT-STORYTELLING.md', 'src/brand-alignment.css']) {\n  if (await pathExists(join(repositoryRoot, obsoletePath))) errors.push(\`Archivo obsoleto presente: \${obsoletePath}\`);\n}\nfor (const requiredDocument of ['ARCHITECTURE.md', 'CORPORATE-SITE.md', 'DESIGN-SYSTEM.md', 'BRAND-SOURCE.md', 'ROADMAP.md']) {\n  if (!await pathExists(join(repositoryRoot, 'docs', requiredDocument))) errors.push(\`Documento de gobierno ausente: docs/\${requiredDocument}\`);\n}\nif (errors.length > 0) throw new Error(errors.join('\\n'));\nconsole.log(\`Contrato verificado: \${routes.length} rutas, \${files.length} archivos, \${declaredCssVariables.size} variables CSS y tres activos de marca.\`);\n`;
await writeFile(join(root, 'scripts', 'verify-public-site.mjs'), verifier, 'utf8');

await rm(join(root, 'scripts', 'apply-brand-assets-pr7.mjs'));
await rm(join(root, '.github', 'workflows', 'one-time-pr7-brand.yml'));
console.log('PR7 aplicado y archivos temporales eliminados.');
