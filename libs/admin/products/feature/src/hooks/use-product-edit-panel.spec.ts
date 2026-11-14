import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useProductEditPanel } from './use-product-edit-panel';

import type { AdminProductListItem } from '@admin/products/model';

const product = { id: 7, nameUk: 'Ручка', productSlug: 'ruchka' } as AdminProductListItem;

describe('useProductEditPanel', () => {
  it('keeps the last product after closing and follows a new slug', () => {
    const { result } = renderHook(() => useProductEditPanel());

    act(() => result.current.edit(product));
    expect(result.current.open).toBe(true);
    expect(result.current.product).toEqual({ id: 7, nameUk: 'Ручка', productSlug: 'ruchka' });

    act(() => result.current.slugChanged('ruchka-nova'));
    act(() => result.current.close());

    expect(result.current.open).toBe(false);
    expect(result.current.product?.productSlug).toBe('ruchka-nova');
    expect(result.current.notice).toBe('Нова адреса: ruchka-nova');

    act(() => result.current.clearNotice());
    expect(result.current.notice).toBeNull();
  });
});
