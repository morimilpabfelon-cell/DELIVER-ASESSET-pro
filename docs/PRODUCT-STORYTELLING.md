# Product storytelling y realidad visual

## Objetivo

La web pública debe mostrar cómo se mueve una operación por DELIVER ASSETS, no limitarse a enumerar aplicaciones o explicar arquitectura interna.

## Historia principal

Una operación atraviesa cuatro responsabilidades:

1. **Customer solicita.**
2. **Business prepara.**
3. **Rider mueve.**
4. **Control supervisa.**

La web debe presentar estas responsabilidades como una secuencia conectada, no como cuatro productos aislados.

## Diferenciación

DELIVER ASSETS no se describe únicamente como una aplicación para pedir comida. El alcance público es:

- comercio local;
- entregas bajo demanda;
- envíos urbanos y paquetería;
- aplicaciones especializadas conectadas por una misma operación.

## Pantallas conceptuales

Las vistas de Customer, Business, Rider y Control sirven para explicar alcance y jerarquía. No representan:

- datos reales;
- comercios activos;
- pedidos procesados;
- métricas de rendimiento;
- cobertura disponible;
- aplicaciones publicadas.

Cada pantalla conceptual debe mantener identidad propia:

- **Customer:** descubrimiento, compra, envío y seguimiento.
- **Business:** catálogo, pedidos, preparación y coordinación.
- **Rider:** asignaciones, ruta, evidencia y cierre.
- **Control:** supervisión, alertas, incidencias y auditoría.

## Movimiento

- La animación principal representa el avance de una operación.
- El movimiento continuo usa únicamente `transform` y `opacity`.
- El contenido permanece visible sin JavaScript.
- `prefers-reduced-motion: reduce` elimina el movimiento continuo y los revelados.
- Las microinteracciones no sustituyen contenido ni bloquean lectura.

## Disponibilidad

- No existe una franja global repetitiva de “Próximamente”.
- El estado se muestra junto a cada aplicación o plataforma.
- Control se presenta como acceso administrado.
- No se publican enlaces de descarga hasta disponer de canales oficiales verificados.

## Gates

- TypeScript y Vite build correctos.
- Contrato de storytelling verificado sobre `dist`.
- Sin clases ni texto del orbitador anterior.
- Revisión desktop, tablet y móvil.
- Revisión con movimiento reducido.
- Revisión final en GitHub Pages después del merge.
