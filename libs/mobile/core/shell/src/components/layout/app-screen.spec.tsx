import { render, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';

import { AppScreen } from './app-screen';
import { AppProviders } from '../../providers/app-providers';

describe('AppScreen', () => {
  it('renders screen content inside the safe area container', async () => {
    const { getByTestId, getByText } = render(
      <AppProviders>
        <AppScreen testID="app-screen">
          <Text>Вміст екрана</Text>
        </AppScreen>
      </AppProviders>,
    );

    await waitFor(() => {
      expect(getByTestId('app-screen')).toBeTruthy();
      expect(getByText('Вміст екрана')).toBeTruthy();
    });
  });
});
