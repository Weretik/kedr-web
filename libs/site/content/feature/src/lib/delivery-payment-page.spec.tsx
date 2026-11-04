import { createSiteConfig } from '@site/core/config';
import { buildSitemapEntries } from '@site/core/seo';
import { renderToStaticMarkup } from 'react-dom/server';

import { CONTENT_SITEMAP_PAGES } from './content-sitemap';
import { DeliveryPaymentPage } from './delivery-payment-page';

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

const cases = [
  {
    locale: 'uk',
    title: 'Доставка та оплата',
    headings: ['Доставка', 'Оплата', 'Як зробити замовлення?', 'Важливо знати'],
  },
  {
    locale: 'ru',
    title: 'Доставка и оплата',
    headings: ['Доставка', 'Оплата', 'Как сделать заказ?', 'Важно знать'],
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
