import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SiteModelNewPanel } from './site-model-new-panel';

const api = vi.hoisted(() => ({ create: vi.fn() }));

vi.mock('@admin/site-models/data-access', () => ({
  useGetSiteModelCategoriesQuery: () => ({
    data: [
      { id: 1, name: 'Фурнітура', parentId: null },
      { id: 3, name: 'Ручки', parentId: 1 },
    ],
    isLoading: false,
  }),
  useGetSiteShowcaseQuery: () => ({
    data: {
      items: [11, 12].map((productId) => ({
        products: [
          {
            productId,
            name: `Ручка ${productId}`,
            photo: '',
            categoryName: 'Ручки',
            model: null,
          },
        ],
      })),
    },
    isFetching: false,
  }),
  useCreateSiteModelMutation: () => [api.create, { isLoading: false }],
}));

describe('SiteModelNewPanel', () => {
  beforeEach(() => api.create.mockReset());

  it('creates a model with a name, a final category and two free products (SC-005)', async () => {
    api.create.mockReturnValue({ unwrap: () => Promise.resolve({ id: 42 }) });
    const onCreated = vi.fn();
    render(<SiteModelNewPanel onClose={vi.fn()} onCreated={onCreated} open options={{}} />);
    const create = screen.getByRole('button', { name: 'Створити модель' }) as HTMLButtonElement;
    expect(create.disabled).toBe(true);
    fireEvent.change(screen.getByLabelText('Назва моделі'), { target: { value: 'Ручка Рим' } });
    expect(create.disabled).toBe(true);
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Категорія на сайті' }));
    expect(screen.queryByRole('option', { name: 'Фурнітура' })).toBeNull();
    fireEvent.click(screen.getByRole('option', { name: 'Фурнітура / Ручки' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Ручка 11' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Ручка 12' }));
    fireEvent.click(create);
    await waitFor(() => expect(onCreated).toHaveBeenCalledWith(42, 'Модель створено'));
    expect(api.create).toHaveBeenCalledWith({
      categoryId: 3,
      name: 'Ручка Рим',
      productIds: [11, 12],
    });
  });

  it('preselects the product it came with', () => {
    render(
      <SiteModelNewPanel
        onClose={vi.fn()}
        onCreated={vi.fn()}
        open
        options={{ productIds: [12], name: 'Ручка 12' }}
      />,
    );
    expect((screen.getByLabelText('Назва моделі') as HTMLInputElement).value).toBe('Ручка 12');
    expect((screen.getByRole('checkbox', { name: 'Ручка 12' }) as HTMLInputElement).checked).toBe(
      true,
    );
  });
});
