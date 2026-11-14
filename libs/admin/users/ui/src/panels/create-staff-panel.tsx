import { AdminEditPanel } from '@admin/shared/ui';
import { staffRoleLabels, staffRoles } from '@admin/users/model';
import { Alert, Button, MenuItem, TextField } from '@mui/material';

import { StaffCandidatePicker } from '../components/staff-candidate-picker';
import { StaffSourceToggle } from '../components/staff-source-toggle';
import { useCreateStaffForm } from '../hooks/use-create-staff-form';

import type { CreateStaffMode } from '../hooks/use-create-staff-form';
import type {
  CreateStaffAccountInput,
  GrantStaffAccessInput,
  StaffCandidate,
  StaffRole,
} from '@admin/users/model';

interface CreateStaffPanelProps {
  open: boolean;
  submitting: boolean;
  /** Server error to show above the form. */
  error: string | null;
  /** Accounts found for the «З бази» search. */
  candidates?: StaffCandidate[];
  candidatesLoading?: boolean;
  onClose: () => void;
  onCandidateSearch?: (search: string) => void;
  /** Resolves true when the account was created and the panel may close. */
  onSubmit: (input: CreateStaffAccountInput) => Promise<boolean>;
  /** Resolves true when the existing account got staff access and the panel may close. */
  onGrant?: (input: GrantStaffAccessInput) => Promise<boolean>;
  /** Called when the admin switches between «Новий» and «З бази», so an old error can go. */
  onModeChange?: (mode: CreateStaffMode) => void;
}

export function CreateStaffPanel({
  candidates = [],
  candidatesLoading = false,
  error,
  onCandidateSearch,
  onClose,
  onGrant,
  onModeChange,
  onSubmit,
  open,
  submitting,
}: CreateStaffPanelProps) {
  const { candidate, changeMode, close, fieldErrors, input, mode, pickCandidate, submit, update } =
    useCreateStaffForm({ onClose, onGrant, onModeChange, onSubmit });
  const canPickExisting = Boolean(onGrant && onCandidateSearch);

  const submitLabel = mode === 'existing' ? 'Надати доступ' : 'Створити';

  return (
    <AdminEditPanel
      actions={
        <>
          <Button disabled={submitting} onClick={close}>
            Скасувати
          </Button>
          <Button disabled={submitting} type="submit" variant="contained">
            {submitting ? 'Збереження…' : submitLabel}
          </Button>
        </>
      }
      busy={submitting}
      onClose={close}
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
      open={open}
      title="Новий користувач"
    >
      {canPickExisting ? <StaffSourceToggle onChange={changeMode} value={mode} /> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}
      {mode === 'existing' && onCandidateSearch ? (
        <>
          <Alert severity="info">
            Знайдіть клієнта або іншого користувача, який уже є в базі. Він отримає роль і новий
            пароль, а як клієнт залишиться з тими самими замовленнями й цінами.
          </Alert>
          <StaffCandidatePicker
            candidates={candidates}
            error={fieldErrors.userId}
            loading={candidatesLoading}
            onChange={pickCandidate}
            onSearch={onCandidateSearch}
            value={candidate}
          />
        </>
      ) : null}
      <TextField
        error={Boolean(fieldErrors.fullName)}
        helperText={fieldErrors.fullName}
        label="Імʼя"
        onChange={(event) => update({ fullName: event.target.value })}
        required
        value={input.fullName}
      />
      {mode === 'new' ? (
        <TextField
          autoComplete="off"
          error={Boolean(fieldErrors.email)}
          helperText={fieldErrors.email}
          label="Email"
          onChange={(event) => update({ email: event.target.value })}
          required
          type="email"
          value={input.email}
        />
      ) : null}
      <TextField
        label="Роль"
        onChange={(event) => update({ role: event.target.value as StaffRole })}
        select
        value={input.role}
      >
        {staffRoles.map((role) => (
          <MenuItem key={role} value={role}>
            {staffRoleLabels[role]}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        autoComplete="new-password"
        error={Boolean(fieldErrors.password)}
        helperText={
          fieldErrors.password ?? 'Щонайменше 8 символів. Передайте пароль користувачу особисто.'
        }
        label={mode === 'existing' ? 'Новий пароль' : 'Пароль'}
        onChange={(event) => update({ password: event.target.value })}
        required
        type="password"
        value={input.password}
      />
    </AdminEditPanel>
  );
}
