# Roadmap por gates

## G0 — Repositorio y marca

- [x] Repositorio canónico inicializado.
- [x] GitHub Pages y CI configurados.
- [x] Identidad principal alineada con Figma.
- [x] Fuente canónica de marca documentada.

## G1 — Arquitectura pública

- [x] Separar sitio corporativo de aplicaciones operativas.
- [x] Eliminar dashboards simulados y código asociado.
- [x] Crear páginas públicas para Customer, Business, Rider y Control.
- [x] Mantener descargas deshabilitadas hasta disponer de binarios oficiales.
- [x] Sustituir parámetros `?app=` por rutas canónicas.
- [x] Generar rutas estáticas, 404, sitemap y robots.
- [ ] Revisar visualmente escritorio, tablet y móvil en GitHub Pages.
- [ ] Añadir pruebas automatizadas de accesibilidad en navegador.

## G2 — Sitio corporativo de producción

- [x] Definir páginas de empresa, servicios, aplicaciones, seguridad, noticias y contacto.
- [x] Consolidar el contrato editorial y eliminar documentos de etapa reemplazados.
- [x] Añadir metadatos y URL canónica por ruta.
- [ ] Persistir el handoff corporativo en Figma.
- [ ] Definir identidad legal, privacidad y términos con revisión competente.
- [ ] Activar canales de contacto con backend, consentimiento y atención.
- [ ] Incorporar una fuente de contenido gobernada para noticias.
- [ ] Definir analítica con privacidad y consentimiento.

## G3 — Contratos compartidos

- [ ] Modelo canónico de identidad y roles.
- [ ] Máquina de estados de pedidos y envíos.
- [ ] Contratos de catálogo, logística, tracking e incidencias.
- [ ] ADR de separación entre móvil, escritorio, Control y backend.
- [ ] Política de versionado y compatibilidad de clientes.

## G4 — Aplicaciones en sandbox

- [ ] Customer móvil.
- [ ] Customer escritorio.
- [ ] Business escritorio y móvil complementario.
- [ ] Rider móvil.
- [ ] Control restringido.
- [ ] Backend versionado, PostgreSQL, autenticación y RBAC.
- [ ] Auditoría, idempotencia, observabilidad y pagos únicamente en sandbox.

## G5 — Distribución controlada

Bloqueado hasta disponer de:

- firma de binarios;
- actualización segura;
- publicación oficial en tiendas o repositorios;
- política de rollback;
- seguridad, privacidad y soporte;
- evidencia operativa y legal suficiente.

## G6 — Piloto

Bloqueado hasta cerrar seguridad, legal, observabilidad, soporte, continuidad y criterios explícitos de salida.
