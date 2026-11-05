import { useBreakpoint } from '@mobile/shared/ui';

import { NavRail, type RailAccount } from './nav-rail';
import { TabBar } from './tab-bar';
import { workTabs, type WorkTabName } from './work-tabs';

import type { WorkNavItem } from './work-nav-item';
import type { BottomTabBarProps } from 'expo-router/js-tabs';

export interface WorkNavigationProps extends Pick<
  BottomTabBarProps,
  'emitter' | 'navigateToTab' | 'state'
> {
  account?: RailAccount;
  /** Count shown next to a label, e.g. `{ calculation: 3 }` → «Розрахунок · 3». */
  badges?: Partial<Record<WorkTabName, number>>;
  hasCustomer: boolean;
}

/** Tab bar on phones, rail on tablets; both lock the sections that need a customer. */
export function WorkNavigation({
  account,
  badges = {},
  emitter,
  hasCustomer,
  navigateToTab,
  state,
}: Readonly<WorkNavigationProps>) {
  const breakpoint = useBreakpoint();
  const focusedName = state.routes[state.index]?.name;

  const items: WorkNavItem[] = workTabs.flatMap((tab) => {
    const route = state.routes.find((candidate) => candidate.name === tab.name);
    if (!route) return [];

    const locked = tab.needsCustomer && !hasCustomer;
    const focused = focusedName === tab.name;

    return [
      {
        badge: badges[tab.name],
        focused,
        key: route.key,
        locked,
        onPress: () => {
          if (locked) return;
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
    <TabBar items={items} />
  ) : (
    <NavRail account={account} items={items} />
  );
}
