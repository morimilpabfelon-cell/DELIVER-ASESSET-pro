import { readFile, writeFile, rm } from 'node:fs/promises';

const path = 'scripts/apply-pr11.mjs';
let source = await readFile(path, 'utf8');

const nestedRelease = "await writeFile(join(dist, 'release.json'), `${'${JSON.stringify(release, null, 2)}'}\\n`, 'utf8');";
const safeRelease = "await writeFile(join(dist, 'release.json'), JSON.stringify(release, null, 2) + '\\\\n', 'utf8');";
if (!source.includes(nestedRelease)) throw new Error('No se encontró la plantilla de release.json');
source = source.replace(nestedRelease, safeRelease);

const unsafeJoin = "errors.join('\\n')";
const safeJoin = "errors.join('\\\\n')";
const joinOccurrences = source.split(unsafeJoin).length - 1;
if (joinOccurrences < 2) throw new Error(`Se esperaban al menos dos joins con escape; encontrados: ${joinOccurrences}`);
source = source.replaceAll(unsafeJoin, safeJoin);

await writeFile(path, source, 'utf8');
await rm('scripts/fix-pr11-generator.mjs');
console.log('Generador PR11 corregido: templates y escapes seguros.');
