import type { ReactNode } from 'react';
import { appRoute, products, siteHref, type AppId, type CorporateRoute } from './site';

export function BrandMark() {
  return (
    <span className="brand-mark" aria-label="DELIVER ASSETS">
      <span className="brand-mark__symbol" aria-hidden="true" />
      <span className="brand-mark__wordmark"><strong>DELIVER</strong><span>ASSETS</span></span>
    </span>
  );
}

export function StatusBadge({ children }: { children: ReactNode }) {
  return <span className="status-badge">{children}</span>;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
}) {
  return (
    <div className={`section-heading${light ? ' section-heading--light' : ''}`} data-reveal="up">
      <p className={`eyebrow${light ? ' eyebrow--light' : ''}`}>{eyebrow}</p>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  lead,
  aside,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  aside?: ReactNode;
}) {
  return (
    <section className="page-hero">
      <div className="page-hero__copy hero-entrance">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{lead}</p>
      </div>
      {aside ? <div className="page-hero__aside hero-entrance hero-entrance--visual">{aside}</div> : null}
    </section>
  );
}

function HeaderNav({ currentRoute }: { currentRoute: CorporateRoute | null }) {
  const links = [
    { id: 'company', label: 'Empresa', path: '/company/' },
    { id: 'services', label: 'Servicios', path: '/services/' },
    { id: 'apps', label: 'Aplicaciones', path: '/apps/' },
    { id: 'security', label: 'Seguridad', path: '/security/' },
    { id: 'news', label: 'Noticias', path: '/news/' },
  ];

  const activeRoot = currentRoute?.id.startsWith('app-') ? 'apps' : currentRoute?.id;

  return (
    <nav className="site-nav" aria-label="Navegación principal">
      {links.map((link) => (
        <a
          key={link.id}
          href={siteHref(link.path)}
          aria-current={activeRoot === link.id ? 'page' : undefined}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}

export function SiteLayout({
  currentRoute,
  children,
}: {
  currentRoute: CorporateRoute | null;
  children: ReactNode;
}) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="site-header__brand" href={siteHref('/')} aria-label="Ir al inicio"><BrandMark /></a>
        <HeaderNav currentRoute={currentRoute} />
        <a className="button button--primary button--header" href={siteHref('/contact/')}>Contacto</a>
      </header>

      {children}

      <footer className="site-footer">
        <div className="site-footer__lead">
          <BrandMark />
          <h2>Infraestructura digital para coordinar comercio y movimiento.</h2>
          <p>La web informa y orienta. Las operaciones ocurrirán en aplicaciones especializadas.</p>
        </div>

        <div className="site-footer__links">
          <div><strong>Organización</strong><a href={siteHref('/company/')}>Empresa</a><a href={siteHref('/services/')}>Servicios</a><a href={siteHref('/news/')}>Noticias</a></div>
          <div><strong>Aplicaciones</strong><a href={appRoute('customer')}>Customer</a><a href={appRoute('business')}>Business</a><a href={appRoute('rider')}>Rider</a><a href={appRoute('control')}>Control</a></div>
          <div><strong>Confianza</strong><a href={siteHref('/security/')}>Seguridad</a><a href={siteHref('/contact/')}>Contacto</a></div>
        </div>

        <div className="site-footer__bottom">
          <span>© DELIVER ASSETS</span>
          <span>Aplicaciones en desarrollo · distribución oficial aún no abierta</span>
        </div>
      </footer>
    </div>
  );
}

export function NetworkScene() {
  return (
    <div className="network-scene" aria-label="Recorrido conceptual entre Customer, Business, Rider y Control">
      <div className="network-scene__grid" aria-hidden="true" />
      <div className="network-scene__route" aria-hidden="true"><span /></div>
      <div className="network-scene__core"><strong>DELIVER</strong><small>CORE</small></div>
      <a className="network-node network-node--customer" href={appRoute('customer')}><i /><span><strong>Customer</strong><small>Solicita</small></span></a>
      <a className="network-node network-node--business" href={appRoute('business')}><i /><span><strong>Business</strong><small>Prepara</small></span></a>
      <a className="network-node network-node--rider" href={appRoute('rider')}><i /><span><strong>Rider</strong><small>Mueve</small></span></a>
      <a className="network-node network-node--control" href={appRoute('control')}><i /><span><strong>Control</strong><small>Supervisa</small></span></a>
    </div>
  );
}

function CustomerVisual() {
  return (
    <div className="product-visual product-visual--phone product-visual--customer" aria-label="Vista conceptual de DELIVER Customer">
      <div className="phone-shell">
        <div className="phone-status"><span>09:41</span><span>● ●</span></div>
        <div className="phone-heading"><strong>Descubre</strong><span className="avatar-dot" /></div>
        <div className="search-field">Buscar comercios o productos</div>
        <div className="category-row"><span>Restaurantes</span><span>Mercado</span><span>Farmacia</span></div>
        <article className="merchant-card"><div className="merchant-card__image" /><div><strong>Comercio local</strong><small>Productos disponibles</small></div><span>→</span></article>
        <div className="tracking-card"><div><small>OPERACIÓN ACTIVA</small><strong>En camino</strong></div><div className="tracking-line"><i /><i /><i /></div></div>
        <div className="mobile-tabs" aria-hidden="true"><b>Inicio</b><span>Pedidos</span><span>Enviar</span><span>Cuenta</span></div>
      </div>
    </div>
  );
}

function BusinessVisual() {
  return (
    <div className="product-visual product-visual--desktop product-visual--business" aria-label="Vista conceptual de DELIVER Business">
      <div className="desktop-window">
        <aside className="desktop-sidebar"><strong>DELIVER</strong><b>Resumen</b><span>Pedidos</span><span>Catálogo</span><span>Equipo</span></aside>
        <div className="desktop-content">
          <div className="desktop-title"><div><small>OPERACIÓN</small><strong>Pedidos entrantes</strong></div><StatusBadge>En preparación</StatusBadge></div>
          <div className="metric-strip"><span><small>Nuevos</small><strong>01</strong></span><span><small>Preparando</small><strong>02</strong></span><span><small>Listos</small><strong>01</strong></span></div>
          <div className="order-board"><section><h4>Por iniciar</h4><article><strong>Pedido conceptual</strong><small>Productos y notas</small></article></section><section><h4>Preparando</h4><article><strong>Pedido conceptual</strong><small>Responsable visible</small></article></section><section><h4>Listo</h4><article><strong>Pedido conceptual</strong><small>Esperando recogida</small></article></section></div>
        </div>
      </div>
    </div>
  );
}

function RiderVisual() {
  return (
    <div className="product-visual product-visual--phone product-visual--rider" aria-label="Vista conceptual de DELIVER Rider">
      <div className="phone-shell">
        <div className="phone-status"><span>09:41</span><span>● ●</span></div>
        <div className="phone-heading"><strong>Ruta activa</strong><StatusBadge>En curso</StatusBadge></div>
        <div className="route-map"><span className="map-block map-block--one" /><span className="map-block map-block--two" /><span className="map-block map-block--three" /><span className="map-block map-block--four" /><span className="route-path" /><i className="route-point route-point--start" /><i className="route-point route-point--end" /></div>
        <article className="next-stop"><small>SIGUIENTE PARADA</small><strong>Punto de recogida</strong><span>Instrucciones disponibles</span></article>
        <div className="concept-button">Llegué al punto</div>
        <div className="mobile-tabs" aria-hidden="true"><b>Ruta</b><span>Tareas</span><span>Ayuda</span><span>Cuenta</span></div>
      </div>
    </div>
  );
}

function ControlVisual() {
  return (
    <div className="product-visual product-visual--desktop product-visual--control" aria-label="Vista conceptual de DELIVER Control">
      <div className="desktop-window desktop-window--dark">
        <aside className="desktop-sidebar"><strong>DELIVER</strong><b>Operación</b><span>Alertas</span><span>Incidencias</span><span>Auditoría</span></aside>
        <div className="desktop-content">
          <div className="desktop-title"><div><small>SUPERVISIÓN</small><strong>Operación general</strong></div><StatusBadge>Acceso administrado</StatusBadge></div>
          <div className="control-layout"><div className="control-map"><span /><span /><span /><span /><span /></div><div className="alert-stack"><article><i className="alert-dot alert-dot--red" /><div><strong>Revisión necesaria</strong><small>Contexto y responsable</small></div></article><article><i className="alert-dot alert-dot--yellow" /><div><strong>Seguimiento</strong><small>Siguiente acción visible</small></div></article><article><i className="alert-dot alert-dot--green" /><div><strong>Resuelta</strong><small>Evidencia conservada</small></div></article></div></div>
        </div>
      </div>
    </div>
  );
}

export function ProductVisual({ id }: { id: AppId }) {
  if (id === 'customer') return <CustomerVisual />;
  if (id === 'business') return <BusinessVisual />;
  if (id === 'rider') return <RiderVisual />;
  return <ControlVisual />;
}

export function ApplicationCard({ id }: { id: AppId }) {
  const product = products[id];
  return (
    <a className={`application-card application-card--${id}`} href={appRoute(id)} data-reveal="up">
      <div><p className="eyebrow">{product.label}</p><h3>{product.name}</h3><p>{product.summary}</p></div>
      <div className="application-card__footer"><StatusBadge>{product.releaseLabel}</StatusBadge><span>Conocer la aplicación →</span></div>
    </a>
  );
}
