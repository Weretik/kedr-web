import ImageNotSupportedOutlinedIcon from '@mui/icons-material/ImageNotSupportedOutlined';
import { Box } from '@mui/material';

import type { GridRenderCellParams } from '@mui/x-data-grid';

const tileSx = {
  alignItems: 'center',
  bgcolor: 'background.default',
  border: 1,
  borderColor: 'divider',
  borderRadius: '12px',
  display: 'flex',
  height: 56,
  justifyContent: 'center',
  overflow: 'hidden',
  width: 56,
} as const;

export function ProductsDataGridPhotoCell({ value }: GridRenderCellParams) {
  return (
    <Box sx={tileSx}>
      {value ? (
        <Box
          alt=""
          component="img"
          src={value}
          sx={{ height: '100%', objectFit: 'contain', width: '100%' }}
        />
      ) : (
        <ImageNotSupportedOutlinedIcon
          aria-label="Без фото"
          color="disabled"
          fontSize="small"
          role="img"
        />
      )}
    </Box>
  );
}
