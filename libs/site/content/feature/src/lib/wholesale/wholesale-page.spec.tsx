import { getCatalogTree } from '@site/catalog/data-access';
import { CATALOG_ROOTS } from '@site/catalog/model';
import { getWholesaleDictionary } from '@site/content/model';
import { siteConfig } from '@site/core/config';
import { renderToStaticMarkup } from 'react-dom/server';

import { WholesalePage } from './wholesale-page';

import type { CatalogTreeNode } from '@site/catalog/model';
import type { WholesaleTextsResult } from '@site/content/data-access';
import type { Locale } from '@site/core/i18n';

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

vi.mock('@site/catalog/data-access', () => ({ getCatalogTree: vi.fn() }));

const { getWholesaleTexts } = vi.hoisted(() => ({
  getWholesaleTexts: vi.fn(async () => ({ kind: 'unavailable' }) as WholesaleTextsResult),
}));

vi.mock('@site/content/data-access', () => ({ getWholesaleTexts }));

const hardware = (locale: Locale): CatalogTreeNode[] => {
  const names =
    locale === 'uk'
      ? ['Завіси', 'Замки', 'Ручки', 'Циліндри', 'Міжкімнатні механізми', 'Інше']
      : ['Петли', 'Замки', 'Ручки', 'Цилиндры', 'Межкомнатные механизмы', 'Прочее'];
  return names.map((name, index) => ({
    id: 900001 + index,
    name,
    slug: `group ${index + 1}`,
    productCount: 20 + index,
    children: [
      { id: 100 + index, name: 'Hidden child', slug: 'child', productCount: 1, children: [] },
    ],
  }));
};

const doors: CatalogTreeNode = {
  id: CATALOG_ROOTS.doorsId,
  name: 'Doors excluded',
  slug: 'doors-excluded',
  productCount: 7,
  children: [],
};

async function renderPage(locale: Locale) {
  const container = document.createElement('div');
  container.innerHTML = renderToStaticMarkup(await WholesalePage({ locale }));
  return container;
}

describe.each(['uk', 'ru'] as const)('wholesale server composition: %s', (locale) => {
  beforeEach(() => {
    vi.mocked(getCatalogTree)
      .mockReset()
      .mockResolvedValue([...hardware(locale), doors]);
  });

  it('renders the offer, company and manager links before hydration without a nested main', async () => {
    const container = await renderPage(locale);
    const dictionary = getWholesaleDictionary(locale);
    expect(getCatalogTree).toHaveBeenCalledWith(locale);
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(container.querySelector('h1')?.textContent).toBe(dictionary.hero.title);
    expect(container.querySelector('main')).toBeNull();
    expect(container.querySelector('form')).toBeNull();
    expect(container.textContent).toContain(contacts.phone.display);
    expect(container.textContent).toContain(contacts.city[locale]);
    expect(container.textContent).toContain(dictionary.company.title);
    expect(container.textContent).toContain(dictionary.steps.title);
    expect(container.textContent).toContain(dictionary.faq.title);
    const hrefs = [...container.querySelectorAll('a')].map((link) => link.getAttribute('href'));
    for (const href of [
      `tel:${contacts.phone.e164}`,
      contacts.links.telegram,
      contacts.links.viber,
      `/${locale}/catalog`,
      `/${locale}#about-company`,
      `/${locale}/delivery-and-payment`,
      `/${locale}/returns-exchanges`,
    ]) {
      expect(hrefs).toContain(href);
    }
  });

  it('uses actual localized category slugs in catalog order and excludes doors and secondary details', async () => {
    const container = await renderPage(locale);
    const links = [...container.querySelectorAll(`a[href^="/${locale}/catalog/"]`)];
    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      hardware(locale).map((category) => `/${locale}/catalog/${encodeURIComponent(category.slug)}`),
    );
    for (const category of hardware(locale)) expect(container.textContent).toContain(category.name);
    expect(container.textContent).not.toContain('Doors excluded');
    expect(container.textContent).not.toContain('Hidden child');
    expect(container.querySelector('img[src*="hinges"]')).not.toBeNull();
  });

  it('renders a partial real assortment without inventing missing categories', async () => {
    const partial = hardware(locale).slice(1, 3);
    vi.mocked(getCatalogTree).mockResolvedValueOnce([...partial, doors]);
    const container = await renderPage(locale);
    const links = [...container.querySelectorAll(`a[href^="/${locale}/catalog/"]`)];
    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      partial.map((category) => `/${locale}/catalog/${encodeURIComponent(category.slug)}`),
    );
    expect(container.querySelector('img[src*="hinges"]')).toBeNull();
  });

  it.each([
    { label: 'unavailable', tree: null },
    { label: 'empty', tree: [] },
    { label: 'doors only', tree: [doors] },
  ] satisfies { label: string; tree: CatalogTreeNode[] | null }[])(
    'keeps useful content and contacts when categories are $label',
    async ({ tree }) => {
      vi.mocked(getCatalogTree).mockResolvedValueOnce(tree);
      const container = await renderPage(locale);
      const dictionary = getWholesaleDictionary(locale);
      expect(container.querySelector('h1')?.textContent).toBe(dictionary.hero.title);
      expect(container.textContent).toContain(dictionary.assortment.unavailable);
      expect(container.textContent).toContain(dictionary.company.title);
      expect(container.textContent).toContain(dictionary.steps.title);
      expect(container.textContent).toContain(dictionary.faq.title);
      expect(container.querySelectorAll(`a[href^="/${locale}/catalog/"]`)).toHaveLength(0);
      expect(container.querySelector(`a[href="/${locale}/catalog"]`)).not.toBeNull();
      expect(container.querySelector(`a[href="${contacts.links.telegram}"]`)).not.toBeNull();
      expect(container.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(1);
    },
  );

  it('shows the copy managers saved in the admin, with more than three questions', async () => {
    const faq = Array.from({ length: 4 }, (_, index) => ({
      question: `Питання ${index + 1}?`,
      answer: `Відповідь ${index + 1}.`,
    }));
    getWholesaleTexts.mockResolvedValueOnce({
      kind: 'ok',
      texts: {
        heroTitle: 'Оптові закупівлі фурнітури',
        heroLead: 'Новий вступ.',
        contactCardTitle: 'Напишіть нам',
        contactCardNote: 'Відповімо сьогодні.',
        assortmentTitle: 'Що ми продаємо',
        assortmentIntro: 'Оберіть розділ.',
        companyTitle: 'надійний постачальник',
        companyText: 'Про нас.',
        selectionTitle: 'Підбір',
        selectionText: 'допоможемо.',
        warehouseTitle: 'Склад',
        warehouseText: 'усе в наявності.',
        stepsTitle: 'Три кроки',
        steps: [
          { title: 'Один', text: 'Перший.' },
          { title: 'Два', text: 'Другий.' },
          { title: 'Три', text: 'Третій.' },
        ],
        faqTitle: 'Часті питання',
        faq,
        closingTitle: 'Домовимося',
      },
    });

    const container = await renderPage(locale);

    expect(getWholesaleTexts).toHaveBeenCalledWith(locale);
    expect(container.querySelector('h1')?.textContent).toBe('Оптові закупівлі фурнітури');
    expect(container.textContent).toContain('надійний постачальник');
    expect(container.textContent).toContain('Домовимося');
    expect(container.querySelectorAll('dt')).toHaveLength(4);
    expect(container.textContent).toContain('Відповідь 4.');
  });

  it('adds only the two visible localized breadcrumb items and leaves Organization to layout', async () => {
    const container = await renderPage(locale);
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts).toHaveLength(1);
    const graph = JSON.parse(scripts[0].textContent ?? '{}');
    expect(graph['@type']).toBe('BreadcrumbList');
    expect(graph.itemListElement).toHaveLength(2);
    expect(graph.itemListElement.map((item: { item: string }) => item.item)).toEqual([
      `${siteConfig.siteUrl}/${locale}`,
      `${siteConfig.siteUrl}/${locale}/wholesale`,
    ]);
    expect(graph.itemListElement[1].name).toBe(locale === 'uk' ? 'Співпраця' : 'Сотрудничество');
    for (const type of ['Organization', 'Product', 'Offer', 'FAQPage']) {
      expect(container.innerHTML).not.toContain(`"@type":"${type}"`);
    }
  });
});
