import { fireEvent, render, screen } from '@testing-library/react';

import { CategoryContent } from './category-content';
import { CategoryHeader } from './category-header';
import { Breadcrumbs } from '../navigation/breadcrumbs';

describe('category UI', () => {
  it('shows the H1, count, and category chips with the current one marked', () => {
    render(
      <CategoryHeader
        locale="uk"
        heading="Ручки"
        productCount={312}
        activeId={3}
        chips={[
          { id: 2, slug: 'na-rozetsi', name: 'На розетці', productCount: 4, children: [] },
          { id: 3, slug: 'na-planci', name: 'На планці', productCount: 6, children: [] },
        ]}
      />,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Ручки' })).toBeTruthy();
    expect(screen.getByText('312 товарів')).toBeTruthy();
    expect(screen.getByRole('link', { name: /На розетці/ }).getAttribute('href')).toBe(
      '/uk/catalog/na-rozetsi',
    );
    expect(screen.getByRole('link', { name: /На планці/ }).getAttribute('aria-current')).toBe(
      'page',
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

  it('folds a long text behind a toggle and keeps it in the HTML', () => {
    const long = `<p>${'Завіси для дверей. '.repeat(60)}</p>`;
    const { container } = render(
      <CategoryContent
        locale="uk"
        content={{ seoTitle: null, metaDescription: null, h1: null, bodyHtml: long, faq: [] }}
      />,
    );
    expect(screen.getByRole('region', { name: 'Про категорію' })).toBeTruthy();
    const toggle = screen.getByRole('button', { name: /Читати повністю/ });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(container.textContent).toContain('Завіси для дверей.');
    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: /Згорнути/ }).getAttribute('aria-expanded')).toBe(
      'true',
    );
  });

  it('shows a short text without a toggle and nothing for empty content', () => {
    const { container, rerender } = render(
      <CategoryContent
        locale="uk"
        content={{
          seoTitle: null,
          metaDescription: null,
          h1: null,
          bodyHtml: '<p>Коротко</p>',
          faq: [],
        }}
      />,
    );
    expect(screen.queryByRole('button')).toBeNull();
    rerender(
      <CategoryContent
        locale="uk"
        content={{ seoTitle: null, metaDescription: null, h1: null, bodyHtml: '  ', faq: [] }}
      />,
    );
    expect(container.innerHTML).toBe('');
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
