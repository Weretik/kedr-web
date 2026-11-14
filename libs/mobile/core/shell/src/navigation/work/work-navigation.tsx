import { useBreakpoint } from '@mobile/shared/ui';

import { workTabs, type WorkTabName } from './work-tabs';
import { NavRail, type RailAccount } from '../bars/nav-rail';
import { TabBar } from '../bars/tab-bar';

import type { WorkNavItem } from './work-nav-item';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import type { ReactNode } from 'react';

export interface WorkNavigationProps extends Pick<
  BottomTabBarProps,
  'emitter' | 'navigateToTab' | 'state'
> {
  account?: RailAccount;
  /** Count shown as a badge on a tab icon, e.g. `{ calculation: 3 }`. */
  badges?: Partial<Record<WorkTabName, number>>;
  hasCustomer: boolean;
  /** Sync status from the app, drawn above the phone tab bar or under the rail items. */
  statusStrip?: (layout: 'bar' | 'rail') => ReactNode;
}

/**
 * Tab bar on phones, rail on tablets; both lock the sections that need a customer, and a locked section opens
 * customer choice instead.
 */
export function WorkNavigation({
  account,
  badges = {},
  emitter,
  hasCustomer,
  navigateToTab,
  state,
  statusStrip,
}: Readonly<WorkNavigationProps>) {
  const breakpoint = useBreakpoint();
  const focusedName = state.routes[state.index]?.name;
  const customerRoute = state.routes.find((candidate) => candidate.name === 'customer');

  const items: WorkNavItem[] = workTabs.flatMap((tab) => {
    const route = state.routes.find((candidate) => candidate.name === tab.name);
    if (!route || !tab.inNavigation) return [];

    const locked = tab.needsCustomer && !hasCustomer;
    const focused = focusedName === tab.name;

    return [
      {
        badge: badges[tab.name],
        focused,
        key: route.key,
        locked,
        onPress: () => {
          if (locked) {
            if (customerRoute && focusedName !== 'customer') navigateToTab(customerRoute.key);
            return;
          }
          const event = emitter.emit({
            canPreventDefault: true,
            target: route.key,
            type: 'tabPress',
          });
          if (!event.defaultPrevented && !focused) navigateToTab(route.key);
        },
        tab,
      },
    ];
  });

  return breakpoint === 'phone' ? (
    <TabBar items={items} statusStrip={statusStrip?.('bar')} />
  ) : (
    <NavRail account={account} items={items} statusStrip={statusStrip?.('rail')} />
  );
}
