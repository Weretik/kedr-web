import { Autocomplete, TextField } from '@mui/material';

import type { SiteFinalCategory } from '@admin/site-models/model';

interface SiteFinalCategorySelectProps {
  /** Final categories only: a model cannot live in a category with subcategories. */
  categories: readonly SiteFinalCategory[];
  loading: boolean;
  value: number | undefined;
  disabled?: boolean;
  onChange: (categoryId: number | undefined) => void;
}

/** «Категорія на сайті»: a searchable list of final categories with their path. */
export function SiteFinalCategorySelect(props: SiteFinalCategorySelectProps) {
  const value = props.categories.find((category) => category.id === props.value) ?? null;
  return (
    <Autocomplete
      disabled={props.disabled}
      getOptionLabel={(option) => option.path}
      isOptionEqualToValue={(option, selected) => option.id === selected.id}
      loading={props.loading}
      loadingText="Завантаження…"
      noOptionsText="Немає кінцевих категорій"
      onChange={(_event, option) => props.onChange(option?.id)}
      options={props.categories}
      renderInput={(params) => (
        <TextField
          {...params}
          helperText="Лише кінцеві категорії (без підкатегорій)."
          label="Категорія на сайті"
          size="small"
        />
      )}
      value={value}
    />
  );
}
