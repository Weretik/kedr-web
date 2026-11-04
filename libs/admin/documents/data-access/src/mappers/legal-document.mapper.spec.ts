import { mapLegalDocumentVersion, toSaveDraftBody } from './legal-document.mapper';

const version = {
  id: 7,
  kind: 'public-offer',
  status: 'draft',
  number: null,
  effectiveFrom: null,
  updatedAt: '2026-11-04T10:00:00Z',
  updatedBy: 'manager@kedr.ua',
  publishedAt: null,
  publishedBy: null,
  texts: [
    { language: 'ru', title: 'Оферта', bodyHtml: '<p>Ру</p>' },
    { language: 'uk', title: 'Оферта', bodyHtml: '<p>Укр</p>' },
  ],
};

describe('legal document mapper', () => {
  it('keys the texts by language', () => {
    const mapped = mapLegalDocumentVersion(version);

    expect(mapped.texts.uk.bodyHtml).toBe('<p>Укр</p>');
    expect(mapped.texts.ru.bodyHtml).toBe('<p>Ру</p>');
    expect(mapped.status).toBe('draft');
  });

  it('rejects an unknown kind', () => {
    expect(() => mapLegalDocumentVersion({ ...version, kind: 'cookies' })).toThrow();
  });

  it('sends both languages trimmed', () => {
    expect(
      toSaveDraftBody({
        texts: {
          uk: { title: ' А ', bodyHtml: '<p>1</p> ' },
          ru: { title: 'Б', bodyHtml: '<p>2</p>' },
        },
      }),
    ).toEqual({
      texts: [
        { language: 'uk', title: 'А', bodyHtml: '<p>1</p>' },
        { language: 'ru', title: 'Б', bodyHtml: '<p>2</p>' },
      ],
    });
  });
});
