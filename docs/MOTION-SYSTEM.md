# Sistema de render editorial y movimiento

## Propósito

El movimiento explica cómo Customer, Business, Rider y Control participan en una operación. No simula pedidos reales, cobertura, tiempos, métricas ni actividad comercial.

## Arquitectura

- `src/motion.ts`: contrato puro para modo de movimiento y stagger.
- `useRevealAnimations`: un único observador para revelados por viewport.
- `src/motion.css`: render editorial, trayecto, estados y microinteracciones.
- La ilustración versionada continúa siendo la capa visual base; el movimiento se añade sin crear una segunda fuente de verdad.
- Las animaciones principales usan `transform`, `opacity`, `background-position` y `offset-distance`.

## Modos

- `enhanced`: IntersectionObserver y movimiento explicativo.
- `reduced`: contenido visible sin animación continua.
- `static`: fallback cuando IntersectionObserver no existe.

## Presupuestos

- CSS compilado total: máximo 60 KB por archivo.
- JavaScript compilado principal: máximo 280 KB por archivo.
- Sin vídeos, WebGL ni librerías externas de animación.
- Sin sourcemaps públicos.
- Sin animaciones que sean necesarias para entender o accionar el contenido.

## Pruebas

- Unitarias para cálculo de stagger y resolución del modo.
- Cobertura y mutation testing sobre `routing.ts` y `motion.ts`.
- Chrome instrumentado para modo normal, modo reducido, overflow y animaciones esenciales.
- Los gates existentes siguen comprobando activos, contraste, rutas, foco, teclado y ausencia del aro del hero.

## Veracidad

Los estados visuales son conceptuales. No representan pedidos, comercios, ubicaciones ni operaciones reales.

## Criterio de terminación

El cambio solo se considera validado cuando el SHA final pasa CI, mutation testing y CodeQL, se despliega mediante el pipeline reproducible y la URL pública confirma ese mismo SHA en `release.json`.
