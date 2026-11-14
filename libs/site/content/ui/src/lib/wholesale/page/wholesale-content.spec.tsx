import { getWholesaleDictionary } from '@site/content/model';
import { cleanup, render, screen, within } from '@testing-library/react';

import { WholesaleContent } from './wholesale-content';

import type { WholesaleContentProps } from './wholesale-content';
import type { WholesaleCompanyDetails } from '@site/content/model';
import type { Locale } from '@site/core/i18n';

afterEach(cleanup);

const details: WholesaleCompanyDetails = {
  name: 'Fixture Company',
  phone: { display: '(050) 000-03-21', e164: '+380500000321' },
  city: 'Fixture City',
  telegram: 'https://t.me/wholesale_fixture',
  viber: 'viber://chat?number=%2B380500000321',
};

function propsFor(locale: Locale): WholesaleContentProps {
  return {
    dictionary: getWholesaleDictionary(locale),
    details,
    links: {
      home: `/${locale}?from=crumb`,
      catalog: `/${locale}/catalog?from=wholesale`,
      company: `/${locale}#about-company`,
      delivery: `/${locale}/delivery-and-payment?from=wholesale`,
      returns: `/${locale}/returns-exchanges?from=wholesale`,
    },
    assortment: (
      <ul aria-label="Controlled assortment">
        <li>
          <a href={`/${locale}/catalog/controlled-category`}>Controlled category</a>
        </li>
      </ul>
    ),
  };
}

describe.each(['uk', 'ru'] as const)('wholesale content: %s', (locale) => {
  it('renders the approved sections, three steps and immediately readable FAQ without another main', () => {
    const props = propsFor(locale);
    const { dictionary } = props;
    const { container } = render(<WholesaleContent {...props} />);

    expect(
      screen.getAllByRole('heading', { level: 1 }).map((heading) => heading.textContent),
    ).toEqual([locale === 'uk' ? 'Дверна фурнітура оптом' : 'Дверная фурнитура оптом']);
    expect(
      screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent),
    ).toEqual([
      dictionary.hero.contactTitle,
      dictionary.assortment.title,
      `${details.name} — ${dictionary.company.title}`,
      dictionary.steps.title,
      dictionary.faq.title,
      dictionary.contact.title,
    ]);
    expect(screen.getByText(dictionary.hero.lead)).toBeTruthy();
    expect(screen.getByText(dictionary.company.wholesaleRetail)).toBeTruthy();
    expect(screen.getByText(`${dictionary.company.cityPrefix} ${details.city}`)).toBeTruthy();
    expect(screen.getByText(dictionary.company.selectionSupport)).toBeTruthy();
    expect(screen.getByText(dictionary.company.warehouse.text, { exact: false })).toBeTruthy();
    expect(screen.getByRole('list', { name: 'Controlled assortment' })).toBeTruthy();

    const steps = screen.getByRole('region', { name: dictionary.steps.title });
    const stepItems = within(steps).getAllByRole('listitem');
    expect(stepItems).toHaveLength(3);
    dictionary.steps.items.forEach((step, index) => {
      expect(stepItems[index].textContent).toContain(step.title);
      expect(stepItems[index].textContent).toContain(step.text);
    });

    const faq = screen.getByRole('region', { name: dictionary.faq.title });
    expect(faq.querySelectorAll('dt')).toHaveLength(3);
    dictionary.faq.items.forEach((item) => {
      expect(within(faq).getByText(item.question)).toBeTruthy();
      expect(within(faq).getByText(item.answer).closest('[hidden]')).toBeNull();
    });
    expect(container.querySelectorAll('main, form, iframe, details, input, button')).toHaveLength(
      0,
    );
  });

  it('uses supplied contact values for manager actions, calls and the unchanged Viber URI', () => {
    const props = propsFor(locale);
    render(<WholesaleContent {...props} />);

    const primary = screen.getByRole('link', { name: props.dictionary.hero.conditionsAction });
    const final = screen.getByRole('link', { name: props.dictionary.contact.managerAction });
    for (const link of [primary, final, screen.getByRole('link', { name: 'Telegram' })]) {
      expect(link.getAttribute('href')).toBe(details.telegram);
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    }
    const calls = screen.getAllByRole('link', { name: details.phone.display });
    expect(calls).toHaveLength(2);
    calls.forEach((link) => expect(link.getAttribute('href')).toBe(`tel:${details.phone.e164}`));
    expect(screen.getByRole('link', { name: 'Viber' }).getAttribute('href')).toBe(details.viber);
    expect(screen.queryByText('(068) 713-50-49')).toBeNull();
  });

  it('keeps all supplied internal destinations and the current breadcrumb readable', () => {
    const props = propsFor(locale);
    const { dictionary, links } = props;
    render(<WholesaleContent {...props} />);

    const crumbs = screen.getByRole('navigation', { name: dictionary.breadcrumbLabel });
    expect(within(crumbs).getByRole('link', { name: dictionary.home }).getAttribute('href')).toBe(
      links.home,
    );
    expect(within(crumbs).getByText(dictionary.breadcrumb).getAttribute('aria-current')).toBe(
      'page',
    );
    expect(
      screen.getByRole('link', { name: dictionary.hero.catalogAction }).getAttribute('href'),
    ).toBe(links.catalog);
    expect(
      screen.getByRole('link', { name: dictionary.company.aboutLink }).getAttribute('href'),
    ).toBe(links.company);
    expect(
      screen.getByRole('link', { name: dictionary.contact.deliveryLink }).getAttribute('href'),
    ).toBe(links.delivery);
    expect(
      screen.getByRole('link', { name: dictionary.contact.returnsLink }).getAttribute('href'),
    ).toBe(links.returns);
  });

  it('replaces only the unavailable assortment with real catalog and manager actions', () => {
    const props = propsFor(locale);
    const { dictionary } = props;
    render(<WholesaleContent {...props} assortment={null} />);

    const assortment = screen.getByRole('region', { name: dictionary.assortment.title });
    expect(within(assortment).getByText(dictionary.assortment.unavailable)).toBeTruthy();
    expect(
      within(assortment)
        .getByRole('link', { name: dictionary.hero.catalogAction })
        .getAttribute('href'),
    ).toBe(props.links.catalog);
    expect(
      within(assortment)
        .getByRole('link', { name: dictionary.contact.managerAction })
        .getAttribute('href'),
    ).toBe(details.telegram);
    expect(screen.queryByRole('list', { name: 'Controlled assortment' })).toBeNull();
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy();
    expect(screen.getByRole('region', { name: dictionary.steps.title })).toBeTruthy();
    expect(screen.getByRole('region', { name: dictionary.faq.title })).toBeTruthy();
    expect(screen.getAllByRole('link', { name: details.phone.display })).toHaveLength(2);
  });
});
