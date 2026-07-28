import { render, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import { useTheme } from 'react-native-paper';

import { AppProviders } from './app-providers';

function ThemeProbe() {
  const theme = useTheme();

  return <Text>{theme.dark ? 'dark' : 'light'}</Text>;
}

describe('AppProviders', () => {
  it('provides the dark corporate Paper theme', async () => {
    const { getByText } = render(
      <AppProviders colorScheme="dark">
        <ThemeProbe />
      </AppProviders>,
    );

    await waitFor(() => expect(getByText('dark')).toBeTruthy());
  });
});
