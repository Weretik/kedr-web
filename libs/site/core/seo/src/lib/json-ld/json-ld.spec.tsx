import { createSiteConfig } from '@site/core/config';
import { renderToStaticMarkup } from 'react-dom/server';

import { JsonLd, serializeJsonLd } from './json-ld';
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from './site-json-ld';

const config = createSiteConfig({});

describe('JSON-LD', () => {
  it('escapes characters that could close the script tag', () => {
    expect(serializeJsonLd({ name: '</script><b>&' })).toBe(
      '{"name":"\\u003c/script\\u003e\\u003cb\\u003e\\u0026"}',
    );
  });

  it('renders a JSON-LD script tag', () => {
    const html = renderToStaticMarkup(<JsonLd data={{ '@type': 'Thing' }} />);

    expect(html).toBe('<script type="application/ld+json">{"@type":"Thing"}</script>');
  });

  it('describes the organization with localized city and contacts', () => {
    expect(buildOrganizationJsonLd('ru', config)).toMatchObject({
      '@type': 'Organization',
      '@id': 'https://classkedr.com.ua/#organization',
      url: 'https://classkedr.com.ua/ru',
      telephone: '+380687135049',
      address: { addressLocality: 'Харьков', addressCountry: 'UA' },
    });
  });

  it('links the website to the organization', () => {
    expect(buildWebSiteJsonLd('uk', config)).toMatchObject({
      '@type': 'WebSite',
      inLanguage: 'uk-UA',
      publisher: { '@id': 'https://classkedr.com.ua/#organization' },
    });
  });
});
