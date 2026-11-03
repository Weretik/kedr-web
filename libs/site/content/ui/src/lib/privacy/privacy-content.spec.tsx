import { getPrivacyDictionary } from '@site/content/model';
import { COMPANY, siteConfig } from '@site/core/config';
import { cleanup, fireEvent, render, within } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';

import { PrivacyContent } from './privacy-content';

import type { PrivacyInline } from '@site/content/model';

afterEach(cleanup);

const bindings = {
  siteHost: new URL(siteConfig.siteUrl).host,
  email: COMPANY.email,
  phoneDisplay: COMPANY.phone.display,
  phoneHref: 'tel:' + COMPANY.phone.e164,
};
const inlineText = (content: readonly PrivacyInline[]) => content.map((part) => part.text).join('');

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
    const dictionary = getPrivacyDictionary(locale, bindings);
    const { container } = render(<PrivacyContent dictionary={dictionary} />);
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(container.querySelector('h1')?.textContent).toBe(title);
    const header = within(container.querySelector('header')!);
    expect(header.getByRole('link', { name: home }).getAttribute('href')).toBe('/' + locale);
    expect(header.getByText(dictionary.intro)).toBeTruthy();
    expect(container.querySelector('main')).toBeNull();
  });

  it('keeps three sourced summary items before the complete document', () => {
    const dictionary = getPrivacyDictionary(locale, bindings);
    const { container } = render(<PrivacyContent dictionary={dictionary} />);
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

  it('renders all eight headings, 15 paragraphs and 11 list items in initial server HTML', () => {
    const dictionary = getPrivacyDictionary(locale, bindings);
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(<PrivacyContent dictionary={dictionary} />);
    const policy = container.querySelector('[data-privacy-document]')!;
    expect(policy).not.toBeNull();
    expect(policy.closest('details')).toBeNull();
    expect(policy.querySelectorAll('section')).toHaveLength(8);
    expect(policy.querySelectorAll('h2')).toHaveLength(8);
    expect(policy.querySelectorAll('p')).toHaveLength(15);
    expect(policy.querySelectorAll('li')).toHaveLength(11);
    const expectedUnits = dictionary.sections.flatMap((section) =>
      section.blocks.flatMap((block) =>
        block.kind === 'paragraph'
          ? [inlineText(block.content)]
          : block.items.map((item) => inlineText(item.content)),
      ),
    );
    expect(
      [...policy.querySelectorAll('[data-privacy-source]')].map((unit) => unit.textContent),
    ).toEqual(expectedUnits);
    for (const section of dictionary.sections) {
      expect(policy.querySelector('[id="' + section.id + '"]')?.textContent).toBe(section.title);
    }
    expect(policy.textContent).not.toContain('kedr-web.vercel.app');
    expect(policy.textContent).toContain(bindings.siteHost);
    expect(policy.textContent).toContain(COMPANY.email);
    expect(policy.textContent).toContain(COMPANY.phone.display);
  });

  it('provides native collapsed contents, eight valid destinations per variant and unique IDs', () => {
    const dictionary = getPrivacyDictionary(locale, bindings);
    const { container } = render(<PrivacyContent dictionary={dictionary} />);
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
      expect(anchors.map((anchor) => anchor.getAttribute('href'))).toEqual(
        dictionary.sections.map((section) => '#' + section.id),
      );
      expect(nav.querySelector('[aria-current]')).toBeNull();
      for (const anchor of anchors) {
        expect(container.querySelectorAll('[id="' + anchor.hash.slice(1) + '"]')).toHaveLength(1);
      }
    }
    const ids = [...container.querySelectorAll('[id]')].map((node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);
    const policy = container.querySelector('[data-privacy-document]')!;
    fireEvent.click(mobile.querySelector('summary')!);
    expect(mobile.open).toBe(true);
    fireEvent.click(mobile.querySelector('summary')!);
    expect(mobile.open).toBe(false);
    expect(policy.querySelectorAll('h2')).toHaveLength(8);
  });

  it('uses the same configured contacts in the complete policy and native email action', () => {
    const dictionary = getPrivacyDictionary(locale, bindings);
    const { container } = render(<PrivacyContent dictionary={dictionary} />);
    const policy = within(container).getByRole('article', { name: dictionary.title });
    expect(within(policy).getByRole('link', { name: COMPANY.email }).getAttribute('href')).toBe(
      'mailto:' + COMPANY.email,
    );
    expect(
      within(policy).getByRole('link', { name: COMPANY.phone.display }).getAttribute('href'),
    ).toBe('tel:' + COMPANY.phone.e164);
    const contact = within(container).getByRole('complementary', { name: dictionary.contactTitle });
    expect(within(contact).getByRole('link', { name: action }).getAttribute('href')).toBe(
      'mailto:' + COMPANY.email,
    );
    expect(
      within(contact)
        .getByRole('link', { name: dictionary.relatedOffer.title })
        .getAttribute('href'),
    ).toBe('/' + locale + '/public-offer');
    expect(contact.compareDocumentPosition(policy) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
  });

  it('keeps mobile contents before summary and legal text outside every disclosure', () => {
    const dictionary = getPrivacyDictionary(locale, bindings);
    const { container } = render(<PrivacyContent dictionary={dictionary} />);
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
