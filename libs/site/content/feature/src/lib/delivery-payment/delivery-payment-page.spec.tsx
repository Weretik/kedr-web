import { createSiteConfig } from '@site/core/config';
import { buildSitemapEntries } from '@site/core/seo';
import { renderToStaticMarkup } from 'react-dom/server';

import { DeliveryPaymentPage } from './delivery-payment-page';
import { CONTENT_SITEMAP_PAGES } from '../sitemap/content-sitemap';

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
vi.mock('@site/content/data-access', () => ({
  getLegalDocument: vi.fn(async (locale: string) => ({
    kind: 'ok',
    document: {
      kind: 'delivery-payment',
      number: 1,
      effectiveFrom: '2026-11-03',
      title: 'Доставка',
      bodyHtml:
        '<p>Вступ</p><h2>Доставка</h2><ul><li>НП</li></ul><h2>Оплата</h2><ul><li>IBAN</li></ul>' +
        `<h2>Порядок</h2><ol><li>Кошик</li></ol><h2>Важливо</h2><blockquote><a href="/${locale}/public-offer">Оферта</a></blockquote>`,
    },
  })),
}));

const cases = [
  {
    locale: 'uk',
    title: 'Доставка та оплата',
    headings: ['Доставка', 'Оплата', 'Порядок', 'Важливо'],
  },
  {
    locale: 'ru',
    title: 'Доставка и оплата',
    headings: ['Доставка', 'Оплата', 'Порядок', 'Важливо'],
  },
] as const;

describe('delivery page composition', () => {
  it.each(cases)(
    'renders the complete $locale page in server HTML',
    async ({ locale, title, headings }) => {
      const html = renderToStaticMarkup(await DeliveryPaymentPage({ locale }));
      const page = new DOMParser().parseFromString(html, 'text/html');
      expect([...page.querySelectorAll('h1')].map((el) => el.textContent)).toEqual([title]);
      const sectionTitles = [...page.querySelectorAll('h2')].map((el) => el.textContent);
      for (const heading of headings) expect(sectionTitles).toContain(heading);
      expect(page.querySelector(`a[href="/${locale}/public-offer"]`)).not.toBeNull();
      expect(page.querySelector('a[href="tel:+380671112233"]')).not.toBeNull();
      expect(page.querySelectorAll('main')).toHaveLength(0);
      expect(page.querySelectorAll('script')).toHaveLength(0);
    },
  );

  it('adds both localized content URLs alongside the existing home and catalog entries', () => {
    const config = createSiteConfig({ SITE_ENV: 'production', SITE_INDEXING: 'true' });
    const pages = [{ path: '/' }, { path: '/catalog' }, ...CONTENT_SITEMAP_PAGES];
    const entries = buildSitemapEntries(pages, config);
    const urls = entries.map(({ url }) => url);
    for (const locale of ['uk', 'ru']) {
      for (const path of ['', '/catalog', '/delivery-and-payment']) {
        expect(urls).toContain(`https://classkedr.com.ua/${locale}${path}`);
      }
    }
    for (const locale of ['uk', 'ru']) {
      expect(
        urls.filter((url) => url === `https://classkedr.com.ua/${locale}/delivery-and-payment`),
      ).toHaveLength(1);
    }
    expect(new Set(urls).size).toBe(urls.length);
    expect(
      entries.find(({ url }) => url.endsWith('/uk/delivery-and-payment'))?.alternates?.languages,
    ).toEqual({
      'uk-UA': 'https://classkedr.com.ua/uk/delivery-and-payment',
      'ru-UA': 'https://classkedr.com.ua/ru/delivery-and-payment',
    });
  });
});
