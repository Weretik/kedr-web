import { describe, expect, it } from 'vitest';

import { readModelsQuery, readShowcaseQuery, writeSiteQuery } from './site-models-url-state';

describe('site models address', () => {
  it('reads the «Огляд» link to products without a model', () => {
    expect(readShowcaseQuery(new URLSearchParams('problem=no_model'))).toEqual({
      categoryId: undefined,
      problem: 'no_model',
      search: undefined,
      page: 1,
      pageSize: 50,
    });
  });

  it('drops model-only problems and bad numbers from the showcase', () => {
    const query = readShowcaseQuery(new URLSearchParams('problem=model_no_seo&page=-2&pageSize=7'));
    expect(query).toMatchObject({ problem: undefined, page: 1, pageSize: 50 });
  });

  it('round-trips the models filters without defaults', () => {
    const query = readModelsQuery(
      new URLSearchParams('status=proposed&categoryId=12&problem=any&page=2&pageSize=100'),
    );
    expect(writeSiteQuery(query).toString()).toBe(
      'categoryId=12&status=proposed&problem=any&page=2&pageSize=100',
    );
    expect(writeSiteQuery({ page: 1, pageSize: 50 }).toString()).toBe('');
  });
});
