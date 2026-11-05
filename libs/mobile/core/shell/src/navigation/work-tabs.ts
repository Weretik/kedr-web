import type { IconName } from '@mobile/shared/ui';

export type WorkTabName = 'cabinet' | 'calculation' | 'customer' | 'orders' | 'products';

export interface WorkTab {
  activeIcon: IconName;
  icon: IconName;
  label: string;
  /** Opens only after a customer is chosen. */
  needsCustomer: boolean;
  name: WorkTabName;
}

/** The five sections of the app, in tab bar and rail order. */
export const workTabs: readonly WorkTab[] = [
  {
    activeIcon: 'account',
    icon: 'account-outline',
    label: 'Клієнт',
    name: 'customer',
    needsCustomer: false,
  },
  {
    activeIcon: 'view-grid',
    icon: 'view-grid-outline',
    label: 'Товари',
    name: 'products',
    needsCustomer: true,
  },
  {
    activeIcon: 'calculator-variant',
    icon: 'calculator-variant-outline',
    label: 'Розрахунок',
    name: 'calculation',
    needsCustomer: true,
  },
  {
    activeIcon: 'receipt-text',
    icon: 'receipt-text-outline',
    label: 'Замовлення',
    name: 'orders',
    needsCustomer: true,
  },
  {
    activeIcon: 'cog',
    icon: 'cog-outline',
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
