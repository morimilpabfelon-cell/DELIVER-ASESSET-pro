# Arquitectura inicial

## Objetivo

Publicar una superficie web verificable que permita revisar la identidad visual y las cuatro aplicaciones de DELIVER ASSETS sin confundir prototipo con producción.

## Superficies

- **Corporate:** narrativa pública, servicios y confianza.
- **Customer:** creación y seguimiento de pedidos desde web.
- **Business:** catálogo, pedidos y operación de comercios.
- **Rider:** previsualización web de una futura aplicación móvil especializada.
- **Control:** supervisión, incidencias y auditoría.

## Decisión de fase 0

La fase inicial utiliza una sola aplicación React modular y navegación mediante hash. Esto permite que GitHub Pages sirva todas las vistas bajo el subdirectorio del repositorio sin depender de reescrituras de servidor.

Las vistas no comparten autoridad ni datos reales. Cuando exista un backend sandbox y contratos aprobados, podrán separarse en aplicaciones desplegables independientes.

## Límites

- Sin autenticación.
- Sin pagos.
- Sin GPS ni geolocalización.
- Sin persistencia remota.
- Sin datos personales.
- Sin claims de rendimiento, usuarios o cobertura.
