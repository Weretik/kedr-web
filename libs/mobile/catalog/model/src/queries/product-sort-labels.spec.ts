import { nextProductSort, productListSummary } from './product-sort-labels';

describe('product sort labels', () => {
  it('cycles the sorts in order', () => {
    expect(nextProductSort('name')).toBe('price-asc');
    expect(nextProductSort('price-asc')).toBe('price-desc');
    expect(nextProductSort('price-desc')).toBe('name');
  });

  it('summarises the list with the stock filter only when it is on', () => {
    expect(productListSummary(12, 'name', false)).toBe('12 шт. · за назвою');
    expect(productListSummary(3, 'price-asc', true)).toBe(
      '3 шт. · спочатку дешевші · лише в наявності',
    );
  });
});
