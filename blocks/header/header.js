import { getMetadata, loadCSS, loadScript } from '../../scripts/aem.js';
import ffetch from '../../scripts/ffetch.js';
import { link, script } from '../../scripts/dom-helpers.js';

/**
 * get all entries from the index
 * create alternate langauge links for each entry
 */
async function alternateHeaders() {
  // get current page url, parse and remove the protocol and domain
  const url = window.location.href;
  const origin = '/en-us';
  const path = url.replace(window.location.origin, '');
  // parse path to remove the /xx-xx/ from the beginning
  const pathArray = path.split('/');
  const pathArrayLength = pathArray.length;
  let pathArrayString = '';

  for (let i = 0; i < pathArrayLength; i += 1) {
    if (i !== 1 || !/^[a-z]{2}-[a-z]{2}$/.test(pathArray[i])) {
      if (pathArray[i] !== '') {
        pathArrayString += `/${pathArray[i]}`;
      }
    }
  }

  const entries = await ffetch('/query-index.json')
    .all();

  const head = document.querySelector('head');
  entries
    .map((entry) => {
      if (entry.path.includes(pathArrayString)) {
        const match = entry.path.match(/^\/([a-z]{2}-[a-z]{2})\//);
        if (match) {
          return [entry, match[1]];
        }
      }

      return null;
    })
    .filter((entry) => entry !== null)
    .forEach(([entry, hreflang]) => {
      // <link rel="alternate" hreflang="en" href="https://www.example.com/en/page.html" />
      // create alternate links for all matching entries
      head.appendChild(link({
        rel: 'alternate',
        hreflang,
        href: window.location.origin + entry.path,
      }));
    });

  // add x-default alternate link
  const xDefaultLink = document.createElement('link');
  xDefaultLink.rel = 'alternate';
  xDefaultLink.hreflang = 'x-default';
  xDefaultLink.setAttribute('href', window.location.origin + origin + pathArrayString);
  head.appendChild(xDefaultLink);
}

function createBreadcrumbs() {
  const breadcrumbsDictionary = {
    'About,À propos d’Esri': '/about/about-esri/overview',
    'About,À propos d’Esri,Europe': '/about/about-esri/europe',
    Fonctionnalités: '/arcgis/geospatial-platform/overview',
    'Fonctionnalités,SIG 3D': '/capabilities/3d-gis/overview',
    'Fonctionnalités,SIG 3D,Fonctionnalités': '/capabilities/3d-gis/overview',
    'Fonctionnalités,Opérations sur le terrain': '/capabilities/field-operations/overview',
    'Fonctionnalités,GeoAI': '/capabilities/geoai/overview',
    'Fonctionnalités,Imagerie et télédétection': '/capabilities/imagery-remote-sensing/overview',
    'Fonctionnalités,Imagerie et télédétection,Fonctionnalités': '/capabilities/imagery-remote-sensing/overview',
    'Fonctionnalités,SIG Indoor': '/capabilities/indoor-gis/overview',
    'Fonctionnalités,SIG Indoor,Piliers': '/capabilities/indoor-gis/overview',
    'Fonctionnalités,Mapping': '/capabilities/mapping/overview',
    'Fonctionnalités,Visualisation et analyse en temps réel': '/capabilities/real-time/overview',
    'Fonctionnalités,Visualisation et analyse en temps réel,Fonctionnalités': '/capabilities/real-time/overview',
    'Fonctionnalités,Visualisation et analyse en temps réel,Partenaires': '/capabilities/real-time/overview',
    'Fonctionnalités,Analyse spatiale et Data Science': '/capabilities/spatial-analytics-data-science/overview',
    'Intelligence artificielle': '/artificial-intelligence',
    'Transformation numérique': '/digital-transformation/overview',
    'Intelligence géographique': '/location-intelligence/overview',
  };

  const breadcrumbs = getMetadata('breadcrumbs')
    .split(',')
    .map((breadcrumb) => breadcrumb.trim());

  const urlSegments = window.location.pathname.split('/').slice(2);

  const language = getMetadata('og:locale');

  let accUrl = `https://www.esri.com/${language}`;
  const accBreadcrumbs = [];

  const breadcrumbsSchema = breadcrumbs.map((breadcrumb, index) => {
    accUrl += `/${urlSegments[index]}`;
    accBreadcrumbs.push(breadcrumb);

    const breadcrumbsSchemaUrl = breadcrumbsDictionary[accBreadcrumbs.join(',')] || accUrl;
    const position = index + 1;
    return {
      '@type': 'ListItem',
      position,
      name: breadcrumb,
      item: breadcrumbsSchemaUrl,
    };
  });

  document.head.appendChild(script(
    {
      type: 'application/ld+json',
      id: 'breadcrumbs',
    },
    JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbsSchema,
    }),
  ));
}

function createSchema() {
  const schema = {
    '@context': 'http://schema.org',
    '@type': 'WebPage',
    name: document.title,
    sourceOrganization: {
      '@type': 'Organization',
      name: 'Esri',
    },
    url: document.querySelector('link[rel="canonical"]').href,
    image: getMetadata('og:image'),
    inLanguage: {
      '@type': 'Language',
      name: getMetadata('og:locale'),
    },
    description: document.querySelector('meta[name="description"]').content,
  };

  const jsonElement = document.createElement('script');
  jsonElement.type = 'application/ld+json';
  jsonElement.classList.add('schema-graph');

  jsonElement.innerHTML = JSON.stringify(schema);
  document.head.appendChild(jsonElement);
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate() {
  createSchema();
  createBreadcrumbs();
  await alternateHeaders()
    .then(async () => {
      window.gnav_jsonPath = '/2022-nav-config.25.json';
      await Promise.all([
        loadScript('https://webapps-cdn.esri.com/CDN/components/global-nav/js/gn.js'),
        loadCSS('https://webapps-cdn.esri.com/CDN/components/global-nav/css/gn.css'),
      ]);
      document.querySelector('#globalfooter').classList.add('calcite-mode-light');
    });
}
