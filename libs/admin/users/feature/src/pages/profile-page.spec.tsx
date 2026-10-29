import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import ProfilePage from './profile-page';

import type { StaffProfile } from '@admin/users/model';

const { changeName, mutation, state } = vi.hoisted(() => {
  const mutation =
    (fn: (arg: unknown) => unknown = () => undefined) =>
    () => [(arg: unknown) => ({ unwrap: () => Promise.resolve(fn(arg)) }), { isLoading: false }];
  return {
    changeName: vi.fn(),
    mutation,
    state: { profile: undefined as StaffProfile | undefined },
  };
});

vi.mock('@admin/users/data-access', () => ({
  useGetMyProfileQuery: () => ({ currentData: state.profile, isError: false, refetch: vi.fn() }),
  useChangeMyNameMutation: mutation((arg) => changeName(arg)),
  useChangeMyEmailMutation: mutation(),
  useChangeMyPasswordMutation: mutation(),
  useUploadMyAvatarMutation: mutation(),
  useRemoveMyAvatarMutation: mutation(),
}));

const manager: StaffProfile = {
  id: 'm-1',
  email: 'olena@kedr.ua',
  fullName: 'Олена',
  role: 'Manager',
  avatarUrl: null,
};

describe('ProfilePage', () => {
  beforeEach(() => {
    changeName.mockReset();
    state.profile = manager;
  });

  it('shows the profile and lets a manager edit only the name', () => {
    render(<ProfilePage onProfileChanged={vi.fn().mockResolvedValue(undefined)} />);

    expect(screen.getByText('olena@kedr.ua')).toBeTruthy();
    expect(screen.getAllByText('Менеджер').length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: 'Змінити' })).toHaveLength(1);
    expect(screen.getByText(/до 2 МБ/)).toBeTruthy();
  });

  it('gives an admin email and password editing', () => {
    state.profile = { ...manager, role: 'Admin' };
    render(<ProfilePage onProfileChanged={vi.fn().mockResolvedValue(undefined)} />);

    expect(screen.getAllByRole('button', { name: 'Змінити' })).toHaveLength(3);
  });

  it('sends a new name only after confirmation and refreshes the header', async () => {
    const onProfileChanged = vi.fn().mockResolvedValue(undefined);
    render(<ProfilePage onProfileChanged={onProfileChanged} />);

    fireEvent.click(screen.getByRole('button', { name: 'Змінити' }));
    fireEvent.change(screen.getByLabelText(/Імʼя/), { target: { value: 'Олена Коваль' } });
    fireEvent.click(screen.getByRole('button', { name: 'Далі' }));

    expect(screen.getByText('Змінити імʼя?')).toBeTruthy();
    expect(changeName).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Змінити імʼя' }));

    await waitFor(() => expect(changeName).toHaveBeenCalledWith('Олена Коваль'));
    await waitFor(() => expect(onProfileChanged).toHaveBeenCalled());
    expect(await screen.findByText('Імʼя змінено.')).toBeTruthy();
  });

  it('does not send anything when the confirmation is cancelled', () => {
    render(<ProfilePage onProfileChanged={vi.fn().mockResolvedValue(undefined)} />);

    fireEvent.click(screen.getByRole('button', { name: 'Змінити' }));
    fireEvent.change(screen.getByLabelText(/Імʼя/), { target: { value: 'Інше' } });
    fireEvent.click(screen.getByRole('button', { name: 'Далі' }));
    fireEvent.click(screen.getByRole('button', { name: 'Скасувати' }));

    expect(changeName).not.toHaveBeenCalled();
  });
});
