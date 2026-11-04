import {
  buildLegalDocument,
  demoteHeadings,
  fillDocumentPlaceholders,
  formatEffectiveDate,
  splitDocumentSections,
} from './legal-document-html';

const bindings = {
  siteHost: 'classkedr.com.ua',
  email: 'sales@kedr.ua',
  phoneDisplay: '+38 (067) 000-00-00',
  phoneHref: 'tel:+380670000000',
};

describe('legal document HTML', () => {
  it('fills the site, email and phone placeholders with escaped values and links', () => {
    expect(fillDocumentPlaceholders('<p>{site}: {email}, {phone}</p>', bindings)).toBe(
      '<p>classkedr.com.ua: <a href="mailto:sales@kedr.ua">sales@kedr.ua</a>, ' +
        '<a href="tel:+380670000000">+38 (067) 000-00-00</a></p>',
    );
    expect(fillDocumentPlaceholders('{email}', { ...bindings, email: 'a"<b>' })).toBe(
      '<a href="mailto:a&quot;&lt;b&gt;">a&quot;&lt;b&gt;</a>',
    );
  });

  it('splits the body at h2 headings with numbered ids and keeps the lead', () => {
    const { leadHtml, sections } = splitDocumentSections(
      '<p>Вступ</p><h2>Перший &amp; <strong>головний</strong></h2><p>А</p><h2>Другий</h2><ul><li>Б</li></ul>',
      'offer',
    );

    expect(leadHtml).toBe('<p>Вступ</p>');
    expect(sections).toEqual([
      { id: 'offer-1', title: 'Перший & головний', html: '<p>А</p>' },
      { id: 'offer-2', title: 'Другий', html: '<ul><li>Б</li></ul>' },
    ]);
  });

  it('returns the whole body as lead when there are no h2 headings', () => {
    expect(splitDocumentSections('<p>Лише текст</p>', 'x')).toEqual({
      leadHtml: '<p>Лише текст</p>',
      sections: [],
    });
  });

  it('demotes headings one level', () => {
    expect(demoteHeadings('<h2>А</h2><h3>Б</h3><p>h2</p>')).toBe('<h3>А</h3><h4>Б</h4><p>h2</p>');
  });

  it('builds a document from the API edition', () => {
    const document = buildLegalDocument(
      {
        kind: 'privacy-policy',
        number: 2,
        effectiveFrom: '2026-11-03',
        title: 'Політика',
        bodyHtml: '<h2>Контакти</h2><p>{email}</p>',
      },
      'uk',
      bindings,
      'privacy',
    );

    expect(document.number).toBe(2);
    expect(document.sections[0].html).toContain('mailto:sales@kedr.ua');
  });

  it('formats the effective date in the page language', () => {
    expect(formatEffectiveDate('2026-11-03', 'uk')).toBe('3 листопада 2026 р.');
    expect(formatEffectiveDate('2026-11-03', 'ru')).toBe('3 ноября 2026 г.');
  });
});
