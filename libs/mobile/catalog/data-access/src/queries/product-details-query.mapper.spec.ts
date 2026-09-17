import { toProductDetailsRequest } from './product-details-query.mapper';

describe('toProductDetailsRequest', () => {
  it('uses the fixed Ukrainian public catalog contract and encodes the slug', () => {
    expect(toProductDetailsRequest('кабель / 10')).toEqual({
      method: 'GET',
      params: { priceTypeId: 11 },
      url: '/api/catalog/uk/product/%D0%BA%D0%B0%D0%B1%D0%B5%D0%BB%D1%8C%20%2F%2010',
    });
  });
});
