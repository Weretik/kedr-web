import { Autocomplete, ListItemText, TextField } from '@mui/material';

import type { SiteModelListItem } from '@admin/site-models/model';

interface SiteModelPickerProps {
  models: readonly SiteModelListItem[];
  loading: boolean;
  /** The typed name; the server searches by it. */
  search: string;
  value: SiteModelListItem | null;
  disabled?: boolean;
  onSearchChange: (search: string) => void;
  onChange: (model: SiteModelListItem | null) => void;
}

/** A model searched by name, with its site category; a proposal says «не перевірена». */
export function SiteModelPicker(props: SiteModelPickerProps) {
  return (
    <Autocomplete
      disabled={props.disabled}
      filterOptions={(options) => options}
      getOptionLabel={(option) => option.name}
      inputValue={props.search}
      isOptionEqualToValue={(option, selected) => option.id === selected.id}
      loading={props.loading}
      loadingText="Завантаження…"
      noOptionsText="Моделей не знайдено"
      onChange={(_event, model) => props.onChange(model)}
      onInputChange={(_event, value) => props.onSearchChange(value)}
      options={props.models}
      renderInput={(params) => <TextField {...params} label="Модель" size="small" />}
      renderOption={({ key, ...optionProps }, option) => (
        <li key={key} {...optionProps}>
          <ListItemText
            primary={option.name}
            secondary={[option.categoryName, option.status === 'proposed' ? 'не перевірена' : '']
              .filter(Boolean)
              .join(' · ')}
          />
        </li>
      )}
      value={props.value}
    />
  );
}
