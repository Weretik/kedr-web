import { apiClient } from '@mobile/shared/api-client';
import { AxiosError, AxiosHeaders } from 'axios';

import { profileApi, ProfileError } from './api/profile-api';

jest.mock('expo-image-picker', () => ({ launchImageLibraryAsync: jest.fn() }));

const refusal = (status: number, data: unknown) =>
  new AxiosError('refused', 'ERR_BAD_REQUEST', undefined, undefined, {
    config: { headers: new AxiosHeaders() },
    data,
    headers: {},
    status,
    statusText: '',
  });

describe('profileApi', () => {
  afterEach(() => jest.restoreAllMocks());

  it('sends a trimmed name', async () => {
    const put = jest.spyOn(apiClient, 'put').mockResolvedValue({ data: undefined });
    await profileApi.changeName('  Олена  ');
    expect(put).toHaveBeenCalledWith('/api/profile/name', { fullName: 'Олена' });
  });

  it('reports a wrong current password as a validation failure (SC-022)', async () => {
    jest
      .spyOn(apiClient, 'put')
      .mockRejectedValue(
        refusal(400, [{ errorMessage: 'Wrong password.', identifier: 'currentPassword' }]),
      );

    await expect(profileApi.changePassword('old', 'newpassword')).rejects.toEqual(
      new ProfileError({
        code: 'Validation',
        fieldErrors: { currentPassword: ['Wrong password.'] },
        status: 400,
      }),
    );
  });

  it('uploads the photo as a file part and returns the new address', async () => {
    const put = jest
      .spyOn(apiClient, 'put')
      .mockResolvedValue({ data: { avatarUrl: 'https://cdn/a.webp' } });

    await expect(
      profileApi.uploadAvatar({ fileName: 'a.jpg', mimeType: 'image/jpeg', uri: 'file:///a.jpg' }),
    ).resolves.toBe('https://cdn/a.webp');
    expect(put.mock.calls[0]?.[0]).toBe('/api/profile/avatar');
    expect(put.mock.calls[0]?.[1]).toBeInstanceOf(FormData);
  });
});
