import { buildLegalDocument, getReturnsDictionary } from '@site/content/model';
import { FALLBACK_COMPANY_CONTACTS as COMPANY_CONTACTS } from '@site/core/config';
import { cleanup, render, screen, within } from '@testing-library/react';

import { ReturnsContent } from './returns-content';

import type { Locale } from '@site/core/i18n';

afterEach(cleanup);

const rules = (locale: Locale) =>
  buildLegalDocument(
    {
      kind: 'returns-policy',
      number: 1,
      effectiveFrom: '2026-11-03',
      title: 'Правила повернення',
      bodyHtml:
        '<p>Вступ</p><h2>1. Загальні</h2><ul><li>Виключення</li></ul>' +
        '<h2>2. Гарантія</h2><h3>Правило 1 метра:</h3><p>Огляд</p>',
    },
    locale,
    { siteHost: 'kedr', email: 'e', phoneDisplay: 'p', phoneHref: 'tel:p' },
    'returns',
  );

describe.each([
  {
    locale: 'uk' as const,
    title: 'Повернення та обмін',
    call: 'Зателефонувати',
    home: 'Головна',
  },
  {
    locale: 'ru' as const,
    title: 'Возврат и обмен',
    call: 'Позвонить',
    home: 'Главная',
  },
])('returns page: $locale', ({ locale, title, call, home }) => {
  it('has one translated H1, the same-language home and real anchor destinations', () => {
    const { container } = render(
      <ReturnsContent
        dictionary={getReturnsDictionary(locale)}
        document={rules(locale)}
        phone={COMPANY_CONTACTS.phone}
      />,
    );
    const header = within(container.querySelector('header')!);
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(header.getByRole('heading', { level: 1 }).textContent).toBe(title);
    expect(header.getByRole('link', { name: home }).getAttribute('href')).toBe('/' + locale);
    const anchors = [...container.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
    expect(anchors.map((anchor) => anchor.getAttribute('href'))).toEqual([
      '#return-conditions',
      '#return-warranty',
      '#return-process',
      '#return-full-rules',
    ]);
    for (const anchor of anchors) {
      expect(container.querySelector(anchor.getAttribute('href')!)).not.toBeNull();
    }
  });

  it('shows both term panels, all summary rows and ordered process steps', () => {
    const dictionary = getReturnsDictionary(locale);
    const { container } = render(
      <ReturnsContent
        dictionary={dictionary}
        document={rules(locale)}
        phone={COMPANY_CONTACTS.phone}
      />,
    );
    const conditions = screen.getByRole('region', { name: dictionary.conditionsTitle });
    const warranty = screen.getByRole('region', { name: dictionary.warrantyTitle });
    expect(conditions.querySelectorAll('dt')).toHaveLength(4);
    expect(warranty.querySelectorAll('dt')).toHaveLength(4);
    expect(conditions.textContent).toContain('14');
    const process = screen.getByRole('region', { name: dictionary.processTitle });
    expect(
      within(process)
        .getAllByRole('listitem')
        .map((item) => item.querySelector('h3')?.textContent),
    ).toEqual(dictionary.steps.map((step) => step.title));
    expect(container.querySelectorAll('#return-process ol > li')).toHaveLength(3);
  });

  it('uses configured contact details and retains complete policy subjects', () => {
    const dictionary = getReturnsDictionary(locale);
    render(
      <ReturnsContent
        dictionary={dictionary}
        document={rules(locale)}
        phone={COMPANY_CONTACTS.phone}
      />,
    );
    expect(screen.getByRole('link', { name: call }).getAttribute('href')).toBe(
      'tel:' + COMPANY_CONTACTS.phone.e164,
    );
    expect(
      screen.getByRole('link', { name: COMPANY_CONTACTS.phone.display }).getAttribute('href'),
    ).toBe('tel:' + COMPANY_CONTACTS.phone.e164);
    const policy = screen.getByRole('region', { name: 'Правила повернення' });
    expect(policy.textContent).toContain('Виключення');
    expect(
      within(policy)
        .getAllByRole('heading', { level: 3 })
        .map((h) => h.textContent),
    ).toEqual(['1. Загальні', '2. Гарантія']);
    expect(within(policy).getByRole('heading', { level: 4 }).textContent).toBe('Правило 1 метра:');
    expect(policy.querySelector('[data-document-edition] time')?.getAttribute('dateTime')).toBe(
      '2026-11-03',
    );
  });

  it('delivers FAQ answers in native disclosure markup without client handlers', () => {
    const dictionary = getReturnsDictionary(locale);
    const { container } = render(
      <ReturnsContent
        dictionary={dictionary}
        document={rules(locale)}
        phone={COMPANY_CONTACTS.phone}
      />,
    );
    const items = [...container.querySelectorAll('details[name="returns-faq"]')];
    expect(items).toHaveLength(3);
    for (let index = 0; index < items.length; index += 1) {
      expect(items[index].querySelector('summary')?.textContent).toContain(
        dictionary.questions[index].title,
      );
      expect(items[index].textContent).toContain(dictionary.questions[index].text);
    }
  });
});
