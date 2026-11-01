import { fireEvent, render, screen } from '@testing-library/react';

import { CatalogTreePanel } from './catalog-tree-panel';
import { TREE_STORAGE_KEY } from './use-tree-state';

const tree = [
  {
    id: 1,
    slug: 'ruchky',
    name: 'Ручки',
    productCount: 10,
    children: [{ id: 2, slug: 'na-rozetsi', name: 'На розетці', productCount: 4, children: [] }],
  },
  {
    id: 3,
    slug: 'zamky',
    name: 'Замки',
    productCount: 7,
    children: [{ id: 4, slug: 'vrizni', name: 'Врізні', productCount: 7, children: [] }],
  },
];

describe('CatalogTreePanel', () => {
  beforeEach(() => window.localStorage.clear());

  it('renders every level expanded with the current category marked', () => {
    render(<CatalogTreePanel locale="uk" tree={tree} activeId={2} />);

    const current = screen.getByRole('link', { name: /На розетці/ });
    expect(current.getAttribute('href')).toBe('/uk/catalog/na-rozetsi');
    expect(current.getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('link', { name: /Врізні/ })).toBeTruthy();
  });

  it('collapses a branch and remembers it, but never the path to the current category', () => {
    render(<CatalogTreePanel locale="uk" tree={tree} activeId={2} />);

    fireEvent.click(screen.getByRole('button', { name: 'Згорнути «Замки»' }));
    expect(screen.queryByRole('link', { name: /Врізні/ })).toBeNull();
    expect(JSON.parse(window.localStorage.getItem(TREE_STORAGE_KEY) ?? '{}')).toEqual({
      collapsed: [3],
      hidden: false,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Згорнути «Ручки»' }));
    expect(screen.getByRole('link', { name: /На розетці/ })).toBeTruthy();
  });

  it('restores saved choices after hydration', () => {
    window.localStorage.setItem(TREE_STORAGE_KEY, JSON.stringify({ collapsed: [3], hidden: true }));
    render(<CatalogTreePanel locale="ru" tree={tree} />);

    expect(
      screen.getByRole('button', { name: 'Показать категории' }).getAttribute('aria-expanded'),
    ).toBe('false');
    expect(screen.getByRole('button', { name: 'Развернуть «Замки»' })).toBeTruthy();
  });
});
