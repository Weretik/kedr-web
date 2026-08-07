import { AppProviders } from '@mobile/core/shell';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import TabsLayout from '../app/(tabs)/_layout';

const mockEmit = jest.fn(() => ({ defaultPrevented: false }));
const mockNavigate = jest.fn();

jest.mock('expo-router', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  const descriptors = {
    'catalog-key': { options: { tabBarAccessibilityLabel: 'Каталог', title: 'Каталог' } },
    'index-key': { options: { tabBarAccessibilityLabel: 'Головна', title: 'Головна' } },
    'profile-key': { options: { tabBarAccessibilityLabel: 'Профіль', title: 'Профіль' } },
  };
  const state = {
    index: 0,
    key: 'tabs-key',
    routes: [
      { key: 'index-key', name: 'index' },
      { key: 'catalog-key', name: 'catalog' },
      { key: 'profile-key', name: 'profile' },
    ],
  };

  function Tabs({ tabBar }) {
    return <View>{tabBar({ descriptors, navigation: { emit: mockEmit, navigate: mockNavigate }, state })}</View>;
  }

  Tabs.Screen = () => null;

  return { Tabs };
});

describe('TabsLayout', () => {
  beforeEach(() => {
    mockEmit.mockClear();
    mockNavigate.mockClear();
  });

  it('uses Paper bottom navigation to switch Expo Router tabs', async () => {
    const { getByLabelText, getByTestId } = render(
      <AppProviders>
        <TabsLayout />
      </AppProviders>,
    );

    await waitFor(() => {
      expect(getByTestId('mobile-bottom-navigation')).toBeTruthy();
    });

    fireEvent.press(getByLabelText('Каталог'));

    expect(mockEmit).toHaveBeenCalledWith({
      canPreventDefault: true,
      target: 'catalog-key',
      type: 'tabPress',
    });
    expect(mockNavigate).toHaveBeenCalledWith('catalog');
  });
});
