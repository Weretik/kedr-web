import { FALLBACK_COMPANY_CONTACTS } from '@site/core/config';
import { fireEvent, render, screen, within } from '@testing-library/react';

import { SiteShell } from './site-shell';

vi.mock('next/navigation', () => ({ usePathname: () => '/ru/wholesale' }));
vi.mock('../footer/copyright-year', () => ({ CopyrightYear: () => '2026' }));

describe('SiteShell', () => {
  it.each([
    ['uk', 'Про компанію', 'Відкрити меню'],
    ['ru', 'О компании', 'Открыть меню'],
  ] as const)(
    'links to the home company section from every menu in %s',
    (locale, label, openMenu) => {
      render(
        <SiteShell contacts={FALLBACK_COMPANY_CONTACTS} locale={locale}>
          content
        </SiteShell>,
      );

      const expectedHref = `/${locale}#about-company`;
      const header = screen.getByRole('banner');
      const footer = screen.getByRole('contentinfo');
      expect(within(header).getByRole('link', { name: label }).getAttribute('href')).toBe(
        expectedHref,
      );
      expect(within(footer).getByRole('link', { name: label }).getAttribute('href')).toBe(
        expectedHref,
      );

      fireEvent.click(within(header).getByRole('button', { name: openMenu }));
      expect(
        within(screen.getByRole('dialog')).getByRole('link', { name: label }).getAttribute('href'),
      ).toBe(expectedHref);
    },
  );

  it('renders the header contacts, catalog sections, and localized links', () => {
    render(
      <SiteShell contacts={FALLBACK_COMPANY_CONTACTS} locale="ru">
        <h1>Страница</h1>
      </SiteShell>,
    );

    const header = screen.getByRole('banner');
    expect(within(header).getAllByText('(068) 713-50-49').length).toBeGreaterThan(0);
    expect(
      within(header).getByRole('link', { name: 'Написать в Telegram' }).getAttribute('href'),
    ).toBe('https://t.me/+380687135049');
    expect(within(header).getAllByRole('link', { name: 'Замки' })[0]?.getAttribute('href')).toBe(
      '/ru/catalog/zamki-900002',
    );
    expect(within(header).getByRole('search').getAttribute('action')).toBe('/ru/search');
    expect(screen.getByRole('main').textContent).toContain('Страница');
  });

  it('shows the contacts saved in the admin in the header and footer', () => {
    render(
      <SiteShell
        locale="uk"
        contacts={{
          phone: { display: '(067) 111-22-33', e164: '+380671112233' },
          email: 'sales@example.test',
          city: { uk: 'Київ', ru: 'Киев' },
          links: {
            telegram: 'https://t.me/kedr_sales',
            viber: 'viber://chat?number=%2B380671112233',
            map: 'https://maps.app.goo.gl/abc',
          },
        }}
      >
        content
      </SiteShell>,
    );

    const header = screen.getByRole('banner');
    const footer = screen.getByRole('contentinfo');
    expect(within(header).getByText('Україна, м. Київ')).toBeTruthy();
    expect(
      within(header)
        .getByRole('link', { name: /\(067\) 111-22-33/ })
        .getAttribute('href'),
    ).toBe('tel:+380671112233');
    expect(
      within(footer).getByRole('link', { name: 'sales@example.test' }).getAttribute('href'),
    ).toBe('mailto:sales@example.test');
    expect(within(footer).getByText('Україна, м. Київ')).toBeTruthy();
    expect(
      within(footer)
        .getAllByRole('link', { name: /Telegram/ })[0]
        ?.getAttribute('href'),
    ).toBe('https://t.me/kedr_sales');
  });

  it('uses the catalog navigation passed by the layout', () => {
    render(
      <SiteShell
        contacts={FALLBACK_COMPANY_CONTACTS}
        locale="uk"
        catalogNavigation={{
          menu: <button type="button">Мега-меню</button>,
          links: [{ key: '1', path: '/catalog/ruchky', label: 'Ручки' }],
        }}
      >
        content
      </SiteShell>,
    );

    const header = screen.getByRole('banner');
    expect(within(header).getByRole('button', { name: 'Мега-меню' })).toBeTruthy();
    expect(within(header).getAllByRole('link', { name: 'Ручки' })[0]?.getAttribute('href')).toBe(
      '/uk/catalog/ruchky',
    );
    expect(within(header).queryByRole('link', { name: 'Замки' })).toBeNull();
  });

  it('switches language on the same page', () => {
    render(
      <SiteShell contacts={FALLBACK_COMPANY_CONTACTS} locale="ru">
        content
      </SiteShell>,
    );

    const switches = screen.getAllByRole('navigation', { name: 'Язык сайта' });
    const ua = within(switches[0] as HTMLElement).getByRole('link', { name: 'UA' });
    expect(ua.getAttribute('href')).toBe('/uk/wholesale');
    expect(ua.getAttribute('hreflang')).toBe('uk-UA');
  });
});
