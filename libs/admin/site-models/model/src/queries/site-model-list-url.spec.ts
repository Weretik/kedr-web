import { describe, expect, it } from 'vitest';

import {
  defaultSiteModelsListState,
  readSiteModelsListUrl,
  siteModelsBackPath,
  siteModelsListQuery,
  writeSiteModelsListUrl,
} from './site-model-list-url';

describe('site models list URL', () => {
  it('reads search, filters and page from the address', () => {
    const state = readSiteModelsListUrl(
      new URLSearchParams(
        'search=ручка&categoryId=7&status=proposed&problem=model_no_seo&page=3&pageSize=50',
      ),
    );
    expect(state).toEqual({
      search: 'ручка',
      categoryId: 7,
      status: 'proposed',
      problem: 'model_no_seo',
      page: 3,
      pageSize: 50,
    });
  });

  it('ignores unknown values and keeps defaults', () => {
    expect(
      readSiteModelsListUrl(
        new URLSearchParams('categoryId=x&status=bad&problem=nope&page=-1&pageSize=7'),
      ),
    ).toEqual(defaultSiteModelsListState);
  });

  it('keeps «any» from the old problems view', () => {
    expect(readSiteModelsListUrl(new URLSearchParams('problem=any')).problem).toBe('any');
  });

  it('writes only what differs from defaults and keeps other params such as the panel', () => {
    const params = writeSiteModelsListUrl(
      { ...defaultSiteModelsListState, search: ' ручка ', status: 'accepted', page: 2 },
      new URLSearchParams('panel=edit-5&page=9'),
    );
    expect(params.toString()).toBe(
      'panel=edit-5&search=%D1%80%D1%83%D1%87%D0%BA%D0%B0&status=accepted&page=2',
    );
  });

  it('turns the state into the list query', () => {
    expect(
      siteModelsListQuery({ ...defaultSiteModelsListState, search: '  ', categoryId: 4 }),
    ).toEqual({
      categoryId: 4,
      page: 1,
      pageSize: 20,
    });
  });

  it('returns to the list with its state and without the panel', () => {
    expect(siteModelsBackPath('?search=a&panel=edit-1')).toBe('/site-models?search=a');
    expect(siteModelsBackPath(undefined)).toBe('/site-models');
  });
});
