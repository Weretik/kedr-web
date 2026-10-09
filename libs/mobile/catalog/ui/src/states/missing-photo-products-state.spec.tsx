import { fireEvent, render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';

import { MissingPhotoProductsState } from './missing-photo-products-state';

describe('MissingPhotoProductsState', () => {
  it('presents an empty response as successful photo coverage', () => {
    const { getByText, queryByRole } = renderState('empty');

    expect(getByText('Усі товари мають фотографії')).toBeTruthy();
    expect(queryByRole('alert')).toBeNull();
  });

  it('announces a safe error and retries explicitly', () => {
    const onRetry = jest.fn();
    const { getByRole, getByTestId, getByText } = render(
      <PaperProvider theme={testTheme}>
        <MissingPhotoProductsState kind="error" onRetry={onRetry} />
      </PaperProvider>,
    );

    expect(getByTestId('missing-photo-products-state-error').props.accessibilityRole).toBe('alert');
    expect(getByText('Не вдалося завантажити товари без фотографій')).toBeTruthy();
    fireEvent.press(getByRole('button', { name: 'Повторити' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('exposes an accessible loading indicator', () => {
    const { getByLabelText } = renderState('loading');

    expect(getByLabelText('Завантаження товарів без фотографій')).toBeTruthy();
  });
});

function renderState(kind: Parameters<typeof MissingPhotoProductsState>[0]['kind']) {
  return render(
    <PaperProvider theme={testTheme}>
      <MissingPhotoProductsState kind={kind} />
    </PaperProvider>,
  );
}

const testTheme = {
  colors: {
    onPrimaryContainer: '#000',
    onSurfaceVariant: '#555',
    primary: '#070',
    primaryContainer: '#efe',
  },
  dark: false,
};
