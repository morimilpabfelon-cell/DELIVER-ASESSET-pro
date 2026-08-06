import { execFileSync } from 'node:child_process';
import { access, readFile, readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');
const errors = [];
async function exists(path) { try { await access(path); return true; } catch { return false; } }
async function collect(directory) { const entries = await readdir(directory, { withFileTypes: true }); const files = []; for (const entry of entries) { const path = join(directory, entry.name); files.push(...(entry.isDirectory() ? await collect(path) : [path])); } return files; }

for (const required of ['package-lock.json', '.nvmrc', '.npmrc', 'vitest.config.ts', 'stryker.config.mjs', 'eslint.config.js', 'docs/ENGINEERING-DOCTRINE.md', 'docs/TECH-DEBT.md']) if (!await exists(join(root, required))) errors.push(`Falta ${required}`);
const gitignore = await readFile(join(root, '.gitignore'), 'utf8');
const ignoredEntries = new Set(gitignore.split(String.fromCharCode(10)).map((entry) => entry.trim()).filter(Boolean));
for (const entry of ['node_modules/', 'dist/', 'coverage/', 'reports/', '.stryker-tmp/']) if (!ignoredEntries.has(entry)) errors.push('Falta en .gitignore: ' + entry);
if (gitignore.includes('gitignore.trim')) errors.push('.gitignore contiene una plantilla sin resolver');
const trackedNodeModules = execFileSync('git', ['ls-files', 'node_modules'], { cwd: root, encoding: 'utf8' }).trim();
if (trackedNodeModules) errors.push('node_modules contiene archivos versionados');
for (const temporary of ['scripts/apply-pr11.mjs', 'scripts/fix-pr11-generator.mjs', '.github/workflows/one-time-pr11.yml']) if (await exists(join(root, temporary))) errors.push('Archivo temporal presente: ' + temporary);
const files = await collect(dist);
const maps = files.filter((file) => extname(file) === '.map');
if (maps.length) errors.push(`Sourcemaps públicos encontrados: ${maps.join(", ")}`);
const releasePath = join(dist, 'release.json');
if (!await exists(releasePath)) errors.push('Falta dist/release.json');
else {
  const release = JSON.parse(await readFile(releasePath, 'utf8'));
  if (release.sha !== 'local' && !/^[a-f0-9]{40}$/.test(release.sha)) errors.push('SHA de release inválido');
  const htmlFiles = files.filter((file) => file.endsWith('.html'));
  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf8');
    if (!html.includes(`<meta name="deliver-build-sha" content="${release.sha}" />`)) errors.push(`HTML sin SHA correcto: ${file}`);
  }
}
const components = await readFile(join(root, 'src', 'components.tsx'), 'utf8');
if ((components.match(/role="img"/g) || []).length < 4) errors.push('Las cuatro vistas conceptuales no tienen semántica de imagen');
const site = await readFile(join(root, 'src', 'site.ts'), 'utf8');
if (!site.includes("from './routing'")) errors.push('Las rutas no están separadas en un módulo puro');
const vite = await readFile(join(root, 'vite.config.ts'), 'utf8');
if (!vite.includes('sourcemap: false')) errors.push('Vite no desactiva sourcemaps de producción');
const workflowPaths = ['.github/workflows/ci.yml', '.github/workflows/pages.yml', '.github/workflows/codeql.yml'];
const workflows = new Map();
for (const workflow of workflowPaths) {
  const content = await readFile(join(root, workflow), 'utf8');
  workflows.set(workflow, content);
  const uses = [...content.matchAll(/^\s*uses:\s*([^@\s]+)@([^\s#]+)\s*$/gm)];
  if (uses.length === 0) errors.push(`${workflow} no declara acciones externas`);
  for (const [, action, ref] of uses) {
    if (!/^[a-f0-9]{40}$/.test(ref)) errors.push(`${workflow} usa una referencia móvil: ${action}@${ref}`);
  }
}
for (const workflow of ['.github/workflows/ci.yml', '.github/workflows/pages.yml']) {
  const content = workflows.get(workflow);
  if (content.includes('npm install')) errors.push(`${workflow} usa npm install`);
  if (!content.includes('npm ci')) errors.push(`${workflow} no usa npm ci`);
}
const ci = workflows.get('.github/workflows/ci.yml');
if (!ci.includes('actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a')) errors.push('CI no usa upload-artifact v7 fijado por SHA');
const pages = workflows.get('.github/workflows/pages.yml');
for (const marker of ['types: [closed]', 'release.json', 'EXPECTED_SHA']) if (!pages.includes(marker)) errors.push(`Pages sin marcador: ${marker}`);
if (errors.length) throw new Error(errors.join('\n'));
console.log('Baseline de calidad verificado: lockfile, build identificable, sin sourcemaps, acciones fijadas, CI reproducible y despliegue verificable.');
