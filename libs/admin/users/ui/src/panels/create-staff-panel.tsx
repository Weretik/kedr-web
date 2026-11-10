import { AdminEditPanel } from '@admin/shared/ui';
import {
  staffRoleLabels,
  staffRoles,
  validateGrantStaffAccessInput,
  validateStaffAccountInput,
} from '@admin/users/model';
import { Alert, Button, MenuItem, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useState } from 'react';

import { StaffCandidatePicker } from '../components/staff-candidate-picker';

import type {
  CreateStaffAccountInput,
  GrantStaffAccessFieldErrors,
  GrantStaffAccessInput,
  StaffAccountFieldErrors,
  StaffCandidate,
  StaffRole,
} from '@admin/users/model';
import type { FormEvent } from 'react';

/** «Новий» creates an account; «З бази» gives staff access to an existing one (usually a customer). */
export type CreateStaffMode = 'new' | 'existing';

const emptyInput: CreateStaffAccountInput = {
  email: '',
  fullName: '',
  role: 'Manager',
  password: '',
};

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
  const [mode, setMode] = useState<CreateStaffMode>('new');
  const [input, setInput] = useState(emptyInput);
  const [candidate, setCandidate] = useState<StaffCandidate | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    StaffAccountFieldErrors & GrantStaffAccessFieldErrors
  >({});
  const canPickExisting = Boolean(onGrant && onCandidateSearch);

  const update = (change: Partial<CreateStaffAccountInput>) =>
    setInput((current) => ({ ...current, ...change }));

  const changeMode = (next: CreateStaffMode) => {
    setMode(next);
    setFieldErrors({});
    onModeChange?.(next);
  };

  const pickCandidate = (next: StaffCandidate | null) => {
    setCandidate(next);
    if (next) update({ email: next.email, fullName: next.fullName });
  };

  const handleClose = () => {
    setMode('new');
    setInput(emptyInput);
    setCandidate(null);
    setFieldErrors({});
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === 'existing' && onGrant) {
      const grant: GrantStaffAccessInput = {
        userId: candidate?.id ?? '',
        fullName: input.fullName,
        role: input.role,
        password: input.password,
      };
      const errors = validateGrantStaffAccessInput(grant);
      setFieldErrors(errors);
      if (Object.keys(errors).length === 0 && (await onGrant(grant))) handleClose();
      return;
    }

    const errors = validateStaffAccountInput(input);
    setFieldErrors(errors);
    if (Object.keys(errors).length === 0 && (await onSubmit(input))) handleClose();
  };

  const submitLabel = mode === 'existing' ? 'Надати доступ' : 'Створити';

  return (
    <AdminEditPanel
      actions={
        <>
          <Button disabled={submitting} onClick={handleClose}>
            Скасувати
          </Button>
          <Button disabled={submitting} type="submit" variant="contained">
            {submitting ? 'Збереження…' : submitLabel}
          </Button>
        </>
      }
      busy={submitting}
      onClose={handleClose}
      onSubmit={(event) => void handleSubmit(event)}
      open={open}
      title="Новий користувач"
    >
      {canPickExisting ? (
        <ToggleButtonGroup
          aria-label="Звідки користувач"
          exclusive
          fullWidth
          onChange={(_, next: CreateStaffMode | null) => {
            if (next) changeMode(next);
          }}
          size="small"
          value={mode}
        >
          <ToggleButton value="new">Новий</ToggleButton>
          <ToggleButton value="existing">З бази</ToggleButton>
        </ToggleButtonGroup>
      ) : null}
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
