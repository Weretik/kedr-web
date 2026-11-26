import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Box, InputAdornment } from '@mui/material';
import { GridToolbarContainer, QuickFilter, QuickFilterControl } from '@mui/x-data-grid';

const searchLabel = 'Пошук за старою або новою адресою';

export function SiteRedirectsGridToolbar() {
  return (
    <GridToolbarContainer sx={{ px: 2, py: 1 }}>
      <Box sx={{ width: { xs: '100%', sm: 360 }, maxWidth: '100%' }}>
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
    </GridToolbarContainer>
  );
}
