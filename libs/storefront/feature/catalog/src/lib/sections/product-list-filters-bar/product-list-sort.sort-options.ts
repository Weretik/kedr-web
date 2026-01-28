import type { ProductListSortUi } from '@storefront/util';
import type { MenuItem } from 'primeng/api';

export function buildSortMenu(deps: {
  setSort: (sort: ProductListSortUi) => void;
}): MenuItem[] {
  return [
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
