# Arquitectura pública

## Decisión canónica

DELIVER ASSETS separa comunicación pública y operación:

```text
Sitio corporativo
  empresa · servicios · aplicaciones · seguridad · noticias · contacto
                               │
              ┌────────────────┼────────────────┐
              │                │                │
          Customer          Business          Rider
       móvil/escritorio   escritorio/móvil     móvil
              │                │                │
              └────────────────┼────────────────┘
                               │
                            Control
                       acceso administrado
                               │
                     Backend autoritativo
       identidad · pedidos · pagos · tracking · auditoría
```

## Alcance de este repositorio

Contiene:

- sitio corporativo público;
- páginas de empresa, servicios, seguridad, noticias y contacto;
- páginas públicas de Customer, Business, Rider y Control;
- información de plataformas y disponibilidad;
- identidad visual y componentes del sitio;
- generación estática para GitHub Pages.

No contiene aplicaciones operativas ni debe simular dashboards funcionales.

## Rutas

El manifiesto `src/routes.json` es la única fuente de verdad para las rutas públicas.

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

`src/main.tsx` resuelve la página mediante `window.location.pathname`. No existe una dependencia de router externo.

## Publicación estática

Vite compila una única aplicación. Después del build:

1. `scripts/generate-static-routes.mjs` copia el HTML compilado en cada directorio canónico;
2. genera `404.html`;
3. genera `sitemap.xml` y `robots.txt`;
4. publica `route-manifest.json` para inspección;
5. `scripts/verify-public-site.mjs` valida rutas, contenido y limpieza.

Esto permite abrir directamente una ruta como `/apps/customer/` en GitHub Pages sin reescrituras de servidor.

## Compatibilidad temporal

Los enlaces antiguos con `?app=customer`, `?app=business`, `?app=rider` o `?app=control` redirigen a las rutas nuevas. Ningún enlace nuevo debe generar parámetros `?app=`.

## Distribución prevista

### Customer

- Android e iOS.
- Windows, macOS y Linux.
- Compra, envíos y seguimiento dentro de la aplicación.

### Business

- Windows, macOS y Linux como superficie principal.
- Android e iOS como superficies complementarias.

### Rider

- Aplicación móvil especializada.
- Acceso operativo sujeto a autorización.

### Control

- Distribución administrada o acceso web interno protegido.
- Sin descarga pública abierta.

## Límites actuales

- Sin autenticación pública.
- Sin pagos.
- Sin GPS ni geolocalización operativa.
- Sin persistencia remota.
- Sin datos personales.
- Sin pedidos ni seguimiento reales.
- Sin enlaces ficticios a tiendas o instaladores.
- Sin claims de rendimiento, cobertura o disponibilidad comercial.
