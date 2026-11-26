import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { InputAdornment, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';

import type { SiteProductScope } from '@admin/site-models/model';

export interface ProductCandidateSearchProps {
  value: string;
  scope: SiteProductScope;
  onSearchChange: (value: string) => void;
  onScopeChange: (scope: SiteProductScope) => void;
}

/** The product search of the whole catalog with «Вільні (без моделі) / Усі товари». */
export function ProductCandidateSearch(props: ProductCandidateSearchProps) {
  return (
    <Stack spacing={1.5}>
      <TextField
        label="Пошук товарів"
        onChange={(event) => props.onSearchChange(event.target.value)}
        placeholder="Назва або код 1С"
        size="small"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon aria-hidden="true" fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
        type="search"
        value={props.value}
      />
      <ToggleButtonGroup
        aria-label="Які товари показати"
        exclusive
        onChange={(_event, scope: SiteProductScope | null) => {
          if (scope) props.onScopeChange(scope);
        }}
        size="small"
        value={props.scope}
      >
        <ToggleButton value="free">Вільні (без моделі)</ToggleButton>
        <ToggleButton value="all">Усі товари</ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
}
