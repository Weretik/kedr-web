import { getWholesaleTexts } from './wholesale-loader';

const { siteApiGet, cacheLife, cacheTag } = vi.hoisted(() => ({
  siteApiGet: vi.fn(),
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('next/cache', () => ({ cacheLife, cacheTag }));
vi.mock('@site/shared/api-client', () => ({ siteApiGet }));

const steps = [
  { title: 'Оберите товары', text: 'Найдите позиции.' },
  { title: 'Отправьте запрос', text: 'Артикулы и количество.' },
  { title: 'Согласуйте заказ', text: 'Детали с менеджером.' },
];

const text = {
  language: 'ru',
  heroTitle: 'Фурнитура оптом',
  heroLead: 'Вступление.',
  contactCardTitle: 'Обсудим заказ',
  contactCardNote: 'Наличие уточняет менеджер.',
  assortmentTitle: 'Ассортимент',
  assortmentIntro: 'Выберите раздел.',
  companyTitle: 'фурнитура для бизнеса',
  companyText: 'О компании.',
  selectionTitle: 'Подбор',
  selectionText: 'учитываем тип дверей.',
  warehouseTitle: 'Склад',
  warehouseText: 'наличие уточняет менеджер.',
  stepsTitle: 'Как заказать',
  steps,
  faqTitle: 'Вопросы',
  faq: [{ question: 'Как узнать цены?', answer: 'Напишите менеджеру.' }],
  closingTitle: 'Обсудим закупку',
};

describe('getWholesaleTexts', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns the admin copy without the language field', async () => {
    siteApiGet.mockResolvedValue({ kind: 'ok', data: { text, updatedAt: '2026-11-05T10:00:00Z' } });

    const result = await getWholesaleTexts('ru');

    expect(siteApiGet).toHaveBeenCalledWith('/api/content/{lang}/wholesale', {
      path: { lang: 'ru' },
    });
    expect(cacheTag).toHaveBeenCalledWith('content', 'content:wholesale');
    expect(cacheLife).toHaveBeenCalledWith({ stale: 300, revalidate: 600, expire: 86_400 });
    expect(result).toEqual({ kind: 'ok', texts: expect.not.objectContaining({ language: 'ru' }) });
    expect(result).toMatchObject({ kind: 'ok', texts: { heroTitle: 'Фурнитура оптом', steps } });
  });

  it('reports a failed read so the page keeps the code copy', async () => {
    siteApiGet.mockResolvedValue({ kind: 'unavailable' });

    expect(await getWholesaleTexts('uk')).toEqual({ kind: 'unavailable' });
    expect(cacheLife).toHaveBeenCalledWith({ stale: 60, revalidate: 60, expire: 3600 });
  });

  it('treats texts that do not fit the page as unavailable', async () => {
    siteApiGet.mockResolvedValue({
      kind: 'ok',
      data: { text: { ...text, steps: steps.slice(0, 2) }, updatedAt: '2026-11-05T10:00:00Z' },
    });

    expect(await getWholesaleTexts('ru')).toEqual({ kind: 'unavailable' });
  });
});
