import ImageNotSupportedOutlinedIcon from '@mui/icons-material/ImageNotSupportedOutlined';
import { Box } from '@mui/material';

/** A square product photo for a table row; an icon without one. */
export function ProductThumb({ size = 48, src }: { src: string; size?: number }) {
  return (
    <Box
      sx={{
        alignItems: 'center',
        bgcolor: 'background.default',
        border: 1,
        borderColor: 'divider',
        borderRadius: '10px',
        display: 'flex',
        flex: '0 0 auto',
        height: size,
        justifyContent: 'center',
        overflow: 'hidden',
        width: size,
      }}
    >
      {src ? (
        <Box
          alt=""
          component="img"
          loading="lazy"
          src={src}
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
