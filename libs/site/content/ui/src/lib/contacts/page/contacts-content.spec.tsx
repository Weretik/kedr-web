import { getContactsDictionary } from '@site/content/model';
import { FALLBACK_COMPANY_CONTACTS as CONTACTS } from '@site/core/config';
import { cleanup, render, screen, within } from '@testing-library/react';

import { ContactsContent } from './contacts-content';

import type { ContactsDetails } from '@site/content/model';

afterEach(cleanup);

function detailsFor(locale: 'uk' | 'ru'): ContactsDetails {
  return {
    phone: CONTACTS.phone,
    email: CONTACTS.email,
    city: CONTACTS.city[locale],
    ...CONTACTS.links,
  };
}

describe.each(['uk', 'ru'] as const)('contacts content: %s', (locale) => {
  it('renders the approved heading order and real section anchor destinations', () => {
    const dictionary = getContactsDictionary(locale);
    const { container } = render(
      <ContactsContent dictionary={dictionary} details={detailsFor(locale)} />,
    );

    expect(
      screen.getAllByRole('heading', { level: 1 }).map((heading) => heading.textContent),
    ).toEqual([locale === 'uk' ? 'Контакти' : 'Контакты']);
    expect(
      screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent),
    ).toEqual([
      dictionary.salesTitle,
      dictionary.writeTitle,
      dictionary.locationTitle,
      dictionary.wholesaleTitle,
      dictionary.prepareTitle,
    ]);
    const home = screen.getByRole('link', { name: dictionary.home });
    expect(home.getAttribute('href')).toBe('/' + locale);
    const navigation = screen.getByRole('navigation', { name: dictionary.navigationLabel });
    const anchors = within(navigation).getAllByRole('link');
    expect(anchors.map((anchor) => anchor.getAttribute('href'))).toEqual([
      '#contacts-connect',
      '#contacts-location',
      '#contacts-wholesale',
    ]);
    for (const anchor of anchors) {
      expect(container.querySelector(anchor.getAttribute('href')!)).not.toBeNull();
    }
    expect(container.querySelectorAll('main, form, iframe')).toHaveLength(0);
    expect(screen.getByText(dictionary.prepareText)).toBeDefined();
  });

  it('keeps the sales number and main call action separate from copying', () => {
    const dictionary = getContactsDictionary(locale);
    render(<ContactsContent dictionary={dictionary} details={detailsFor(locale)} />);
    const sales = screen.getByRole('region', { name: dictionary.salesTitle });
    const salesLinks = within(sales).getAllByRole('link');

    expect(salesLinks.map((link) => link.textContent)).toEqual([
      CONTACTS.phone.display,
      dictionary.call,
    ]);
    expect(salesLinks.map((link) => link.getAttribute('href'))).toEqual([
      'tel:' + CONTACTS.phone.e164,
      'tel:' + CONTACTS.phone.e164,
    ]);
    expect(
      within(sales).getByRole('button', { name: dictionary.copyLabel }).getAttribute('type'),
    ).toBe('button');
    expect(within(sales).getByRole('status')).toBeDefined();
  });

  it('exposes the configured written contact channels with readable names', () => {
    const dictionary = getContactsDictionary(locale);
    render(<ContactsContent dictionary={dictionary} details={detailsFor(locale)} />);
    const written = screen.getByRole('region', { name: dictionary.writeTitle });
    const links = within(written).getAllByRole('link');

    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      CONTACTS.links.telegram,
      CONTACTS.links.viber,
      'mailto:' + CONTACTS.email,
    ]);
    expect(links[0].textContent).toContain('Telegram');
    expect(links[0].textContent).toContain(dictionary.telegramCaption);
    expect(links[1].textContent).toContain('Viber');
    expect(links[1].textContent).toContain(dictionary.viberCaption);
    expect(links[2].textContent).toContain(dictionary.emailLabel);
    expect(links[2].textContent).toContain(CONTACTS.email);
    expect(links[0].getAttribute('rel')).toContain('noopener');
  });

  it('uses the confirmed city and map with a telephone alternative for planning a visit', () => {
    const dictionary = getContactsDictionary(locale);
    render(<ContactsContent dictionary={dictionary} details={detailsFor(locale)} />);
    const location = screen.getByRole('region', { name: dictionary.locationTitle });

    expect(within(location).getByText(CONTACTS.city[locale])).toBeDefined();
    expect(within(location).getByText(dictionary.visitText)).toBeDefined();
    expect(
      within(location).getByRole('link', { name: dictionary.openMap }).getAttribute('href'),
    ).toBe(CONTACTS.links.map);
    expect(
      within(location).getByRole('link', { name: dictionary.contactManager }).getAttribute('href'),
    ).toBe('tel:' + CONTACTS.phone.e164);
  });

  it('links cooperation to Telegram and both help pages to the current language', () => {
    const dictionary = getContactsDictionary(locale);
    render(<ContactsContent dictionary={dictionary} details={detailsFor(locale)} />);
    const wholesale = screen.getByRole('region', { name: dictionary.wholesaleTitle });
    expect(
      within(wholesale).getByRole('link', { name: dictionary.writeManager }).getAttribute('href'),
    ).toBe(CONTACTS.links.telegram);
    const help = screen.getByRole('navigation', { name: dictionary.helpLabel });
    expect(
      within(help).getByRole('link', { name: dictionary.deliveryLink }).getAttribute('href'),
    ).toBe(`/${locale}/delivery-and-payment`);
    expect(
      within(help).getByRole('link', { name: dictionary.returnsLink }).getAttribute('href'),
    ).toBe(`/${locale}/returns-exchanges`);
  });
});

it('renders supplied company facts instead of freezing a second copy in the UI', () => {
  const dictionary = getContactsDictionary('uk');
  const supplied: ContactsDetails = {
    phone: { display: 'Телефон менеджера', e164: '+380501234567' },
    email: 'sales@example.test',
    city: 'Місто з конфігурації',
    telegram: 'https://t.me/example_contacts',
    viber: 'viber://chat?number=%2B380501234567',
    map: 'https://maps.example.test/company',
  };
  const { container } = render(<ContactsContent dictionary={dictionary} details={supplied} />);

  expect(screen.getByRole('link', { name: supplied.phone.display }).getAttribute('href')).toBe(
    'tel:' + supplied.phone.e164,
  );
  expect(screen.getByText(supplied.city)).toBeDefined();
  expect(container.textContent).not.toContain(CONTACTS.phone.display);
  expect(container.textContent).not.toContain(CONTACTS.email);
  expect(container.querySelector('a[href="mailto:sales@example.test"]')).not.toBeNull();
  expect(container.querySelector('a[href="https://maps.example.test/company"]')).not.toBeNull();
});
