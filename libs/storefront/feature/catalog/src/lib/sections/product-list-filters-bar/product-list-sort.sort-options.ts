import { ProductListSortUi } from '@storefront/contracts';

import type { MenuItem } from 'primeng/api';

export function buildSortMenu(deps: {
  setSort: (sort: ProductListSortUi) => void;
}): MenuItem[] {
  return [
    {
      label: 'Артикул (min → max)',
      icon: 'pi pi-sort-amount-up',
      command: () => deps.setSort('id-asc'),
    },
    {
      label: 'Артикул (max → min)',
      icon: 'pi pi-sort-amount-down',
      command: () => deps.setSort('id-desc'),
    },
    {
      label: 'Назва (а → я)',
      icon: 'pi pi-sort-amount-up',
      command: () => deps.setSort('name-asc'),
    },
    {
      label: 'Назва (я → а)',
      icon: 'pi pi-sort-amount-down',
      command: () => deps.setSort('name-desc'),
    },
    {
      label: 'Ціна (min → max)',
      icon: 'pi pi-sort-amount-up',
      command: () => deps.setSort('price-asc'),
    },
    {
      label: 'Ціна (max → min)',
      icon: 'pi pi-sort-amount-down',
      command: () => deps.setSort('price-desc'),
    },
  ];
}
