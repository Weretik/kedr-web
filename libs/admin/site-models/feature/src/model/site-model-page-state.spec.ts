import { describe, expect, it } from 'vitest';

import { siteModelArrivalNotice, siteModelListSearch } from './site-model-page-state';

describe('site model page state', () => {
  it('reads the list address and the arrival notice', () => {
    const state = { listSearch: '?search=рим', notice: 'Модель створено' };
    expect(siteModelListSearch(state)).toBe('?search=рим');
    expect(siteModelArrivalNotice(state)).toBe('Модель створено');
  });

  it('gives nothing for an empty or foreign state', () => {
    expect(siteModelListSearch(null)).toBeUndefined();
    expect(siteModelArrivalNotice(undefined)).toBeNull();
    expect(siteModelArrivalNotice({ other: 1 })).toBeNull();
  });
});
