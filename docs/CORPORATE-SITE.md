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

- El movimiento comunica relación y continuidad, no decora.
- Las animaciones continuas usan `transform` y `opacity`.
- El contenido permanece visible sin animaciones.
- `prefers-reduced-motion: reduce` elimina movimiento continuo y revelados.
- Foco, contraste, lectura y navegación por teclado son gates obligatorios.

## Limpieza

Un documento se conserva únicamente si gobierna una decisión vigente.

También se considera código muerto cualquier exportación, selector, variable CSS o dependencia que no tenga consumo actual ni una reserva explícitamente documentada.

Al reemplazar una arquitectura:

1. actualizar el documento canónico;
2. migrar las reglas duraderas;
3. eliminar documentos de etapa y código sin uso;
4. añadir una verificación que impida la regresión.
