import { useCart } from '@mobile/cart/data-access';
import { PillTabBar, type PillTab } from '@mobile/core/shell';
import { ScreenHeader } from '@mobile/shared/ui';
import { Tabs } from 'expo-router';

const tabs: Record<string, PillTab> = {
  cart: { focusedIcon: 'cart', label: 'Кошик', unfocusedIcon: 'cart-outline' },
  catalog: { focusedIcon: 'view-grid', label: 'Каталог', unfocusedIcon: 'view-grid-outline' },
  index: { focusedIcon: 'home', label: 'Головна', unfocusedIcon: 'home-outline' },
  orders: {
    focusedIcon: 'receipt-text',
    label: 'Замовлення',
    unfocusedIcon: 'receipt-text-outline',
  },
  profile: { focusedIcon: 'account', label: 'Профіль', unfocusedIcon: 'account-outline' },
};

const options = (name: keyof typeof tabs) => ({
  tabBarAccessibilityLabel: tabs[name].label,
  title: tabs[name].label,
});

export default function TabsLayout() {
  const { lines } = useCart();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        header: ({ options: screenOptions }) => (
          <ScreenHeader
            right={screenOptions.headerRight?.({ canGoBack: false })}
            title={screenOptions.title ?? route.name}
          />
        ),
      })}
      tabBar={({ emitter, navigateToTab, state }) => (
        <PillTabBar
          badges={{ cart: lines.length }}
          emitter={emitter}
          navigateToTab={navigateToTab}
          state={state}
          tabs={tabs}
        />
      )}
    >
      <Tabs.Screen name="index" options={options('index')} />
      <Tabs.Screen name="catalog" options={options('catalog')} />
      <Tabs.Screen name="cart" options={options('cart')} />
      <Tabs.Screen name="orders" options={options('orders')} />
      <Tabs.Screen name="profile" options={options('profile')} />
    </Tabs>
  );
}
