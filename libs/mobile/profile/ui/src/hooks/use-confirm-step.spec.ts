import { act, renderHook } from '@testing-library/react-native';

import { useConfirmStep } from './use-confirm-step';

describe('useConfirmStep', () => {
  it('shows the problem and stays on the form when the check fails', async () => {
    const { result } = await renderHook(() => useConfirmStep(() => 'Вкажіть поточний пароль.'));
    await act(() => result.current.review());
    expect(result.current.problem).toBe('Вкажіть поточний пароль.');
    expect(result.current.confirming).toBe(false);
  });

  it('asks to confirm when the check passes and goes back on request', async () => {
    const { result } = await renderHook(() => useConfirmStep(() => null));
    await act(() => result.current.review());
    expect(result.current.confirming).toBe(true);
    await act(() => result.current.back());
    expect(result.current.confirming).toBe(false);
  });
});
