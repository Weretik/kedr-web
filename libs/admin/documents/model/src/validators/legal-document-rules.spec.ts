import { validateEffectiveFrom, validateLegalDocumentDraft } from './legal-document-rules';

const text = (title: string, bodyHtml: string) => ({ title, bodyHtml });

describe('legal document rules', () => {
  it('accepts both languages with a title and a body', () => {
    expect(
      validateLegalDocumentDraft({
        texts: { uk: text('Оферта', '<p>А</p>'), ru: text('Оферта', '<p>Б</p>') },
      }),
    ).toBeUndefined();
  });

  it('marks the language with an empty title or an empty editor', () => {
    expect(
      validateLegalDocumentDraft({
        texts: { uk: text(' ', '<p>А</p>'), ru: text('Оферта', '<p></p>') },
      }),
    ).toEqual({
      uk: { title: 'Вкажіть назву.', bodyHtml: undefined },
      ru: { title: undefined, bodyHtml: 'Напишіть текст документа.' },
    });
  });

  it('does not allow a date before the edition on the site', () => {
    expect(validateEffectiveFrom('2026-11-10', '2026-11-03')).toBeUndefined();
    expect(validateEffectiveFrom('2026-11-03', '2026-11-03')).toBeUndefined();
    expect(validateEffectiveFrom('2026-11-01', '2026-11-03')).toBe(
      'Не раніше за дату чинної редакції (03.11.2026).',
    );
    expect(validateEffectiveFrom('', null)).toBe('Вкажіть дату.');
  });
});
