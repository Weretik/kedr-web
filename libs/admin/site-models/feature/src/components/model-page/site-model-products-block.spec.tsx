import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SiteModelProductsBlock } from './site-model-products-block';

import type { useSiteModelEditor } from '../../hooks/model-editor/use-site-model-editor';
import type { SiteModel } from '@admin/site-models/model';

vi.mock('@admin/site-models/data-access', () => ({
  useGetAttributeValueOptionsQuery: () => ({ data: undefined }),
}));

const model: SiteModel = {
  id: 5,
  categoryId: 7,
  categoryName: 'Ручки',
  name: 'Ручка Рим',
  slug: 'ruchka-rym',
  status: 'accepted',
  acceptedAt: null,
  acceptedBy: null,
  mainProductId: null,
  axes: [],
  products: [
    {
      productId: 11,
      name: 'Ручка Рим хром',
      slug: 'p',
      photo: '',
      retailPrice: null,
      inStock: true,
      exportToSite: true,
      isMain: true,
      values: [],
      problems: [],
    },
  ],
  texts: [],
  characteristics: [],
  problems: [],
  oneCCategories: [],
};

describe('SiteModelProductsBlock', () => {
  it('lists products with the 1C code and opens «Додати товар»', () => {
    const onAdd = vi.fn();
    const editor = {
      productsBusy: false,
      errors: {},
      createValue: vi.fn(),
      fillFromNames: vi.fn(),
      removeProduct: vi.fn(),
      setValue: vi.fn(),
    } as unknown as ReturnType<typeof useSiteModelEditor>;
    render(
      <SiteModelProductsBlock
        editor={editor}
        model={model}
        onAdd={onAdd}
        onEditAttributes={vi.fn()}
      />,
    );
    expect(screen.getByText('Ручка Рим хром')).toBeTruthy();
    expect(screen.getByText(/Код 1С 11/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Додати товар' }));
    expect(onAdd).toHaveBeenCalled();
  });
});
