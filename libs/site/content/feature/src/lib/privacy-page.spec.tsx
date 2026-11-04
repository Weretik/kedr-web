import { siteConfig } from '@site/core/config';
import { renderToStaticMarkup } from 'react-dom/server';

import { PrivacyPage } from './privacy-page';

const { contacts } = vi.hoisted(() => ({
  contacts: {
    phone: { display: '(067) 111-22-33', e164: '+380671112233' },
    email: 'sales@example.test',
    city: { uk: 'Київ', ru: 'Киев' },
    links: {
      telegram: 'https://t.me/kedr_sales',
      viber: 'viber://chat?number=%2B380671112233',
      map: 'https://maps.app.goo.gl/abc',
    },
  },
}));

vi.mock('@site/shared/company', () => ({ getCompanyContacts: vi.fn(async () => contacts) }));

it.each([
  { locale: 'uk' as const, title: 'Політика конфіденційності', home: 'Головна' },
  { locale: 'ru' as const, title: 'Политика конфиденциальности', home: 'Главная' },
])(
  'delivers the configured complete policy and matching breadcrumb graph for $locale',
  async ({ locale, title, home }) => {
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(await PrivacyPage({ locale }));
    expect(container.querySelector('h1')?.textContent).toBe(title);
    const policy = container.querySelector('[data-privacy-document]')!;
    expect(policy).not.toBeNull();
    expect(policy.querySelectorAll('h2')).toHaveLength(8);
    expect(policy.querySelectorAll('p')).toHaveLength(15);
    expect(policy.querySelectorAll('li')).toHaveLength(11);
    expect(policy.textContent).toContain(new URL(siteConfig.siteUrl).host);
    expect(policy.textContent).toContain(contacts.email);
    expect(policy.textContent).toContain(contacts.phone.display);
    const breadcrumbHome = container.querySelector('header nav a');
    expect(breadcrumbHome?.getAttribute('aria-label')).toBe(home);
    expect(breadcrumbHome?.getAttribute('href')).toBe('/' + locale);

    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts).toHaveLength(1);
    const graph = JSON.parse(scripts[0].textContent!);
    expect(graph['@type']).toBe('BreadcrumbList');
    expect(graph.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: home, item: siteConfig.siteUrl + '/' + locale },
      {
        '@type': 'ListItem',
        position: 2,
        name: title,
        item: siteConfig.siteUrl + '/' + locale + '/privacy-policy',
      },
    ]);
  },
);
