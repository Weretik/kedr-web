import { Autocomplete, ListItemText, TextField } from '@mui/material';

import type { CategoryParentOption } from '@admin/categories/model';

interface CategoryParentPickerProps {
  options: readonly CategoryParentOption[];
  /** The chosen parent; `null` is the top level. */
  value: number | null;
  onChange: (parentId: number | null) => void;
  disabled?: boolean;
}

/** «Вкласти в»: a category found by name, shown with its path, or the top level (spec 002 R-005). */
export function CategoryParentPicker({
  disabled,
  onChange,
  options,
  value,
}: CategoryParentPickerProps) {
  const selected = options.find((option) => option.id === value) ?? null;
  return (
    <Autocomplete
      disableClearable={selected !== null}
      disabled={disabled}
      filterOptions={(list, state) => {
        const term = state.inputValue.trim().toLocaleLowerCase('uk');
        return term
          ? list.filter((option) => option.path.toLocaleLowerCase('uk').includes(term))
          : list;
      }}
      getOptionLabel={(option) => option.path || option.label}
      isOptionEqualToValue={(option, chosen) => option.id === chosen.id}
      noOptionsText="Категорій не знайдено"
      onChange={(_event, option) => onChange(option?.id ?? null)}
      options={options}
      renderInput={(params) => <TextField {...params} label="Вкласти в" />}
      renderOption={({ key, ...optionProps }, option) => (
        <li key={key ?? option.id ?? 'top'} {...optionProps}>
          <ListItemText primary={option.label} secondary={option.path || undefined} />
        </li>
      )}
      value={selected ?? undefined}
    />
  );
}
