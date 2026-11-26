import { categoryListFilters } from '@admin/categories/model';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { Button, Chip, InputAdornment, Stack, TextField } from '@mui/material';

import type { CategoryListFilter } from '@admin/categories/model';

interface CategoryTreeToolbarProps {
  search: string;
  filters: ReadonlySet<CategoryListFilter>;
  counts: Record<CategoryListFilter, number>;
  /** Every parent is open; then the button collapses them. */
  allOpen: boolean;
  /** A search or a chip opens every parent itself, so the button is off. */
  filtering: boolean;
  onSearchChange: (search: string) => void;
  onFilterToggle: (filter: CategoryListFilter) => void;
  onToggleAll: () => void;
}

/** Search, filter chips and «Розгорнути все» above the category table (spec 003 R-002). */
export function CategoryTreeToolbar(props: CategoryTreeToolbarProps) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={1.5}
      sx={{ alignItems: { md: 'center' } }}
    >
      <TextField
        autoComplete="off"
        onChange={(event) => props.onSearchChange(event.target.value)}
        placeholder="Назва на сайті, назва в 1С, ID або адреса"
        size="small"
        slotProps={{
          htmlInput: { 'aria-label': 'Пошук категорій' },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
        sx={{ flex: { md: '1 1 320px' }, maxWidth: { md: 420 } }}
        value={props.search}
      />
      <Stack direction="row" sx={{ flex: 1, flexWrap: 'wrap', gap: 1 }}>
        {categoryListFilters.map(({ label, value }) => {
          const on = props.filters.has(value);
          return (
            <Chip
              aria-pressed={on}
              color={on ? 'primary' : 'default'}
              key={value}
              label={`${label} · ${props.counts[value]}`}
              onClick={() => props.onFilterToggle(value)}
              variant={on ? 'filled' : 'outlined'}
            />
          );
        })}
      </Stack>
      <Button
        disabled={props.filtering}
        onClick={props.onToggleAll}
        startIcon={props.allOpen ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
        sx={{ alignSelf: { xs: 'flex-start', md: 'center' }, whiteSpace: 'nowrap' }}
      >
        {props.allOpen ? 'Згорнути все' : 'Розгорнути все'}
      </Button>
    </Stack>
  );
}
