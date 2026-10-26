import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Box, InputAdornment } from '@mui/material';
import { GridToolbarContainer, QuickFilter, QuickFilterControl } from '@mui/x-data-grid';

/** Client-side quick search of the product picker by name or ID. */
export function ProductPickerToolbar() {
  return (
    <GridToolbarContainer sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
      <Box sx={{ width: { xs: '100%', sm: 360 }, maxWidth: '100%' }}>
        <QuickFilter expanded debounceMs={200}>
          <QuickFilterControl
            fullWidth
            placeholder="Пошук за назвою або ID"
            size="small"
            slotProps={{
              htmlInput: { 'aria-label': 'Пошук за назвою або ID' },
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
    </GridToolbarContainer>
  );
}
