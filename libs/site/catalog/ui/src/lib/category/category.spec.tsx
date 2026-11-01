import { render, screen } from '@testing-library/react';

import { CategoryContent } from './category-content';
import { CategoryHeader } from './category-header';
import { Breadcrumbs } from '../navigation/breadcrumbs';

describe('category UI', () => {
  it('shows the H1, count, and subcategory links', () => {
    render(
      <CategoryHeader
        locale="uk"
        heading="Ручки"
        productCount={312}
        subcategories={[
          { id: 2, slug: 'na-rozetsi', name: 'На розетці', productCount: 4, children: [] },
        ]}
      />,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Ручки' })).toBeTruthy();
    expect(screen.getByText('312 товарів')).toBeTruthy();
    expect(screen.getByRole('link', { name: /На розетці/ }).getAttribute('href')).toBe(
      '/uk/catalog/na-rozetsi',
    );
  });

  it('renders the admin text and the FAQ as visible text', () => {
    render(
      <CategoryContent
        locale="ru"
        content={{
          seoTitle: null,
          metaDescription: null,
          h1: null,
          bodyHtml: '<h2>Как выбрать</h2><p>Текст</p>',
          faq: [{ question: 'Есть опт?', answer: 'Да' }],
        }}
      />,
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Как выбрать' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: 'Вопросы и ответы' })).toBeTruthy();
    expect(screen.getByText('Есть опт?')).toBeTruthy();
    expect(screen.getByText('Да')).toBeTruthy();
  });

  it('links every breadcrumb except the current page', () => {
    render(
      <Breadcrumbs
        locale="uk"
        items={[
          { name: 'Головна', href: '/uk' },
          { name: 'Каталог', href: '/uk/catalog' },
          { name: 'Ручки', href: '/uk/catalog/ruchky' },
        ]}
      />,
    );

    expect(screen.getByRole('link', { name: 'Каталог' }).getAttribute('href')).toBe('/uk/catalog');
    expect(screen.queryByRole('link', { name: 'Ручки' })).toBeNull();
    expect(screen.getByText('Ручки').getAttribute('aria-current')).toBe('page');
  });
});
