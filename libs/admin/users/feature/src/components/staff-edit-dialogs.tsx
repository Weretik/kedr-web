import { validateEmail, validateFullName } from '@admin/users/model';
import { EditTextDialog, SetPasswordDialog } from '@admin/users/ui';

import type { StaffAccount } from '@admin/users/model';

interface StaffEditDialogsProps {
  editDialog: { account: StaffAccount; field: 'name' | 'email' | 'password' } | null;
  onClose: () => void;
  onSubmit: (value: string) => void;
}

/** Forms for a manager's name, email and password on the Users page. */
export function StaffEditDialogs({ editDialog, onClose, onSubmit }: StaffEditDialogsProps) {
  const account = editDialog?.account;
  const field = editDialog?.field;

  return (
    <>
      <EditTextDialog
        description={account?.email}
        initialValue={account?.fullName ?? ''}
        label="Імʼя"
        onClose={onClose}
        onSubmit={onSubmit}
        open={field === 'name'}
        title="Змінити імʼя"
        validate={validateFullName}
      />
      <EditTextDialog
        description="Новий email стане логіном менеджера. Він вийде з системи на всіх пристроях."
        initialValue={account?.email ?? ''}
        label="Email"
        onClose={onClose}
        onSubmit={onSubmit}
        open={field === 'email'}
        title="Змінити email"
        type="email"
        validate={validateEmail}
      />
      <SetPasswordDialog
        email={field === 'password' ? (account?.email ?? null) : null}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </>
  );
}
