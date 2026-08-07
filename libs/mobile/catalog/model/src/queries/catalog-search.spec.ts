import { defaultCatalogQuery } from './catalog-query';
import { withCatalogSearch } from './catalog-search';

describe('withCatalogSearch', () => {
  it('resets pagination and limits the search to the contract maximum', () => {
    expect(withCatalogSearch({ ...defaultCatalogQuery, page: 3 }, 'кабель'.repeat(20))).toEqual({
      ...defaultCatalogQuery,
      page: 1,
      search: 'кабель'.repeat(16) + 'кабе',
    });
  });
});
