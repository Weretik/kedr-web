import { FALLBACK_COMPANY_CONTACTS } from '@site/core/config';
import { render, screen, within } from '@testing-library/react';

import { SiteShell } from '../site-shell';

vi.mock('next/navigation', () => ({ usePathname: () => '/uk/checkout' }));
vi.mock('../footer/copyright-year', () => ({ CopyrightYear: () => '2026' }));

function cartFallbacks(header: HTMLElement, locale: 'uk' | 'ru') {
  const label = locale === 'uk' ? 'Кошик' : 'Корзина';
  return header.querySelectorAll(`a[aria-label="${label}"][href="/${locale}/checkout"]`);
}

describe('SiteShell cart action slots', () => {
  it.each(['uk', 'ru'] as const)(
    'passes arbitrary nodes to both cart surfaces without duplicate links in %s',
    (locale) => {
      render(
        <SiteShell
          contacts={FALLBACK_COMPANY_CONTACTS}
          locale={locale}
          cartAction={<button type="button">Main cart</button>}
          compactCartAction={<button type="button">Compact cart</button>}
        >
          checkout content
        </SiteShell>,
      );

      const header = screen.getByRole('banner');
      expect(within(header).queryAllByRole('button', { name: 'Main cart' })).toHaveLength(1);
      expect(within(header).queryAllByRole('button', { name: 'Compact cart' })).toHaveLength(1);
      expect(cartFallbacks(header, locale)).toHaveLength(0);
      const languageSwitch = within(header).getByRole('navigation', {
        name: locale === 'uk' ? 'Мова сайту' : 'Язык сайта',
      });
      for (const [name, target] of [
        ['UA', 'uk'],
        ['RU', 'ru'],
      ] as const) {
        const link = within(languageSwitch).getByRole('link', { name });
        expect(link.getAttribute('href')).toBe(`/${target}/checkout`);
        expect(link.getAttribute('rel')).toBe('nofollow');
      }
      expect(header.querySelector(`a[href="/${locale}/cabinet"]`)).toBeNull();
      expect(within(header).getByRole('search').getAttribute('action')).toBe(`/${locale}/search`);
      expect(screen.getByRole('main').textContent).toContain('checkout content');
    },
  );

  it.each(['main', 'compact'] as const)('replaces only the supplied %s cart surface', (surface) => {
    render(
      <SiteShell
        contacts={FALLBACK_COMPANY_CONTACTS}
        locale="uk"
        cartAction={surface === 'main' ? <button type="button">External cart</button> : undefined}
        compactCartAction={
          surface === 'compact' ? <button type="button">External cart</button> : undefined
        }
      >
        content
      </SiteShell>,
    );

    const header = screen.getByRole('banner');
    expect(within(header).queryAllByRole('button', { name: 'External cart' })).toHaveLength(1);
    const fallback = cartFallbacks(header, 'uk');
    expect(fallback).toHaveLength(1);
    expect(fallback[0]?.getAttribute('rel')).toBe('nofollow');
  });

  it.each(['uk', 'ru'] as const)('preserves localized checkout fallbacks in %s', (locale) => {
    render(
      <SiteShell contacts={FALLBACK_COMPANY_CONTACTS} locale={locale}>
        content
      </SiteShell>,
    );

    const fallbacks = cartFallbacks(screen.getByRole('banner'), locale);
    expect(fallbacks).toHaveLength(2);
    fallbacks.forEach((fallback) => expect(fallback.getAttribute('rel')).toBe('nofollow'));
  });
});
