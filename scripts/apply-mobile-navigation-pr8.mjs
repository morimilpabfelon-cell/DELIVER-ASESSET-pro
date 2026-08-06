import { readFile, rm, writeFile } from 'node:fs/promises';

function replaceRequired(source, search, replacement, label) {
  if (!source.includes(search)) throw new Error(`No se encontró el bloque requerido: ${label}`);
  return source.replace(search, replacement);
}

const componentsPath = 'src/components.tsx';
let components = await readFile(componentsPath, 'utf8');
components = replaceRequired(
  components,
  "import type { ReactNode } from 'react';",
  "import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';",
  'import de React',
);

const navigationStart = components.indexOf('function HeaderNav');
const navigationEnd = components.indexOf('export function EditorialNetwork');
if (navigationStart < 0 || navigationEnd < 0 || navigationEnd <= navigationStart) {
  throw new Error('No se pudo aislar la navegación existente');
}

const navigationImplementation = `const headerLinks = [
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
      (element): element is HTMLElement => element instanceof HTMLElement,
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

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
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

`;
components = `${components.slice(0, navigationStart)}${navigationImplementation}${components.slice(navigationEnd)}`;
await writeFile(componentsPath, components, 'utf8');

const stylesPath = 'src/styles.css';
let styles = await readFile(stylesPath, 'utf8');
styles = replaceRequired(
  styles,
  ".site-nav a:hover::after,\n.site-nav a[aria-current='page']::after { right: 0; left: 0; }",
  ".site-nav a:hover::after,\n.site-nav a[aria-current='page']::after { right: 0; left: 0; }\n.site-nav__contact { display: none; }",
  'estado de navegación desktop',
);
styles = replaceRequired(
  styles,
  ".button--header { min-height: 46px; padding-inline: 20px; }",
  `.button--header { min-height: 46px; padding-inline: 20px; }
.button--header[aria-current='page'] { background: var(--brand-primary-hover); box-shadow: 0 0 0 3px var(--brand-accent), 0 10px 25px rgb(21 81 216 / 20%); }
.mobile-nav-toggle,
.mobile-nav-scrim { display: none; }
.mobile-nav-toggle { min-height: 46px; align-items: center; gap: 10px; padding: 0 14px; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); color: var(--ink); background: var(--surface-warm); cursor: pointer; font-size: 14px; font-weight: 800; }
.mobile-nav-toggle__icon { position: relative; display: block; width: 22px; height: 16px; }
.mobile-nav-toggle__icon i { position: absolute; left: 0; width: 22px; height: 2px; border-radius: 2px; background: currentColor; transition: top 180ms var(--ease-out), transform 180ms var(--ease-out); }
.mobile-nav-toggle__icon i:first-child { top: 4px; }
.mobile-nav-toggle__icon i:last-child { top: 11px; }
.mobile-nav-toggle[aria-expanded='true'] .mobile-nav-toggle__icon i:first-child { top: 7px; transform: rotate(45deg); }
.mobile-nav-toggle[aria-expanded='true'] .mobile-nav-toggle__icon i:last-child { top: 7px; transform: rotate(-45deg); }
html.mobile-nav-open,
html.mobile-nav-open body { overflow: hidden; }`,
  'botón de contacto y control móvil',
);
styles = replaceRequired(
  styles,
  `@media (max-width: 1120px) {
  .site-header { grid-template-columns: auto 1fr; }
  .site-nav { grid-column: 1 / -1; order: 3; justify-content: start; overflow-x: auto; border-top: 1px solid var(--border-subtle); }
  .site-nav a { padding: 16px 0; }
  .site-nav a::after { bottom: 7px; }`,
  `@media (max-width: 1120px) {
  .site-header { grid-template-columns: auto 1fr; }
  .site-nav { grid-column: 1 / -1; order: 3; flex-wrap: wrap; justify-content: start; overflow: visible; border-top: 1px solid var(--border-subtle); }
  .site-nav a { padding: 16px 0; }
  .site-nav a::after { bottom: 7px; }`,
  'navegación tablet',
);
styles = replaceRequired(
  styles,
  `@media (max-width: 820px) {
  html { scroll-padding-top: 132px; }
  .site-header { gap: 14px; padding: 10px 18px 0; }
  .button--header { display: none; }
  .site-nav { margin-inline: -18px; padding-inline: 18px; gap: 24px; }`,
  `@media (max-width: 820px) {
  html { scroll-padding-top: 94px; }
  .site-header { z-index: 40; min-height: 74px; grid-template-columns: minmax(0, 1fr) auto; gap: 14px; padding: 10px 18px; }
  .site-header__brand { min-width: 0; }
  .site-header[data-mobile-menu-open='true'] { background: var(--paper); }
  .button--header { display: none; }
  .mobile-nav-toggle { display: inline-flex; }
  .site-nav {
    position: fixed;
    z-index: 42;
    top: 82px;
    right: 18px;
    left: 18px;
    display: none;
    max-height: calc(100dvh - 100px);
    grid-template-columns: 1fr;
    gap: 6px;
    margin: 0;
    padding: 12px;
    overflow-y: auto;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    background: var(--surface-warm);
    box-shadow: var(--shadow-md);
  }
  .site-header[data-mobile-menu-open='true'] .site-nav { display: grid; }
  .site-nav a { padding: 15px 16px; border-radius: var(--radius-sm); font-size: 17px; }
  .site-nav a::after { display: none; }
  .site-nav a:hover,
  .site-nav a[aria-current='page'] { color: var(--brand-primary); background: var(--info-surface); }
  .site-nav__contact { display: flex; justify-content: center; margin-top: 4px; color: white !important; background: var(--brand-primary); }
  .site-nav__contact:hover,
  .site-nav__contact[aria-current='page'] { color: white !important; background: var(--brand-primary-hover); }
  .mobile-nav-scrim { position: fixed; z-index: 25; inset: 0; display: block; padding: 0; border: 0; background: rgb(17 17 17 / 42%); backdrop-filter: blur(4px); cursor: default; }`,
  'navegación móvil anterior',
);
await writeFile(stylesPath, styles, 'utf8');

const verifierPath = 'scripts/verify-public-site.mjs';
let verifier = await readFile(verifierPath, 'utf8');
verifier = replaceRequired(
  verifier,
  "const sourceCss = await readFile(join(repositoryRoot, 'src', 'styles.css'), 'utf8');",
  `const sourceCss = await readFile(join(repositoryRoot, 'src', 'styles.css'), 'utf8');
const sourceComponents = await readFile(join(repositoryRoot, 'src', 'components.tsx'), 'utf8');
const navigationRequirements = [
  'id="site-navigation"',
  'aria-controls="site-navigation"',
  'aria-expanded={mobileMenuOpen}',
  "event.key === 'Escape'",
  "event.key !== 'Tab'",
  'mobile-nav-scrim',
  'site-nav__contact',
  "currentRoute?.id === 'contact' ? 'page'",
  "document.documentElement.classList.add('mobile-nav-open')",
];
const missingNavigationRequirements = navigationRequirements.filter((requirement) => !sourceComponents.includes(requirement));
if (missingNavigationRequirements.length > 0) errors.push(\`Contrato de navegación móvil incompleto: \${missingNavigationRequirements.join(', ')}\`);
for (const obsoleteNavigationRule of ['overflow-x: auto', 'margin-inline: -18px']) {
  if (sourceCss.includes(obsoleteNavigationRule)) errors.push(\`Regla móvil obsoleta presente: \${obsoleteNavigationRule}\`);
}`,
  'lectura de CSS en verificador',
);
verifier = replaceRequired(
  verifier,
  "console.log(`Contrato verificado: ${routes.length} rutas, ${files.length} archivos, ${declaredCssVariables.size} variables CSS y tres activos de marca.`);",
  "console.log(`Contrato verificado: ${routes.length} rutas, ${files.length} archivos, ${declaredCssVariables.size} variables CSS, tres activos de marca y navegación móvil accesible.`);",
  'mensaje final del verificador',
);
await writeFile(verifierPath, verifier, 'utf8');

const corporateSitePath = 'docs/CORPORATE-SITE.md';
let corporateSite = await readFile(corporateSitePath, 'utf8');
const accessibilitySection = `

## Navegación móvil y accesibilidad

- En pantallas de hasta 820 px, la navegación se presenta como un panel controlado por un botón con \`aria-controls\` y \`aria-expanded\`.
- El menú contiene Empresa, Servicios, Aplicaciones, Seguridad, Noticias y Contacto; ningún destino depende de desplazamiento horizontal.
- Al abrir, el foco pasa al primer enlace. \`Tab\` y \`Shift+Tab\` permanecen dentro del control hasta cerrarlo.
- \`Escape\`, el botón de cierre y el fondo exterior cierran el panel y devuelven el foco al botón.
- La página Contacto utiliza \`aria-current="page"\` tanto en el menú como en el acceso de escritorio.
- El fondo no se desplaza mientras el menú permanece abierto.
`;
if (!corporateSite.includes('## Navegación móvil y accesibilidad')) corporateSite += accessibilitySection;
await writeFile(corporateSitePath, corporateSite, 'utf8');

await rm('scripts/apply-mobile-navigation-pr8.mjs');
await rm('.github/workflows/one-time-pr8-mobile-nav.yml');
await rm('.github/pr8-trigger.txt', { force: true });

console.log('Migración PR8 aplicada; archivos temporales eliminados.');
