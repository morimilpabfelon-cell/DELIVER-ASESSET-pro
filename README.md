# DELIVER ASSETS Pro

Repositorio canónico del sitio corporativo público de DELIVER ASSETS y de la arquitectura de distribución de sus aplicaciones.

## Decisión de producto

La página web **presenta, explica, publica información oficial y distribuye**. No es el marketplace ni la consola operativa principal.

Las operaciones se realizarán en aplicaciones separadas:

- **DELIVER Customer:** Android, iOS y clientes de escritorio previstos.
- **DELIVER Business:** escritorio como superficie principal y móvil complementario.
- **DELIVER Rider:** aplicación móvil especializada.
- **DELIVER Control:** acceso institucional restringido, sin descarga pública abierta.

## Rutas públicas

```text
/
/company/
/services/
/apps/
/apps/customer/
/apps/business/
/apps/rider/
/apps/control/
/security/
/news/
/contact/
```

Las rutas se gobiernan desde `src/routes.json`. El build genera un directorio estático por ruta para que GitHub Pages pueda abrirlas directamente.

## Estado

El sitio corporativo es público. Las aplicaciones, la identidad operativa, los pagos, la ubicación, los pedidos y la distribución oficial todavía no están habilitados.

No se publican descargas, fechas, cobertura, métricas ni datos corporativos que no hayan sido verificados.

## Desarrollo local

```bash
npm ci --no-audit --no-fund
npm run dev
```

## Verificación

```bash
npm run quality
```

El pipeline de calidad ejecuta:

1. validación de las 11 rutas canónicas;
2. TypeScript y ESLint sin warnings;
3. pruebas unitarias y cobertura con umbrales;
4. build de Vite sin sourcemaps públicos;
5. generación de `release.json`, rutas estáticas, `404.html`, sitemap y robots;
6. contrato corporativo y control de código/documentación obsoletos;
7. Chrome headless para navegación móvil, foco, responsive, activos y contraste;
8. Chrome instrumentado para movimiento `enhanced`, `reduced` y `static`, recorrido operativo y presupuestos;
9. mutation testing y auditoría de dependencias mediante los comandos dedicados.

Las páginas utilizan `siteHref()` y los archivos de `public/` utilizan `assetHref()`. Un activo inexistente debe responder HTTP 404; no puede quedar oculto mediante una página HTML servida con estado 200.

## Documentación canónica

- [Contrato del sitio corporativo](docs/CORPORATE-SITE.md)
- [Arquitectura pública](docs/ARCHITECTURE.md)
- [Fuente canónica de marca](docs/BRAND-SOURCE.md)
- [Design System](docs/DESIGN-SYSTEM.md)
- [Roadmap por gates](docs/ROADMAP.md)
- [Política de seguridad](SECURITY.md)
- [Guía de contribución](CONTRIBUTING.md)

Todo cambio debe entrar mediante rama, pull request y evidencia verificable de compilación. Los documentos de etapas reemplazadas deben consolidarse o eliminarse para evitar fuentes de verdad paralelas.

## Calidad y publicación verificable

El contrato de ingeniería está en [docs/ENGINEERING-DOCTRINE.md](docs/ENGINEERING-DOCTRINE.md). El build usa dependencias bloqueadas, cobertura, análisis estático, Chrome instrumentado y metadata de release. GitHub Pages solo se considera validado cuando `release.json` y el HTML público exponen el SHA esperado.

Comandos principales:

```bash
npm ci
npm run quality
npm run test:mutation
npm run security:audit
```
