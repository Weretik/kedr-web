import { siteProblemLabel } from '@admin/site-models/model';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, MenuItem, Stack, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

import type { SiteProblemFilter } from '@admin/site-models/model';

interface SiteListFiltersProps {
  search: string | undefined;
  searchLabel: string;
  problem: SiteProblemFilter | undefined;
  problems: readonly string[];
  onSearch: (search: string | undefined) => void;
  onProblem: (problem: SiteProblemFilter | undefined) => void;
}

/** Search and «Чого бракує» above a site models table; the category tree beside it picks the category. */
export function SiteListFilters(props: SiteListFiltersProps) {
  const [search, setSearch] = useState(props.search ?? '');
  const onSearch = useRef(props.onSearch);
  useEffect(() => {
    onSearch.current = props.onSearch;
  });
  const applied = props.search ?? '';
  // When the address changes (back, a link), the field follows it.
  const [shown, setShown] = useState(applied);
  if (shown !== applied) {
    setShown(applied);
    setSearch(applied);
  }

  useEffect(() => {
    if (search.trim() === applied) return;
    const timer = setTimeout(() => onSearch.current(search.trim() || undefined), 400);
    return () => clearTimeout(timer);
  }, [applied, search]);

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
      <TextField
        label={props.searchLabel}
        onChange={(event) => setSearch(event.target.value)}
        size="small"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
        sx={{ flex: 1.5, minWidth: 0 }}
        value={search}
      />
      <TextField
        label="Чого бракує"
        onChange={(event) =>
          props.onProblem((event.target.value || undefined) as SiteProblemFilter | undefined)
        }
        select
        size="small"
        sx={{ flex: 1, minWidth: 0 }}
        value={props.problem ?? ''}
      >
        <MenuItem value="">Усі</MenuItem>
        <MenuItem value="any">Будь-яка проблема</MenuItem>
        {props.problems.map((code) => (
          <MenuItem key={code} value={code}>
            {siteProblemLabel(code)}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
}
