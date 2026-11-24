import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Box, FormControlLabel, InputAdornment, Stack, Switch } from '@mui/material';
import { GridToolbarContainer, QuickFilter, QuickFilterControl } from '@mui/x-data-grid';
import { createContext, useContext } from 'react';

export interface SiteOrdersToolbarState {
  problemOnly: boolean;
  onProblemOnlyChange: (problemOnly: boolean) => void;
}

/** The grid renders its own toolbar, so the switch state reaches it through context. */
export const SiteOrdersToolbarContext = createContext<SiteOrdersToolbarState | null>(null);

const searchLabel = 'Пошук за номером, ім’ям або телефоном';

export function SiteOrdersGridToolbar() {
  const state = useContext(SiteOrdersToolbarContext);
  return (
    <GridToolbarContainer sx={{ px: 2, py: 1 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 3 }}
        sx={{ alignItems: { sm: 'center' }, width: '100%' }}
      >
        <Box sx={{ width: { xs: '100%', sm: 320 }, maxWidth: '100%' }}>
          <QuickFilter
            debounceMs={300}
            expanded
            parser={(value) => (value.trim() ? [value.trim()] : [])}
          >
            <QuickFilterControl
              fullWidth
              placeholder={searchLabel}
              size="small"
              slotProps={{
                htmlInput: { 'aria-label': searchLabel },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlinedIcon aria-hidden="true" fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </QuickFilter>
        </Box>
        {state ? (
          <FormControlLabel
            control={
              <Switch
                checked={state.problemOnly}
                onChange={(_, checked) => state.onProblemOnlyChange(checked)}
              />
            }
            label="Лише з проблемою"
          />
        ) : null}
      </Stack>
    </GridToolbarContainer>
  );
}
