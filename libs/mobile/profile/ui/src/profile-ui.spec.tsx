import { fireEvent, render, screen } from '@testing-library/react-native';

import { EmailForm } from './components/email-form';
import { PasswordForm } from './components/password-form';
import { ProfileHeader } from './components/profile-header';
import { SignOutSection } from './components/sign-out-section';

describe('ProfileHeader', () => {
  it('shows name, role and e-mail and changes the photo (SC-021)', async () => {
    const onChangePhoto = jest.fn();
    await render(
      <ProfileHeader
        avatarUrl={null}
        busy={false}
        canEdit
        email="olena@kedr.ua"
        name="Олена Коваль"
        onChangePhoto={onChangePhoto}
        onRemovePhoto={jest.fn()}
        roleLabel="Менеджер"
      />,
    );

    expect(screen.getByText('Менеджер')).toBeTruthy();
    expect(screen.getByText('olena@kedr.ua')).toBeTruthy();
    expect(screen.queryByText('Прибрати фото')).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: 'Змінити фото' }));
    expect(onChangePhoto).toHaveBeenCalled();
  });
});

describe('Admin credential forms (SC-022)', () => {
  it('asks for the current password and a confirmation before changing the e-mail', async () => {
    const onSave = jest.fn();
    await render(
      <EmailForm
        busy={false}
        currentEmail="a@kedr.ua"
        error={null}
        onCancel={jest.fn()}
        onSave={onSave}
      />,
    );

    await fireEvent.changeText(screen.getByLabelText('Новий e-mail'), 'b@kedr.ua');
    await fireEvent.press(screen.getByRole('button', { name: 'Далі' }));
    expect(screen.getByText('Вкажіть поточний пароль.')).toBeTruthy();

    await fireEvent.changeText(screen.getByLabelText('Поточний пароль'), 'secret-1');
    await fireEvent.press(screen.getByRole('button', { name: 'Далі' }));
    expect(screen.getByText(/Змінити e-mail a@kedr.ua на b@kedr.ua\?/)).toBeTruthy();
    expect(onSave).not.toHaveBeenCalled();

    await fireEvent.press(screen.getByRole('button', { name: 'Так, змінити' }));
    expect(onSave).toHaveBeenCalledWith('b@kedr.ua', 'secret-1');
  });

  it('checks the new password twice before confirming', async () => {
    const onSave = jest.fn();
    await render(<PasswordForm busy={false} error={null} onCancel={jest.fn()} onSave={onSave} />);

    await fireEvent.changeText(screen.getByLabelText('Поточний пароль'), 'old-pass');
    await fireEvent.changeText(screen.getByLabelText('Новий пароль'), 'new-password');
    await fireEvent.changeText(screen.getByLabelText('Повторіть новий пароль'), 'new-passwor');
    await fireEvent.press(screen.getByRole('button', { name: 'Далі' }));
    expect(screen.getByText('Паролі не збігаються.')).toBeTruthy();

    await fireEvent.changeText(screen.getByLabelText('Повторіть новий пароль'), 'new-password');
    await fireEvent.press(screen.getByRole('button', { name: 'Далі' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Так, змінити' }));
    expect(onSave).toHaveBeenCalledWith('old-pass', 'new-password');
  });
});

describe('SignOutSection (SC-023)', () => {
  it('signs out at once with an empty queue', async () => {
    const onSignOut = jest.fn();
    await render(<SignOutSection onSignOut={onSignOut} queuedCount={0} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Вийти' }));
    expect(onSignOut).toHaveBeenCalled();
  });

  it('warns about queued orders and signs out only after confirmation', async () => {
    const onSignOut = jest.fn();
    await render(<SignOutSection onSignOut={onSignOut} queuedCount={1} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Вийти' }));
    expect(onSignOut).not.toHaveBeenCalled();
    expect(screen.getByText('Невідправлених у черзі: 1')).toBeTruthy();

    await fireEvent.press(screen.getByRole('button', { name: 'Вийти все одно' }));
    expect(onSignOut).toHaveBeenCalled();
  });
});
