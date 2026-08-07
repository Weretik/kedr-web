import { AppProviders } from '@mobile/core/shell';
import { render, waitFor } from '@testing-library/react-native';

import CatalogRoute from '../app/(tabs)/catalog';
import StartRoute from '../app/(tabs)/index';
import ProfileRoute from '../app/(tabs)/profile';

jest.mock('@mobile/catalog/feature', () => ({
  CatalogScreen: () => {
    const { Text: MockText } = jest.requireActual('react-native');

    return <MockText accessibilityRole="header">Каталог</MockText>;
  },
}));

jest.mock('expo-router', () => {
  const Tabs = () => null;
  Tabs.Screen = () => null;

  return { Tabs };
});

describe('StartRoute', () => {
  it('renders the home tab placeholder', async () => {
    const { getByRole, getByText } = render(
      <AppProviders>
        <StartRoute />
      </AppProviders>,
    );

    await waitFor(() => {
      expect(getByRole('header', { name: 'Головна' })).toBeTruthy();
      expect(getByText('Тут з’являться актуальні пропозиції та новини.')).toBeTruthy();
    });
  });

  it('renders the catalog and profile root tab routes', async () => {
    const { getByRole } = render(
      <AppProviders>
        <CatalogRoute />
        <ProfileRoute />
      </AppProviders>,
    );

    await waitFor(() => {
      expect(getByRole('header', { name: 'Каталог' })).toBeTruthy();
      expect(getByRole('header', { name: 'Профіль' })).toBeTruthy();
    });
  });
});
