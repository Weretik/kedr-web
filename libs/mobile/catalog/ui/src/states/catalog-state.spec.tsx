import { fireEvent, render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';

import { CatalogState } from './catalog-state';

describe('CatalogState', () => {
  it('renders an accessible retry action for an error', () => {
    const onRetry = jest.fn();
    const { getByRole, getByTestId } = render(
      <PaperProvider theme={testTheme}>
        <CatalogState kind="error" onRetry={onRetry} />
      </PaperProvider>,
    );

    expect(getByTestId('catalog-state-error')).toBeTruthy();
    fireEvent.press(getByRole('button', { name: 'Повторити спробу' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

const testTheme = {
  colors: {
    onPrimaryContainer: '#000',
    onSurfaceVariant: '#000',
    primaryContainer: '#fff',
  },
  dark: false,
};
