# Contrato de contenido y movimiento

## Objetivo

La web pública debe sentirse como una propiedad institucional definitiva aunque las aplicaciones todavía se publiquen por etapas.

## Voz pública

- Hablar de beneficios, funciones y responsabilidades del ecosistema.
- Mantener la verdad sobre disponibilidad mediante `Próximamente` o `Acceso administrado`.
- Evitar lenguaje de repositorio, implementación, sandbox o deuda técnica en la interfaz pública.
- No presentar fechas, cobertura, tiempos, pagos, descargas o disponibilidad que no estén verificados.
- Customer, Business, Rider y Control deben mantener vocabulario y alcance diferenciados.

## Jerarquía de contenido

1. Propuesta de valor.
2. Aplicaciones y públicos.
3. Cómo funciona la distribución.
4. Tecnología explicada desde el beneficio.
5. Confianza, límites y trazabilidad.
6. Identidad institucional.

## Movimiento

- Animar para comunicar entrada, relación y continuidad; no para decorar.
- Usar únicamente `transform` y `opacity` en movimiento continuo o revelado.
- No bloquear interacción ni lectura mientras una animación está activa.
- El contenido debe ser visible sin JavaScript y sin animaciones.
- Respetar `prefers-reduced-motion: reduce` y eliminar movimiento continuo en ese modo.
- Evitar librerías de animación mientras CSS e `IntersectionObserver` cubran el alcance.

## Gates

- TypeScript correcto.
- Build de Vite correcto.
- Contrato público verificado sobre `dist`.
- Revisión de desktop, tablet y móvil.
- Revisión con movimiento reducido.
- Revisión final sobre GitHub Pages antes de cerrar el gate visual.
