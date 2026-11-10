import { minCandidateSearchLength } from '@admin/users/model';
import { Autocomplete, Box, TextField, Typography } from '@mui/material';

import type { StaffCandidate } from '@admin/users/model';

interface StaffCandidatePickerProps {
  candidates: StaffCandidate[];
  loading: boolean;
  value: StaffCandidate | null;
  error?: string;
  onChange: (candidate: StaffCandidate | null) => void;
  /** Called with the typed text; the page searches the server from two characters. */
  onSearch: (search: string) => void;
}

/** Finds an existing account (usually a customer) by part of the email or name. */
export function StaffCandidatePicker({
  candidates,
  error,
  loading,
  onChange,
  onSearch,
  value,
}: StaffCandidatePickerProps) {
  return (
    <Autocomplete
      filterOptions={(options) => options}
      getOptionLabel={(candidate) => candidate.fullName || candidate.email}
      isOptionEqualToValue={(option, selected) => option.id === selected.id}
      loading={loading}
      loadingText="Пошук…"
      noOptionsText={`Введіть щонайменше ${minCandidateSearchLength} символи email або імені`}
      onChange={(_, candidate) => onChange(candidate)}
      onInputChange={(_, text, reason) => {
        if (reason === 'input') onSearch(text);
      }}
      options={candidates}
      renderInput={(params) => (
        <TextField
          {...params}
          error={Boolean(error)}
          helperText={error ?? (value ? `Email для входу: ${value.email}` : undefined)}
          label="Користувач із бази"
          required
        />
      )}
      renderOption={({ key, ...props }, candidate) => (
        <Box component="li" key={key} {...props}>
          <Box sx={{ minWidth: 0 }}>
            <Typography noWrap variant="body2">
              {candidate.fullName || candidate.email}
            </Typography>
            <Typography color="text.secondary" noWrap variant="caption">
              {candidate.email}
              {candidate.isCustomer ? ' · клієнт' : ''}
            </Typography>
          </Box>
        </Box>
      )}
      value={value}
    />
  );
}
