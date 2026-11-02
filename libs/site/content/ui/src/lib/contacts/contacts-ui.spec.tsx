import { COMPANY } from '@site/core/config';
import { LOCALES } from '@site/core/i18n';
import { cleanup, render, screen, within } from '@testing-library/react';

import { ContactsHeading } from './contacts-heading';
import { LocationCard } from './location-card';
import { SalesContact } from './sales-contact';
import { WholesaleContact } from './wholesale-contact';
import { WrittenChannels } from './written-channels';
import { getContactsDictionary } from '../i18n/contacts-dictionary';

afterEach(cleanup);

describe.each(LOCALES)('contacts UI in %s', (locale) => {
  it('uses real company channels, localized navigation, and selectable contact text', () => {
    const dictionary = getContactsDictionary(locale);
    render(
      <>
        <ContactsHeading locale={locale} dictionary={dictionary} />
        <SalesContact dictionary={dictionary} />
        <WrittenChannels dictionary={dictionary} />
      </>,
    );

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(dictionary.heading);
    const breadcrumbs = screen.getByRole('navigation', { name: dictionary.breadcrumbs });
    expect(
      within(breadcrumbs).getByRole('link', { name: dictionary.home }).getAttribute('href'),
    ).toBe(`/${locale}`);
    expect(breadcrumbs.querySelector('[aria-current="page"]')?.textContent).toBe(
      dictionary.heading,
    );
    expect(screen.getByText(COMPANY.phone.display).tagName).toBe('P');
    expect(screen.getByRole('link', { name: dictionary.call }).getAttribute('href')).toBe(
      `tel:${COMPANY.phone.e164}`,
    );
    expect(screen.getByRole('link', { name: 'Telegram' }).getAttribute('href')).toBe(
      COMPANY.links.telegram,
    );
    expect(screen.getByRole('link', { name: 'Viber' }).getAttribute('href')).toBe(
      COMPANY.links.viber,
    );
    expect(screen.getByRole('link', { name: COMPANY.email }).getAttribute('href')).toBe(
      `mailto:${COMPANY.email}`,
    );
    expect(screen.getByRole('button', { name: dictionary.copyLabel })).toBeTruthy();
    for (const link of screen
      .getAllByRole('link')
      .filter((entry) => entry.getAttribute('target') === '_blank')) {
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    }
  });

  it('shows only the confirmed location and three wholesale preparation items without a form', () => {
    const dictionary = getContactsDictionary(locale);
    const { container } = render(
      <>
        <LocationCard locale={locale} dictionary={dictionary} />
        <WholesaleContact dictionary={dictionary} />
      </>,
    );

    expect(container.querySelector('address')?.textContent).toBe(
      `${dictionary.cityPrefix} ${COMPANY.address.city[locale]}`,
    );
    expect(screen.getByText(dictionary.visitHint)).toBeTruthy();
    expect(screen.getByRole('link', { name: dictionary.map }).getAttribute('href')).toBe(
      COMPANY.links.map,
    );
    const wholesale = screen.getByRole('complementary', { name: dictionary.wholesaleHeading });
    expect(
      within(wholesale)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(dictionary.wholesaleChecklist);
    expect(
      within(wholesale)
        .getByRole('link', { name: dictionary.wholesaleAction })
        .getAttribute('href'),
    ).toBe(COMPANY.links.telegram);
    expect(container.querySelector('form, input, textarea, iframe')).toBeNull();
  });
});
