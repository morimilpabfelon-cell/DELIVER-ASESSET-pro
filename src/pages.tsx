import {
  ApplicationCard,
  EditorialNetwork,
  PageHero,
  ProductVisual,
  SectionHeading,
  StatusBadge,
} from './components';
import {
  appIds,
  appRoute,
  products,
  services,
  siteHref,
  type AppId,
} from './site';

const operatingPrinciples = [
  {
    title: 'Responsabilidad visible',
    text: 'Cada función debe entender qué puede hacer, qué ocurrió y cuál es la siguiente acción.',
  },
  {
    title: 'Separación por función',
    text: 'Customer, Business, Rider y Control mantienen herramientas y permisos distintos.',
  },
  {
    title: 'Verdad antes que velocidad',
    text: 'No se publican coberturas, fechas, descargas ni capacidades que no estén verificadas.',
  },
  {
    title: 'Continuidad con contexto',
    text: 'El recorrido debe conservar estados, evidencia y responsabilidad entre superficies autorizadas.',
  },
];

export function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="hero__content hero-entrance">
          <p className="eyebrow">COMERCIO · DELIVERY · PAQUETERÍA</p>
          <h1>Mover la ciudad.<span>Una red visible.</span></h1>
          <p className="hero__lead">DELIVER ASSETS conecta personas, comercios y operadores mediante aplicaciones especializadas que comparten el mismo recorrido.</p>
          <div className="hero__actions">
            <a className="button button--primary" href={siteHref('/services/')}>Conocer servicios</a>
            <a className="button button--secondary" href={siteHref('/apps/')}>Explorar aplicaciones</a>
          </div>
          <p className="hero__status">Las aplicaciones se publicarán únicamente cuando existan versiones verificadas y canales oficiales.</p>
        </div>
        <EditorialNetwork />
      </section>

      <section className="mission-band">
        <p className="eyebrow eyebrow--light">PROPÓSITO</p>
        <h2>Coordinar el movimiento de productos y paquetes sin perder contexto, responsabilidad ni claridad.</h2>
        <a className="text-link text-link--light" href={siteHref('/company/')}>Conocer la organización <span aria-hidden="true">→</span></a>
      </section>

      <section className="section-block">
        <SectionHeading
          eyebrow="SERVICIOS"
          title="Una red para distintas formas de movimiento."
          description="Las aplicaciones son las herramientas. Los servicios describen el valor que la red pretende coordinar."
        />
        <div className="service-grid">
          {services.map((service, index) => (
            <article className="service-card" key={service.id} data-reveal="up">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p className="eyebrow">{service.label}</p>
              <h3>{service.title}</h3>
              <p>{service.summary}</p>
            </article>
          ))}
        </div>
        <a className="section-link" href={siteHref('/services/')}>Ver todos los servicios <span aria-hidden="true">→</span></a>
      </section>

      <section className="applications-section">
        <SectionHeading
          eyebrow="APLICACIONES"
          title="Cuatro responsabilidades. Una operación conectada."
          description="Cada superficie mantiene un alcance propio sin convertir la web corporativa en una aplicación operativa."
          light
        />
        <div className="application-grid">
          {appIds.map((id) => <ApplicationCard id={id} key={id} />)}
        </div>
      </section>

      <section className="corporate-split">
        <div data-reveal="left">
          <p className="eyebrow">EMPRESA</p>
          <h2>Una organización definida por lo que puede demostrar.</h2>
          <p>La misión y los principios son públicos. Los datos legales, la cobertura y las fechas de lanzamiento se comunicarán solo cuando estén confirmados.</p>
          <a className="button button--secondary" href={siteHref('/company/')}>Empresa y principios</a>
        </div>
        <div className="corporate-split__panel" data-reveal="up">
          <strong>Estado actual</strong>
          <ul>
            <li>Sitio corporativo público</li>
            <li>Aplicaciones en desarrollo</li>
            <li>Distribución oficial aún no abierta</li>
            <li>Sin operaciones comerciales presentadas como activas</li>
          </ul>
        </div>
      </section>

      <section className="news-preview">
        <div>
          <p className="eyebrow eyebrow--light">NOTICIAS</p>
          <h2>Un espacio reservado para comunicaciones verificadas.</h2>
          <p>No se publicarán anuncios ficticios para llenar la página. Las novedades aparecerán cuando exista información oficial.</p>
        </div>
        <a className="button button--light" href={siteHref('/news/')}>Ir a Noticias</a>
      </section>

      <section className="trust-section">
        <SectionHeading
          eyebrow="CONFIANZA"
          title="Límites claros antes de funciones sensibles."
          description="Acceso por función, minimización de datos y trazabilidad son requisitos de diseño, no decoración institucional."
        />
        <div className="trust-grid">
          <article data-reveal="up"><span>01</span><h3>Acceso por función</h3><p>Cada aplicación expone solo las capacidades correspondientes a su usuario.</p></article>
          <article data-reveal="up"><span>02</span><h3>Datos necesarios</h3><p>Ubicación, pagos y evidencias se solicitarán dentro del flujo y la superficie adecuados.</p></article>
          <article data-reveal="up"><span>03</span><h3>Decisiones trazables</h3><p>Los cambios críticos deben conservar contexto, responsabilidad y evidencia.</p></article>
        </div>
        <a className="section-link" href={siteHref('/security/')}>Seguridad y confianza <span aria-hidden="true">→</span></a>
      </section>
    </main>
  );
}

export function CompanyPage() {
  return (
    <main>
      <PageHero
        eyebrow="EMPRESA"
        title="Infraestructura digital para coordinar comercio y movimiento."
        lead="DELIVER ASSETS se plantea como una red de aplicaciones especializadas para personas, comercios, operadores y equipos autorizados."
        aside={<div className="statement-card"><small>DECLARACIÓN</small><strong>La claridad operacional forma parte del producto.</strong></div>}
      />

      <section className="section-block">
        <div className="mission-vision-grid">
          <article data-reveal="up"><p className="eyebrow">MISIÓN</p><h2>Coordinar movimientos con información clara y responsabilidades visibles.</h2><p>La misión describe la dirección del sistema. No implica que todas las funciones o plataformas ya estén disponibles.</p></article>
          <article data-reveal="up"><p className="eyebrow">VISIÓN</p><h2>Una ciudad donde comercio, entregas y paquetes puedan compartir una red sin perder contexto.</h2><p>La visión guía las decisiones de arquitectura, producto y distribución.</p></article>
        </div>
      </section>

      <section className="principles-section">
        <SectionHeading eyebrow="PRINCIPIOS" title="Cómo se toman decisiones de producto y operación." light />
        <div className="principle-grid">
          {operatingPrinciples.map((principle, index) => (
            <article key={principle.title} data-reveal="up"><span>{String(index + 1).padStart(2, '0')}</span><h3>{principle.title}</h3><p>{principle.text}</p></article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeading eyebrow="ESTADO ACTUAL" title="La organización se presenta sin inventar madurez." />
        <div className="state-grid">
          <article><strong>Publicado</strong><p>Sitio corporativo y páginas informativas de las aplicaciones.</p></article>
          <article><strong>En desarrollo</strong><p>Customer, Business, Rider, Control y sus contratos compartidos.</p></article>
          <article><strong>No anunciado</strong><p>Fechas, cobertura, métricas, alianzas, oficinas y canales comerciales.</p></article>
        </div>
        <div className="truth-note"><strong>Datos corporativos pendientes</strong><p>La web no atribuye dirección legal, ejecutivos, número de empleados, clientes o socios mientras esa información no esté definida y verificada.</p></div>
      </section>
    </main>
  );
}

export function ServicesPage() {
  return (
    <main>
      <PageHero
        eyebrow="SERVICIOS"
        title="El servicio es la coordinación. Las aplicaciones son las herramientas."
        lead="DELIVER ASSETS separa los tipos de valor que pretende ofrecer de las superficies utilizadas para operarlos."
        aside={<div className="service-orbit"><span>COMERCIO</span><span>ENTREGAS</span><span>PAQUETES</span><strong>RED</strong></div>}
      />

      <section className="section-block">
        <div className="service-detail-list">
          {services.map((service, index) => (
            <article className="service-detail" id={service.id} key={service.id} data-reveal="up">
              <span className="service-detail__number">{String(index + 1).padStart(2, '0')}</span>
              <div><p className="eyebrow">{service.label}</p><h2>{service.title}</h2><p>{service.summary}</p></div>
              <ul>{service.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className="journey-section">
        <SectionHeading eyebrow="RECORRIDO" title="Una operación atraviesa responsabilidades distintas." description="La misma operación puede ser vista desde Customer, Business, Rider y Control sin que cada superficie exponga las mismas capacidades." light />
        <ol className="journey-grid">
          <li><span>01</span><strong>Customer solicita</strong><p>Define la necesidad y conserva visibilidad.</p></li>
          <li><span>02</span><strong>Business prepara</strong><p>Confirma y coordina la preparación.</p></li>
          <li><span>03</span><strong>Rider mueve</strong><p>Ejecuta la recogida y la entrega.</p></li>
          <li><span>04</span><strong>Control supervisa</strong><p>Atiende excepciones con acceso restringido.</p></li>
        </ol>
      </section>
    </main>
  );
}

export function AppsPage() {
  return (
    <main>
      <PageHero
        eyebrow="APLICACIONES"
        title="Diseñadas para verse distintas y trabajar juntas."
        lead="La web explica y distribuye. Las compras, la preparación, el movimiento y la supervisión ocurrirán en aplicaciones separadas."
        aside={<div className="app-index"><span>Customer</span><span>Business</span><span>Rider</span><span>Control</span></div>}
      />

      <section className="section-block">
        <div className="application-grid application-grid--light">
          {appIds.map((id) => <ApplicationCard id={id} key={id} />)}
        </div>
      </section>

      <section className="distribution-section">
        <SectionHeading eyebrow="DISTRIBUCIÓN" title="Los enlaces aparecerán solo cuando existan binarios y canales oficiales." light />
        <div className="distribution-grid">
          <article><strong>Móvil</strong><p>Android, iPhone y iPad según la aplicación y la etapa de publicación.</p></article>
          <article><strong>Escritorio</strong><p>Windows, macOS y Linux para las superficies que requieren mayor contexto.</p></article>
          <article><strong>Acceso administrado</strong><p>Control permanecerá restringido a organizaciones, roles y dispositivos aprobados.</p></article>
        </div>
      </section>
    </main>
  );
}

export function ProductPage({ id }: { id: AppId }) {
  const product = products[id];

  return (
    <main>
      <section className={`product-hero product-hero--${id}`}>
        <div className="product-hero__copy hero-entrance">
          <a className="back-link" href={siteHref('/apps/')}>← Todas las aplicaciones</a>
          <div className="product-hero__topline"><p className="eyebrow">{product.label}</p><StatusBadge>{product.releaseLabel}</StatusBadge></div>
          <h1>{product.name}</h1>
          <h2>{product.headline}</h2>
          <p>{product.summary}</p>
          <div className="hero__actions"><a className="button button--primary" href="#capabilities">Capacidades</a><a className="button button--secondary" href="#platforms">Plataformas</a></div>
          <div className="availability-note"><strong>{product.releaseLabel}</strong><span>{product.accessNote}</span></div>
        </div>
        <ProductVisual id={id} />
      </section>

      <section className="audience-band"><span>Diseñada para</span><strong>{product.audience}</strong></section>

      <section className="section-block" id="capabilities">
        <SectionHeading eyebrow="CAPACIDADES" title="Una función clara para cada responsabilidad." />
        <div className="capability-grid">
          {product.capabilities.map((capability, index) => <article key={capability} data-reveal="up"><span>{String(index + 1).padStart(2, '0')}</span><h3>{capability}</h3></article>)}
        </div>
      </section>

      <section className="journey-section">
        <SectionHeading eyebrow="CÓMO FUNCIONA" title="Una secuencia comprensible desde el acceso hasta el cierre." light />
        <ol className="journey-grid">
          {product.steps.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, '0')}</span><strong>{step.title}</strong><p>{step.text}</p></li>)}
        </ol>
      </section>

      <section className="section-block" id="platforms">
        <SectionHeading eyebrow="PLATAFORMAS" title="La superficie adecuada para cada contexto." description="La disponibilidad mostrada es el estado público actual; no equivale a una descarga activa." />
        <div className="platform-grid">
          {product.platforms.map((platform) => <article key={platform.name}><div><h3>{platform.name}</h3><p>{platform.use}</p></div><StatusBadge>{platform.availability}</StatusBadge></article>)}
        </div>
      </section>

      <section className="other-apps">
        <p className="eyebrow">OTRAS APLICACIONES</p>
        <div>{appIds.filter((candidate) => candidate !== id).map((candidate) => <a key={candidate} href={appRoute(candidate)}><span>{products[candidate].label}</span><strong>{products[candidate].name}</strong></a>)}</div>
      </section>
    </main>
  );
}

export function SecurityPage() {
  return (
    <main>
      <PageHero
        eyebrow="SEGURIDAD Y CONFIANZA"
        title="La seguridad empieza por limitar correctamente el sistema."
        lead="Esta página presenta principios de diseño. No afirma certificaciones, auditorías externas ni cumplimiento regulatorio no verificado."
        aside={<div className="security-mark"><span /><span /><span /><strong>ACCESO</strong></div>}
      />

      <section className="section-block">
        <div className="security-principles">
          <article><span>01</span><h2>Acceso mínimo</h2><p>Cada usuario debe recibir únicamente las capacidades correspondientes a su función.</p></article>
          <article><span>02</span><h2>Datos necesarios</h2><p>La ubicación, los pagos y las evidencias deben solicitarse únicamente dentro del flujo adecuado.</p></article>
          <article><span>03</span><h2>Trazabilidad</h2><p>Las acciones sensibles deben conservar contexto, responsable y evidencia verificable.</p></article>
          <article><span>04</span><h2>Distribución controlada</h2><p>Los clientes no se publicarán sin firma, actualización, rollback y canales oficiales.</p></article>
        </div>
      </section>

      <section className="security-report">
        <div><p className="eyebrow eyebrow--light">REPORTE RESPONSABLE</p><h2>El canal público de seguridad aún no está abierto.</h2><p>Se publicará una dirección o formulario específico cuando exista un proceso capaz de recibir, confirmar y atender reportes.</p></div>
        <StatusBadge>Canal en preparación</StatusBadge>
      </section>

      <section className="section-block">
        <SectionHeading eyebrow="LÍMITES" title="Lo que esta página no declara." />
        <div className="limit-grid"><p>Sin certificaciones publicadas.</p><p>Sin programa de recompensas anunciado.</p><p>Sin auditorías externas presentadas.</p><p>Sin promesas absolutas de seguridad.</p></div>
      </section>
    </main>
  );
}

export function NewsPage() {
  return (
    <main>
      <PageHero
        eyebrow="NOTICIAS"
        title="Comunicaciones oficiales, cuando exista algo que comunicar."
        lead="La infraestructura editorial está preparada sin fabricar anuncios, fechas, alianzas o hitos."
        aside={<div className="news-index"><span>COMUNICADOS</span><span>PRODUCTO</span><span>EMPRESA</span></div>}
      />

      <section className="section-block">
        <div className="empty-news" data-reveal="up">
          <span>—</span>
          <p className="eyebrow">SIN PUBLICACIONES</p>
          <h2>Las comunicaciones oficiales aparecerán en este espacio.</h2>
          <p>Cuando se publique una noticia incluirá fecha, categoría, contenido verificable y una URL estable.</p>
        </div>
      </section>
    </main>
  );
}

export function ContactPage() {
  const contacts = [
    { title: 'Personas', text: 'Información sobre Customer, plataformas y disponibilidad.', href: appRoute('customer'), action: 'Conocer Customer' },
    { title: 'Comercios', text: 'Información sobre Business y el futuro proceso de alta comercial.', href: appRoute('business'), action: 'Conocer Business' },
    { title: 'Riders', text: 'Información sobre requisitos, autorización y aplicación móvil.', href: appRoute('rider'), action: 'Conocer Rider' },
    { title: 'Seguridad', text: 'Principios y estado del futuro canal de reporte responsable.', href: siteHref('/security/'), action: 'Ver Seguridad' },
  ];

  return (
    <main>
      <PageHero
        eyebrow="CONTACTO"
        title="La ruta correcta depende de quién eres y qué necesitas."
        lead="No se muestra un formulario inoperativo. Los canales de contacto se activarán cuando exista recepción, consentimiento, confirmación y atención."
        aside={<div className="contact-status"><strong>Canales directos</strong><StatusBadge>En preparación</StatusBadge></div>}
      />

      <section className="section-block">
        <div className="contact-grid">
          {contacts.map((contact) => <article key={contact.title} data-reveal="up"><h2>{contact.title}</h2><p>{contact.text}</p><a className="text-link" href={contact.href}>{contact.action} <span aria-hidden="true">→</span></a></article>)}
          <article data-reveal="up"><h2>Organizaciones</h2><p>El canal institucional se publicará junto con la identidad legal y el proceso de atención correspondiente.</p><StatusBadge>Canal en preparación</StatusBadge></article>
        </div>
      </section>

      <section className="contact-policy"><strong>Por qué no hay formulario todavía</strong><p>Un formulario sin backend, política de privacidad, retención definida y responsable de atención sería una interfaz engañosa.</p></section>
    </main>
  );
}

export function NotFoundPage() {
  return (
    <main className="not-found">
      <p className="eyebrow">ERROR 404</p>
      <h1>Esta página no existe.</h1>
      <p>La ruta pudo cambiar durante la reorganización del sitio corporativo.</p>
      <div><a className="button button--primary" href={siteHref('/')}>Volver al inicio</a><a className="button button--secondary" href={siteHref('/apps/')}>Ver aplicaciones</a></div>
    </main>
  );
}
