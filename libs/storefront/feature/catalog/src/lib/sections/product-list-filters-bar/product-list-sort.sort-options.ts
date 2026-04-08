import { ProductListSortUi } from '@storefront/data-access';

import type { MenuItem } from 'primeng/api';

const translateWithFallback = (
  translate: (key: string) => string,
  key: string,
  fallback: string,
): string => {
  const translated = translate(key);
  return translated === key ? fallback : translated;
};

export function buildSortMenu(params: {
  setSort: (sort: ProductListSortUi) => void;
  translate: (key: string) => string;
}): MenuItem[] {
  return [
    {
      label: translateWithFallback(
        params.translate,
        'catalog.sort.idAsc',
        'Артикул (min -> max)',
      ),
      icon: 'pi pi-sort-amount-up',
      command: () => params.setSort('id-asc'),
    },
    {
      label: translateWithFallback(
        params.translate,
        'catalog.sort.idDesc',
        'Артикул (max -> min)',
      ),
      icon: 'pi pi-sort-amount-down',
      command: () => params.setSort('id-desc'),
    },
    {
      label: translateWithFallback(
        params.translate,
        'catalog.sort.priceAsc',
        'Ціна (min -> max)',
      ),
      icon: 'pi pi-sort-amount-up',
      command: () => params.setSort('price-asc'),
    },
    {
      label: translateWithFallback(
        params.translate,
        'catalog.sort.priceDesc',
        'Ціна (max -> min)',
      ),
      icon: 'pi pi-sort-amount-down',
      command: () => params.setSort('price-desc'),
    },
  ];
}
