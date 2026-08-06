import { readFile, writeFile } from 'node:fs/promises';

const path = 'scripts/apply-pr12.mjs';
const source = await readFile(path, 'utf8');
const broken = "element.style.setProperty('--reveal-delay', \\`${getRevealDelay(index)}ms\\`);";
const fixed = "element.style.setProperty('--reveal-delay', \\`\\${getRevealDelay(index)}ms\\`);";
if (!source.includes(broken)) throw new Error('No se encontró la plantilla de stagger que debía corregirse');
await writeFile(path, source.replace(broken, fixed));
console.log('Plantilla de stagger corregida.');
