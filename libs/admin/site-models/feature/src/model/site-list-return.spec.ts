import { describe, expect, it } from 'vitest';

import { siteListReturn, siteListReturnState } from './site-list-return';

describe('site list return', () => {
  it('goes back to the list with its filters', () => {
    expect(siteListReturn(siteListReturnState('/site-models', '?categoryId=11'))).toEqual({
      path: '/site-models?categoryId=11',
      label: 'Моделі',
    });
    expect(siteListReturn({ from: '/site-showcase?problem=any' })).toEqual({
      path: '/site-showcase?problem=any',
      label: 'Вітрина сайту',
    });
  });

  it('falls back to «Моделі» for a missing or foreign address', () => {
    expect(siteListReturn(null)).toEqual({ path: '/site-models', label: 'Моделі' });
    expect(siteListReturn({ from: 'https://example.com' })).toEqual({
      path: '/site-models',
      label: 'Моделі',
    });
  });
});
