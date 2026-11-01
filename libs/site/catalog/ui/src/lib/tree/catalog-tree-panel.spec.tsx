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

  it('opens only the path to the current category, keeping other branches in the HTML', () => {
    const { container } = render(<CatalogTreePanel locale="uk" tree={tree} activeId={2} />);

    const current = screen.getByRole('link', { name: /На розетці/ });
    expect(current.getAttribute('href')).toBe('/uk/catalog/na-rozetsi');
    expect(current.getAttribute('aria-current')).toBe('page');
    expect(screen.queryByRole('link', { name: /Врізні/ })).toBeNull();
    expect(container.querySelector('a[href="/uk/catalog/vrizni"]')).toBeTruthy();
  });

  it('opens another branch and remembers it', () => {
    render(<CatalogTreePanel locale="uk" tree={tree} activeId={2} />);

    fireEvent.click(screen.getByRole('button', { name: 'Розгорнути «Замки»' }));
    expect(screen.getByRole('link', { name: /Врізні/ })).toBeTruthy();
    expect(JSON.parse(window.localStorage.getItem(TREE_STORAGE_KEY) ?? '{}')).toEqual({
      expanded: [3],
      hidden: false,
    });
  });

  it('restores saved choices after hydration', () => {
    window.localStorage.setItem(TREE_STORAGE_KEY, JSON.stringify({ expanded: [3], hidden: true }));
    render(<CatalogTreePanel locale="ru" tree={tree} />);

    expect(
      screen.getByRole('button', { name: 'Показать категории' }).getAttribute('aria-expanded'),
    ).toBe('false');
    expect(screen.getByRole('button', { name: 'Свернуть «Замки»' })).toBeTruthy();
  });
});
