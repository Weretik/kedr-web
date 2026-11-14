import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useCreateStaffForm } from './use-create-staff-form';

const candidate = { id: 'u-1', email: 'client@kedr.ua', fullName: 'Клієнт' } as never;

describe('useCreateStaffForm', () => {
  it('shows field errors and does not submit an empty new account', async () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() => useCreateStaffForm({ onClose: vi.fn(), onSubmit }));

    await act(() => result.current.submit());

    expect(onSubmit).not.toHaveBeenCalled();
    expect(result.current.fieldErrors.email).toBeTruthy();
  });

  it('grants access to a picked account and resets after success', async () => {
    const onGrant = vi.fn().mockResolvedValue(true);
    const onClose = vi.fn();
    const onModeChange = vi.fn();
    const { result } = renderHook(() =>
      useCreateStaffForm({ onClose, onGrant, onModeChange, onSubmit: vi.fn() }),
    );

    act(() => result.current.changeMode('existing'));
    act(() => result.current.pickCandidate(candidate));
    act(() => result.current.update({ password: 'secret-123' }));
    await act(() => result.current.submit());

    expect(onModeChange).toHaveBeenCalledWith('existing');
    expect(onGrant).toHaveBeenCalledWith({
      userId: 'u-1',
      fullName: 'Клієнт',
      role: 'Manager',
      password: 'secret-123',
    });
    expect(onClose).toHaveBeenCalled();
    expect(result.current.mode).toBe('new');
    expect(result.current.input.fullName).toBe('');
  });
});
