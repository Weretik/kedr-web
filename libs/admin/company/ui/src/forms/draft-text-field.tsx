import { TextField } from '@mui/material';

interface DraftTextFieldProps<Draft extends Record<string, string>> {
  field: keyof Draft & string;
  label: string;
  hint: string;
  draft: Draft;
  error?: string;
  inputMode?: 'tel' | 'email' | 'url' | 'text' | 'numeric';
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
}: DraftTextFieldProps<Draft>) {
  return (
    <TextField
      error={Boolean(error)}
      fullWidth
      helperText={error ?? hint}
      label={label}
      name={field}
      onChange={(event) => onChange({ [field]: event.target.value } as Partial<Draft>)}
      slotProps={{ htmlInput: { inputMode } }}
      type={inputMode === 'email' ? 'email' : inputMode === 'url' ? 'url' : 'text'}
      value={draft[field]}
    />
  );
}
