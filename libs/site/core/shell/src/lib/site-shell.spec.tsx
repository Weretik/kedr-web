import { render, screen, within } from '@testing-library/react';

import { SiteShell } from './site-shell';

vi.mock('next/navigation', () => ({ usePathname: () => '/ru/wholesale' }));
vi.mock('./footer/copyright-year', () => ({ CopyrightYear: () => '2026' }));

describe('SiteShell', () => {
  it('renders the header contacts, catalog sections, and localized links', () => {
    render(
      <SiteShell locale="ru">
        <h1>Страница</h1>
      </SiteShell>,
    );

    const header = screen.getByRole('banner');
    expect(within(header).getAllByText('(068) 713-50-49').length).toBeGreaterThan(0);
    expect(
      within(header).getByRole('link', { name: 'Написать в Telegram' }).getAttribute('href'),
    ).toBe('https://t.me/+380687135049');
    expect(within(header).getAllByRole('link', { name: 'Замки' })[0]?.getAttribute('href')).toBe(
      '/ru/catalog/zamki-900002/products',
    );
    expect(within(header).getByRole('search')).toBeTruthy();
    expect(screen.getByRole('main').textContent).toContain('Страница');
  });

  it('switches language on the same page', () => {
    render(<SiteShell locale="ru">content</SiteShell>);

    const switches = screen.getAllByRole('navigation', { name: 'Язык сайта' });
    const ua = within(switches[0] as HTMLElement).getByRole('link', { name: 'UA' });
    expect(ua.getAttribute('href')).toBe('/uk/wholesale');
    expect(ua.getAttribute('hreflang')).toBe('uk-UA');
  });
});
