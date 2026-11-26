import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useSiteModelPanels } from './site-model-panels-context';
import { SiteModelPanelsProvider } from './site-model-panels-provider';

const api = vi.hoisted(() => ({ create: vi.fn() }));

vi.mock('./site-model-edit-panel', () => ({
  SiteModelEditPanel: ({
    modelId,
    open,
    onClose,
  }: {
    modelId: number;
    open: boolean;
    onClose: () => void;
  }) => (
    <button onClick={onClose} type="button">
      {open ? `edit ${modelId}` : `closed edit ${modelId}`}
    </button>
  ),
}));
vi.mock('./site-model-add-products-panel', () => ({
  SiteModelAddProductsPanel: ({ modelId }: { modelId: number }) => (
    <div>add to model {modelId}</div>
  ),
}));
vi.mock('./site-product-add-to-model-panel', () => ({
  SiteProductAddToModelPanel: ({
    productId,
    onNewModel,
  }: {
    productId: number;
    onNewModel: () => void;
  }) => (
    <button onClick={onNewModel} type="button">
      add product {productId}
    </button>
  ),
}));
vi.mock('./site-model-new-panel', () => ({
  SiteModelNewPanel: ({
    options,
    onCreated,
  }: {
    options: { productIds?: number[] };
    onCreated: (id: number) => void;
  }) => (
    <button onClick={() => onCreated(42)} type="button">
      new with {(options.productIds ?? []).join(',')}
    </button>
  ),
}));

function Opener() {
  const panels = useSiteModelPanels();
  const location = useLocation();
  return (
    <>
      <output aria-label="Адреса">{location.pathname + location.search}</output>
      <button onClick={() => panels.openEditModel(5)} type="button">
        open edit
      </button>
      <button onClick={() => panels.openAddToModel({ modelId: 5 })} type="button">
        open add model
      </button>
      <button onClick={() => panels.openAddToModel({ productId: 11 })} type="button">
        open add product
      </button>
      <button onClick={() => panels.openNewModel({ productIds: [7] })} type="button">
        open new
      </button>
    </>
  );
}

const renderProvider = (entry = '/site-models?search=a') =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <SiteModelPanelsProvider>
        <Routes>
          <Route element={<Opener />} path="/site-models" />
          <Route element={<Opener />} path="/site-models/:id" />
        </Routes>
      </SiteModelPanelsProvider>
    </MemoryRouter>,
  );

const address = () => screen.getByLabelText('Адреса').textContent;

describe('SiteModelPanelsProvider', () => {
  beforeEach(() => api.create.mockReset());

  it('opens the edit panel in the address and keeps it mounted closed after closing', () => {
    renderProvider();
    fireEvent.click(screen.getByRole('button', { name: 'open edit' }));
    expect(address()).toBe('/site-models?search=a&panel=edit-5');
    fireEvent.click(screen.getByRole('button', { name: 'edit 5' }));
    expect(address()).toBe('/site-models?search=a');
    expect(screen.getByRole('button', { name: 'closed edit 5' })).toBeTruthy();
  });

  it('opens a panel from the address', () => {
    renderProvider('/site-models?panel=add-m5');
    expect(screen.getByText('add to model 5')).toBeTruthy();
  });

  it('goes from a product to a new model with it, then opens the created model', async () => {
    renderProvider();
    fireEvent.click(screen.getByRole('button', { name: 'open add product' }));
    fireEvent.click(screen.getByRole('button', { name: 'add product 11' }));
    expect(address()).toBe('/site-models?search=a&panel=new');
    fireEvent.click(screen.getByRole('button', { name: 'new with 11' }));
    await waitFor(() => expect(address()).toBe('/site-models/42'));
  });

  it('passes the options of «Нова модель»', () => {
    renderProvider();
    fireEvent.click(screen.getByRole('button', { name: 'open new' }));
    expect(screen.getByRole('button', { name: 'new with 7' })).toBeTruthy();
  });
});
