import { validateWholesaleDraft } from './wholesale-rules';
import { moveFaqItem } from '../forms/wholesale-draft';

import type { WholesaleText } from '../entities/wholesale-page';

const sampleText = (title = 'Оптом'): WholesaleText => ({
  heroTitle: title,
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

describe('wholesale rules', () => {
  it('accepts filled texts in both languages', () => {
    expect(validateWholesaleDraft({ uk: sampleText(), ru: sampleText() })).toBeUndefined();
  });

  it('marks an empty field, an empty step, a long answer and no questions per language', () => {
    const uk = sampleText(' ');
    uk.steps[1] = { title: 'x', text: '' };
    uk.faq = [{ question: 'Q?', answer: 'a'.repeat(1001) }];
    const ru = { ...sampleText(), faq: [] };

    const errors = validateWholesaleDraft({ uk, ru });

    expect(errors?.uk?.fields?.heroTitle).toBe('Заповніть поле.');
    expect(errors?.uk?.steps?.[1]).toEqual({ title: undefined, text: 'Заповніть поле.' });
    expect(errors?.uk?.faq?.[0].answer).toBe('Не більше 1000 символів.');
    expect(errors?.ru?.faqCount).toBe('Додайте хоча б одне питання.');
  });

  it('moves a question within the list only', () => {
    expect(moveFaqItem(['a', 'b', 'c'], 0, 1)).toEqual(['b', 'a', 'c']);
    expect(moveFaqItem(['a', 'b'], 0, -1)).toEqual(['a', 'b']);
  });
});
