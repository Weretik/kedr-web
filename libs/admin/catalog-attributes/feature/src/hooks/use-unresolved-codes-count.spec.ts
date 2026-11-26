import { useGetUnresolvedCodesQuery } from '@admin/catalog-attributes/data-access';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useUnresolvedCodesCount } from './use-unresolved-codes-count';

vi.mock('@admin/catalog-attributes/data-access', () => ({
  useGetUnresolvedCodesQuery: vi.fn(),
}));

const query = vi.mocked(useGetUnresolvedCodesQuery);

describe('useUnresolvedCodesCount', () => {
  it('counts the undecoded codes, and nothing while they load', () => {
    query.mockReturnValue({ data: [{ aliasId: 1 }, { aliasId: 2 }] } as never);
    expect(renderHook(() => useUnresolvedCodesCount()).result.current).toBe(2);

    query.mockReturnValue({ data: undefined } as never);
    expect(renderHook(() => useUnresolvedCodesCount()).result.current).toBeUndefined();
  });
});
