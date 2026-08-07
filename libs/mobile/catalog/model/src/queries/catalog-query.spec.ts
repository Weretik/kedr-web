import { defaultCatalogQuery } from './catalog-query';

describe('defaultCatalogQuery', () => {
  it('starts server queries from the first page with the default sort', () => {
    expect(defaultCatalogQuery).toEqual({ filters: {}, page: 1, search: '', sort: 'IdAsc' });
  });
});
