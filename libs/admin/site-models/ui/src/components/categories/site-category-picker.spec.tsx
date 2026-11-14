import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SiteCategoryPicker } from './site-category-picker';

import type { SiteModelCategory } from '@admin/site-models/model';

const category = (id: number, name: string, parentId: number | null): SiteModelCategory => ({
  id,
  name,
  parentId,
  onSiteProducts: 3,
  acceptedModels: 1,
  proposedModels: 1,
  problemCount: 0,
  loneProducts: 0,
  filterCount: 0,
});

const categories = [category(1, 'Фурнітура', null), category(2, 'Ручки', 1)];

describe('SiteCategoryPicker', () => {
  it('opens a branch with the arrow and picks a category with a click on its name', () => {
    const onSelect = vi.fn();
    render(
      <SiteCategoryPicker
        categories={categories}
        loading={false}
        onSelect={onSelect}
        selectedId={undefined}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Усі категорії' }));
    const root = screen.getByRole('treeitem', { name: /Фурнітура/ });
    const arrow = root.querySelector('.MuiTreeItem-iconContainer');
    if (!arrow) throw new Error('No arrow');
    fireEvent.click(arrow);

    expect(onSelect).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('Ручки'));
    expect(onSelect).toHaveBeenCalledWith(2);
  });
});
