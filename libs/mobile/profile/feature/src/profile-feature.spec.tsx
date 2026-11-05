import { ProfileError, type ProfileApi } from '@mobile/profile/data-access';
import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { CabinetProfile, type CabinetUser } from './components/cabinet-profile';

jest.mock('expo-image-picker', () => ({ launchImageLibraryAsync: jest.fn() }));

const manager: CabinetUser = {
  avatarUrl: null,
  email: 'olena@kedr.ua',
  fullName: 'Олена Коваль',
  roles: ['Manager'],
};
const admin: CabinetUser = { ...manager, roles: ['Admin'] };

const fakeApi = (overrides: Partial<ProfileApi> = {}): ProfileApi => ({
  changeEmail: jest.fn().mockResolvedValue(undefined),
  changeName: jest.fn().mockResolvedValue(undefined),
  changePassword: jest.fn().mockResolvedValue(undefined),
  removeAvatar: jest.fn().mockResolvedValue(undefined),
  uploadAvatar: jest.fn().mockResolvedValue('https://cdn/new.webp'),
  ...overrides,
});

describe('CabinetProfile', () => {
  it('lets a manager change name and photo but not e-mail or password (SC-021)', async () => {
    const api = fakeApi();
    const onUserChanged = jest.fn();
    await render(
      <CabinetProfile
        api={api}
        isOnline
        onCredentialsChanged={jest.fn()}
        onUserChanged={onUserChanged}
        pickPhoto={jest
          .fn()
          .mockResolvedValue({ fileName: 'a.jpg', mimeType: 'image/jpeg', uri: 'file:///a.jpg' })}
        user={manager}
      />,
    );

    expect(screen.queryByRole('button', { name: 'Змінити e-mail' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Змінити пароль' })).toBeNull();

    await fireEvent.press(screen.getByRole('button', { name: 'Змінити фото' }));
    await act(async () => undefined);
    expect(onUserChanged).toHaveBeenCalledWith({ avatarUrl: 'https://cdn/new.webp' });

    await fireEvent.press(screen.getByRole('button', { name: 'Змінити імʼя' }));
    await fireEvent.changeText(screen.getByLabelText('Імʼя та прізвище'), 'Олена К.');
    await fireEvent.press(screen.getByRole('button', { name: 'Зберегти імʼя' }));
    await act(async () => undefined);
    expect(api.changeName).toHaveBeenCalledWith('Олена К.');
    expect(onUserChanged).toHaveBeenCalledWith({ fullName: 'Олена К.' });
    expect(screen.getByText('Імʼя змінено.')).toBeTruthy();
  });

  it('changes an admin password and signs in again with it (SC-022)', async () => {
    const api = fakeApi();
    const onCredentialsChanged = jest.fn().mockResolvedValue(undefined);
    await render(
      <CabinetProfile
        api={api}
        isOnline
        onCredentialsChanged={onCredentialsChanged}
        onUserChanged={jest.fn()}
        user={admin}
      />,
    );

    await fireEvent.press(screen.getByRole('button', { name: 'Змінити пароль' }));
    await fireEvent.changeText(screen.getByLabelText('Поточний пароль'), 'old-pass');
    await fireEvent.changeText(screen.getByLabelText('Новий пароль'), 'new-password');
    await fireEvent.changeText(screen.getByLabelText('Повторіть новий пароль'), 'new-password');
    await fireEvent.press(screen.getByRole('button', { name: 'Далі' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Так, змінити' }));
    await act(async () => undefined);

    expect(api.changePassword).toHaveBeenCalledWith('old-pass', 'new-password');
    expect(onCredentialsChanged).toHaveBeenCalledWith('olena@kedr.ua', 'new-password');
  });

  it('says when the current password is wrong', async () => {
    const api = fakeApi({
      changeEmail: jest
        .fn()
        .mockRejectedValue(
          new ProfileError({ code: 'Validation', fieldErrors: { currentPassword: ['x'] } }),
        ),
    });
    await render(
      <CabinetProfile
        api={api}
        isOnline
        onCredentialsChanged={jest.fn()}
        onUserChanged={jest.fn()}
        user={admin}
      />,
    );

    await fireEvent.press(screen.getByRole('button', { name: 'Змінити e-mail' }));
    await fireEvent.changeText(screen.getByLabelText('Новий e-mail'), 'new@kedr.ua');
    await fireEvent.changeText(screen.getByLabelText('Поточний пароль'), 'wrong');
    await fireEvent.press(screen.getByRole('button', { name: 'Далі' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Так, змінити' }));
    await act(async () => undefined);

    expect(screen.getByText('Невірний поточний пароль.')).toBeTruthy();
  });

  it('keeps changes for the network', async () => {
    await render(
      <CabinetProfile
        api={fakeApi()}
        isOnline={false}
        onCredentialsChanged={jest.fn()}
        onUserChanged={jest.fn()}
        user={manager}
      />,
    );
    expect(screen.getByRole('button', { name: 'Змінити імʼя' })).toBeDisabled();
    expect(screen.getByText('Зміни профілю зберігаються, коли є мережа.')).toBeTruthy();
  });
});
