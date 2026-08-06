import { StrictMode, useEffect } from 'react';
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
      'La aplicación para descubrir comercios, solicitar entregas, enviar paquetes y consultar cada avance sin perder el contexto.',
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
      { title: 'Descarga', text: 'Instala DELIVER Customer desde el canal oficial de tu dispositivo.' },
      { title: 'Configura', text: 'Crea tu cuenta y guarda las direcciones que utilizas con frecuencia.' },
      { title: 'Elige', text: 'Compra en un comercio o solicita un envío independiente.' },
      { title: 'Sigue', text: 'Consulta el estado, las actualizaciones y el soporte desde la aplicación.' },
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
        answer: 'La web presenta el servicio y dirige a las aplicaciones. Las compras, los envíos y el seguimiento se realizarán en DELIVER Customer.',
      },
      {
        question: '¿La misma cuenta funcionará en móvil y escritorio?',
        answer: 'Sí. La experiencia está planteada para conservar cuenta, historial y operaciones entre dispositivos compatibles.',
      },
      {
        question: '¿Cuándo estará disponible?',
        answer: 'La fecha se comunicará únicamente cuando existan versiones verificadas y canales oficiales de distribución.',
      },
    ],
  },
  business: {
    id: 'business',
    name: 'DELIVER Business',
    label: 'PARA COMERCIOS',
    headline: 'Tu catálogo, tus pedidos y tu operación en un solo lugar.',
    summary:
      'Una aplicación empresarial para organizar sucursales, preparar pedidos, coordinar entregas y mantener visible cada responsabilidad.',
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
      { title: 'Entrega', text: 'Conecta la operación con logística y conserva trazabilidad.' },
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
        answer: 'Sí. La arquitectura contempla organizaciones, sucursales, permisos y trazabilidad por usuario.',
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
      'Una aplicación móvil especializada para recibir asignaciones, navegar, registrar transiciones y resolver incidencias en campo.',
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
    accessNote: 'La aplicación podrá descargarse por canales oficiales, pero operar exigirá autorización e identidad verificadas.',
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
        question: '¿La aplicación funcionará con conectividad limitada?',
        answer: 'La continuidad controlada forma parte del diseño previsto y se validará antes de la publicación.',
      },
    ],
  },
  control: {
    id: 'control',
    name: 'DELIVER Control',
    label: 'PARA OPERACIÓN AUTORIZADA',
    headline: 'Supervisión y respuesta con permisos, contexto y trazabilidad.',
    summary:
      'La superficie institucional para observar operaciones, resolver incidencias y conservar evidencia de decisiones sensibles.',
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
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
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
      : 'Conoce las aplicaciones de DELIVER ASSETS para personas, comercios, operadores y equipos autorizados.';

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
      <span className="brand-mark__wordmark">
        <strong>DELIVER</strong><span>ASSETS</span>
      </span>
    </span>
  );
}

function LaunchNotice() {
  return (
    <aside className="launch-notice" aria-label="Disponibilidad de aplicaciones">
      <strong>Próximamente</strong>
      <span>Las aplicaciones se publicarán por etapas en canales oficiales.</span>
      <a href="./#applications">Conocer plataformas</a>
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
        <a href="./#security">Confianza</a>
        <a href="./#company">Empresa</a>
      </nav>
      <a className="button button--primary button--header" href="./#applications">Conocer aplicaciones</a>
    </header>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <article
      className={`product-card product-card--${product.id}`}
      data-reveal="up"
      style={{ '--reveal-delay': `${index * 70}ms` } as React.CSSProperties}
    >
      <div className="product-card__topline">
        <p className="eyebrow">{product.label}</p>
        <span className="availability-badge">{product.releaseLabel}</span>
      </div>
      <h3>{product.name}</h3>
      <p>{product.summary}</p>
      <div className="product-card__meta">
        <span>{product.platforms.length} plataformas</span>
        <span>{product.audience}</span>
      </div>
      <a className="text-link" href={`?app=${product.id}`}>Conocer la aplicación <span aria-hidden="true">→</span></a>
    </article>
  );
}

function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="hero__content hero-entrance">
          <p className="eyebrow">COMERCIO · DELIVERY · PAQUETERÍA</p>
          <h1>Mover la ciudad.<span>Una red visible.</span></h1>
          <p className="hero__lead">
            DELIVER ASSETS conecta personas, comercios y operadores mediante aplicaciones especializadas que comparten una misma operación.
          </p>
          <div className="hero__actions">
            <a className="button button--primary" href="#applications">Conocer aplicaciones</a>
            <a className="button button--secondary" href="#architecture">Cómo funciona</a>
          </div>
          <p className="hero__status">Aplicaciones móviles y de escritorio en preparación. Publicación progresiva por plataforma.</p>
        </div>

        <div className="app-orbit hero-entrance hero-entrance--visual" aria-label="Ecosistema de aplicaciones DELIVER ASSETS">
          <div className="app-orbit__track app-orbit__track--outer" aria-hidden="true" />
          <div className="app-orbit__track app-orbit__track--inner" aria-hidden="true" />
          <div className="app-orbit__core"><strong>DELIVER</strong><small>CORE</small></div>
          <a className="app-orbit__node app-orbit__node--customer" href="?app=customer"><small>PERSONAS</small>Customer</a>
          <a className="app-orbit__node app-orbit__node--business" href="?app=business"><small>COMERCIOS</small>Business</a>
          <a className="app-orbit__node app-orbit__node--rider" href="?app=rider"><small>CAMPO</small>Rider</a>
          <a className="app-orbit__node app-orbit__node--control" href="?app=control"><small>OPERACIÓN</small>Control</a>
        </div>
      </section>

      <section className="principle-strip" aria-label="Separación de responsabilidades" data-reveal="up">
        <span><strong>Descubre</strong> el ecosistema en la web</span>
        <span><strong>Opera</strong> desde la aplicación adecuada</span>
        <span><strong>Conserva</strong> una experiencia conectada</span>
      </section>

      <section className="section-block" id="applications">
        <div className="section-heading" data-reveal="up">
          <p className="eyebrow">APLICACIONES</p>
          <h2>Una experiencia diseñada para cada responsabilidad.</h2>
          <p>Customer, Business, Rider y Control separan funciones, permisos y dispositivos sin fragmentar la operación.</p>
        </div>
        <div className="product-grid">
          {productIds.map((id, index) => <ProductCard key={id} product={products[id]} index={index} />)}
        </div>
      </section>

      <section className="architecture-section" id="architecture">
        <div className="section-heading section-heading--light" data-reveal="left">
          <p className="eyebrow eyebrow--light">CÓMO FUNCIONA</p>
          <h2>Encuentra la aplicación correcta y continúa desde ahí.</h2>
          <p>La web orienta. Cada aplicación ofrece las herramientas y permisos correspondientes a su función.</p>
        </div>
        <ol className="architecture-steps">
          <li data-reveal="up"><span>01</span><div><strong>Descubre</strong><p>Conoce cada solución, sus requisitos y las plataformas disponibles.</p></div></li>
          <li data-reveal="up"><span>02</span><div><strong>Descarga</strong><p>Instala desde un canal oficial cuando la versión de tu plataforma esté publicada.</p></div></li>
          <li data-reveal="up"><span>03</span><div><strong>Opera</strong><p>Compra, vende, transporta o supervisa desde la aplicación correspondiente.</p></div></li>
          <li data-reveal="up"><span>04</span><div><strong>Continúa</strong><p>Mantén cuenta, estados y contexto entre las superficies autorizadas.</p></div></li>
        </ol>
      </section>

      <section className="section-block" id="technology">
        <div className="section-heading" data-reveal="up">
          <p className="eyebrow">TECNOLOGÍA</p>
          <h2>Especializada por dispositivo. Conectada por diseño.</h2>
          <p>Cada superficie responde a su contexto sin sacrificar identidad, continuidad ni claridad operacional.</p>
        </div>
        <div className="feature-grid">
          <article data-reveal="up"><span>01</span><h3>Una cuenta</h3><p>Una identidad coherente para conservar historial, preferencias y acceso entre dispositivos compatibles.</p></article>
          <article data-reveal="up"><span>02</span><h3>Cada dispositivo</h3><p>Móvil para operar en movimiento. Escritorio para administrar con más espacio, contexto y precisión.</p></article>
          <article data-reveal="up"><span>03</span><h3>Estados visibles</h3><p>Permisos, transiciones y evidencias diseñados para que cada persona comprenda la siguiente acción.</p></article>
        </div>
      </section>

      <section className="security-section" id="security">
        <div data-reveal="left">
          <p className="eyebrow">CONFIANZA</p>
          <h2>La operación correcta empieza por límites claros.</h2>
        </div>
        <div className="security-list">
          <p data-reveal="up"><strong>Acceso por función.</strong> Cada aplicación expone únicamente las capacidades correspondientes a su usuario.</p>
          <p data-reveal="up"><strong>Datos necesarios.</strong> Ubicación, pagos y evidencias se solicitarán solo dentro del flujo y la aplicación adecuados.</p>
          <p data-reveal="up"><strong>Trazabilidad.</strong> Los cambios críticos conservarán contexto, responsabilidad y evidencia verificable.</p>
        </div>
      </section>

      <section className="company-section" id="company">
        <div data-reveal="up">
          <p className="eyebrow eyebrow--light">DELIVER ASSETS</p>
          <h2>Infraestructura digital para coordinar comercio y movimiento.</h2>
          <p>Una red de aplicaciones enfocadas que conecta personas, comercios, operadores y equipos autorizados.</p>
          <a className="button button--light" href="#applications">Explorar el ecosistema</a>
        </div>
      </section>
    </main>
  );
}

function PlatformCard({ platform, index }: { platform: Platform; index: number }) {
  return (
    <article
      className="platform-card"
      data-reveal="up"
      style={{ '--reveal-delay': `${index * 55}ms` } as React.CSSProperties}
    >
      <div><h3>{platform.name}</h3><p>{platform.use}</p></div>
      <span className="availability-badge">{platform.availability}</span>
    </article>
  );
}

function ProductPage({ product }: { product: Product }) {
  return (
    <main className={`product-page product-page--${product.id}`}>
      <section className="product-hero">
        <div className="hero-entrance">
          <a className="back-link" href="./#applications">← Todas las aplicaciones</a>
          <div className="product-hero__topline">
            <p className="eyebrow">{product.label}</p>
            <span className="availability-badge">{product.releaseLabel}</span>
          </div>
          <h1>{product.name}</h1>
          <h2>{product.headline}</h2>
          <p className="product-hero__lead">{product.summary}</p>
          <div className="hero__actions">
            <a className="button button--primary" href="#platforms">Ver plataformas</a>
            <a className="button button--secondary" href="#how-it-works">Cómo funciona</a>
          </div>
          <p className="availability-callout"><strong>{product.releaseLabel}.</strong> {product.accessNote}</p>
        </div>
        <div className="device-preview hero-entrance hero-entrance--visual" aria-label={`Vista conceptual de ${product.name}`}>
          <div className="device-preview__window">
            <span className="device-preview__label">{product.name}</span>
            <div className="device-preview__screen">
              <span>{product.label}</span>
              <strong>{product.headline}</strong>
              <small>Vista de producto</small>
            </div>
          </div>
        </div>
      </section>

      <section className="audience-band" data-reveal="up">
        <span>Diseñada para</span><strong>{product.audience}</strong>
      </section>

      <section className="section-block">
        <div className="section-heading" data-reveal="up">
          <p className="eyebrow">CAPACIDADES</p>
          <h2>Todo lo necesario para cumplir una función con claridad.</h2>
        </div>
        <div className="capability-grid">
          {product.capabilities.map((capability, index) => (
            <article key={capability} data-reveal="up" style={{ '--reveal-delay': `${index * 45}ms` } as React.CSSProperties}>
              <span>{String(index + 1).padStart(2, '0')}</span><h3>{capability}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="steps-section" id="how-it-works">
        <div className="section-heading section-heading--light" data-reveal="left">
          <p className="eyebrow eyebrow--light">CÓMO FUNCIONA</p>
          <h2>Una secuencia clara desde el acceso hasta el cierre.</h2>
        </div>
        <ol>
          {product.steps.map((step, index) => (
            <li key={step.title} data-reveal="up"><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{step.title}</strong><p>{step.text}</p></div></li>
          ))}
        </ol>
      </section>

      <section className="section-block" id="platforms">
        <div className="section-heading" data-reveal="up">
          <p className="eyebrow">PLATAFORMAS</p>
          <h2>La experiencia adecuada para cada dispositivo.</h2>
          <p>Los enlaces oficiales aparecerán aquí cuando cada versión esté publicada y verificada.</p>
        </div>
        <div className="platform-grid">
          {product.platforms.map((platform, index) => <PlatformCard key={platform.name} platform={platform} index={index} />)}
        </div>
      </section>

      <section className="faq-section">
        <div className="section-heading" data-reveal="up">
          <p className="eyebrow">PREGUNTAS FRECUENTES</p>
          <h2>Disponibilidad, acceso y plataformas.</h2>
        </div>
        <div className="faq-list">
          {product.faqs.map((faq) => (
            <details key={faq.question} data-reveal="up"><summary>{faq.question}</summary><p>{faq.answer}</p></details>
          ))}
        </div>
      </section>

      <section className="other-products">
        <p className="eyebrow" data-reveal="up">OTRAS APLICACIONES</p>
        <div>
          {productIds.filter((id) => id !== product.id).map((id) => (
            <a key={id} href={`?app=${id}`} data-reveal="up"><span>{products[id].label}</span><strong>{products[id].name}</strong></a>
          ))}
        </div>
      </section>
    </main>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__brand"><BrandMark /><p>Comercio, delivery y paquetería en una red de aplicaciones especializadas.</p></div>
      <nav aria-label="Enlaces del pie de página">
        <a href="./#applications">Aplicaciones</a>
        <a href="./#technology">Tecnología</a>
        <a href="./#security">Confianza</a>
        <a href="./#company">Empresa</a>
      </nav>
      <div className="site-footer__status"><span>Aplicaciones en preparación</span><span>Distribución oficial por etapas</span></div>
    </footer>
  );
}

function App() {
  const selectedProduct = getSelectedProduct();
  useRevealAnimations();
  usePageMetadata(selectedProduct);

  return (
    <div className="site-shell">
      <LaunchNotice />
      <SiteHeader />
      {selectedProduct ? <ProductPage product={selectedProduct} /> : <HomePage />}
      <SiteFooter />
    </div>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('No se encontró el nodo raíz de la aplicación.');
createRoot(root).render(<StrictMode><App /></StrictMode>);