import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Box } from '@mui/material';
import { GridToolbarContainer, QuickFilter, QuickFilterControl } from '@mui/x-data-grid';

export function CategoriesGridToolbar() {
  return (
    <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'flex-start', px: 2, py: 1 }}>
      <Box sx={{ width: { xs: '100%', sm: 320 }, maxWidth: '100%' }}>
        <QuickFilter expanded debounceMs={200}>
          <QuickFilterControl
            fullWidth
            placeholder="Пошук за назвою або адресою"
            size="small"
            slotProps={{
              htmlInput: { 'aria-label': 'Пошук категорій' },
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
