import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { appRoute, assetHref, products, siteHref, type AppId, type CorporateRoute } from './site';

export function BrandMark() {
  return (
    <span className="brand-mark" aria-label="DELIVER ASSETS">
      <img
        className="brand-mark__symbol"
        src={assetHref('brand/deliver-assets-mark.png')}
        width="96"
        height="73"
        alt=""
        aria-hidden="true"
      />
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

const headerLinks = [
  { id: 'company', label: 'Empresa', path: '/company/' },
  { id: 'services', label: 'Servicios', path: '/services/' },
  { id: 'apps', label: 'Aplicaciones', path: '/apps/' },
  { id: 'security', label: 'Seguridad', path: '/security/' },
  { id: 'news', label: 'Noticias', path: '/news/' },
  { id: 'contact', label: 'Contacto', path: '/contact/' },
] as const;

function HeaderNav({
  currentRoute,
  navRef,
  onNavigate,
}: {
  currentRoute: CorporateRoute | null;
  navRef: RefObject<HTMLElement | null>;
  onNavigate: () => void;
}) {
  const activeRoot = currentRoute?.id.startsWith('app-') ? 'apps' : currentRoute?.id;

  return (
    <nav id="site-navigation" ref={navRef} className="site-nav" aria-label="Navegación principal">
      {headerLinks.map((link) => (
        <a
          key={link.id}
          className={link.id === 'contact' ? 'site-nav__contact' : undefined}
          href={siteHref(link.path)}
          aria-current={activeRoot === link.id ? 'page' : undefined}
          onClick={onNavigate}
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  const closeMobileMenu = (restoreFocus = false) => {
    setMobileMenuOpen(false);
    if (restoreFocus) window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  };

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const links = Array.from(navRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? []);
    const focusableElements = [menuButtonRef.current, ...links].filter(
      (element): element is HTMLButtonElement | HTMLAnchorElement => element !== null,
    );
    const firstLink = links[0];
    const focusFrame = window.requestAnimationFrame(() => firstLink?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMobileMenu(true);
        return;
      }

      if (event.key !== 'Tab' || focusableElements.length === 0) return;

      const firstElement = focusableElements.at(0);
      const lastElement = focusableElements.at(-1);
      if (!firstElement || !lastElement) return;
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.documentElement.classList.add('mobile-nav-open');
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.documentElement.classList.remove('mobile-nav-open');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 821px)');
    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileMenuOpen(false);
    };

    desktopQuery.addEventListener('change', handleDesktopChange);
    return () => desktopQuery.removeEventListener('change', handleDesktopChange);
  }, []);

  return (
    <div className="site-shell">
      <header className="site-header" data-mobile-menu-open={mobileMenuOpen ? 'true' : 'false'}>
        <a className="site-header__brand" href={siteHref('/')} aria-label="Ir al inicio"><BrandMark /></a>
        <button
          ref={menuButtonRef}
          className="mobile-nav-toggle"
          type="button"
          aria-controls="site-navigation"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span>{mobileMenuOpen ? 'Cerrar' : 'Menú'}</span>
          <span className="mobile-nav-toggle__icon" aria-hidden="true"><i /><i /></span>
        </button>
        <HeaderNav currentRoute={currentRoute} navRef={navRef} onNavigate={() => setMobileMenuOpen(false)} />
        <a
          className="button button--primary button--header"
          href={siteHref('/contact/')}
          aria-current={currentRoute?.id === 'contact' ? 'page' : undefined}
        >
          Contacto
        </a>
      </header>

      {mobileMenuOpen ? (
        <button
          className="mobile-nav-scrim"
          type="button"
          tabIndex={-1}
          aria-label="Cerrar menú de navegación"
          onClick={() => closeMobileMenu(true)}
        />
      ) : null}

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

export function EditorialNetwork() {
  const steps = [
    { id: 'customer', index: '01', role: 'Customer', action: 'Solicita' },
    { id: 'business', index: '02', role: 'Business', action: 'Prepara' },
    { id: 'rider', index: '03', role: 'Rider', action: 'Mueve' },
    { id: 'control', index: '04', role: 'Control', action: 'Supervisa' },
  ] as const;

  return (
    <figure className="editorial-network hero-entrance hero-entrance--visual" aria-labelledby="editorial-network-caption">
      <div className="editorial-network__art">
        <img src={assetHref('brand/city-network.svg')} alt="" aria-hidden="true" />
      </div>
      <figcaption className="editorial-network__legend" id="editorial-network-caption">
        {steps.map((step) => (
          <a key={step.id} href={appRoute(step.id)}>
            <span>{step.index}</span><strong>{step.role}</strong><small>{step.action}</small>
          </a>
        ))}
      </figcaption>
    </figure>
  );
}

function CustomerVisual() {
  return (
    <div className="product-visual product-visual--phone product-visual--customer" role="img" aria-label="Vista conceptual de DELIVER Customer">
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
    <div className="product-visual product-visual--desktop product-visual--business" role="img" aria-label="Vista conceptual de DELIVER Business">
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
    <div className="product-visual product-visual--phone product-visual--rider" role="img" aria-label="Vista conceptual de DELIVER Rider">
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
    <div className="product-visual product-visual--desktop product-visual--control" role="img" aria-label="Vista conceptual de DELIVER Control">
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
