import { COMPANY } from '@site/core/config';
import { LOCALES, switchLocalePath } from '@site/core/i18n';
import { renderToStaticMarkup } from 'react-dom/server';

import { ContactsPage } from './contacts-page';

describe('server contacts page', () => {
  it.each(LOCALES)('renders %s content, channels, and JSON-LD in the initial HTML', (locale) => {
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(<ContactsPage locale={locale} />);

    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(container.querySelector('h1')?.textContent).toBe(
      locale === 'uk' ? 'Контакти' : 'Контакты',
    );
    expect(container.textContent).toContain(COMPANY.phone.display);
    expect(container.textContent).toContain(COMPANY.email);
    const hrefs = Array.from(container.querySelectorAll('a'), (link) => link.getAttribute('href'));
    for (const href of [
      `/${locale}`,
      `tel:${COMPANY.phone.e164}`,
      `mailto:${COMPANY.email}`,
      COMPANY.links.telegram,
      COMPANY.links.viber,
      COMPANY.links.map,
    ]) {
      expect(hrefs).toContain(href);
    }
    expect(container.querySelector('main, footer, form, iframe')).toBeNull();
    const sectionIds = Array.from(container.querySelectorAll('section, aside'), (section) =>
      section.getAttribute('aria-labelledby'),
    );
    expect(sectionIds).toEqual([
      'contacts-sales',
      'contacts-written',
      'contacts-location',
      'contacts-wholesale',
    ]);
    const schemas = Array.from(
      container.querySelectorAll('script[type="application/ld+json"]'),
    ).flatMap((script) => JSON.parse(script.textContent!));
    expect(schemas.map((schema) => schema['@type'])).toEqual(['ContactPage', 'BreadcrumbList']);
    const breadcrumb = container.querySelector('[aria-current="page"]')?.textContent;
    expect(schemas[0].name).toBe(breadcrumb);
    expect(schemas[1].itemListElement[1].name).toBe(breadcrumb);
  });

  it('keeps the contacts address when the existing locale switch changes language', () => {
    expect(switchLocalePath('/uk/contacts', 'ru')).toBe('/ru/contacts');
    expect(switchLocalePath('/ru/contacts', 'uk')).toBe('/uk/contacts');
  });
});
