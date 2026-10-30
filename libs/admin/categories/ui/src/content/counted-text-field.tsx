import { TextField } from '@mui/material';

interface CountedTextFieldProps {
  label: string;
  value: string;
  maxLength: number;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  multiline?: boolean;
  readOnly?: boolean;
}

/** Text field with a «12 / 70» counter; it allows typing past the limit and then shows the error. */
export function CountedTextField({
  error,
  hint,
  label,
  maxLength,
  multiline = false,
  onChange,
  readOnly = false,
  value,
}: CountedTextFieldProps) {
  const length = value.trim().length;
  const counter = `${length} / ${maxLength}`;

  return (
    <TextField
      error={Boolean(error) || length > maxLength}
      fullWidth
      helperText={[error ?? hint, counter].filter(Boolean).join(' · ')}
      label={label}
      minRows={multiline ? 2 : undefined}
      multiline={multiline}
      onChange={(event) => onChange(event.target.value)}
      slotProps={{ input: { readOnly } }}
      value={value}
    />
  );
}
