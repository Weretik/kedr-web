import { Ionicons } from '@expo/vector-icons';
import { ThemePreferenceHeaderControl } from '@mobile/core/shell';
import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';

const tabIcons = {
  catalog: 'grid-outline',
  index: 'home-outline',
  profile: 'person-outline',
} as const;

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerRight: () => <ThemePreferenceHeaderControl />,
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.onSurface,
        headerTitleAlign: 'center',
        headerTitleStyle: { color: theme.colors.onSurface },
        tabBarAccessibilityLabel: route.name,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarIcon: ({ color, size }) => (
          <Ionicons
            color={color}
            name={tabIcons[route.name as keyof typeof tabIcons]}
            size={size}
          />
        ),
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: { backgroundColor: theme.colors.surface },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Головна', tabBarAccessibilityLabel: 'Головна' }}
      />
      <Tabs.Screen
        name="catalog"
        options={{ title: 'Каталог', tabBarAccessibilityLabel: 'Каталог' }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Профіль', tabBarAccessibilityLabel: 'Профіль' }}
      />
    </Tabs>
  );
}
