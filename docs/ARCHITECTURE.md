# Arquitectura pública

## Decisión canónica

DELIVER ASSETS separa la comunicación pública de la operación:

```text
Sitio corporativo
  presenta · explica · genera confianza · distribuye
                         │
          ┌──────────────┼──────────────┐
          │              │              │
       Customer       Business        Rider
     móvil/escritorio  escritorio/móvil  móvil
                         │
                       Control
                  acceso restringido
                         │
                  Backend autoritativo
        identidad · pedidos · pagos · tracking · auditoría
```

## Alcance de este repositorio

Este repositorio contiene únicamente:

- Página corporativa.
- Páginas públicas de Customer, Business, Rider y Control.
- Información de plataformas previstas.
- Futuros puntos de distribución y descarga.
- Identidad visual y componentes del sitio público.

No contiene aplicaciones operativas ni debe simular dashboards funcionales.

## Distribución prevista

### Customer

- Android e iOS como aplicaciones móviles.
- Windows, macOS y Linux como clientes de escritorio.
- Compra, envíos y seguimiento dentro de la aplicación, no en la web corporativa.

### Business

- Windows, macOS y Linux como superficie principal.
- Android e iOS como superficies complementarias.

### Rider

- Aplicación móvil especializada.
- Sin cliente de escritorio previsto para la primera etapa.

### Control

- Distribución administrada o acceso web interno protegido.
- Sin descarga pública abierta.

## Navegación técnica del prototipo

GitHub Pages sirve una sola aplicación React bajo el subdirectorio del repositorio.

- La página principal utiliza secciones y anclas.
- Las páginas públicas de aplicaciones utilizan el parámetro `?app=`.
- No se requieren reescrituras de servidor.
- Los botones de distribución están deshabilitados mientras no existan binarios oficiales.

## Límites actuales

- Sin autenticación.
- Sin pagos.
- Sin GPS ni geolocalización.
- Sin persistencia remota.
- Sin datos personales.
- Sin pedidos ni seguimiento reales.
- Sin enlaces ficticios a tiendas o instaladores.
- Sin claims de rendimiento, cobertura o disponibilidad comercial.
