import { renderHook } from '@testing-library/react';
import { useContext } from 'react';
import { describe, expect, it } from 'vitest';

import { SiteModelsToolbarContext } from './site-models-toolbar-context';

describe('SiteModelsToolbarContext', () => {
  it('has no filters outside the grid', () => {
    const { result } = renderHook(() => useContext(SiteModelsToolbarContext));
    expect(result.current).toMatchObject({
      categories: [],
      categoryId: undefined,
      status: undefined,
    });
    expect(result.current.onCategoryChange(undefined)).toBeUndefined();
  });
});
