import {
  useCreateAttributeValueMutation,
  useUpdateAttributeValueMutation,
  useUploadAttributeSwatchMutation,
} from '@admin/catalog-attributes/data-access';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAttributeValueEditor } from './use-attribute-value-editor';

import type { CatalogAttributeValue, CatalogAttributeValueChange } from '@admin/catalog-attributes/model';

vi.mock('@admin/catalog-attributes/data-access', () => ({
  useCreateAttributeValueMutation: vi.fn(),
  useUpdateAttributeValueMutation: vi.fn(),
  useUploadAttributeSwatchMutation: vi.fn(),
}));

const create = vi.fn();
const update = vi.fn();
const upload = vi.fn();
const resolve = (value?: unknown) => ({ unwrap: () => Promise.resolve(value) });
const value = { id: 3, swatchMediaFileId: 9, swatchImageUrl: 'oak.png' } as CatalogAttributeValue;
const change = { nameUk: 'Дуб' } as CatalogAttributeValueChange;

describe('useAttributeValueEditor', () => {
  beforeEach(() => {
    for (const mock of [create, update, upload]) mock.mockReset().mockImplementation(resolve);
    vi.mocked(useCreateAttributeValueMutation).mockReturnValue([create, { isLoading: false }] as never);
    vi.mocked(useUpdateAttributeValueMutation).mockReturnValue([update, { isLoading: false }] as never);
    vi.mocked(useUploadAttributeSwatchMutation).mockReturnValue([upload, { isLoading: false }] as never);
  });

  it('opens a value with its texture and saves the change', async () => {
    const onNotice = vi.fn();
    const { result } = renderHook(() => useAttributeValueEditor(5, undefined, onNotice));
    act(() => result.current.open(value));
    expect(result.current.texture).toEqual({ id: 9, url: 'oak.png' });

    await act(() => result.current.save(change));

    expect(update).toHaveBeenCalledWith({ attributeId: 5, valueId: 3, change });
    expect(result.current.edit).toBeUndefined();
    expect(onNotice).toHaveBeenCalledWith('Значення збережено.');
  });

  it('creates a new value when no value is open for edit', async () => {
    const { result } = renderHook(() => useAttributeValueEditor(5, undefined, vi.fn()));
    act(() => result.current.open(null));
    expect(result.current.texture).toBeNull();
    await act(() => result.current.save(change));
    expect(create).toHaveBeenCalledWith({ attributeId: 5, change });
  });

  it('uses an uploaded picture as the texture', async () => {
    upload.mockReturnValue(resolve({ id: 11, url: 'walnut.png' }));
    const { result } = renderHook(() => useAttributeValueEditor(5, undefined, vi.fn()));
    act(() => result.current.open(null));
    await act(() => result.current.upload(new File([''], 'walnut.png')));
    expect(result.current.texture).toEqual({ id: 11, url: 'walnut.png' });
  });
});
