import { buildLegalDocument, getPrivacyDictionary } from '@site/content/model';
import { FALLBACK_COMPANY_CONTACTS as CONTACTS, siteConfig } from '@site/core/config';
import { cleanup, fireEvent, render, within } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';

import { PrivacyContent } from './privacy-content';

import type { Locale } from '@site/core/i18n';

afterEach(cleanup);

const bindings = {
  siteHost: new URL(siteConfig.siteUrl).host,
  email: CONTACTS.email,
  phoneDisplay: CONTACTS.phone.display,
  phoneHref: 'tel:' + CONTACTS.phone.e164,
};
const BODY =
  '<h2>1. Загальні положення</h2><p>Сайт {site}.</p>' +
  '<h2>2. Склад даних</h2><p>Збираємо:</p><ul><li>телефон;</li><li>ім’я.</li></ul>' +
  '<h2>3. Контакти</h2><p>Пишіть {email} або дзвоніть {phone}.</p>';
const policyDocument = (locale: Locale) =>
  buildLegalDocument(
    {
      kind: 'privacy-policy',
      number: 1,
      effectiveFrom: '2026-11-03',
      title: 'Політика',
      bodyHtml: BODY,
    },
    locale,
    bindings,
    'privacy',
  );
const contactBindings = {
  email: bindings.email,
  phoneDisplay: bindings.phoneDisplay,
  phoneHref: bindings.phoneHref,
};

describe.each([
  {
    locale: 'uk' as const,
    title: 'Політика конфіденційності',
    home: 'Головна',
    action: 'Написати нам',
  },
  {
    locale: 'ru' as const,
    title: 'Политика конфиденциальности',
    home: 'Главная',
    action: 'Написать нам',
  },
])('privacy policy: $locale', ({ locale, title, home, action }) => {
  it('shows one localized H1 and a home breadcrumb in the same language', () => {
    const dictionary = getPrivacyDictionary(locale, contactBindings);
    const { container } = render(
      <PrivacyContent dictionary={dictionary} document={policyDocument(locale)} />,
    );
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(container.querySelector('h1')?.textContent).toBe(title);
    const header = within(container.querySelector('header')!);
    expect(header.getByRole('link', { name: home }).getAttribute('href')).toBe('/' + locale);
    expect(header.getByText(dictionary.intro)).toBeTruthy();
    expect(container.querySelector('main')).toBeNull();
  });

  it('keeps three sourced summary items before the complete document', () => {
    const dictionary = getPrivacyDictionary(locale, contactBindings);
    const { container } = render(
      <PrivacyContent dictionary={dictionary} document={policyDocument(locale)} />,
    );
    const summary = container.querySelector('[data-privacy-summary]')!;
    const policy = container.querySelector('[data-privacy-document]')!;
    expect(summary).not.toBeNull();
    expect(summary.querySelectorAll('dt')).toHaveLength(3);
    expect(summary.querySelectorAll('dd')).toHaveLength(3);
    expect([...summary.querySelectorAll('dt')].map((item) => item.textContent)).toEqual(
      dictionary.summary.map((item) => item.title),
    );
    expect([...summary.querySelectorAll('dd')].map((item) => item.textContent)).toEqual(
      dictionary.summary.map((item) => item.body),
    );
    expect(summary.compareDocumentPosition(policy) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('renders every heading, paragraph and list item of the document in initial server HTML', () => {
    const dictionary = getPrivacyDictionary(locale, contactBindings);
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(
      <PrivacyContent dictionary={dictionary} document={policyDocument(locale)} />,
    );
    const article = container.querySelector('[data-privacy-document]')!;
    expect(article.closest('details')).toBeNull();
    expect(article.querySelectorAll('section')).toHaveLength(3);
    expect([...article.querySelectorAll('h2')].map((h) => h.id)).toEqual([
      'privacy-1',
      'privacy-2',
      'privacy-3',
    ]);
    expect(article.querySelectorAll('p')).toHaveLength(3);
    expect(article.querySelectorAll('li')).toHaveLength(2);
    expect(article.textContent).not.toContain('{site}');
    expect(article.textContent).toContain(bindings.siteHost);
    expect(container.querySelector('[data-document-edition] time')?.getAttribute('dateTime')).toBe(
      '2026-11-03',
    );
  });

  it('provides native collapsed contents, a destination per section and unique IDs', () => {
    const dictionary = getPrivacyDictionary(locale, contactBindings);
    const { container } = render(
      <PrivacyContent dictionary={dictionary} document={policyDocument(locale)} />,
    );
    const mobile = container.querySelector<HTMLDetailsElement>(
      'details[data-privacy-contents="mobile"]',
    )!;
    expect(mobile).not.toBeNull();
    expect(mobile.open).toBe(false);
    expect(mobile.querySelector('summary')?.textContent).toContain(dictionary.contentsLabel);
    expect(mobile.querySelector('[data-privacy-document]')).toBeNull();
    for (const variant of ['mobile', 'desktop']) {
      const nav = container.querySelector('[data-privacy-contents="' + variant + '"]')!;
      const anchors = [...nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
      expect(anchors.map((anchor) => anchor.getAttribute('href'))).toEqual([
        '#privacy-1',
        '#privacy-2',
        '#privacy-3',
      ]);
      expect(nav.querySelector('[aria-current]')).toBeNull();
      for (const anchor of anchors) {
        expect(container.querySelectorAll('[id="' + anchor.hash.slice(1) + '"]')).toHaveLength(1);
      }
    }
    const ids = [...container.querySelectorAll('[id]')].map((node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);
    const article = container.querySelector('[data-privacy-document]')!;
    fireEvent.click(mobile.querySelector('summary')!);
    expect(mobile.open).toBe(true);
    fireEvent.click(mobile.querySelector('summary')!);
    expect(mobile.open).toBe(false);
    expect(article.querySelectorAll('h2')).toHaveLength(3);
  });

  it('uses the same configured contacts in the complete policy and native email action', () => {
    const dictionary = getPrivacyDictionary(locale, contactBindings);
    const { container } = render(
      <PrivacyContent dictionary={dictionary} document={policyDocument(locale)} />,
    );
    const policy = within(container).getByRole('article', { name: dictionary.title });
    expect(within(policy).getByRole('link', { name: CONTACTS.email }).getAttribute('href')).toBe(
      'mailto:' + CONTACTS.email,
    );
    expect(
      within(policy).getByRole('link', { name: CONTACTS.phone.display }).getAttribute('href'),
    ).toBe('tel:' + CONTACTS.phone.e164);
    const contact = within(container).getByRole('complementary', { name: dictionary.contactTitle });
    expect(within(contact).getByRole('link', { name: action }).getAttribute('href')).toBe(
      'mailto:' + CONTACTS.email,
    );
    expect(
      within(contact)
        .getByRole('link', { name: dictionary.relatedOffer.title })
        .getAttribute('href'),
    ).toBe('/' + locale + '/public-offer');
    expect(contact.compareDocumentPosition(policy) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
  });

  it('keeps mobile contents before summary and legal text outside every disclosure', () => {
    const dictionary = getPrivacyDictionary(locale, contactBindings);
    const { container } = render(
      <PrivacyContent dictionary={dictionary} document={policyDocument(locale)} />,
    );
    const header = container.querySelector('header')!;
    const mobile = container.querySelector('details')!;
    const summary = container.querySelector('[data-privacy-summary]')!;
    const policy = container.querySelector('[data-privacy-document]')!;
    for (const block of [header, mobile, summary, policy]) expect(block).not.toBeNull();
    expect(header.compareDocumentPosition(mobile) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(mobile.compareDocumentPosition(summary) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(summary.compareDocumentPosition(policy) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    for (const heading of policy.querySelectorAll('h2'))
      expect(heading.closest('details')).toBeNull();
  });
});
