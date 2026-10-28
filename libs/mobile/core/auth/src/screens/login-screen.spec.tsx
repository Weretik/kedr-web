import { AppProviders } from '@mobile/core/shell';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { AxiosError, AxiosHeaders } from 'axios';

import { LoginScreen } from './login-screen';
import { login } from '../session/mobile-auth';

jest.mock('../session/mobile-auth', () => ({ login: jest.fn(), logout: jest.fn() }));

const renderScreen = () =>
  render(
    <AppProviders>
      <LoginScreen />
    </AppProviders>,
  );

const fillAndSubmit = async (screen: ReturnType<typeof renderScreen>) => {
  fireEvent.changeText(await screen.findByLabelText('Email'), 'm@kedr.ua');
  fireEvent.changeText(screen.getByLabelText('Пароль'), 'secret-pass');
  fireEvent.press(screen.getByRole('button', { name: 'Увійти' }));
};

describe('LoginScreen', () => {
  beforeEach(() => jest.mocked(login).mockReset());

  it('signs in with the trimmed email', async () => {
    jest
      .mocked(login)
      .mockResolvedValue({ email: 'm@kedr.ua', fullName: 'M', id: '1', roles: ['Manager'] });
    const screen = renderScreen();

    fireEvent.changeText(await screen.findByLabelText('Email'), ' m@kedr.ua ');
    fireEvent.changeText(screen.getByLabelText('Пароль'), 'secret-pass');
    fireEvent.press(screen.getByRole('button', { name: 'Увійти' }));

    await waitFor(() =>
      expect(login).toHaveBeenCalledWith({ email: 'm@kedr.ua', password: 'secret-pass' }),
    );
  });

  it('explains wrong credentials', async () => {
    const config = { headers: new AxiosHeaders() };
    jest.mocked(login).mockRejectedValue(
      new AxiosError('Unauthorized', '401', config, undefined, {
        config,
        data: {},
        headers: {},
        status: 401,
        statusText: '',
      }),
    );
    const screen = renderScreen();

    await fillAndSubmit(screen);

    expect(await screen.findByText(/Невірний email або пароль/)).toBeTruthy();
  });
});
