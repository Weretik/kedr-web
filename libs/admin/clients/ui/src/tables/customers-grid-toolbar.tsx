import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Box } from '@mui/material';
import { GridToolbarContainer, QuickFilter, QuickFilterControl } from '@mui/x-data-grid';

export function CustomersGridToolbar() {
  return (
    <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'flex-start', px: 2, py: 1 }}>
      <Box sx={{ width: { xs: '100%', sm: 320 }, maxWidth: '100%' }}>
        <QuickFilter expanded debounceMs={300} parser={(value) => value.trim() ? [value.trim()] : []}>
          <QuickFilterControl
            fullWidth
            placeholder="Пошук клієнтів"
            size="small"
            slotProps={{
              htmlInput: { 'aria-label': 'Пошук клієнтів' },
              input: {
                startAdornment: <SearchOutlinedIcon aria-hidden="true" fontSize="small" />,
              },
            }}
          />
        </QuickFilter>
      </Box>
    </GridToolbarContainer>
  );
}
