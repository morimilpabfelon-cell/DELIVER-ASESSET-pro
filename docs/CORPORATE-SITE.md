# Contrato del sitio corporativo

## Función

El sitio público de DELIVER ASSETS debe:

- presentar la organización;
- explicar sus servicios;
- presentar Customer, Business, Rider y Control;
- publicar información oficial verificable;
- explicar principios de seguridad y confianza;
- orientar a cada audiencia hacia el canal correcto;
- distribuir aplicaciones únicamente cuando existan canales oficiales.

La web no es el marketplace ni la consola operativa principal.

## Arquitectura pública

Rutas canónicas:

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

Las rutas se definen una sola vez en `src/routes.json`. Ese manifiesto gobierna:

- resolución de páginas en React;
- generación de directorios estáticos;
- títulos y descripciones;
- sitemap;
- controles de CI.

## Jerarquía editorial

La referencia corporativa externa sirve para estudiar madurez de arquitectura, no para copiar diseño, texto ni secciones que no correspondan a DELIVER ASSETS.

La jerarquía propia es:

1. Propósito y propuesta de valor.
2. Servicios.
3. Aplicaciones.
4. Empresa y principios.
5. Seguridad y confianza.
6. Noticias verificadas.
7. Contacto y distribución.

## Veracidad

No publicar sin evidencia:

- fechas de lanzamiento;
- cobertura;
- tiempos de entrega;
- métricas;
- clientes o comercios activos;
- alianzas;
- ejecutivos;
- dirección legal;
- número de empleados;
- certificaciones;
- descargas o tiendas.

Las pantallas conceptuales explican jerarquía y alcance. No representan operaciones reales.

## Noticias

La infraestructura editorial puede existir sin publicaciones. No se crearán anuncios ficticios para ocupar espacio.

Cada publicación futura deberá incluir:

- título;
- fecha;
- categoría;
- contenido verificable;
- URL estable;
- metadatos sociales.

## Contacto

No se activa un formulario hasta disponer de:

- backend receptor;
- consentimiento informado;
- política de privacidad;
- retención definida;
- confirmación al remitente;
- responsable de atención.

## Distribución

- Customer: móvil y escritorio por etapas.
- Business: escritorio principal y móvil complementario.
- Rider: móvil y acceso operativo autorizado.
- Control: acceso administrado, sin descarga pública abierta.

## Movimiento y accesibilidad

Este documento es la fuente canónica del movimiento del sitio; no se mantiene un contrato de movimiento paralelo.

- El movimiento comunica relación, continuidad y cambio de responsabilidad; no es decoración necesaria para comprender o accionar el contenido.
- `src/motion.ts` resuelve únicamente los modos `enhanced`, `reduced` y `static`; `src/main.tsx` mantiene un solo `IntersectionObserver` para los revelados por viewport.
- `enhanced` habilita el movimiento editorial; `reduced` elimina el movimiento continuo; `static` conserva todo el contenido visible cuando `IntersectionObserver` no está disponible.
- `transform` y `opacity` son las propiedades preferidas para movimiento continuo. `offset-distance` y `background-position` solo se permiten en capas editoriales acotadas, sin afectar layout, interacción ni comprensión, y deben quedar desactivadas en `reduced` y `static`.
- No se usa `filter` animado de forma continua, WebGL, vídeo de fondo ni una librería externa de animación.
- El CSS compilado no puede superar 60 KB por archivo y el JavaScript compilado no puede superar 280 KB por archivo. No se publican sourcemaps.
- Chrome instrumentado debe comprobar `enhanced`, `reduced`, `static`, overflow horizontal, recorrido operativo y presupuestos de bundle.
- La ausencia de comparación pixel a pixel se registra como deuda técnica; no se presenta una inspección estructural como equivalencia a QA visual.
- Foco, contraste, lectura y navegación por teclado son gates obligatorios.

## Limpieza

Un documento se conserva únicamente si gobierna una decisión vigente.

También se considera código muerto cualquier exportación, selector, variable CSS o dependencia que no tenga consumo actual ni una reserva explícitamente documentada.

Al reemplazar una arquitectura:

1. actualizar el documento canónico;
2. migrar las reglas duraderas;
3. eliminar documentos de etapa y código sin uso;
4. añadir una verificación que impida la regresión.

## Navegación móvil y accesibilidad

- En pantallas de hasta 820 px, la navegación se presenta como un panel controlado por un botón con `aria-controls` y `aria-expanded`.
- El menú contiene Empresa, Servicios, Aplicaciones, Seguridad, Noticias y Contacto; ningún destino depende de desplazamiento horizontal.
- Al abrir, el foco pasa al primer enlace. `Tab` y `Shift+Tab` permanecen dentro del control hasta cerrarlo.
- `Escape`, el botón de cierre y el fondo exterior cierran el panel y devuelven el foco al botón.
- La página Contacto utiliza `aria-current="page"` tanto en el menú como en el acceso de escritorio.
- El fondo no se desplaza mientras el menú permanece abierto.

## Activos públicos y contraste

- Las rutas corporativas utilizan `siteHref()` y conservan slash final.
- Los archivos de `public/` utilizan `assetHref()` y nunca reciben slash final después de la extensión.
- El build debe abrir logo e ilustración en Chrome y comprobar dimensiones naturales mayores que cero.
- Customer, Business, Rider y Control mantienen fondos blanco, amarillo, rojo y negro respectivamente.
- Una variante de cuadrícula no puede anular el fondo de una aplicación sin actualizar también su contrato de contraste.

## Hero sin aro decorativo

- El hero de Inicio no utiliza pseudo-elementos circulares, anillos ni manchas de fondo.
- `.hero::before` está prohibido por el contrato estático y por Chrome.
- `position`, `overflow` e `isolation` no se conservan cuando solo sostenían esa decoración.
