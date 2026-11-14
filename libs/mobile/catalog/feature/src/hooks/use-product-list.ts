import { useCategories, usePricedProducts } from '@mobile/catalog/data-access';
import {
  categoryPath,
  childrenOf,
  filterProducts,
  sortNameOrdered,
  withDescendants,
  type Category,
  type PricedProduct,
  type ProductSort,
} from '@mobile/catalog/model';
import { useDeferredValue, useMemo, useState } from 'react';

const noCategories: Category[] = [];
const noProducts: PricedProduct[] = [];

/** The local catalog with the customer's prices, and the search, category, stock, and sort of the list. */
export function useProductList(counterpartyId: string | null) {
  const loadedCategories = useCategories();
  const loadedProducts = usePricedProducts(counterpartyId);
  const categories = loadedCategories ?? noCategories;
  const products = loadedProducts ?? noProducts;
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<ProductSort>('name');

  // Products arrive in name order, so filtering keeps it and only a price sort reorders.
  const filtered = useMemo(
    () =>
      filterProducts(products, {
        categoryIds: categoryId === null ? null : withDescendants(categories, categoryId),
        inStockOnly,
        query: deferredQuery,
      }),
    [categories, categoryId, deferredQuery, inStockOnly, products],
  );
  const shown = useMemo(() => sortNameOrdered(filtered, sort), [filtered, sort]);

  return {
    loading: loadedProducts === undefined,
    empty: products.length === 0,
    shown,
    query,
    setQuery,
    categoryId,
    setCategoryId,
    path: categoryId === null ? [] : categoryPath(categories, categoryId),
    children: childrenOf(categories, categoryId),
    inStockOnly,
    toggleInStock: () => setInStockOnly((value) => !value),
    sort,
    setSort,
  };
}
