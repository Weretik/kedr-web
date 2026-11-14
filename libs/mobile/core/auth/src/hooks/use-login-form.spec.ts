import { act, renderHook } from '@testing-library/react-native';

import { useLoginForm } from './use-login-form';
import { login } from '../session/mobile-auth';

jest.mock('../session/mobile-auth', () => ({ login: jest.fn() }));

describe('useLoginForm', () => {
  beforeEach(() => jest.mocked(login).mockReset());

  it('signs in with the trimmed email only when both fields are filled', async () => {
    jest.mocked(login).mockResolvedValue(undefined as never);
    const { result } = await renderHook(() => useLoginForm());
    expect(result.current.canSubmit).toBe(false);
    await act(() => result.current.setEmail(' olha@classkedr.com.ua '));
    await act(() => result.current.setPassword('secret'));
    await act(() => result.current.submit());
    expect(login).toHaveBeenCalledWith({ email: 'olha@classkedr.com.ua', password: 'secret' });
    expect(result.current.submitting).toBe(false);
  });

  it('shows the message for a failed sign-in', async () => {
    jest.mocked(login).mockRejectedValue(new Error('offline'));
    const { result } = await renderHook(() => useLoginForm());
    await act(() => result.current.setEmail('olha@classkedr.com.ua'));
    await act(() => result.current.setPassword('secret'));
    await act(() => result.current.submit());
    expect(result.current.error).toEqual(expect.any(String));
  });
});
