import { StrictMode, useEffect, useState, type ComponentType, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const viewIds = ['corporate', 'customer', 'business', 'rider', 'control'] as const;
type ViewId = (typeof viewIds)[number];
type Tone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

type NavigationItem = {
  id: ViewId;
  label: string;
  description: string;
};

const navigation: NavigationItem[] = [
  { id: 'corporate', label: 'Plataforma', description: 'Visión, servicios y arquitectura pública.' },
  { id: 'customer', label: 'Customer', description: 'Creación y seguimiento de pedidos.' },
  { id: 'business', label: 'Business', description: 'Catálogo, órdenes y operación comercial.' },
  { id: 'rider', label: 'Rider', description: 'Ruta, evidencia y cierre de entrega.' },
  { id: 'control', label: 'Control', description: 'Supervisión, incidencias y auditoría.' },
];

function readView(): ViewId {
  const hash = window.location.hash.replace(/^#\/?/, '');
  return viewIds.includes(hash as ViewId) ? (hash as ViewId) : 'corporate';
}

function BrandMark() {
  return (
    <span className="brand-mark" aria-label="DELIVER ASSETS">
      <span className="brand-mark__symbol" aria-hidden="true">DA</span>
      <span className="brand-mark__wordmark"><strong>DELIVER</strong><span>ASSETS</span></span>
    </span>
  );
}

function StatusBadge({ children, tone = 'neutral' }: { children: ReactNode; tone?: Tone }) {
  return <span className={`status-badge status-badge--${tone}`}>{children}</span>;
}

function PrototypeNotice() {
  return (
    <aside className="prototype-notice" aria-label="Estado del sistema">
      <strong>Prototipo verificable</strong>
      <span>No procesa pagos, identidades, ubicaciones ni operaciones comerciales reales.</span>
    </aside>
  );
}

const services = [
  ['01', 'Envíos express', 'Crea, coordina y sigue entregas urbanas desde una sola operación.'],
  ['02', 'Comercios locales', 'Catálogo, pedidos y logística para negocios que necesitan operar mejor.'],
  ['03', 'Paquetería', 'Recogida, traslado, evidencia y resolución de incidencias.'],
  ['04', 'DELIVER PRO', 'Herramientas operativas para comercios, flotas y futuros operadores.'],
];

function CorporateView() {
  return (
    <main>
      <section className="hero">
        <div className="hero__content">
          <p className="eyebrow">INFRAESTRUCTURA DIGITAL · COMERCIO + LOGÍSTICA</p>
          <h1>Mover la ciudad.<span>Una red visible.</span></h1>
          <p className="hero__lead">
            DELIVER ASSETS conecta compra, recogida, transporte, seguimiento y entrega dentro de una sola arquitectura operacional.
          </p>
          <div className="hero__actions">
            <a className="button button--primary" href="#/customer">Explorar Customer</a>
            <a className="button button--secondary" href="#/business">Ver DELIVER PRO</a>
          </div>
        </div>

        <div className="network-visual" aria-label="Representación conceptual de una red logística">
          <div className="network-visual__ring network-visual__ring--one" />
          <div className="network-visual__ring network-visual__ring--two" />
          <span className="network-node network-node--store">Comercio</span>
          <span className="network-node network-node--order">Pedido</span>
          <span className="network-node network-node--rider">Rider</span>
          <span className="network-node network-node--control">Control</span>
          <div className="network-visual__core">DA</div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Principios del prototipo">
        <span>Arquitectura multirol</span>
        <span>Diseño web-first</span>
        <span>Estados verificables</span>
        <span>Sin claims operativos ficticios</span>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">SUPERFICIES DEL SISTEMA</p>
          <h2>Una operación, responsabilidades separadas.</h2>
          <p>La plataforma pública explica la visión. Cada aplicación resuelve las tareas de un rol específico sin mezclar permisos ni autoridad.</p>
        </div>
        <div className="service-grid">
          {services.map(([number, title, text]) => (
            <article className="service-card" key={number}>
              <span className="service-card__number">{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <span className="service-card__arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="movement-section">
        <div>
          <p className="eyebrow eyebrow--light">MODELO OPERATIVO</p>
          <h2>No es solo entregar. Es coordinar el movimiento.</h2>
        </div>
        <ol className="movement-steps">
          <li><span>1</span><strong>Crea</strong><small>La orden nace con datos y responsabilidad definidos.</small></li>
          <li><span>2</span><strong>Coordina</strong><small>Cliente, comercio y rider ven el estado que les corresponde.</small></li>
          <li><span>3</span><strong>Verifica</strong><small>La operación conserva trazabilidad y evidencia.</small></li>
        </ol>
      </section>
    </main>
  );
}

function CustomerView() {
  return (
    <main className="workspace">
      <WorkspaceHeader eyebrow="CUSTOMER · PROTOTIPO WEB" title="Tu pedido, visible de principio a fin." text="Explora servicios, crea un envío y consulta el avance sin instalar una aplicación.">
        <button className="button button--primary" type="button">Crear envío</button>
      </WorkspaceHeader>

      <section className="dashboard-grid dashboard-grid--customer">
        <article className="panel panel--wide">
          <PanelHeader label="PEDIDO ACTIVO" title="DA-24736"><StatusBadge tone="info">En camino</StatusBadge></PanelHeader>
          <div className="progress-track" aria-label="Estado demostrativo del pedido">
            <ProgressStep state="done" number="✓" label="Creado" />
            <div className="progress-line progress-line--done" />
            <ProgressStep state="done" number="✓" label="Asignado" />
            <div className="progress-line progress-line--active" />
            <ProgressStep state="active" number="3" label="En camino" />
            <div className="progress-line" />
            <ProgressStep state="next" number="4" label="Entregado" />
          </div>
          <div className="tracking-map">
            <div className="tracking-map__route" />
            <span className="tracking-map__point tracking-map__point--start">A</span>
            <span className="tracking-map__point tracking-map__point--end">B</span>
            <span className="tracking-map__vehicle">→</span>
          </div>
        </article>

        <article className="panel">
          <span className="panel__label">RESUMEN</span>
          <dl className="summary-list">
            <SummaryRow label="Servicio" value="Envío express" />
            <SummaryRow label="Destino" value="Av. Principal 245" />
            <SummaryRow label="ETA demostrativa" value="12 min" />
            <SummaryRow label="Total simulado" value="S/ 18.90" strong />
          </dl>
        </article>

        <article className="panel">
          <span className="panel__label">ACCIONES</span>
          <div className="action-list">
            <button type="button">Ver detalle del pedido</button>
            <button type="button">Contactar soporte</button>
            <button type="button">Compartir seguimiento</button>
          </div>
        </article>
      </section>
    </main>
  );
}

const orderRows = [
  ['DA-24736', 'Farmacia Central', 'En camino', 'S/ 18.90'],
  ['DA-24735', 'Mercado Norte', 'Asignando', 'S/ 22.50'],
  ['DA-24731', 'Tienda Local', 'Entregado', 'S/ 15.40'],
];

function BusinessView() {
  return (
    <main className="workspace">
      <WorkspaceHeader eyebrow="BUSINESS · DELIVER PRO" title="Opera pedidos y logística desde un solo panel." text="Vista demostrativa para catálogo, órdenes, preparación y coordinación de entregas.">
        <button className="button button--primary" type="button">Nueva orden</button>
      </WorkspaceHeader>

      <section className="metric-grid">
        <Metric label="Órdenes activas" value="12" />
        <Metric label="En preparación" value="4" />
        <Metric label="En ruta" value="6" />
        <Metric label="Incidencias" value="1" />
      </section>

      <section className="panel panel--table">
        <PanelHeader label="OPERACIÓN" title="Pedidos recientes"><button className="button button--secondary button--compact" type="button">Exportar</button></PanelHeader>
        <div className="data-table" role="table" aria-label="Pedidos recientes de demostración">
          <div className="data-table__row data-table__row--header" role="row">
            <span role="columnheader">Pedido</span><span role="columnheader">Comercio</span><span role="columnheader">Estado</span><span role="columnheader">Total</span>
          </div>
          {orderRows.map(([id, merchant, state, total]) => (
            <div className="data-table__row" role="row" key={id}>
              <strong role="cell">{id}</strong><span role="cell">{merchant}</span>
              <span role="cell"><StatusBadge tone={state === 'Entregado' ? 'success' : 'info'}>{state}</StatusBadge></span>
              <span role="cell">{total}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function RiderView() {
  return (
    <main className="workspace">
      <WorkspaceHeader eyebrow="RIDER · PREVISUALIZACIÓN WEB" title="Ruta, evidencia y siguiente acción." text="Esta superficie anticipa la experiencia Rider. La aplicación móvil futura requerirá GPS, cámara, notificaciones y operación offline controlada.">
        <StatusBadge tone="warning">Simulación</StatusBadge>
      </WorkspaceHeader>

      <section className="rider-layout">
        <article className="phone-frame">
          <div className="phone-frame__topbar"><span>09:41</span><strong>DELIVER RIDER</strong><span>●●●</span></div>
          <div className="phone-frame__content">
            <span className="panel__label">ENTREGA ACTIVA</span><h2>DA-24736</h2><StatusBadge tone="info">En camino</StatusBadge>
            <div className="mobile-route"><div className="mobile-route__line" /><span>A</span><span>B</span></div>
            <div className="stop-card"><small>DESTINO</small><strong>Av. Principal 245</strong><span>Cliente de demostración</span></div>
            <button className="button button--primary button--full" type="button">Llegué al destino</button>
          </div>
        </article>

        <article className="panel rider-checklist">
          <span className="panel__label">CONTRATO OPERATIVO</span><h2>Antes de cerrar una entrega</h2>
          <ul className="checklist">
            <li><span>1</span>Validar que el pedido corresponde a la asignación.</li>
            <li><span>2</span>Registrar evidencia según una política aprobada.</li>
            <li><span>3</span>Confirmar entrega o escalar una incidencia.</li>
            <li><span>4</span>Conservar un evento de auditoría verificable.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}

const incidents: Array<{ id: string; order: string; label: string; tone: Tone }> = [
  { id: 'INC-041', order: 'DA-24728', label: 'Dirección', tone: 'warning' },
  { id: 'INC-040', order: 'DA-24720', label: 'Pago sandbox', tone: 'danger' },
  { id: 'INC-039', order: 'DA-24714', label: 'Resuelta', tone: 'success' },
];

function ControlView() {
  return (
    <main className="workspace workspace--control">
      <WorkspaceHeader eyebrow="CONTROL · SUPERVISIÓN" title="Decisiones operativas con evidencia." text="Vista administrativa para seguimiento, escalamiento e historial de eventos.">
        <button className="button button--secondary" type="button">Abrir registro</button>
      </WorkspaceHeader>

      <section className="control-grid">
        <article className="panel control-map">
          <PanelHeader label="RED ACTIVA" title="Vista operacional"><StatusBadge>Datos simulados</StatusBadge></PanelHeader>
          <div className="control-map__canvas">
            <span className="control-dot control-dot--one">1</span><span className="control-dot control-dot--two">2</span>
            <span className="control-dot control-dot--three">3</span><span className="control-dot control-dot--four">4</span>
          </div>
        </article>

        <article className="panel">
          <span className="panel__label">INCIDENCIAS</span><h2>Cola de revisión</h2>
          <div className="incident-list">
            {incidents.map((incident) => (
              <button type="button" key={incident.id}>
                <span><strong>{incident.id}</strong><small>{incident.order}</small></span>
                <StatusBadge tone={incident.tone}>{incident.label}</StatusBadge>
              </button>
            ))}
          </div>
        </article>

        <article className="panel audit-panel">
          <span className="panel__label">AUDITORÍA</span><h2>Eventos recientes</h2>
          <ol>
            <li><span>12:42</span>Orden asignada a un rider de demostración.</li>
            <li><span>12:39</span>Comercio confirmó preparación.</li>
            <li><span>12:31</span>Orden creada en entorno de interfaz.</li>
          </ol>
        </article>
      </section>
    </main>
  );
}

function WorkspaceHeader({ eyebrow, title, text, children }: { eyebrow: string; title: string; text: string; children: ReactNode }) {
  return <section className="workspace-hero"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{text}</p></div>{children}</section>;
}

function PanelHeader({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  return <div className="panel__header"><div><span className="panel__label">{label}</span><h2>{title}</h2></div>{children}</div>;
}

function ProgressStep({ state, number, label }: { state: 'done' | 'active' | 'next'; number: string; label: string }) {
  return <div className={`progress-step progress-step--${state}`}><span>{number}</span><small>{label}</small></div>;
}

function SummaryRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return <div className={strong ? 'summary-list__total' : undefined}><dt>{label}</dt><dd>{value}</dd></div>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <article className="metric-card"><span>{label}</span><strong>{value}</strong><small>Dato de interfaz, no métrica real</small></article>;
}

const views: Record<ViewId, ComponentType> = {
  corporate: CorporateView,
  customer: CustomerView,
  business: BusinessView,
  rider: RiderView,
  control: ControlView,
};

function App() {
  const [activeView, setActiveView] = useState<ViewId>(() => readView());

  useEffect(() => {
    const onHashChange = () => setActiveView(readView());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const ActiveView = views[activeView];

  return (
    <div className={`site-shell site-shell--${activeView}`}>
      <PrototypeNotice />
      <header className="site-header">
        <a className="site-header__brand" href="#/corporate"><BrandMark /></a>
        <nav className="site-nav" aria-label="Superficies de DELIVER ASSETS">
          {navigation.map((item) => (
            <a key={item.id} href={`#/${item.id}`} title={item.description} aria-current={activeView === item.id ? 'page' : undefined} className={activeView === item.id ? 'site-nav__link site-nav__link--active' : 'site-nav__link'}>{item.label}</a>
          ))}
        </nav>
        <a className="button button--primary button--header" href="#/customer">Crear envío</a>
      </header>
      <ActiveView />
      <footer className="site-footer"><BrandMark /><p>Base web canónica en construcción. Diseño editorial y UI operativa permanecen separados.</p><span>v0.1.0 · GitHub Pages</span></footer>
    </div>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('No se encontró el nodo raíz de la aplicación.');
createRoot(root).render(<StrictMode><App /></StrictMode>);
