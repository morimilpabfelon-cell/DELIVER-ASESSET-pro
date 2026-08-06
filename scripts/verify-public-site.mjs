import { readFile, readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';

const distDirectory = new URL('../dist/', import.meta.url);
const textExtensions = new Set(['.html', '.css', '.js']);

async function collectTextFiles(directoryUrl) {
  const entries = await readdir(directoryUrl, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryUrl = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directoryUrl);
    if (entry.isDirectory()) {
      files.push(...await collectTextFiles(entryUrl));
    } else if (textExtensions.has(extname(entry.name))) {
      files.push(entryUrl);
    }
  }

  return files;
}

const files = await collectTextFiles(distDirectory);
const contents = await Promise.all(files.map(async (file) => readFile(file, 'utf8')));
const bundle = contents.join('\n');

const forbiddenTerms = [
  'DA-24736',
  'S/ 18.90',
  'Crear envío',
  'Prototipo público',
  'Este repositorio',
  'backend central todavía no implementado',
  'Vista conceptual · sin funciones operativas',
];

const requiredTerms = [
  'Mover la ciudad.',
  'Una red visible.',
  'Próximamente',
  'DELIVER Customer',
  'DELIVER Business',
  'DELIVER Rider',
  'DELIVER Control',
  'prefers-reduced-motion',
];

const forbiddenFound = forbiddenTerms.filter((term) => bundle.includes(term));
const requiredMissing = requiredTerms.filter((term) => !bundle.includes(term));

if (forbiddenFound.length > 0 || requiredMissing.length > 0) {
  const messages = [];
  if (forbiddenFound.length > 0) messages.push(`Contenido prohibido encontrado: ${forbiddenFound.join(', ')}`);
  if (requiredMissing.length > 0) messages.push(`Contenido obligatorio ausente: ${requiredMissing.join(', ')}`);
  throw new Error(messages.join('\n'));
}

console.log(`Contrato público verificado en ${files.length} archivos compilados.`);
