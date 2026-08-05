# DELIVER ASSETS Pro

Repositorio canónico del sitio público de DELIVER ASSETS y de la arquitectura de distribución de sus aplicaciones.

## Decisión de producto

La página web **presenta, explica y distribuye**. No es el marketplace operativo principal.

Las operaciones se realizarán en aplicaciones separadas:

- **DELIVER Customer:** Android, iOS y clientes de escritorio previstos.
- **DELIVER Business:** escritorio como superficie principal y móvil complementario.
- **DELIVER Rider:** aplicación móvil especializada.
- **DELIVER Control:** acceso institucional restringido, sin descarga pública abierta.

## Estado

**Prototipo técnico y visual.** No existen descargas públicas, autenticación, pagos, ubicación, pedidos ni operaciones reales.

Los controles de descarga permanecen deshabilitados deliberadamente hasta disponer de binarios verificados, firma, actualización y canales oficiales.

## Desarrollo local

```bash
npm install --no-audit --no-fund
npm run dev
```

## Verificación

```bash
npm run build
```

## Arquitectura y controles

- [Arquitectura pública](docs/ARCHITECTURE.md)
- [Fuente canónica de marca](docs/BRAND-SOURCE.md)
- [Design System](docs/DESIGN-SYSTEM.md)
- [Roadmap por gates](docs/ROADMAP.md)
- [Política de seguridad](SECURITY.md)
- [Guía de contribución](CONTRIBUTING.md)

Todo cambio debe entrar mediante rama, pull request y evidencia verificable de compilación.
