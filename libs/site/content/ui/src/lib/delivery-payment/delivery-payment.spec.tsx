import { buildLegalDocument } from '@site/content/model';
import { FALLBACK_COMPANY_CONTACTS as COMPANY_CONTACTS } from '@site/core/config';
import { render, screen, within } from '@testing-library/react';

import {
  DeliveryContact,
  DeliveryPageHeader,
  DeliverySections,
  getDeliveryPaymentDictionary,
} from '../../index';

import type { Locale } from '@site/core/i18n';

const delivery = (locale: Locale) =>
  buildLegalDocument(
    {
      kind: 'delivery-payment',
      number: 1,
      effectiveFrom: '2026-11-03',
      title: 'Доставка та оплата',
      bodyHtml:
        '<p>Кожне замовлення індивідуальне.</p>' +
        '<h2>Як зробити замовлення?</h2><ol><li><strong>Кошик:</strong> виберіть товари.</li><li><strong>Контакти:</strong> вкажіть телефон.</li></ol>' +
        '<h2>Доставка</h2><p>По Україні:</p><ul><li><strong>Служба доставки:</strong> «Нова Пошта».</li></ul>' +
        '<h2>Важливо знати</h2><ul><li>Ціни інформаційні.</li></ul><blockquote>Умови є частиною <a href="/uk/public-offer">оферти</a>.</blockquote>',
    },
    locale,
    { siteHost: 'kedr', email: 'e', phoneDisplay: 'p', phoneHref: 'tel:p' },
    'delivery',
  );

describe.each(['uk', 'ru'] as const)('delivery and payment: %s', (locale) => {
  const dictionary = getDeliveryPaymentDictionary(locale);

  it('shows the page title, the lead and one anchor per published section', () => {
    const { container } = render(
      <DeliveryPageHeader locale={locale} dictionary={dictionary} document={delivery(locale)} />,
    );

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(dictionary.title);
    expect(container.textContent).toContain('Кожне замовлення індивідуальне.');
    const nav = screen.getByRole('navigation', { name: dictionary.sectionNavigation });
    expect(
      within(nav)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href')),
    ).toEqual(['#delivery-1', '#delivery-2', '#delivery-3']);
    container.remove();
  });

  it('renders each section as a card and the numbered list as full-width steps', () => {
    const { container } = render(<DeliverySections sections={delivery(locale).sections} />);

    const sections = [...container.querySelectorAll('section')];
    expect(sections.map((section) => section.id)).toEqual([
      'delivery-1',
      'delivery-2',
      'delivery-3',
    ]);
    expect(sections.map((section) => section.dataset['deliverySection'])).toEqual([
      'steps',
      'terms',
      'terms',
    ]);
    expect(sections[0].querySelectorAll('ol > li')).toHaveLength(2);
    expect(sections[1].querySelector('strong')?.textContent).toBe('Служба доставки:');
    expect(sections[2].querySelector('a')?.getAttribute('href')).toBe('/uk/public-offer');
    container.remove();
  });

  it('calls the saved sales phone', () => {
    const { container } = render(
      <DeliveryContact dictionary={dictionary} phone={COMPANY_CONTACTS.phone} />,
    );

    expect(screen.getByRole('link', { name: dictionary.call }).getAttribute('href')).toBe(
      'tel:' + COMPANY_CONTACTS.phone.e164,
    );
    container.remove();
  });
});
