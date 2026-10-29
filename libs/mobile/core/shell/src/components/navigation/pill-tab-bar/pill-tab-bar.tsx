import { useKedrTheme } from '@mobile/shared/ui';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PillTabItem } from './pill-tab-item';

import type { PillTab } from './pill-tab';

interface TabRoute {
  key: string;
  name: string;
}

export interface PillTabBarProps {
  /** Count badges by route name, e.g. `{ cart: 3 }`. */
  badges?: Readonly<Record<string, number>>;
  emitter: {
    emit: (event: { canPreventDefault: true; target: string; type: 'tabPress' }) => {
      defaultPrevented: boolean;
    };
  };
  navigateToTab: (routeKey: string) => void;
  state: { index: number; routes: readonly TabRoute[] };
  tabs: Readonly<Record<string, PillTab>>;
}

/** Floating dark pill navigation; the active tab expands into a green pill with its label. */
export function PillTabBar({
  badges = {},
  emitter,
  navigateToTab,
  state,
  tabs,
}: Readonly<PillTabBarProps>) {
  const { kedr } = useKedrTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        backgroundColor: kedr.colors.background,
        paddingBottom: insets.bottom + 10,
        paddingHorizontal: kedr.layout.navInset,
        paddingTop: 6,
      }}
    >
      <View
        accessibilityRole="tablist"
        style={[
          styles.bar,
          { backgroundColor: kedr.colors.inverseSurface, height: kedr.layout.navHeight },
        ]}
        testID="mobile-bottom-navigation"
      >
        {state.routes.map((route, index) => {
          const tab = tabs[route.name];
          if (!tab) return null;
          return (
            <PillTabItem
              badge={badges[route.name]}
              focused={state.index === index}
              key={route.key}
              onPress={() => {
                const event = emitter.emit({
                  canPreventDefault: true,
                  target: route.key,
                  type: 'tabPress',
                });
                if (!event.defaultPrevented && state.index !== index) navigateToTab(route.key);
              }}
              tab={tab}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    alignItems: 'center',
    borderRadius: 999,
    elevation: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
  },
});
