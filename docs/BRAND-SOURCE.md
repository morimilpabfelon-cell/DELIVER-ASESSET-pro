# Fuente canónica de marca

## Figma

- Archivo: `DELIVER ASSETS — Editorial AI Concept`
- File key: `cUGTTGlTB05xiKLL8NGcwG`
- Página del sistema de producción: `59:2 — Design System Production`
- Navegación de referencia: `59:196 — Desktop Navigation`
- Nuevo símbolo raster aprobado para la web: `277:5`
- Wordmark tipográfico de referencia: `59:198`
- Lenguaje material de referencia: `277:8`

## Activos web

- `public/brand/deliver-assets-mark.png`: exportación transparente del nodo `277:5`, recortada mediante un frame temporal que no se conservó en Figma.
- Tamaño del activo de header: `96 × 73 px`, aproximadamente `9.3 KB`.
- Contrato binario: PNG RGBA de 8 bits, con transparencia y límite automático de `32 KB`.
- Render en desktop: ancho `54 px`; render móvil: ancho `44 px`.
- `public/brand/city-network.svg`: ilustración editorial original inspirada por grano, halftone y líneas de ruta; no reproduce claims ni métricas de los moodboards.
- `public/brand/og-brand.png`: tarjeta social `1200 × 630 px` generada con el símbolo oficial y los colores canónicos.

## Contrato visual

- Wordmark: `DELIVER ASSETS` en una sola línea.
- Familia tipográfica: `Inter`.
- Peso: `Extra Bold / 800`.
- Tamaño: `18 px` en desktop y `15 px` en móvil.
- Color principal: `#1551D8`.
- El símbolo conserva transparencia, textura roja y proporción propia.

## Reglas

1. No redibujar ni reinterpretar el símbolo sin una decisión registrada.
2. No incrustar imágenes raster como base64 dentro de CSS, HTML o JavaScript.
3. Los activos se versionan bajo `public/brand/` y no dependen de URLs temporales de Figma.
4. Los moodboards con métricas, direcciones, tiempos, cobertura o capacidades no verificadas sirven solo como referencia.
5. Toda modificación de identidad debe citar los nodos de Figma usados como evidencia.
6. Al sustituir un activo se elimina su implementación anterior y cualquier selector sin consumidores.

## Historial

El nodo `59:197` y `src/brand-alignment.css` fueron reemplazados por `277:5` y un activo PNG versionado. El antiguo raster embebido en CSS se eliminó para evitar duplicación, peso oculto y fuentes de verdad paralelas.
