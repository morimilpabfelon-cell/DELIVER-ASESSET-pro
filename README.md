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
npm install --no-audit --no-fund
npm run dev
```

## Verificación

```bash
npm run build
```

El build ejecuta:

1. TypeScript.
2. Vite.
3. Generación de rutas estáticas.
4. Generación de `404.html`, sitemap y robots.
5. Contrato corporativo y control de código/documentación obsoletos.
6. Chrome headless para navegación móvil, foco y responsive.
7. Carga real del logo y de la ilustración editorial mediante sus dimensiones naturales.
8. Contraste y fondos canónicos de Customer, Business, Rider y Control.
9. Ausencia del aro decorativo y del CSS residual que lo sostenía en el hero de Inicio.

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
