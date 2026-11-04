import { getReturnsDictionary } from '@site/content/model';
import { FALLBACK_COMPANY_CONTACTS as COMPANY_CONTACTS } from '@site/core/config';
import { cleanup, render, screen, within } from '@testing-library/react';

import { ReturnsContent } from './returns-content';

afterEach(cleanup);

describe.each([
  {
    locale: 'uk' as const,
    title: 'Повернення та обмін',
    call: 'Зателефонувати',
    home: 'Головна',
    exclusion: 'Товари, виготовлені за індивідуальним замовленням',
    visual: 'Правило 1 метра:',
  },
  {
    locale: 'ru' as const,
    title: 'Возврат и обмен',
    call: 'Позвонить',
    home: 'Главная',
    exclusion: 'Товары, изготовленные по индивидуальному заказу',
    visual: 'Правило 1 метра:',
  },
])('returns page: $locale', ({ locale, title, call, home, exclusion, visual }) => {
  it('has one translated H1, the same-language home and real anchor destinations', () => {
    const { container } = render(
      <ReturnsContent dictionary={getReturnsDictionary(locale)} phone={COMPANY_CONTACTS.phone} />,
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
      <ReturnsContent dictionary={dictionary} phone={COMPANY_CONTACTS.phone} />,
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
    render(<ReturnsContent dictionary={dictionary} phone={COMPANY_CONTACTS.phone} />);
    expect(screen.getByRole('link', { name: call }).getAttribute('href')).toBe(
      'tel:' + COMPANY_CONTACTS.phone.e164,
    );
    expect(
      screen.getByRole('link', { name: COMPANY_CONTACTS.phone.display }).getAttribute('href'),
    ).toBe('tel:' + COMPANY_CONTACTS.phone.e164);
    const policy = screen.getByRole('region', { name: dictionary.policyTitle });
    expect(policy.textContent).toContain(exclusion);
    expect(policy.textContent).toContain(visual);
    expect(within(policy).getAllByRole('heading', { level: 3 })).toHaveLength(4);
  });

  it('delivers FAQ answers in native disclosure markup without client handlers', () => {
    const dictionary = getReturnsDictionary(locale);
    const { container } = render(
      <ReturnsContent dictionary={dictionary} phone={COMPANY_CONTACTS.phone} />,
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
