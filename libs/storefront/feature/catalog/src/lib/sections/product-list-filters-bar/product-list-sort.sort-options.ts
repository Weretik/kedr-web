import { ProductListSortUi } from '@storefront/data-access';

import type { MenuItem } from 'primeng/api';

export function buildSortMenu(params: {
  setSort: (sort: ProductListSortUi) => void;
  translate: (key: string) => string;
}): MenuItem[] {
  return [
    {
      label: params.translate('catalog.sort.idAsc'),
      icon: 'pi pi-sort-amount-up',
      command: () => params.setSort('id-asc'),
    },
    {
      label: params.translate('catalog.sort.idDesc'),
      icon: 'pi pi-sort-amount-down',
      command: () => params.setSort('id-desc'),
    },
    {
      label: params.translate('catalog.sort.priceAsc'),
      icon: 'pi pi-sort-amount-up',
      command: () => params.setSort('price-asc'),
    },
    {
      label: params.translate('catalog.sort.priceDesc'),
      icon: 'pi pi-sort-amount-down',
      command: () => params.setSort('price-desc'),
    },
  ];
}
