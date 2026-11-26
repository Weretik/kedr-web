import { TextField } from '@mui/material';

interface DraftTextFieldProps<Draft extends Record<string, string>> {
  field: keyof Draft & string;
  label: string;
  hint: string;
  draft: Draft;
  error?: string;
  inputMode?: 'tel' | 'email' | 'url' | 'text' | 'numeric';
  /** A time of day in `HH:mm`; the browser shows its own time picker. */
  time?: boolean;
  onChange: (patch: Partial<Draft>) => void;
}

/** One text field of a company form: the server or validator error replaces the hint. */
export function DraftTextField<Draft extends Record<string, string>>({
  draft,
  error,
  field,
  hint,
  inputMode = 'text',
  label,
  onChange,
  time = false,
}: DraftTextFieldProps<Draft>) {
  const type = time
    ? 'time'
    : inputMode === 'email'
      ? 'email'
      : inputMode === 'url'
        ? 'url'
        : 'text';
  return (
    <TextField
      error={Boolean(error)}
      fullWidth
      helperText={error ?? hint}
      label={label}
      name={field}
      onChange={(event) => onChange({ [field]: event.target.value } as Partial<Draft>)}
      slotProps={{ htmlInput: { inputMode }, inputLabel: time ? { shrink: true } : undefined }}
      type={type}
      value={draft[field]}
    />
  );
}
