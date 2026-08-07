import { ThemePreferenceHeaderControl } from '@mobile/core/shell';
import { Tabs } from 'expo-router';
import { Appbar, BottomNavigation, useTheme } from 'react-native-paper';

type Tab = {
  focusedIcon: string;
  options: { tabBarAccessibilityLabel: string; title: string };
  unfocusedIcon: string;
};

const tabs: Record<string, Tab> = {
  catalog: {
    focusedIcon: 'view-grid',
    options: { tabBarAccessibilityLabel: 'Каталог', title: 'Каталог' },
    unfocusedIcon: 'view-grid-outline',
  },
  index: {
    focusedIcon: 'home',
    options: { tabBarAccessibilityLabel: 'Головна', title: 'Головна' },
    unfocusedIcon: 'home-outline',
  },
  profile: {
    focusedIcon: 'account',
    options: { tabBarAccessibilityLabel: 'Профіль', title: 'Профіль' },
    unfocusedIcon: 'account-outline',
  },
};

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        header: ({ options }) => (
          <Appbar.Header>
            <Appbar.Content title={options.title ?? route.name} />
            {options.headerRight?.({ canGoBack: false })}
          </Appbar.Header>
        ),
        headerRight: () => <ThemePreferenceHeaderControl />,
        headerTitleAlign: 'center',
        tabBarAccessibilityLabel: tabs[route.name].options.tabBarAccessibilityLabel,
      })}
      tabBar={({ descriptors, insets = { bottom: 0 }, navigation, state }) => (
        <BottomNavigation.Bar
          activeColor={theme.colors.primary}
          activeIndicatorStyle={{ backgroundColor: 'transparent' }}
          compact={false}
          getAccessibilityLabel={({ route }) =>
            descriptors[route.key].options.tabBarAccessibilityLabel ?? route.name
          }
          getLabelText={({ route }) =>
            descriptors[route.key].options.tabBarLabel?.toString() ??
            descriptors[route.key].options.title ??
            route.name
          }
          inactiveColor={theme.colors.onSurfaceVariant}
          labeled
          navigationState={{
            ...state,
            routes: state.routes.map((route) => ({
              ...route,
              ...tabs[route.name],
            })),
          }}
          onTabPress={({ preventDefault, route }) => {
            const event = navigation.emit({
              canPreventDefault: true,
              target: route.key,
              type: 'tabPress',
            });
            if (event.defaultPrevented) preventDefault();
            else navigation.navigate(route.name);
          }}
          onTabLongPress={({ route }) =>
            navigation.emit({ target: route.key, type: 'tabLongPress' })
          }
          safeAreaInsets={{ bottom: 0 }}
          shifting={false}
          style={{
            backgroundColor: theme.colors.background,
            height: 72,
            marginBottom: insets.bottom,
          }}
          testID="mobile-bottom-navigation"
        />
      )}
    >
      <Tabs.Screen name="index" options={tabs.index.options} />
      <Tabs.Screen name="catalog" options={tabs.catalog.options} />
      <Tabs.Screen name="profile" options={tabs.profile.options} />
    </Tabs>
  );
}
