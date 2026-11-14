import { getPublicOfferDictionary } from '@site/content/model';
import { FALLBACK_COMPANY_CONTACTS as COMPANY_CONTACTS } from '@site/core/config';
import { cleanup, render } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';

import { PublicOfferContent } from './public-offer-content';

import type { LegalDocument } from '@site/content/model';
import type { Locale } from '@site/core/i18n';

afterEach(cleanup);

function offer(locale: Locale): LegalDocument {
  return {
    locale,
    kind: 'public-offer',
    number: 2,
    effectiveFrom: '2026-11-03',
    title: 'Публічна оферта та правила користування сайтом',
    leadHtml: '',
    sections: [
      { id: 'offer-1', title: '1. Загальні положення', html: '<p>Пункт 1.1</p><p>Пункт 1.2</p>' },
      { id: 'offer-2', title: '2. Ціна та оплата', html: '<p>Пункт 2.1</p>' },
      {
        id: 'offer-3',
        title: '3. Прикінцеві положення',
        html: '<p>Пункт 3.1</p><blockquote>Примітка</blockquote>',
      },
    ],
  };
}

describe.each(['uk', 'ru'] as const)('public offer document: %s', (locale) => {
  const dictionary = getPublicOfferDictionary(locale);

  it('renders one localized title, the full name, the edition date and same-language home', () => {
    const { container } = render(
      <PublicOfferContent
        dictionary={dictionary}
        document={offer(locale)}
        contacts={COMPANY_CONTACTS}
      />,
    );
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(container.querySelector('h1')?.textContent).toBe(dictionary.title);
    expect(container.textContent).toContain('Публічна оферта та правила користування сайтом');
    const edition = container.querySelector('[data-document-edition] time');
    expect(edition?.getAttribute('dateTime')).toBe('2026-11-03');
    const home = container.querySelector<HTMLAnchorElement>('[data-offer-breadcrumb] a');
    expect(home?.getAttribute('href')).toBe('/' + locale);
    expect(container.querySelector('main')).toBeNull();
  });

  it('keeps every section and its clauses in complete server HTML', () => {
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(
      <PublicOfferContent
        dictionary={dictionary}
        document={offer(locale)}
        contacts={COMPANY_CONTACTS}
      />,
    );
    const legalDocument = container.querySelector('[data-offer-document]')!;
    expect(legalDocument.querySelectorAll('section')).toHaveLength(3);
    expect([...legalDocument.querySelectorAll('h2')].map((h) => h.textContent)).toEqual([
      '1. Загальні положення',
      '2. Ціна та оплата',
      '3. Прикінцеві положення',
    ]);
    expect(legalDocument.querySelectorAll('p')).toHaveLength(4);
    expect(legalDocument.querySelector('#offer-3 blockquote')?.textContent).toBe('Примітка');
    expect(legalDocument.closest('details')).toBeNull();
  });

  it('links the contents to every section outside the legal text', () => {
    const { container } = render(
      <PublicOfferContent
        dictionary={dictionary}
        document={offer(locale)}
        contacts={COMPANY_CONTACTS}
      />,
    );
    const details = container.querySelector('details')!;
    expect(details.hasAttribute('open')).toBe(false);
    expect(details.querySelector('summary')?.textContent).toContain(dictionary.contentsLabel);
    const anchors = [...details.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
    expect(anchors.map((a) => a.getAttribute('href'))).toEqual([
      '#offer-1',
      '#offer-2',
      '#offer-3',
    ]);
    expect(details.querySelector('[data-offer-document]')).toBeNull();
  });

  it('uses configured phone/email and same-language related pages in the contact blocks', () => {
    const { container } = render(
      <PublicOfferContent
        dictionary={dictionary}
        document={offer(locale)}
        contacts={COMPANY_CONTACTS}
      />,
    );
    const contacts = [...container.querySelectorAll('[data-offer-contact]')];
    expect(contacts.length).toBeGreaterThan(0);
    for (const contact of contacts) {
      const hrefs = [...contact.querySelectorAll('a')].map((a) => a.getAttribute('href'));
      expect(hrefs).toContain('tel:' + COMPANY_CONTACTS.phone.e164);
      expect(hrefs).toContain('mailto:' + COMPANY_CONTACTS.email);
      expect(hrefs).toContain('/' + locale + '/delivery-and-payment');
      expect(hrefs).toContain('/' + locale + '/returns-exchanges');
    }
    const layout = container.querySelector('[data-offer-layout]')!;
    expect(layout.lastElementChild!.hasAttribute('data-offer-contact')).toBe(true);
  });
});
