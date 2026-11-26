import type { ReactNode } from 'react';

export interface NavigationItem {
  /** `admin`: only the Admin role; `userManagement`: whoever may manage users. Omitted: everyone. */
  access?: 'admin' | 'userManagement';
  /** Paths inside `to` that belong to another item, so this one is not highlighted there. */
  activeExcept?: string[];
  icon: ReactNode;
  label: string;
  to: string;
}

export interface NavigationGroup {
  /** Shown on the block heading and for every item of the block when the drawer is collapsed. */
  icon: ReactNode;
  id: string;
  items: NavigationItem[];
  label: string;
}

const matchesPath = (pathname: string, to: string) =>
  pathname === to || pathname.startsWith(`${to}/`);

export const isItemActive = (pathname: string, item: Pick<NavigationItem, 'activeExcept' | 'to'>) =>
  matchesPath(pathname, item.to) &&
  !(item.activeExcept ?? []).some((except) => matchesPath(pathname, except));
