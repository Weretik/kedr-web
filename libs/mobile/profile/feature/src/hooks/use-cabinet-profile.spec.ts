import { act, renderHook } from '@testing-library/react-native';

import { useCabinetProfile } from './use-cabinet-profile';

import type { ProfileApi } from '@mobile/profile/data-access';

const user = {
  fullName: 'Ольга',
  email: 'olha@classkedr.com.ua',
  avatarUrl: null,
  roles: ['Admin'],
};

const setup = (api: Partial<ProfileApi>) => {
  const onUserChanged = jest.fn();
  const onCredentialsChanged = jest.fn().mockResolvedValue(undefined);
  const hook = renderHook(() =>
    useCabinetProfile({
      api: api as ProfileApi,
      onCredentialsChanged,
      onUserChanged,
      pickPhoto: jest.fn().mockResolvedValue(null),
      user,
    }),
  );
  return { hook, onCredentialsChanged, onUserChanged };
};

describe('useCabinetProfile', () => {
  it('saves the name, closes the form, and shows the notice', async () => {
    const { hook, onUserChanged } = setup({ changeName: jest.fn().mockResolvedValue(undefined) });
    const { result } = await hook;
    await act(() => result.current.open('name'));
    await act(() => result.current.saveName('Ольга К.'));
    expect(onUserChanged).toHaveBeenCalledWith({ fullName: 'Ольга К.' });
    expect(result.current.editing).toBeNull();
    expect(result.current.notice).toBe('Імʼя змінено.');
  });

  it('signs in again with the new password and keeps the form open on failure', async () => {
    const changePassword = jest.fn().mockResolvedValue(undefined);
    const { hook, onCredentialsChanged } = setup({ changePassword });
    const { result } = await hook;
    await act(() => result.current.savePassword('old', 'new'));
    expect(onCredentialsChanged).toHaveBeenCalledWith('olha@classkedr.com.ua', 'new');

    changePassword.mockRejectedValue(new Error('down'));
    await act(() => result.current.open('password'));
    await act(() => result.current.savePassword('old', 'new'));
    expect(result.current.editing).toBe('password');
    expect(result.current.error).toBe('Не вдалося зберегти. Спробуйте ще раз.');
  });
});
