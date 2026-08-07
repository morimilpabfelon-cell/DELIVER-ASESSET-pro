import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { SiteLayout } from './components';
import {
  AppsPage,
  CompanyPage,
  ContactPage,
  HomePage,
  NewsPage,
  NotFoundPage,
  ProductPage,
  SecurityPage,
  ServicesPage,
} from './pages';
import {
  getLegacyAppRedirect,
  resolveRoute,
  siteHref,
  type CorporateRoute,
} from './site';
import { resolveMotionMode } from './motion';
import './styles.css';
import './motion.css';

function useRevealAnimations() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const supportsObserver = typeof window.IntersectionObserver === 'function';
    const root = document.documentElement;

    root.classList.add('motion-ready');

    const setMode = () => {
      const mode = resolveMotionMode(preference.matches, supportsObserver);
      root.dataset.motion = mode;
      return mode;
    };
    const revealAll = () => elements.forEach((element) => element.classList.add('is-visible'));

    const mode = setMode();
    if (mode !== 'enhanced') revealAll();

    const observer = mode === 'enhanced'
      ? new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add('is-visible');
            observer?.unobserve(entry.target);
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
      )
      : null;

    elements.forEach((element) => observer?.observe(element));

    const handlePreferenceChange = () => {
      if (setMode() !== 'enhanced') revealAll();
    };
    preference.addEventListener('change', handlePreferenceChange);

    return () => {
      observer?.disconnect();
      preference.removeEventListener('change', handlePreferenceChange);
      root.classList.remove('motion-ready');
      delete root.dataset.motion;
    };
  }, []);
}

function usePageMetadata(route: CorporateRoute | null) {
  useEffect(() => {
    const title = route?.title ?? 'Página no encontrada — DELIVER ASSETS';
    const description = route?.description ?? 'La ruta solicitada no existe en el sitio corporativo de DELIVER ASSETS.';
    const canonicalUrl = new URL(route ? siteHref(route.path) : window.location.pathname, window.location.origin).toString();

    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonicalUrl);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl);
  }, [route]);
}

function RoutePage({ route }: { route: CorporateRoute | null }) {
  if (!route) return <NotFoundPage />;

  switch (route.id) {
    case 'home': return <HomePage />;
    case 'company': return <CompanyPage />;
    case 'services': return <ServicesPage />;
    case 'apps': return <AppsPage />;
    case 'app-customer': return <ProductPage id="customer" />;
    case 'app-business': return <ProductPage id="business" />;
    case 'app-rider': return <ProductPage id="rider" />;
    case 'app-control': return <ProductPage id="control" />;
    case 'security': return <SecurityPage />;
    case 'news': return <NewsPage />;
    case 'contact': return <ContactPage />;
    default: return <NotFoundPage />;
  }
}

function App({ route }: { route: CorporateRoute | null }) {
  useRevealAnimations();
  usePageMetadata(route);

  return (
    <SiteLayout currentRoute={route}>
      <RoutePage route={route} />
    </SiteLayout>
  );
}

function bootstrap() {
  const legacyRedirect = getLegacyAppRedirect(window.location.search);
  if (legacyRedirect) {
    window.location.replace(legacyRedirect);
    return;
  }

  const root = document.getElementById('root');
  if (!root) throw new Error('No se encontró el nodo raíz de la aplicación.');

  const route = resolveRoute(window.location.pathname);
  createRoot(root).render(<StrictMode><App route={route} /></StrictMode>);
}

bootstrap();
