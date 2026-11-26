import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LoneProductAddToModel } from './lone-product-add-to-model';

import type { SiteShowcaseItem } from '@admin/site-models/model';

const api = vi.hoisted(() => ({ models: vi.fn(), add: vi.fn(), picker: vi.fn() }));

vi.mock('@admin/site-models/data-access', () => ({
  useGetSiteModelsQuery: api.models,
  useAddSiteModelProductsMutation: () => [api.add, { isLoading: false }],
}));

vi.mock('@admin/site-models/ui', () => ({
  LoneProductModelPicker: (props: { onAdd: (id: number) => void; suggestedId?: number }) => {
    api.picker(props);
    return <span>picker {props.suggestedId}</span>;
  },
}));

const product = {
  productId: 4021,
  name: 'Завіса 100×75 BK',
  categoryId: 7,
} as SiteShowcaseItem;

const model = (id: number, name: string) => ({ id, name, categoryId: 7, status: 'accepted' });

describe('LoneProductAddToModel (spec 001 SC-008)', () => {
  beforeEach(() => vi.clearAllMocks());

  it('loads the models of the product category, suggests a similar one, and adds the product', async () => {
    api.models.mockReturnValue({
      data: { items: [model(3, 'Ручка RIO'), model(5, 'Завіса 100×75')] },
      isLoading: false,
    });
    api.add.mockReturnValue({ unwrap: () => Promise.resolve({ name: 'Завіса 100×75' }) });
    const onNotice = vi.fn();
    render(<LoneProductAddToModel onNotice={onNotice} product={product} />);

    expect(api.models).toHaveBeenCalledWith(expect.objectContaining({ categoryId: 7, page: 1 }));
    expect(screen.getByText('picker 5')).toBeTruthy();

    api.picker.mock.calls[0][0].onAdd(5);
    expect(api.add).toHaveBeenCalledWith({ id: 5, productIds: [4021] });
    await vi.waitFor(() =>
      expect(onNotice).toHaveBeenCalledWith('Товар додано в модель «Завіса 100×75»'),
    );
  });
});
