import { AppProviders } from '@mobile/core/shell';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { AxiosError, AxiosHeaders } from 'axios';

import { LoginScreen } from './login-screen';
import { login } from '../session/mobile-auth';

jest.mock('../session/mobile-auth', () => ({ login: jest.fn(), logout: jest.fn() }));

const renderScreen = async () =>
  await render(
    <AppProviders>
      <LoginScreen />
    </AppProviders>,
  );

const fillAndSubmit = async (screen: Awaited<ReturnType<typeof renderScreen>>) => {
  await fireEvent.changeText(await screen.findByLabelText('Email'), 'm@kedr.ua');
  await fireEvent.changeText(screen.getByLabelText('Пароль'), 'secret-pass');
  await fireEvent.press(screen.getByRole('button', { name: 'Увійти' }));
};

describe('LoginScreen', () => {
  beforeEach(() => jest.mocked(login).mockReset());

  it('signs in with the trimmed email', async () => {
    jest
      .mocked(login)
      .mockResolvedValue({ email: 'm@kedr.ua', fullName: 'M', id: '1', roles: ['Manager'] });
    const screen = await renderScreen();

    await fireEvent.changeText(await screen.findByLabelText('Email'), ' m@kedr.ua ');
    await fireEvent.changeText(screen.getByLabelText('Пароль'), 'secret-pass');
    await fireEvent.press(screen.getByRole('button', { name: 'Увійти' }));

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
    const screen = await renderScreen();

    await fillAndSubmit(screen);

    expect(await screen.findByText(/Невірний email або пароль/)).toBeTruthy();
  });
});
