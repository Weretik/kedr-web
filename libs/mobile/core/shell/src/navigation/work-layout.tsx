import { useBreakpoint } from '@mobile/shared/ui';
import { Redirect, useSegments } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';

import { WorkNavigation, type WorkNavigationProps } from './work-navigation';
import { needsCustomer, workTabs } from './work-tabs';

export type WorkLayoutProps = Pick<WorkNavigationProps, 'account' | 'badges' | 'hasCustomer'>;

/**
 * The signed-in area: five sections, a tab bar on phones and a rail on tablets.
 * A link into a section that needs a customer lands on customer choice instead.
 */
export function WorkLayout({ account, badges, hasCustomer }: Readonly<WorkLayoutProps>) {
  const breakpoint = useBreakpoint();
  const segments = useSegments() as string[];
  const section = segments[segments.indexOf('(work)') + 1];

  if (!hasCustomer && needsCustomer(section)) return <Redirect href="/customer" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarPosition: breakpoint === 'phone' ? 'bottom' : 'left',
      }}
      tabBar={(props) => (
        <WorkNavigation {...props} account={account} badges={badges} hasCustomer={hasCustomer} />
      )}
    >
      {workTabs.map((tab) => (
        <Tabs.Screen key={tab.name} name={tab.name} options={{ title: tab.label }} />
      ))}
    </Tabs>
  );
}
