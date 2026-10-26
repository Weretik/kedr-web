import { AppProviders } from '@mobile/core/shell';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import ProfileRoute from '../app/(tabs)/profile';

const mockPush = jest.fn();

jest.mock('@mobile/catalog/feature', () => ({
  MissingPhotoProductsScreen: ({
    onProductPress,
  }: {
    onProductPress: (product: { productSlug: string }) => void;
  }) => {
    const { Pressable, Text } = jest.requireActual('react-native');
    return (
      <Pressable
        accessibilityLabel="Товар Кабель"
        accessibilityRole="button"
        onPress={() => onProductPress({ productSlug: 'kabel-12' })}
      >
        <Text accessibilityRole="header">Товари без фотографій</Text>
      </Pressable>
    );
  },
}));

jest.mock('expo-router', () => ({
  router: { push: (...args: unknown[]) => mockPush(...args) },
  Tabs: { Screen: () => null },
}));

describe('ProfileRoute', () => {
  beforeEach(() => mockPush.mockClear());

  it('composes the missing-photo feature and opens existing product details', async () => {
    const { getByLabelText, getByRole } = render(
      <AppProviders>
        <ProfileRoute />
      </AppProviders>,
    );

    await waitFor(() =>
      expect(getByRole('header', { name: 'Товари без фотографій' })).toBeTruthy(),
    );
    fireEvent.press(getByLabelText('Товар Кабель'));
    expect(mockPush).toHaveBeenCalledWith({
      params: { productSlug: 'kabel-12' },
      pathname: '/product/[productSlug]',
    });
  });
});
