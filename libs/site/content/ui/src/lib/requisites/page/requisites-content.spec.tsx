import { getRequisitesDictionary } from '@site/content/model';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';

import { RequisitesContent } from './requisites-content';

import type { RequisitesDetails } from '@site/content/model';

// Synthetic UI input only. Production facts belong to the feature/config after EN-001.
const details: RequisitesDetails = {
  legalName: 'ТЕСТ — ФОП «Зразок» Й. І.',
  code: '0001234567',
  registrationExtractNumber: '0000123456789012',
  iban: 'TEST-ua00 001_02',
  bankName: 'ТЕСТ — АТ «Банк»',
  bankCode: '000001',
  phone: { display: 'ТЕСТ телефон', e164: '+000000000000' },
};
const copyText = 'ТЕСТ: готовий payload від feature\nНе переформатовувати в UI.';
const clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');

afterEach(() => {
  cleanup();
  document.body.replaceChildren();
  if (clipboardDescriptor) Object.defineProperty(navigator, 'clipboard', clipboardDescriptor);
  else Reflect.deleteProperty(navigator, 'clipboard');
});

describe.each(['uk', 'ru'] as const)('requisites content in %s', (locale) => {
  const dictionary = getRequisitesDictionary(locale);

  function serverContent() {
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(
      <RequisitesContent dictionary={dictionary} details={details} copyText={copyText} />,
    );
    document.body.appendChild(container);
    return container;
  }

  it('renders supplied official values, localized structure and the contact before hydration', () => {
    const container = serverContent();
    const content = within(container);

    expect(container.querySelector('main')).toBeNull();
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(content.getByRole('heading', { level: 1 }).textContent).toBe(dictionary.title);
    expect(content.getByText(dictionary.intro)).toBeTruthy();
    expect(content.getByText(dictionary.paymentNote)).toBeTruthy();
    expect(content.getByRole('region', { name: dictionary.administrationTitle })).toBeTruthy();
    expect(content.getByRole('region', { name: dictionary.bankTitle })).toBeTruthy();
    expect(content.getByRole('region', { name: dictionary.paymentTitle })).toBeTruthy();
    expect(content.getByRole('complementary', { name: dictionary.helpTitle })).toBeTruthy();
    for (const value of [
      details.legalName,
      details.code,
      '№ ' + details.registrationExtractNumber,
      details.iban,
      details.bankName,
      details.bankCode,
      details.phone.display,
    ]) {
      expect(container.textContent).toContain(value);
    }
    expect(container.querySelector('#requisites-bank code')?.textContent).toBe(details.iban);
    expect(container.querySelectorAll('dl')).toHaveLength(2);
    expect(content.getByRole('button', { name: dictionary.copy.iban })).toBeTruthy();
    expect(content.getByRole('button', { name: dictionary.copy.all })).toBeTruthy();
  });

  it('connects every section anchor and same-language delivery/legal destination', () => {
    const container = serverContent();
    const content = within(container);
    const navigation = content.getByRole('navigation', { name: dictionary.navigationLabel });
    const anchors = [...navigation.querySelectorAll('a')];
    expect(anchors.map((anchor) => anchor.getAttribute('href'))).toEqual([
      '#requisites-administration',
      '#requisites-bank',
      '#requisites-payment',
    ]);
    for (const anchor of anchors) {
      const id = anchor.getAttribute('href')?.slice(1);
      expect(container.querySelectorAll('[id="' + id + '"]')).toHaveLength(1);
    }

    expect(content.getByRole('link', { name: dictionary.home }).getAttribute('href')).toBe(
      '/' + locale,
    );
    for (const [label, path] of [
      [dictionary.deliveryLink, '/delivery-and-payment'],
      [dictionary.publicOfferLink, '/public-offer'],
      [dictionary.privacyPolicyLink, '/privacy-policy'],
    ]) {
      expect(content.getByRole('link', { name: label }).getAttribute('href')).toBe(
        '/' + locale + path,
      );
    }
    expect(content.getByRole('link', { name: details.phone.display }).getAttribute('href')).toBe(
      'tel:' + details.phone.e164,
    );
    expect(content.getByRole('link', { name: dictionary.call }).getAttribute('href')).toBe(
      'tel:' + details.phone.e164,
    );
  });

  it('passes the raw IBAN and separate supplied complete payload to their own actions', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    render(<RequisitesContent dictionary={dictionary} details={details} copyText={copyText} />);

    expect(writeText).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: dictionary.copy.iban }));
    await waitFor(() => expect(writeText).toHaveBeenNthCalledWith(1, details.iban));
    fireEvent.click(screen.getByRole('button', { name: dictionary.copy.all }));
    await waitFor(() => expect(writeText).toHaveBeenNthCalledWith(2, copyText));
    expect(writeText).toHaveBeenCalledTimes(2);
  });
});

it('keeps long supplied names and identifiers intact in the server output', () => {
  const longDetails = {
    ...details,
    legalName: 'ТЕСТ «' + 'ДовгеОфіційнеНайменування'.repeat(12) + '»',
    iban: 'TEST-' + '001'.repeat(40),
  };
  const container = document.createElement('div');
  container.innerHTML = renderToStaticMarkup(
    <RequisitesContent
      dictionary={getRequisitesDictionary('ru')}
      details={longDetails}
      copyText={copyText}
    />,
  );

  expect(container.textContent).toContain(longDetails.legalName);
  expect(container.querySelector('#requisites-bank code')?.textContent).toBe(longDetails.iban);
});
