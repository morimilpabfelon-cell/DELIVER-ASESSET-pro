import { readFile } from 'node:fs/promises';

const routes = JSON.parse(await readFile(new URL('../src/routes.json', import.meta.url), 'utf8'));
const errors = [];
const ids = new Set();
const paths = new Set();
for (const [index, route] of routes.entries()) {
  if (!route || typeof route !== 'object') { errors.push('Ruta inválida en índice ' + index); continue; }
  for (const field of ['id', 'path', 'title', 'description']) if (typeof route[field] !== 'string' || !route[field].trim()) errors.push('Ruta ' + index + ' sin ' + field + ' válido');
  if (ids.has(route.id)) errors.push('ID duplicado: ' + route.id);
  if (paths.has(route.path)) errors.push('Path duplicado: ' + route.path);
  ids.add(route.id); paths.add(route.path);
  if (route.path !== '/' && (!route.path.startsWith('/') || !route.path.endsWith('/'))) errors.push('Path no canónico: ' + route.path);
}
if (routes.filter((route) => route.path === '/').length !== 1) errors.push('Debe existir una única ruta de inicio');
if (errors.length) throw new Error(errors.join('\n'));
console.log('Contrato de rutas válido: ' + routes.length + ' rutas únicas.');
