import { StrictMode, useEffect, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type AppId = 'customer' | 'business' | 'rider' | 'control';
type Availability = 'Próximamente' | 'Acceso administrado';

type Platform = {
  name: string;
  use: string;
  availability: Availability;
};

type Product = {
  id: AppId;
  name: string;
  label: string;
  headline: string;
  summary: string;
  audience: string;
  releaseLabel: Availability;
  capabilities: string[];
  steps: Array<{ title: string; text: string }>;
  platforms: Platform[];
  accessNote: string;
  faqs: Array<{ question: string; answer: string }>;
};

const products: Record<AppId, Product> = {
  customer: {
    id: 'customer',
    name: 'DELIVER Customer',
    label: 'PARA PERSONAS',
    headline: 'Compra, envía y sigue todo desde una sola cuenta.',
    summary:
      'Descubre comercios, solicita entregas, envía paquetes y consulta cada avance desde una experiencia diseñada para móvil y escritorio.',
    audience: 'Personas que compran, reciben o envían productos y paquetes.',
    releaseLabel: 'Próximamente',
    capabilities: [
      'Explorar comercios y categorías',
      'Crear pedidos y envíos',
      'Seguir cada operación',
      'Gestionar direcciones',
      'Consultar historial y comprobantes',
      'Resolver dudas e incidencias',
    ],
    steps: [
      { title: 'Descubre', text: 'Encuentra un comercio o selecciona la opción para enviar un paquete.' },
      { title: 'Configura', text: 'Define productos, dirección, horario e instrucciones necesarias.' },
      { title: 'Confirma', text: 'Revisa el resumen antes de continuar con la operación.' },
      { title: 'Sigue', text: 'Consulta estados, actualizaciones y soporte desde la aplicación.' },
    ],
    platforms: [
      { name: 'Android', use: 'Compras, envíos y seguimiento móvil', availability: 'Próximamente' },
      { name: 'iPhone y iPad', use: 'Compras, envíos y seguimiento móvil', availability: 'Próximamente' },
      { name: 'Windows', use: 'Operación y seguimiento en escritorio', availability: 'Próximamente' },
      { name: 'macOS', use: 'Operación y seguimiento en escritorio', availability: 'Próximamente' },
      { name: 'Linux', use: 'Operación y seguimiento en escritorio', availability: 'Próximamente' },
    ],
    accessNote: 'La publicación se realizará por etapas cuando cada cliente supere validación, firma y distribución oficial.',
    faqs: [
      {
        question: '¿Se podrá comprar desde la web corporativa?',
        answer: 'La web presenta el servicio y dirige a DELIVER Customer. Las compras, los envíos y el seguimiento se realizarán dentro de la aplicación.',
      },
      {
        question: '¿La misma cuenta funcionará en móvil y escritorio?',
        answer: 'La experiencia está diseñada para conservar cuenta, historial y operaciones entre dispositivos compatibles.',
      },
      {
        question: '¿Cuándo estará disponible?',
        answer: 'La fecha se comunicará cuando existan versiones verificadas y canales oficiales de distribución.',
      },
    ],
  },
  business: {
    id: 'business',
    name: 'DELIVER Business',
    label: 'PARA COMERCIOS',
    headline: 'Tu catálogo, tus pedidos y tu operación en un solo lugar.',
    summary:
      'Organiza sucursales, prepara pedidos, coordina entregas y mantiene visible la responsabilidad de cada equipo.',
    audience: 'Comercios, sucursales, operadores y equipos de atención.',
    releaseLabel: 'Próximamente',
    capabilities: [
      'Catálogo y disponibilidad',
      'Recepción y preparación de pedidos',
      'Sucursales, usuarios y permisos',
      'Coordinación de entregas',
      'Incidencias y soporte',
      'Reportes para la operación',
    ],
    steps: [
      { title: 'Registra', text: 'Completa el alta de la organización y la validación comercial.' },
      { title: 'Configura', text: 'Define sucursales, catálogo, permisos y reglas de atención.' },
      { title: 'Prepara', text: 'Recibe pedidos y coordina el trabajo de cada equipo.' },
      { title: 'Entrega', text: 'Conecta la preparación con logística y conserva trazabilidad.' },
    ],
    platforms: [
      { name: 'Windows', use: 'Superficie principal para la operación', availability: 'Próximamente' },
      { name: 'macOS', use: 'Superficie principal para la operación', availability: 'Próximamente' },
      { name: 'Linux', use: 'Superficie principal para la operación', availability: 'Próximamente' },
      { name: 'Android', use: 'Acciones rápidas y notificaciones', availability: 'Próximamente' },
      { name: 'iPhone y iPad', use: 'Acciones rápidas y notificaciones', availability: 'Próximamente' },
    ],
    accessNote: 'El alta comercial se habilitará junto con los primeros canales oficiales de distribución.',
    faqs: [
      {
        question: '¿Business será únicamente móvil?',
        answer: 'No. La experiencia principal está diseñada para escritorio; el móvil complementará alertas y acciones rápidas.',
      },
      {
        question: '¿Admitirá varias sucursales y usuarios?',
        answer: 'La arquitectura contempla organizaciones, sucursales, permisos y trazabilidad por usuario.',
      },
      {
        question: '¿Ya puedo registrar mi negocio?',
        answer: 'El registro se abrirá cuando el proceso comercial, la validación y el soporte estén operativos.',
      },
    ],
  },
  rider: {
    id: 'rider',
    name: 'DELIVER Rider',
    label: 'PARA OPERADORES EN CAMPO',
    headline: 'Cada ruta, cada evidencia y cada siguiente acción.',
    summary:
      'Recibe asignaciones, navega, registra transiciones y resuelve incidencias desde una aplicación móvil especializada.',
    audience: 'Riders, conductores y operadores autorizados de recogida y entrega.',
    releaseLabel: 'Próximamente',
    capabilities: [
      'Recepción de asignaciones',
      'Navegación y paradas',
      'Estados de recogida y entrega',
      'Evidencia autorizada',
      'Gestión de incidencias',
      'Continuidad con conectividad limitada',
    ],
    steps: [
      { title: 'Valida', text: 'Completa el proceso de autorización y activa tu acceso.' },
      { title: 'Prepara', text: 'Configura permisos, disponibilidad y condiciones del dispositivo.' },
      { title: 'Ejecuta', text: 'Recibe una asignación y registra cada cambio de estado.' },
      { title: 'Cierra', text: 'Confirma la entrega o escala una incidencia con evidencia.' },
    ],
    platforms: [
      { name: 'Android', use: 'Plataforma móvil prioritaria', availability: 'Próximamente' },
      { name: 'iPhone', use: 'Plataforma móvil complementaria', availability: 'Próximamente' },
    ],
    accessNote: 'La descarga podrá ser pública, pero operar exigirá autorización e identidad verificadas.',
    faqs: [
      {
        question: '¿Existirá una versión para escritorio?',
        answer: 'No está prevista para la primera etapa porque la operación depende de ubicación, cámara y notificaciones móviles.',
      },
      {
        question: '¿Descargar la aplicación será suficiente para operar?',
        answer: 'No. El acceso operativo requerirá autorización, identidad y permisos correspondientes.',
      },
      {
        question: '¿Funcionará con conectividad limitada?',
        answer: 'La continuidad controlada forma parte del diseño y se validará antes de la publicación.',
      },
    ],
  },
  control: {
    id: 'control',
    name: 'DELIVER Control',
    label: 'PARA OPERACIÓN AUTORIZADA',
    headline: 'Supervisión y respuesta con permisos, contexto y trazabilidad.',
    summary:
      'Observa operaciones, atiende incidencias y conserva evidencia de decisiones sensibles desde una superficie institucional restringida.',
    audience: 'Equipos internos y organizaciones expresamente autorizadas.',
    releaseLabel: 'Acceso administrado',
    capabilities: [
      'Supervisión operacional',
      'Gestión de incidencias',
      'Auditoría y trazabilidad',
      'Gestión de riesgo',
      'Soporte y escalamiento',
      'Configuración restringida',
    ],
    steps: [
      { title: 'Invita', text: 'Una organización autorizada asigna acceso a un usuario.' },
      { title: 'Verifica', text: 'Se validan identidad, rol y dispositivo.' },
      { title: 'Supervisa', text: 'El operador accede únicamente a las funciones permitidas.' },
      { title: 'Audita', text: 'Las decisiones críticas conservan contexto y evidencia.' },
    ],
    platforms: [
      { name: 'Escritorio autorizado', use: 'Distribución administrada por organización', availability: 'Acceso administrado' },
      { name: 'Navegador interno', use: 'Acceso protegido cuando sea necesario', availability: 'Acceso administrado' },
    ],
    accessNote: 'Control no tendrá una descarga pública abierta. El acceso dependerá de organización, rol y dispositivo aprobados.',
    faqs: [
      {
        question: '¿Por qué Control no tiene descarga pública?',
        answer: 'Porque reúne funciones sensibles y necesita gobierno de acceso, auditoría y dispositivos autorizados.',
      },
      {
        question: '¿Será una aplicación móvil?',
        answer: 'No es la prioridad. La superficie principal está planteada para escritorio o acceso web interno protegido.',
      },
      {
        question: '¿Cómo se concederá acceso?',
        answer: 'Mediante una organización autorizada y controles de identidad, rol y dispositivo.',
      },
    ],
  },
};

const productIds = Object.keys(products) as AppId[];

function getSelectedProduct(): Product | null {
  const requested = new URLSearchParams(window.location.search).get('app');
  return productIds.includes(requested as AppId) ? products[requested as AppId] : null;
}

function useRevealAnimations() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.documentElement.classList.add('motion-ready');

    if (reduceMotion || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return () => document.documentElement.classList.remove('motion-ready');
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove('motion-ready');
    };
  }, []);
}

function usePageMetadata(product: Product | null) {
  useEffect(() => {
    const title = product
      ? `${product.name} — DELIVER ASSETS`
      : 'DELIVER ASSETS — Comercio, delivery y paquetería';
    const description = product
      ? product.summary
      : 'Una red de aplicaciones para personas, comercios, operadores y equipos autorizados.';

    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
  }, [product]);
}

function BrandMark() {
  return (
    <span className="brand-mark" aria-label="DELIVER ASSETS">
      <span className="brand-mark__symbol" aria-hidden="true" />
      <span className="brand-mark__wordmark"><strong>DELIVER</strong><span>ASSETS</span></span>
    </span>
  );
}

function SiteHeader() {
  return (
    <header className="site-header">
      <a className="site-header__brand" href="./" aria-label="Ir al inicio"><BrandMark /></a>
      <nav className="site-nav" aria-label="Navegación principal">
        <a href="./#journey">Cómo funciona</a>
        <a href="./#difference">Diferencia</a>
        <a href="./#use-cases">Casos de uso</a>
        <a href="./#applications">Aplicaciones</a>
        <a href="./#trust">Confianza</a>
      </nav>
      <a className="button button--primary button--header" href="./#applications">Explorar aplicaciones</a>
    </header>
  );
}

function StatusBadge({ children }: { children: ReactNode }) {
  return <span className="status-badge">{children}</span>;
}

function HeroCityScene() {
  return (
    <div className="city-scene hero-entrance hero-entrance--visual" aria-label="Una operación conectada entre las cuatro aplicaciones">
      <div className="city-scene__grid" aria-hidden="true" />
      <div className="city-scene__road city-scene__road--vertical" aria-hidden="true" />
      <div className="city-scene__road city-scene__road--horizontal" aria-hidden="true" />
      <div className="city-scene__core"><strong>DELIVER</strong><small>CORE</small></div>
      <span className="city-scene__packet" aria-hidden="true">→</span>
      <a className="city-node city-node--customer" href="?app=customer">
        <span className="city-node__icon city-node__icon--blue" aria-hidden="true" />
        <span><strong>Customer</strong><small>Solicitud creada</small></span>
      </a>
      <a className="city-node city-node--business" href="?app=business">
        <span className="city-node__icon city-node__icon--yellow" aria-hidden="true" />
        <span><strong>Business</strong><small>Pedido confirmado</small></span>
      </a>
      <a className="city-node city-node--rider" href="?app=rider">
        <span className="city-node__icon city-node__icon--red" aria-hidden="true" />
        <span><strong>Rider</strong><small>Ruta en curso</small></span>
      </a>
      <a className="city-node city-node--control" href="?app=control">
        <span className="city-node__icon city-node__icon--ink" aria-hidden="true" />
        <span><strong>Control</strong><small>Operación visible</small></span>
      </a>
    </div>
  );
}

const journeyStages = [
  { number: '01', app: 'Customer', verb: 'Solicita', text: 'Elige un comercio o crea un envío.', tone: 'blue' },
  { number: '02', app: 'Business', verb: 'Prepara', text: 'Confirma disponibilidad y organiza la entrega.', tone: 'yellow' },
  { number: '03', app: 'Rider', verb: 'Mueve', text: 'Recoge, navega y registra el avance.', tone: 'red' },
  { number: '04', app: 'Control', verb: 'Supervisa', text: 'Atiende excepciones y conserva trazabilidad.', tone: 'ink' },
] as const;

const differences = [
  { title: 'Una cuenta', text: 'Historial, preferencias y operaciones conectadas.' },
  { title: 'Una red', text: 'Personas, comercios y operadores coordinados.' },
  { title: 'Varios movimientos', text: 'Productos, pedidos y paquetes dentro del mismo ecosistema.' },
  { title: 'Apps especializadas', text: 'Cada función recibe las herramientas que necesita.' },
];

const useCases = [
  { title: 'Compra local', text: 'Descubre comercios y recibe productos.', tone: 'blue' },
  { title: 'Envío urbano', text: 'Mueve un paquete entre dos puntos.', tone: 'yellow' },
  { title: 'Operación comercial', text: 'Coordina catálogo, preparación y entrega.', tone: 'red' },
  { title: 'Excepciones visibles', text: 'Escala incidencias sin perder contexto.', tone: 'ink' },
] as const;

function CustomerVisual() {
  return (
    <div className="product-visual product-visual--phone product-visual--customer" aria-label="Vista conceptual de DELIVER Customer">
      <div className="phone-shell">
        <div className="phone-status"><span>09:41</span><span>● ●</span></div>
        <div className="phone-heading"><strong>Descubre</strong><span className="avatar-dot" /></div>
        <div className="search-field">Buscar comercios o productos</div>
        <div className="category-row"><span>Restaurantes</span><span>Mercado</span><span>Farmacia</span></div>
        <article className="merchant-card">
          <div className="merchant-card__image" />
          <div><strong>Comercio local</strong><small>Productos disponibles</small></div>
          <span>→</span>
        </article>
        <div className="tracking-card">
          <div><small>OPERACIÓN ACTIVA</small><strong>En camino</strong></div>
          <div className="tracking-line"><i /><i /><i /></div>
        </div>
        <nav className="mobile-tabs" aria-label="Navegación conceptual"><b>Inicio</b><span>Pedidos</span><span>Enviar</span><span>Cuenta</span></nav>
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
          <div className="order-board">
            <section><h4>Por iniciar</h4><article><strong>Pedido conceptual</strong><small>Productos y notas</small></article></section>
            <section><h4>Preparando</h4><article><strong>Pedido conceptual</strong><small>Responsable visible</small></article></section>
            <section><h4>Listo</h4><article><strong>Pedido conceptual</strong><small>Esperando recogida</small></article></section>
          </div>
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
        <div className="route-map">
          <span className="map-block map-block--one" /><span className="map-block map-block--two" />
          <span className="map-block map-block--three" /><span className="map-block map-block--four" />
          <span className="route-path" /><i className="route-point route-point--start" /><i className="route-point route-point--end" />
        </div>
        <article className="next-stop"><small>SIGUIENTE PARADA</small><strong>Punto de recogida</strong><span>Instrucciones disponibles</span></article>
        <button type="button" className="concept-button" tabIndex={-1}>Llegué al punto</button>
        <nav className="mobile-tabs" aria-label="Navegación conceptual"><b>Ruta</b><span>Tareas</span><span>Ayuda</span><span>Cuenta</span></nav>
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
          <div className="control-layout">
            <div className="control-map"><span /><span /><span /><span /><span /></div>
            <div className="alert-stack"><article><i className="alert-dot alert-dot--red" /><div><strong>Revisión necesaria</strong><small>Contexto y responsable</small></div></article><article><i className="alert-dot alert-dot--yellow" /><div><strong>Seguimiento</strong><small>Siguiente acción visible</small></div></article><article><i className="alert-dot alert-dot--green" /><div><strong>Resuelta</strong><small>Evidencia conservada</small></div></article></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductVisual({ id }: { id: AppId }) {
  if (id === 'customer') return <CustomerVisual />;
  if (id === 'business') return <BusinessVisual />;
  if (id === 'rider') return <RiderVisual />;
  return <ControlVisual />;
}

function ApplicationLink({ product }: { product: Product }) {
  return (
    <a className={`application-link application-link--${product.id}`} href={`?app=${product.id}`} data-reveal="up">
      <div><p className="eyebrow">{product.label}</p><h3>{product.name}</h3><p>{product.summary}</p></div>
      <div className="application-link__footer"><StatusBadge>{product.releaseLabel}</StatusBadge><span>Conocer la aplicación →</span></div>
    </a>
  );
}

function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="hero__content hero-entrance">
          <p className="eyebrow">COMERCIO · DELIVERY · PAQUETERÍA</p>
          <h1>Mover la ciudad.<span>Una red visible.</span></h1>
          <p className="hero__lead">Personas, comercios y operadores conectados por aplicaciones especializadas que comparten el mismo recorrido.</p>
          <div className="hero__actions"><a className="button button--primary" href="#applications">Conocer aplicaciones</a><a className="button button--secondary" href="#journey">Cómo funciona</a></div>
          <p className="hero__status">Las aplicaciones se publicarán por plataforma cuando existan versiones verificadas y canales oficiales.</p>
        </div>
        <HeroCityScene />
      </section>

      <section className="journey-section" id="journey">
        <div className="section-heading section-heading--light" data-reveal="up">
          <p className="eyebrow eyebrow--light">UNA OPERACIÓN · CUATRO RESPONSABILIDADES</p>
          <h2>La red se entiende cuando el pedido avanza.</h2>
          <p>Cada aplicación ve la parte que necesita y conserva el contexto de toda la operación.</p>
        </div>
        <div className="journey-route" aria-hidden="true"><span /></div>
        <ol className="journey-grid">
          {journeyStages.map((stage) => (
            <li className={`journey-card journey-card--${stage.tone}`} key={stage.app} data-reveal="up">
              <span className="journey-card__number">{stage.number}</span><h3>{stage.app}</h3><strong>{stage.verb}</strong><p>{stage.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="difference-section" id="difference">
        <div className="section-heading" data-reveal="up">
          <p className="eyebrow">QUÉ HACE DIFERENTE A DELIVER ASSETS</p>
          <h2><span>No es solo pedir comida.</span> Es una red para mover comercio, entregas y paquetes.</h2>
        </div>
        <div className="difference-grid">
          {differences.map((item, index) => <article key={item.title} data-reveal="up"><span>{String(index + 1).padStart(2, '0')}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}
        </div>
      </section>

      <section className="use-cases-section" id="use-cases">
        <div className="section-heading" data-reveal="up"><p className="eyebrow">CASOS DE USO</p><h2>La ciudad no se mueve de una sola manera.</h2></div>
        <div className="use-case-grid">
          {useCases.map((item) => <article key={item.title} data-reveal="up"><span className={`use-case-icon use-case-icon--${item.tone}`} aria-hidden="true" /><h3>{item.title}</h3><p>{item.text}</p></article>)}
        </div>
      </section>

      <section className="showcase-section" id="applications">
        <div className="section-heading section-heading--light" data-reveal="up"><p className="eyebrow eyebrow--light">LAS APLICACIONES</p><h2>Diseñadas para verse distintas y trabajar juntas.</h2><p>Estas vistas explican el alcance previsto de cada superficie. No representan datos ni operaciones reales.</p></div>
        <div className="showcase-stack">
          {productIds.map((id, index) => {
            const product = products[id];
            return (
              <article className={`showcase-item showcase-item--${id} ${index % 2 ? 'showcase-item--reverse' : ''}`} key={id} data-reveal="up">
                <div className="showcase-copy"><p className="eyebrow">{product.label}</p><div className="showcase-title"><h3>{product.name}</h3><StatusBadge>{product.releaseLabel}</StatusBadge></div><h4>{product.headline}</h4><p>{product.summary}</p><a className="text-link" href={`?app=${id}`}>Explorar {product.name} <span aria-hidden="true">→</span></a></div>
                <ProductVisual id={id} />
              </article>
            );
          })}
        </div>
      </section>

      <section className="application-index">
        <div className="section-heading" data-reveal="up"><p className="eyebrow">ECOSISTEMA</p><h2>Elige la aplicación correspondiente a tu función.</h2></div>
        <div className="application-index__grid">{productIds.map((id) => <ApplicationLink product={products[id]} key={id} />)}</div>
      </section>

      <section className="trust-section" id="trust">
        <div data-reveal="left"><p className="eyebrow">CONFIANZA</p><h2>La operación correcta empieza por límites claros.</h2></div>
        <div className="trust-list">
          <article data-reveal="up"><strong>Acceso por función.</strong><p>Cada aplicación expone únicamente las capacidades correspondientes a su usuario.</p></article>
          <article data-reveal="up"><strong>Datos necesarios.</strong><p>Ubicación, pagos y evidencias se solicitarán solo dentro del flujo y la aplicación adecuados.</p></article>
          <article data-reveal="up"><strong>Trazabilidad.</strong><p>Los cambios críticos conservarán contexto, responsabilidad y evidencia verificable.</p></article>
        </div>
      </section>

      <section className="company-section" id="company" data-reveal="up"><p className="eyebrow eyebrow--light">DELIVER ASSETS</p><h2>Infraestructura digital para coordinar comercio y movimiento.</h2><p>Aplicaciones especializadas. Una operación conectada.</p><a className="button button--light" href="#applications">Explorar el ecosistema</a></section>
    </main>
  );
}

function PlatformCard({ platform }: { platform: Platform }) {
  return <article className="platform-card" data-reveal="up"><div><h3>{platform.name}</h3><p>{platform.use}</p></div><StatusBadge>{platform.availability}</StatusBadge></article>;
}

function ProductPage({ product }: { product: Product }) {
  return (
    <main className={`product-page product-page--${product.id}`}>
      <section className="product-hero">
        <div className="product-hero__copy hero-entrance"><a className="back-link" href="./#applications">← Todas las aplicaciones</a><div className="product-hero__topline"><p className="eyebrow">{product.label}</p><StatusBadge>{product.releaseLabel}</StatusBadge></div><h1>{product.name}</h1><h2>{product.headline}</h2><p>{product.summary}</p><div className="hero__actions"><a className="button button--primary" href="#platforms">Ver plataformas</a><a className="button button--secondary" href="#how-it-works">Cómo funciona</a></div><p className="availability-callout"><strong>{product.releaseLabel}.</strong> {product.accessNote}</p></div>
        <div className="product-hero__visual hero-entrance hero-entrance--visual"><ProductVisual id={product.id} /></div>
      </section>

      <section className="audience-band" data-reveal="up"><span>Diseñada para</span><strong>{product.audience}</strong></section>

      <section className="section-block"><div className="section-heading" data-reveal="up"><p className="eyebrow">CAPACIDADES</p><h2>Todo lo necesario para cumplir una función con claridad.</h2></div><div className="capability-grid">{product.capabilities.map((capability, index) => <article key={capability} data-reveal="up"><span>{String(index + 1).padStart(2, '0')}</span><h3>{capability}</h3></article>)}</div></section>

      <section className="steps-section" id="how-it-works"><div className="section-heading section-heading--light" data-reveal="left"><p className="eyebrow eyebrow--light">CÓMO FUNCIONA</p><h2>Una secuencia clara desde el acceso hasta el cierre.</h2></div><ol>{product.steps.map((step, index) => <li key={step.title} data-reveal="up"><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{step.title}</strong><p>{step.text}</p></div></li>)}</ol></section>

      <section className="section-block" id="platforms"><div className="section-heading" data-reveal="up"><p className="eyebrow">PLATAFORMAS</p><h2>La experiencia adecuada para cada dispositivo.</h2><p>Los enlaces oficiales aparecerán cuando cada versión esté publicada y verificada.</p></div><div className="platform-grid">{product.platforms.map((platform) => <PlatformCard platform={platform} key={platform.name} />)}</div></section>

      <section className="faq-section"><div className="section-heading" data-reveal="up"><p className="eyebrow">PREGUNTAS FRECUENTES</p><h2>Disponibilidad, acceso y plataformas.</h2></div><div className="faq-list">{product.faqs.map((faq) => <details key={faq.question} data-reveal="up"><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></section>

      <section className="other-products"><p className="eyebrow" data-reveal="up">OTRAS APLICACIONES</p><div>{productIds.filter((id) => id !== product.id).map((id) => <a key={id} href={`?app=${id}`} data-reveal="up"><span>{products[id].label}</span><strong>{products[id].name}</strong></a>)}</div></section>
    </main>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__lead"><BrandMark /><h2>Infraestructura digital para coordinar comercio y movimiento.</h2><p>Aplicaciones especializadas. Una operación conectada.</p></div>
      <div className="site-footer__columns">
        <nav aria-label="Aplicaciones"><strong>Aplicaciones</strong><a href="?app=customer">Customer</a><a href="?app=business">Business</a><a href="?app=rider">Rider</a><a href="?app=control">Control</a></nav>
        <nav aria-label="Información"><strong>Información</strong><a href="./#journey">Cómo funciona</a><a href="./#use-cases">Casos de uso</a><a href="./#trust">Confianza</a><a href="./#company">Empresa</a></nav>
        <div><strong>Disponibilidad</strong><span>Aplicaciones por etapas</span><span>Canales oficiales al publicarse</span><span>Control con acceso administrado</span></div>
      </div>
      <div className="site-footer__bottom"><span>© DELIVER ASSETS</span><span>Comercio · delivery · paquetería</span></div>
    </footer>
  );
}

function App() {
  const selectedProduct = getSelectedProduct();
  useRevealAnimations();
  usePageMetadata(selectedProduct);

  return <div className="site-shell"><SiteHeader />{selectedProduct ? <ProductPage product={selectedProduct} /> : <HomePage />}<SiteFooter /></div>;
}

const root = document.getElementById('root');
if (!root) throw new Error('No se encontró el nodo raíz de la aplicación.');
createRoot(root).render(<StrictMode><App /></StrictMode>);
