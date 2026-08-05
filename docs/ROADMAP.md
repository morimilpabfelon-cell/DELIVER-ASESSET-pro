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
- [ ] Revisar visualmente escritorio, tablet y móvil en GitHub Pages.
- [ ] Añadir pruebas automatizadas de accesibilidad y navegación.

## G2 — Sitio corporativo de producción

- [ ] Cerrar contenido, jerarquía y sistema responsive contra Figma.
- [ ] Definir páginas de tecnología, seguridad, empresa y soporte.
- [ ] Incorporar CMS o fuente de contenido gobernada.
- [ ] Definir analítica con privacidad y consentimiento.
- [ ] Preparar SEO, metadatos sociales y política legal.

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

- Firma de binarios.
- Actualización segura.
- Publicación oficial en tiendas o repositorios.
- Política de rollback.
- Seguridad, privacidad y soporte.
- Evidencia operativa y legal suficiente.

## G6 — Piloto

Bloqueado hasta cerrar seguridad, legal, observabilidad, soporte, continuidad y criterios explícitos de salida.
