import { categoryPath } from '@site/catalog/model';

import { productCategoryHref } from './product-category-href';
import { productFixture } from '../../test/product.fixture';

vi.mock('@site/catalog/model', () => ({ categoryPath: vi.fn() }));

describe('product category destination ownership', () => {
  beforeEach(() => vi.mocked(categoryPath).mockReset());

  it.each(['uk', 'ru'] as const)('delegates the raw slug to the catalog policy in %s', (locale) => {
    vi.mocked(categoryPath).mockReturnValue('/catalog-owner/selected-category');
    const product = { ...productFixture, categorySlug: 'ручки / спеціальні' };
    expect(productCategoryHref(locale, product)).toBe(
      '/' + locale + '/catalog-owner/selected-category',
    );
    expect(categoryPath).toHaveBeenCalledExactlyOnceWith(product.categorySlug);
  });

  it('does not ask the catalog for a destination without a category slug', () => {
    expect(productCategoryHref('uk', { ...productFixture, categorySlug: null })).toBeNull();
    expect(categoryPath).not.toHaveBeenCalled();
  });
});
