import { attentionItems } from './attention-items';
import { pluralUk } from './plural';

import type {
  DashboardCatalog,
  DashboardContent,
  DashboardOrders,
} from '../entities/dashboard-overview';

const now = new Date('2026-11-05T09:00:00Z');

const orders: DashboardOrders = {
  ordersToday: 3,
  draftCount: 1,
  syncProblemCount: 2,
  syncProblems: [
    {
      orderId: 82,
      orderNumber: '10482',
      counterpartyName: 'Іван',
      createdAt: '2026-11-05T08:00:00Z',
      status: 'BusinessError',
      errorMessage: null,
    },
    {
      orderId: 79,
      orderNumber: '10479',
      counterpartyName: 'ФОП',
      createdAt: '2026-11-04T08:00:00Z',
      status: 'DeadLetter',
      errorMessage: '1С не відповідає',
    },
  ],
  latestOrders: [],
};
const catalog: DashboardCatalog = {
  productsWithoutPhoto: 37,
  topCategoryWithoutPhoto: { id: 5, name: 'Ручки на розетці', count: 12 },
  categoriesWithoutText: 1,
  siteModels: null,
};
const content: DashboardContent = {
  articleDrafts: 3,
  oldestArticleDraft: { id: 7, title: 'Як вибрати ручку', updatedAt: '2026-10-24T08:00:00Z' },
  legacyArticleCovers: 0,
  documentDrafts: 1,
};

describe('attentionItems', () => {
  it('lists problems most urgent first with counts, reasons, and links', () => {
    const items = attentionItems({ orders, catalog, content, now });

    expect(items.map((item) => item.kind)).toEqual([
      'sync',
      'photos',
      'category-texts',
      'article-drafts',
      'document-drafts',
    ]);
    expect(items[0]).toMatchObject({
      tone: 'error',
      title: '1С не прийняла 2 замовлення',
      detail: '№ 10482, № 10479 · 1С не відповідає',
      href: '/orders',
    });
    expect(items[1].title).toBe('37 товарів без фото');
    expect(items[1].detail).toContain('«Ручки на розетці» (12)');
    expect(items[2].title).toBe('1 категорія без тексту для сайту');
    expect(items[3].detail).toBe('Найдовше без змін — «Як вибрати ручку», 12 днів');
    expect(items[4].title).toBe('1 чернетка документа');
  });

  it('puts products without a model first and links site model problems', () => {
    const items = attentionItems({
      orders: undefined,
      catalog: {
        ...catalog,
        siteModels: {
          productsWithoutModel: 12,
          productsWithoutAttributes: 3,
          productsMissingAxisValue: 2,
          productsWithSameCombination: 0,
          modelsWithoutAxes: 0,
          modelsWithoutSeo: 40,
          modelsWithoutPhoto: 1,
          proposedModels: 760,
        },
      },
      content: undefined,
      now,
    });

    expect(items.map((item) => item.kind)).toEqual([
      'site-no-model',
      'photos',
      'site-product-problems',
      'site-model-problems',
      'category-texts',
      'site-proposed-models',
    ]);
    expect(items[0]).toMatchObject({
      tone: 'error',
      title: 'Товари на сайті без моделі: 12',
      href: '/site-showcase?problem=no_model',
    });
    expect(items[2]).toMatchObject({
      title: 'Товари на сайті з неповними ознаками: 5',
      detail: 'без ознак 3 · не заповнена ознака 2',
    });
    expect(items[3]).toMatchObject({
      detail: 'без SEO 40 · без фото 1',
      href: '/site-models?status=accepted&problem=any',
    });
    expect(items[5].href).toBe('/site-models?status=proposed');
  });

  it('links a single problem straight to its page', () => {
    const items = attentionItems({
      orders: { ...orders, syncProblemCount: 1, syncProblems: [orders.syncProblems[0]] },
      catalog: undefined,
      content: { ...content, articleDrafts: 1 },
      now,
    });

    expect(items.find((item) => item.kind === 'sync')?.href).toBe('/orders/82');
    expect(items.find((item) => item.kind === 'article-drafts')?.href).toBe('/articles/7');
  });

  it('shows nothing for zero counts or blocks that did not load', () => {
    expect(
      attentionItems({
        orders: { ...orders, syncProblemCount: 0, syncProblems: [] },
        catalog: {
          productsWithoutPhoto: 0,
          topCategoryWithoutPhoto: null,
          categoriesWithoutText: 0,
          siteModels: null,
        },
        content: undefined,
        now,
      }),
    ).toEqual([]);
  });
});

describe('pluralUk', () => {
  it.each([
    [1, 'товар'],
    [3, 'товари'],
    [5, 'товарів'],
    [11, 'товарів'],
    [21, 'товар'],
    [114, 'товарів'],
  ])('%i → %s', (count, form) => {
    expect(pluralUk(count, ['товар', 'товари', 'товарів'])).toBe(form);
  });
});
