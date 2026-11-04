import { render, screen, within } from '@testing-library/react';

import { HomePage } from './home-page';

const { getCatalogSections, getHomeBlocks } = vi.hoisted(() => ({
  getCatalogSections: vi.fn(),
  getHomeBlocks: vi.fn(),
}));

vi.mock('@site/catalog/data-access', () => ({ getCatalogSections }));
vi.mock('@site/home/data-access', () => ({ getHomeBlocks }));

beforeEach(() => getHomeBlocks.mockResolvedValue({ kind: 'unavailable' }));
vi.mock('@site/shared/company', () => ({
  getCompanyContacts: vi.fn(async () => ({
    phone: { display: '(067) 111-22-33', e164: '+380671112233' },
  })),
}));

const renderHome = async (locale: 'uk' | 'ru') => render(await HomePage({ locale }));

describe('HomePage', () => {
  it('composes the hero, catalog index, and company content without products', async () => {
    getCatalogSections.mockResolvedValue([
      { id: 1, slug: 'zamki-900002', name: 'Замки', children: [] },
    ]);
    await renderHome('uk');

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Каталог дверної фурнітури' }),
    ).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Замки' }).getAttribute('href')).toBe(
      '/uk/catalog/zamki-900002',
    );
    expect(screen.getByRole('search', { name: 'Пошук товару' }).getAttribute('action')).toBe(
      '/uk/search',
    );
    expect(screen.queryByRole('heading', { name: 'Є на складі' })).toBeNull();
    expect(document.querySelector('script[type="application/ld+json"]')?.textContent).toContain(
      '"@type":"WebSite"',
    );
  });

  it('keeps the page useful when the catalog API is unavailable', async () => {
    getCatalogSections.mockResolvedValue(null);

    await renderHome('ru');

    expect(screen.getByRole('status').textContent).toContain('Каталог временно не загрузился');
    expect(screen.getByRole('heading', { level: 2, name: 'Опыт и результаты' })).toBeTruthy();
  });
});

describe('home blocks from the admin', () => {
  it('shows the FAQ and brands edited in the admin', async () => {
    getCatalogSections.mockResolvedValue(null);
    getHomeBlocks.mockResolvedValue({
      kind: 'ok',
      faq: [{ question: 'Чи є доставка?', answer: 'Так, Новою поштою.' }],
      brands: [
        {
          name: 'Apecs',
          src: 'https://images-kedr.cdn.express/brands/apecs.webp',
          width: 320,
          height: 128,
        },
      ],
    });

    await renderHome('uk');

    const faq = document.querySelectorAll('details[name="home-faq"]');
    expect(faq).toHaveLength(1);
    expect(faq[0].querySelector('summary')?.textContent).toContain('Чи є доставка?');
    expect(screen.getByRole('img', { name: 'Apecs' })).toBeTruthy();
    expect(screen.queryByRole('img', { name: 'Korfad' })).toBeNull();
  });

  it('hides an empty FAQ and keeps the built-in logos while no brand is added', async () => {
    getCatalogSections.mockResolvedValue(null);
    getHomeBlocks.mockResolvedValue({ kind: 'ok', faq: [], brands: [] });

    await renderHome('uk');

    expect(screen.queryByRole('heading', { level: 2, name: 'Часті запитання' })).toBeNull();
    expect(screen.getByRole('img', { name: 'Korfad' })).toBeTruthy();
  });
});

describe('home company concept', () => {
  it.each([
    [
      'uk',
      'Про Class Kedr',
      'Як допомагаємо партнерам',
      'Досвід та результати',
      'Бренди, з якими працюємо',
      'Часті запитання',
      'Зв’язатися з менеджером',
    ],
    [
      'ru',
      'О Class Kedr',
      'Как помогаем партнёрам',
      'Опыт и результаты',
      'Бренды, с которыми работаем',
      'Частые вопросы',
      'Связаться с менеджером',
    ],
  ] as const)(
    'renders the complete concept in %s even without the API',
    async (locale, ...labels) => {
      getCatalogSections.mockResolvedValue(null);
      await renderHome(locale);
      for (const label of labels.slice(0, 5)) {
        expect(screen.getByRole('heading', { level: 2, name: label })).toBeTruthy();
      }
      expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
      for (const value of ['15+', '15 000+', '50 000+', '1 000+']) {
        expect(screen.getByText(value)).toBeTruthy();
      }
      for (const name of ['Korfad', 'Leador', 'Syndicate doors', 'Steelguard', 'LA', 'SOVA']) {
        expect(screen.getByRole('img', { name })).toBeTruthy();
      }
      expect(screen.getByRole('region', { name: labels[0] }).id).toBe('about-company');
      const support = screen.getByRole('complementary', { name: labels[1] });
      expect(within(support).getAllByRole('listitem')).toHaveLength(4);
      const faq = document.querySelectorAll('details[name="home-faq"]');
      expect(faq).toHaveLength(6);
      expect(faq[0].hasAttribute('open')).toBe(true);
      for (const [index, item] of Array.from(faq).entries()) {
        expect(item.hasAttribute('open')).toBe(index === 0);
        expect(item.querySelector('summary')?.textContent?.trim()).toBeTruthy();
        expect(item.querySelector('p')?.textContent?.trim()).toBeTruthy();
      }
      expect(screen.getByRole('link', { name: labels[5] }).getAttribute('href')).toBe(
        'tel:+380671112233',
      );
    },
  );
});
