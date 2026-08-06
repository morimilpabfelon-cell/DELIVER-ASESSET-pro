import { readFile, writeFile, rm } from 'node:fs/promises';

const path = 'scripts/apply-pr11.mjs';
let source = await readFile(path, 'utf8');
const before = "await writeFile(join(dist, 'release.json'), `${'${JSON.stringify(release, null, 2)}'}\\n`, 'utf8');";
const after = "await writeFile(join(dist, 'release.json'), JSON.stringify(release, null, 2) + '\\n', 'utf8');";
if (!source.includes(before)) throw new Error('No se encontró la plantilla de release.json');
source = source.replace(before, after);
await writeFile(path, source, 'utf8');
await rm('scripts/fix-pr11-generator.mjs');
console.log('Generador PR11 corregido.');
