import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');
const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
const routes = JSON.parse(await readFile(join(root, 'src', 'routes.json'), 'utf8'));
const sha = (process.env.BUILD_SHA || 'local').trim().toLowerCase();
if (sha !== 'local' && !/^[a-f0-9]{40}$/.test(sha)) throw new Error('BUILD_SHA inválido: ' + sha);
if (process.env.CI && sha === 'local') throw new Error('CI debe proporcionar BUILD_SHA');
const release = { sha, version: pkg.version, basePath: '/DELIVER-ASESSET-pro/', routeCount: routes.length };
await writeFile(join(dist, 'release.json'), JSON.stringify(release, null, 2) + '\n', 'utf8');
const indexPath = join(dist, 'index.html');
let html = await readFile(indexPath, 'utf8');
html = html.replace(/<meta name="deliver-build-sha" content="[^"]*" \/>/, '<meta name="deliver-build-sha" content="' + sha + '" />');
await writeFile(indexPath, html, 'utf8');
console.log('Metadatos de build generados para ' + sha + '.');
