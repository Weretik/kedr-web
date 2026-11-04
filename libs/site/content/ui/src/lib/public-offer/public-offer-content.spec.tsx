import { getPublicOfferDictionary } from '@site/content/model';
import { FALLBACK_COMPANY_CONTACTS as COMPANY_CONTACTS } from '@site/core/config';
import { cleanup, render } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';

import { PublicOfferContent } from './public-offer-content';

afterEach(cleanup);

describe.each(['uk', 'ru'] as const)('public offer document: %s', (locale) => {
  it('renders one localized title, original full name and same-language home', () => {
    const dictionary = getPublicOfferDictionary(locale);
    const { container } = render(
      <PublicOfferContent dictionary={dictionary} contacts={COMPANY_CONTACTS} />,
    );
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(container.querySelector('h1')?.textContent).toBe(dictionary.title);
    expect(container.textContent).toContain(dictionary.fullTitle);
    const home = container.querySelector<HTMLAnchorElement>('[data-offer-breadcrumb] a');
    expect(home?.getAttribute('href')).toBe('/' + locale);
    expect(home?.getAttribute('aria-label')).toBe(dictionary.home);
    expect(container.querySelector('main')).toBeNull();
  });

  it('keeps all seven headings, 18 literal clauses and final note in complete server HTML', () => {
    const dictionary = getPublicOfferDictionary(locale);
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(
      <PublicOfferContent dictionary={dictionary} contacts={COMPANY_CONTACTS} />,
    );
    const legalDocument = container.querySelector('[data-offer-document]')!;
    expect(legalDocument).not.toBeNull();
    expect(legalDocument.querySelectorAll('section')).toHaveLength(7);
    expect(legalDocument.querySelectorAll('h2')).toHaveLength(7);
    expect(legalDocument.querySelectorAll('[data-offer-clause]')).toHaveLength(18);
    expect(
      [...legalDocument.querySelectorAll('[data-offer-clause]')].map((p) => p.textContent),
    ).toEqual(dictionary.sections.flatMap((section) => section.paragraphs));
    for (const section of dictionary.sections) {
      const target = legalDocument.querySelector('#' + section.id)!;
      expect(target.querySelector('h2')?.textContent).toContain(section.title);
      if (section.subtitle)
        expect(target.querySelector('h2')?.textContent).toContain(section.subtitle);
      expect(target.closest('details')).toBeNull();
    }
    expect(legalDocument.querySelector('[data-offer-note]')?.textContent).toBe(dictionary.note);
    expect(legalDocument.lastElementChild?.hasAttribute('data-offer-note')).toBe(true);
  });

  it('provides seven unique targets and native mobile contents outside the legal text', () => {
    const dictionary = getPublicOfferDictionary(locale);
    const { container } = render(
      <PublicOfferContent dictionary={dictionary} contacts={COMPANY_CONTACTS} />,
    );
    const details = container.querySelector('details')!;
    expect(details).not.toBeNull();
    expect(details.hasAttribute('open')).toBe(false);
    expect(details.querySelector('summary')?.textContent).toContain(dictionary.contentsLabel);
    const anchors = [...details.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
    expect(anchors.map((a) => a.getAttribute('href'))).toEqual(
      dictionary.sections.map((s) => '#' + s.id),
    );
    for (const section of dictionary.sections) {
      expect(container.querySelectorAll('[id="' + section.id + '"]')).toHaveLength(1);
    }
    expect(details.querySelector('[data-offer-document]')).toBeNull();
  });

  it('uses configured phone/email and same-language related pages in the responsive contact blocks', () => {
    const dictionary = getPublicOfferDictionary(locale);
    const { container } = render(
      <PublicOfferContent dictionary={dictionary} contacts={COMPANY_CONTACTS} />,
    );
    const contacts = [...container.querySelectorAll('[data-offer-contact]')];
    expect(contacts.length).toBeGreaterThan(0);
    for (const contact of contacts) {
      expect(contact.textContent).toContain(COMPANY_CONTACTS.phone.display);
      expect(contact.textContent).toContain(COMPANY_CONTACTS.email);
      const hrefs = [...contact.querySelectorAll('a')].map((a) => a.getAttribute('href'));
      expect(hrefs).toContain('tel:' + COMPANY_CONTACTS.phone.e164);
      expect(hrefs).toContain('mailto:' + COMPANY_CONTACTS.email);
      expect(hrefs).toContain('/' + locale + '/delivery-and-payment');
      expect(hrefs).toContain('/' + locale + '/returns-exchanges');
    }
    const layout = container.querySelector('[data-offer-layout]')!;
    const mobileContact = layout.lastElementChild!;
    expect(mobileContact.hasAttribute('data-offer-contact')).toBe(true);
    expect(
      container.querySelector('[data-offer-document]')!.compareDocumentPosition(mobileContact) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
