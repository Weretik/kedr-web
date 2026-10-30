import { render, screen, within } from '@testing-library/react';

import { HomeFacts } from './facts/home-facts';
import { HomeHero } from './hero/home-hero';
import { getHomeDictionary } from './i18n/home-dictionary';
import { CatalogUnavailable } from './notice/catalog-unavailable';
import { WholesalePanel } from './wholesale/wholesale-panel';

describe('home UI', () => {
  it('renders the H1 and a search form to the all-products listing', () => {
    render(
      <HomeHero
        locale="uk"
        dictionary={getHomeDictionary('uk')}
        searchAction="/uk/catalog/products"
      />,
    );

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'Дверна фурнітура оптом і в роздріб',
    );
    const form = screen.getByRole('search', { name: 'Пошук товару' });
    expect(form.getAttribute('action')).toBe('/uk/catalog/products');
    expect(form.getAttribute('method')).toBe('get');
    expect(within(form).getByRole('searchbox').getAttribute('name')).toBe('search');
  });

  it('lists wholesale benefits with the cooperation page and a call link', () => {
    render(<WholesalePanel locale="ru" dictionary={getHomeDictionary('ru')} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    expect(screen.getByRole('link', { name: 'Стать партнером' }).getAttribute('href')).toBe(
      '/ru/wholesale',
    );
    expect(screen.getByRole('link', { name: /Позвонить/ }).getAttribute('href')).toBe(
      'tel:+380687135049',
    );
  });

  it('renders three facts and the unavailable notice', () => {
    render(
      <>
        <HomeFacts dictionary={getHomeDictionary('uk')} />
        <CatalogUnavailable
          text="Каталог не завантажився."
          href="/uk/catalog/products"
          label="Усі товари"
        />
      </>,
    );

    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
    expect(screen.getByRole('status').textContent).toContain('Каталог не завантажився.');
    expect(screen.getByRole('link', { name: 'Усі товари' }).getAttribute('href')).toBe(
      '/uk/catalog/products',
    );
  });
});
