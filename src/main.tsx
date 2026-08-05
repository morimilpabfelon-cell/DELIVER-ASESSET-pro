import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type AppId = 'customer' | 'business' | 'rider' | 'control';

type Platform = {
  name: string;
  use: string;
  availability: 'Planificada' | 'Acceso privado';
};

type Product = {
  id: AppId;
  name: string;
  label: string;
  headline: string;
  summary: string;
  audience: string;
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
    label: 'PARA CLIENTES',
    headline: 'Compra, envía y sigue cada operación desde una aplicación dedicada.',
    summary:
      'Customer será la aplicación para explorar comercios, crear pedidos, solicitar envíos y consultar el seguimiento con una sola cuenta.',
    audience: 'Personas que compran, reciben o envían productos y paquetes.',
    capabilities: [
      'Explorar comercios y categorías',
      'Crear pedidos y envíos',
      'Rastrear operaciones',
      'Gestionar direcciones',
      'Consultar historial y comprobantes',
      'Acceder a soporte e incidencias',
    ],
    steps: [
      { title: 'Descarga', text: 'Instala la aplicación correspondiente a tu dispositivo.' },
      { title: 'Configura', text: 'Crea una cuenta y define tus datos de entrega.' },
      { title: 'Opera', text: 'Compra en un comercio o crea un envío independiente.' },
      { title: 'Sigue', text: 'Consulta estados, evidencias y soporte desde la aplicación.' },
    ],
    platforms: [
      { name: 'Android', use: 'Aplicación móvil principal', availability: 'Planificada' },
      { name: 'iPhone y iPad', use: 'Aplicación móvil principal', availability: 'Planificada' },
      { name: 'Windows', use: 'Pedidos y seguimiento en escritorio', availability: 'Planificada' },
      { name: 'macOS', use: 'Pedidos y seguimiento en escritorio', availability: 'Planificada' },
      { name: 'Linux', use: 'Pedidos y seguimiento en escritorio', availability: 'Planificada' },
    ],
    accessNote: 'Todavía no existen binarios públicos ni enlaces oficiales de tienda.',
    faqs: [
      {
        question: '¿Se podrá comprar desde esta página web?',
        answer: 'No. El sitio explica el servicio y dirige a la aplicación. La operación principal ocurre en Customer.',
      },
      {
        question: '¿La misma cuenta funcionará en móvil y escritorio?',
        answer: 'Esa es la arquitectura prevista, sujeta a contratos de identidad y sincronización todavía no implementados.',
      },
      {
        question: '¿La aplicación ya está disponible?',
        answer: 'No. Esta página documenta la distribución planificada sin presentar descargas ficticias.',
      },
    ],
  },
  business: {
    id: 'business',
    name: 'DELIVER Business',
    label: 'PARA COMERCIOS',
    headline: 'Gestiona catálogo, pedidos y operación desde una aplicación empresarial.',
    summary:
      'Business concentrará la operación comercial en escritorio y ofrecerá funciones móviles complementarias para acciones rápidas.',
    audience: 'Comercios, sucursales, operadores y equipos de atención.',
    capabilities: [
      'Catálogo y disponibilidad',
      'Recepción y preparación de pedidos',
      'Sucursales y usuarios',
      'Coordinación logística',
      'Incidencias y soporte',
      'Reportes operativos',
    ],
    steps: [
      { title: 'Alta', text: 'La organización completa validación y configuración comercial.' },
      { title: 'Configura', text: 'Crea sucursales, catálogo, permisos y reglas operativas.' },
      { title: 'Recibe', text: 'Gestiona pedidos y preparación desde la aplicación.' },
      { title: 'Coordina', text: 'Entrega la operación a logística y conserva trazabilidad.' },
    ],
    platforms: [
      { name: 'Windows', use: 'Operación principal de escritorio', availability: 'Planificada' },
      { name: 'macOS', use: 'Operación principal de escritorio', availability: 'Planificada' },
      { name: 'Linux', use: 'Operación principal de escritorio', availability: 'Planificada' },
      { name: 'Android', use: 'Aplicación complementaria', availability: 'Planificada' },
      { name: 'iPhone y iPad', use: 'Aplicación complementaria', availability: 'Planificada' },
    ],
    accessNote: 'El registro comercial y las descargas todavía no están habilitados.',
    faqs: [
      {
        question: '¿Business será solo móvil?',
        answer: 'No. La superficie principal está prevista para escritorio; el móvil será complementario.',
      },
      {
        question: '¿Puedo registrar mi negocio ahora?',
        answer: 'No. Aún no existe un flujo de alta productivo ni validación comercial habilitada.',
      },
      {
        question: '¿Habrá múltiples usuarios y sucursales?',
        answer: 'Está previsto, pero requiere identidad, RBAC y auditoría reales antes de publicarse.',
      },
    ],
  },
  rider: {
    id: 'rider',
    name: 'DELIVER Rider',
    label: 'PARA OPERADORES EN CAMPO',
    headline: 'Asignaciones, navegación y evidencia en una aplicación móvil especializada.',
    summary:
      'Rider será una aplicación móvil separada porque depende de ubicación, cámara, notificaciones y operación confiable en campo.',
    audience: 'Riders, conductores y operadores autorizados de recogida y entrega.',
    capabilities: [
      'Recepción de asignaciones',
      'Navegación y paradas',
      'Estados de recogida y entrega',
      'Evidencia autorizada',
      'Gestión de incidencias',
      'Operación con conectividad limitada',
    ],
    steps: [
      { title: 'Autoriza', text: 'El operador completa validación y recibe acceso aprobado.' },
      { title: 'Activa', text: 'Configura permisos del dispositivo y disponibilidad.' },
      { title: 'Ejecuta', text: 'Recibe una asignación y registra cada transición.' },
      { title: 'Cierra', text: 'Confirma entrega o escala una incidencia con evidencia.' },
    ],
    platforms: [
      { name: 'Android', use: 'Plataforma móvil prioritaria', availability: 'Planificada' },
      { name: 'iPhone', use: 'Plataforma móvil sujeta a validación', availability: 'Planificada' },
    ],
    accessNote: 'No habrá descarga pública operativa sin validación, identidad y permisos aprobados.',
    faqs: [
      {
        question: '¿Existirá Rider para escritorio?',
        answer: 'No está previsto para la primera etapa; la operación depende del dispositivo móvil en campo.',
      },
      {
        question: '¿Cualquiera podrá descargar y operar?',
        answer: 'La descarga puede ser pública en el futuro, pero operar exigirá autorización y controles de identidad.',
      },
      {
        question: '¿Ya utiliza GPS?',
        answer: 'No. El repositorio actual es únicamente el sitio público y no solicita ubicación.',
      },
    ],
  },
  control: {
    id: 'control',
    name: 'DELIVER Control',
    label: 'PARA OPERACIÓN AUTORIZADA',
    headline: 'Supervisión, incidencias y auditoría bajo acceso institucional restringido.',
    summary:
      'Control no se distribuirá como una aplicación pública abierta. Su acceso dependerá de organización, rol, autenticación reforzada y dispositivo aprobado.',
    audience: 'Equipos internos y organizaciones expresamente autorizadas.',
    capabilities: [
      'Supervisión operacional',
      'Gestión de incidencias',
      'Auditoría y trazabilidad',
      'Gestión de riesgo',
      'Soporte y escalamiento',
      'Configuración restringida',
    ],
    steps: [
      { title: 'Invitación', text: 'Una organización autorizada asigna acceso a un usuario.' },
      { title: 'Verificación', text: 'Se valida identidad, rol y dispositivo.' },
      { title: 'Supervisión', text: 'El operador accede únicamente a funciones permitidas.' },
      { title: 'Auditoría', text: 'Las decisiones críticas conservan evidencia verificable.' },
    ],
    platforms: [
      { name: 'Escritorio autorizado', use: 'Distribución administrada', availability: 'Acceso privado' },
      { name: 'Navegador interno', use: 'Acceso protegido cuando sea necesario', availability: 'Acceso privado' },
    ],
    accessNote: 'No existirá un botón público de descarga para Control.',
    faqs: [
      {
        question: '¿Por qué Control no tiene descarga pública?',
        answer: 'Porque administra funciones sensibles y exige gobierno de acceso, auditoría y dispositivos autorizados.',
      },
      {
        question: '¿Control será una app móvil?',
        answer: 'No es prioritario. La superficie principal está prevista para escritorio o acceso web interno protegido.',
      },
      {
        question: '¿Existe acceso administrativo ahora?',
        answer: 'No. No hay autenticación, roles ni entorno operativo habilitado.',
      },
    ],
  },
};

const productIds = Object.keys(products) as AppId[];

function getSelectedProduct(): Product | null {
  const requested = new URLSearchParams(window.location.search).get('app');
  return productIds.includes(requested as AppId) ? products[requested as AppId] : null;
}

function BrandMark() {
  return (
    <span className="brand-mark" aria-label="DELIVER ASSETS">
      <span className="brand-mark__symbol" aria-hidden="true" />
      <span className="brand-mark__wordmark">
        <strong>DELIVER</strong><span>ASSETS</span>
      </span>
    </span>
  );
}

function AvailabilityNotice() {
  return (
    <aside className="prototype-notice" aria-label="Estado de disponibilidad">
      <strong>Desarrollo temprano</strong>
      <span>Las aplicaciones y descargas mostradas todavía no están disponibles.</span>
    </aside>
  );
}

function SiteHeader() {
  return (
    <header className="site-header">
      <a className="site-header__brand" href="./" aria-label="Ir al inicio"><BrandMark /></a>
      <nav className="site-nav" aria-label="Navegación principal">
        <a href="./#applications">Aplicaciones</a>
        <a href="./#architecture">Cómo funciona</a>
        <a href="./#technology">Tecnología</a>
        <a href="./#security">Seguridad</a>
        <a href="./#company">Empresa</a>
      </nav>
      <a className="button button--primary button--header" href="./#applications">Ver descargas</a>
    </header>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className={`product-card product-card--${product.id}`}>
      <p className="eyebrow">{product.label}</p>
      <h3>{product.name}</h3>
      <p>{product.summary}</p>
      <div className="product-card__meta">
        <span>{product.platforms.length} plataformas previstas</span>
        <span>No disponible todavía</span>
      </div>
      <a className="text-link" href={`?app=${product.id}`}>Conocer la aplicación <span aria-hidden="true">→</span></a>
    </article>
  );
}

function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="hero__content">
          <p className="eyebrow">COMERCIO · DELIVERY · PAQUETERÍA</p>
          <h1>Una red.<span>Cuatro aplicaciones.</span></h1>
          <p className="hero__lead">
            DELIVER ASSETS presenta y distribuye un ecosistema de aplicaciones separadas para clientes, comercios, riders y operación autorizada.
          </p>
          <div className="hero__actions">
            <a className="button button--primary" href="#applications">Explorar aplicaciones</a>
            <a className="button button--secondary" href="#architecture">Entender la arquitectura</a>
          </div>
          <p className="hero__status">Este sitio no procesa pedidos. La operación ocurrirá dentro de las aplicaciones.</p>
        </div>

        <div className="app-orbit" aria-label="Ecosistema de aplicaciones DELIVER ASSETS">
          <div className="app-orbit__core"><span>DA</span><small>CORE</small></div>
          <a className="app-orbit__node app-orbit__node--customer" href="?app=customer">Customer</a>
          <a className="app-orbit__node app-orbit__node--business" href="?app=business">Business</a>
          <a className="app-orbit__node app-orbit__node--rider" href="?app=rider">Rider</a>
          <a className="app-orbit__node app-orbit__node--control" href="?app=control">Control</a>
        </div>
      </section>

      <section className="principle-strip" aria-label="Separación de responsabilidades">
        <span><strong>Web</strong> presenta y distribuye</span>
        <span><strong>Apps</strong> permiten operar</span>
        <span><strong>Core</strong> sincronizará y gobernará</span>
      </section>

      <section className="section-block" id="applications">
        <div className="section-heading">
          <p className="eyebrow">APLICACIONES</p>
          <h2>Elige la herramienta correspondiente a tu función.</h2>
          <p>Cada aplicación tendrá distribución, permisos y experiencia propios. Ninguna descarga está habilitada todavía.</p>
        </div>
        <div className="product-grid">
          {productIds.map((id) => <ProductCard key={id} product={products[id]} />)}
        </div>
      </section>

      <section className="architecture-section" id="architecture">
        <div className="section-heading section-heading--light">
          <p className="eyebrow eyebrow--light">ARQUITECTURA PÚBLICA</p>
          <h2>La página explica. Las aplicaciones ejecutan.</h2>
        </div>
        <ol className="architecture-steps">
          <li><span>01</span><div><strong>Descubre</strong><p>Conoce el servicio, requisitos y aplicación adecuada desde el sitio corporativo.</p></div></li>
          <li><span>02</span><div><strong>Instala</strong><p>Descarga desde un canal oficial cuando exista una versión publicada.</p></div></li>
          <li><span>03</span><div><strong>Opera</strong><p>Compra, vende, transporta o supervisa únicamente dentro de la aplicación autorizada.</p></div></li>
          <li><span>04</span><div><strong>Sincroniza</strong><p>El futuro backend central mantendrá identidad, estados, permisos y auditoría.</p></div></li>
        </ol>
      </section>

      <section className="section-block" id="technology">
        <div className="section-heading">
          <p className="eyebrow">TECNOLOGÍA</p>
          <h2>Distribución separada, contratos compartidos.</h2>
          <p>La velocidad no vendrá de mezclar todas las superficies, sino de compartir diseño, contratos y automatización sin confundir responsabilidades.</p>
        </div>
        <div className="feature-grid">
          <article><span>01</span><h3>Móvil especializado</h3><p>Customer y Rider priorizarán Android e iOS según las necesidades del dispositivo.</p></article>
          <article><span>02</span><h3>Escritorio real</h3><p>Customer y Business tendrán clientes para Windows, macOS y Linux cuando el producto lo justifique.</p></article>
          <article><span>03</span><h3>Núcleo autoritativo</h3><p>Identidad, pedidos, pagos, tracking y auditoría dependerán de un backend central todavía no implementado.</p></article>
        </div>
      </section>

      <section className="security-section" id="security">
        <div>
          <p className="eyebrow">SEGURIDAD Y CONFIANZA</p>
          <h2>No publicaremos funciones críticas como si ya existieran.</h2>
        </div>
        <div className="security-list">
          <p><strong>Sin descargas ficticias.</strong> Los botones permanecerán inactivos hasta disponer de binarios firmados y canales oficiales.</p>
          <p><strong>Sin acceso administrativo público.</strong> Control requerirá identidad, rol y dispositivo autorizados.</p>
          <p><strong>Sin datos reales en este sitio.</strong> La web pública no solicita pagos, ubicación ni información operacional.</p>
        </div>
      </section>

      <section className="company-section" id="company">
        <p className="eyebrow eyebrow--light">DELIVER ASSETS</p>
        <h2>Infraestructura digital para coordinar comercio y movimiento.</h2>
        <p>Este repositorio publica una representación verificable de la arquitectura pública. No representa una operación comercial activa.</p>
        <a className="button button--light" href="#applications">Ver aplicaciones previstas</a>
      </section>
    </main>
  );
}

function PlatformCard({ platform }: { platform: Platform }) {
  return (
    <article className="platform-card">
      <div><h3>{platform.name}</h3><p>{platform.use}</p></div>
      <button type="button" disabled>{platform.availability}</button>
    </article>
  );
}

function ProductPage({ product }: { product: Product }) {
  return (
    <main className={`product-page product-page--${product.id}`}>
      <section className="product-hero">
        <div>
          <a className="back-link" href="./#applications">← Todas las aplicaciones</a>
          <p className="eyebrow">{product.label}</p>
          <h1>{product.name}</h1>
          <h2>{product.headline}</h2>
          <p className="product-hero__lead">{product.summary}</p>
          <div className="hero__actions">
            <a className="button button--primary" href="#platforms">Ver plataformas previstas</a>
            <a className="button button--secondary" href="#how-it-works">Cómo funcionará</a>
          </div>
          <p className="availability-callout"><strong>No disponible todavía.</strong> {product.accessNote}</p>
        </div>
        <div className="device-preview" aria-label={`Vista conceptual de ${product.name}`}>
          <div className="device-preview__window">
            <span className="device-preview__label">{product.name}</span>
            <div className="device-preview__screen">
              <span>{product.label}</span>
              <strong>{product.headline}</strong>
              <small>Vista conceptual · sin funciones operativas</small>
            </div>
          </div>
        </div>
      </section>

      <section className="audience-band">
        <span>Diseñada para</span><strong>{product.audience}</strong>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">CAPACIDADES PREVISTAS</p>
          <h2>Una aplicación enfocada, no una sección disfrazada de la web.</h2>
        </div>
        <div className="capability-grid">
          {product.capabilities.map((capability, index) => (
            <article key={capability}><span>{String(index + 1).padStart(2, '0')}</span><h3>{capability}</h3></article>
          ))}
        </div>
      </section>

      <section className="steps-section" id="how-it-works">
        <div className="section-heading section-heading--light">
          <p className="eyebrow eyebrow--light">CÓMO FUNCIONARÁ</p>
          <h2>Del acceso a una operación trazable.</h2>
        </div>
        <ol>
          {product.steps.map((step, index) => (
            <li key={step.title}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{step.title}</strong><p>{step.text}</p></div></li>
          ))}
        </ol>
      </section>

      <section className="section-block" id="platforms">
        <div className="section-heading">
          <p className="eyebrow">DISTRIBUCIÓN</p>
          <h2>Plataformas previstas.</h2>
          <p>Los controles están deshabilitados deliberadamente. Se activarán únicamente cuando existan aplicaciones verificadas y enlaces oficiales.</p>
        </div>
        <div className="platform-grid">
          {product.platforms.map((platform) => <PlatformCard key={platform.name} platform={platform} />)}
        </div>
      </section>

      <section className="faq-section">
        <div className="section-heading">
          <p className="eyebrow">PREGUNTAS CLAVE</p>
          <h2>Estado y límites actuales.</h2>
        </div>
        <div className="faq-list">
          {product.faqs.map((faq) => (
            <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>
          ))}
        </div>
      </section>

      <section className="other-products">
        <p className="eyebrow">OTRAS APLICACIONES</p>
        <div>
          {productIds.filter((id) => id !== product.id).map((id) => (
            <a key={id} href={`?app=${id}`}><span>{products[id].label}</span><strong>{products[id].name}</strong></a>
          ))}
        </div>
      </section>
    </main>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div><strong>DELIVER ASSETS</strong><p>Sitio corporativo y centro futuro de distribución de aplicaciones.</p></div>
      <div><span>Prototipo público</span><span>Sin operación real</span><span>GitHub Pages</span></div>
    </footer>
  );
}

function App() {
  const selectedProduct = getSelectedProduct();

  return (
    <div className="site-shell">
      <AvailabilityNotice />
      <SiteHeader />
      {selectedProduct ? <ProductPage product={selectedProduct} /> : <HomePage />}
      <SiteFooter />
    </div>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('No se encontró el nodo raíz de la aplicación.');
createRoot(root).render(<StrictMode><App /></StrictMode>);
