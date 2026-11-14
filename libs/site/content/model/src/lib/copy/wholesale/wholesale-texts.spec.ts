import { getWholesaleDictionary } from './wholesale-dictionary';
import { applyWholesaleTexts } from './wholesale-texts';

import type { WholesaleTexts } from './wholesale-types';

const texts: WholesaleTexts = {
  heroTitle: 'Фурнітура оптом',
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
  faqTitle: 'Питання',
  faq: [{ question: 'Чи є доставка?', answer: 'Так.' }],
  closingTitle: 'Домовимося',
};

describe('applyWholesaleTexts', () => {
  it('keeps the code copy when the admin texts are unavailable', () => {
    const dictionary = getWholesaleDictionary('uk');

    expect(applyWholesaleTexts(dictionary, null)).toBe(dictionary);
  });

  it('puts the admin copy in place and keeps buttons, links and labels from the code', () => {
    const dictionary = getWholesaleDictionary('uk');

    const result = applyWholesaleTexts(dictionary, texts);

    expect(result.hero).toEqual({
      ...dictionary.hero,
      title: 'Фурнітура оптом',
      lead: 'Новий вступ.',
      contactTitle: 'Напишіть нам',
      contactNote: 'Відповімо сьогодні.',
    });
    expect(result.assortment.unavailable).toBe(dictionary.assortment.unavailable);
    expect(result.company.title).toBe('надійний постачальник');
    expect(result.company.selection).toEqual({ title: 'Підбір', text: 'допоможемо.' });
    expect(result.company.aboutLink).toBe(dictionary.company.aboutLink);
    expect(result.steps.items[2]).toEqual({ title: 'Три', text: 'Третій.' });
    expect(result.faq).toEqual({ title: 'Питання', items: texts.faq });
    expect(result.contact).toEqual({ ...dictionary.contact, title: 'Домовимося' });
    expect(result.breadcrumb).toBe(dictionary.breadcrumb);
  });
});
