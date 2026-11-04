import { TextField } from '@mui/material';

import type { CompanyContactsDraft, CompanyContactsField } from '@admin/company/model';

interface ContactFieldProps {
  field: CompanyContactsField;
  label: string;
  hint: string;
  draft: CompanyContactsDraft;
  error?: string;
  inputMode?: 'tel' | 'email' | 'url' | 'text';
  onChange: (patch: Partial<CompanyContactsDraft>) => void;
}

/** One contact field: the server or validator error replaces the hint. */
export function ContactField({
  draft,
  error,
  field,
  hint,
  inputMode = 'text',
  label,
  onChange,
}: ContactFieldProps) {
  return (
    <TextField
      error={Boolean(error)}
      fullWidth
      helperText={error ?? hint}
      label={label}
      name={field}
      onChange={(event) => onChange({ [field]: event.target.value })}
      slotProps={{ htmlInput: { inputMode } }}
      type={inputMode === 'email' ? 'email' : inputMode === 'url' ? 'url' : 'text'}
      value={draft[field]}
    />
  );
}
