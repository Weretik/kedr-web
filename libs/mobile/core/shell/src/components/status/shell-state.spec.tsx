import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { ShellState } from './shell-state';
import { AppProviders } from '../../providers/app-providers';

describe('ShellState', () => {
  it('renders an accessible empty state', async () => {
    const { getByRole, getByTestId } = render(
      <AppProviders>
        <ShellState
          description="У цьому розділі поки немає вмісту."
          kind="empty"
          title="Немає даних"
        />
      </AppProviders>,
    );

    await waitFor(() => {
      expect(getByTestId('shell-state-empty')).toBeTruthy();
      expect(getByRole('header', { name: 'Немає даних' })).toBeTruthy();
    });
  });

  it('exposes a retry action for an error state', async () => {
    const onRetry = jest.fn();
    const { getByRole } = render(
      <AppProviders>
        <ShellState
          description="Не вдалося завантажити дані."
          kind="error"
          onRetry={onRetry}
          title="Сталася помилка"
        />
      </AppProviders>,
    );

    await waitFor(() => expect(getByRole('button', { name: 'Повторити спробу' })).toBeTruthy());
    fireEvent.press(getByRole('button', { name: 'Повторити спробу' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
