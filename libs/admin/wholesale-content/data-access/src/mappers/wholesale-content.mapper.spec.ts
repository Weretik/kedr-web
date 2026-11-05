import { mapWholesalePage, toSaveWholesaleBody } from './wholesale-content.mapper';

const text = (language: 'uk' | 'ru', heroTitle: string) => ({
  language,
  heroTitle,
  heroLead: 'Lead',
  contactCardTitle: 'Card',
  contactCardNote: 'Note',
  assortmentTitle: 'Assortment',
  assortmentIntro: 'Intro',
  companyTitle: 'company',
  companyText: 'Company text',
  selectionTitle: 'Selection',
  selectionText: 'selection',
  warehouseTitle: 'Warehouse',
  warehouseText: 'warehouse',
  stepsTitle: 'Steps',
  steps: [1, 2, 3].map((i) => ({ title: `Step ${i}`, text: `Text ${i}` })),
  faqTitle: 'Faq',
  faq: [{ question: 'Q?', answer: 'A.' }],
  closingTitle: 'Closing',
});

describe('wholesale content mapper', () => {
  it('maps both languages by their code and sends them back trimmed, uk first', () => {
    const page = mapWholesalePage({
      texts: [text('ru', 'Оптом'), text('uk', 'Оптом uk')],
      updatedAt: '2026-11-05T00:00:00Z',
      updatedBy: null,
    });
    expect(page.texts.uk.heroTitle).toBe('Оптом uk');
    expect(page.texts.ru.heroTitle).toBe('Оптом');

    const body = toSaveWholesaleBody({
      uk: { ...page.texts.uk, heroTitle: '  Нове  ', faq: [{ question: ' Q? ', answer: 'A.' }] },
      ru: page.texts.ru,
    });
    expect(body.texts.map((item) => item.language)).toEqual(['uk', 'ru']);
    expect(body.texts[0].heroTitle).toBe('Нове');
    expect(body.texts[0].faq[0].question).toBe('Q?');
  });

  it('rejects a response without two languages', () => {
    expect(() =>
      mapWholesalePage({ texts: [text('uk', 'x')], updatedAt: 'x', updatedBy: null }),
    ).toThrow();
  });
});
