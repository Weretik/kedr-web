import type { IconName } from '@mobile/shared/ui';

export type WorkTabName = 'cabinet' | 'calculation' | 'customer' | 'orders' | 'products';

export interface WorkTab {
  activeIcon: IconName;
  icon: IconName;
  /** Shown in the tab bar and rail; the customer section opens from the customer line on each screen instead. */
  inNavigation: boolean;
  label: string;
  /** Opens only after a customer is chosen. */
  needsCustomer: boolean;
  name: WorkTabName;
}

/** The five sections of the app, in tab bar and rail order; four of them are tabs. */
export const workTabs: readonly WorkTab[] = [
  {
    activeIcon: 'account',
    icon: 'account-outline',
    inNavigation: false,
    label: 'Клієнт',
    name: 'customer',
    needsCustomer: false,
  },
  {
    activeIcon: 'view-grid',
    icon: 'view-grid-outline',
    inNavigation: true,
    label: 'Товари',
    name: 'products',
    needsCustomer: true,
  },
  {
    activeIcon: 'calculator-variant',
    icon: 'calculator-variant-outline',
    inNavigation: true,
    label: 'Розрахунок',
    name: 'calculation',
    needsCustomer: true,
  },
  {
    activeIcon: 'receipt-text',
    icon: 'receipt-text-outline',
    inNavigation: true,
    label: 'Замовлення',
    name: 'orders',
    needsCustomer: true,
  },
  {
    activeIcon: 'cog',
    icon: 'cog-outline',
    inNavigation: true,
    label: 'Кабінет',
    name: 'cabinet',
    needsCustomer: false,
  },
];

const lockedNames = new Set<string>(
  workTabs.filter((tab) => tab.needsCustomer).map((tab) => tab.name),
);

/** True when the route (first segment inside the working area) waits for a customer. */
export const needsCustomer = (routeName: string | undefined): boolean =>
  routeName !== undefined && lockedNames.has(routeName);
