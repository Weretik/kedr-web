import { SectionCard } from '@admin/shared/ui';
import ImageNotSupportedOutlinedIcon from '@mui/icons-material/ImageNotSupportedOutlined';
import { Box, ButtonBase, Stack, Typography } from '@mui/material';

interface ProductImageCardProps {
  failed?: boolean;
  kind: 'photo' | 'scheme';
  onError: () => void;
  onPreview: () => void;
  src: string;
}

const frameSx = {
  aspectRatio: '1 / 1',
  bgcolor: 'background.default',
  borderRadius: '14px',
  display: 'block',
  overflow: 'hidden',
  width: '100%',
} as const;

export function ProductImageCard({
  failed = false,
  kind,
  onError,
  onPreview,
  src,
}: ProductImageCardProps) {
  const isScheme = kind === 'scheme';
  return (
    <SectionCard title={isScheme ? 'Схема товару' : 'Фото товару'}>
      {src && !failed ? (
        <ButtonBase
          aria-label={isScheme ? 'Збільшити схему товару' : 'Збільшити фото товару'}
          onClick={onPreview}
          sx={(theme) => ({
            ...frameSx,
            transition: theme.transitions.create('transform', {
              duration: theme.transitions.duration.short,
            }),
            '&:hover img': { transform: 'scale(1.03)' },
            '&.Mui-focusVisible': {
              outline: `2px solid ${theme.palette.primary.main}`,
              outlineOffset: 2,
            },
          })}
        >
          <Box
            alt=""
            component="img"
            onError={onError}
            src={src}
            sx={(theme) => ({
              display: 'block',
              height: '100%',
              objectFit: 'contain',
              transition: theme.transitions.create('transform'),
              width: '100%',
            })}
          />
        </ButtonBase>
      ) : (
        <Box
          aria-label="Фото товару недоступне"
          role="img"
          sx={{ ...frameSx, alignItems: 'center', display: 'flex', justifyContent: 'center' }}
        >
          <Stack
            spacing={1}
            sx={{ alignItems: 'center', color: 'text.secondary', p: 2, textAlign: 'center' }}
          >
            <ImageNotSupportedOutlinedIcon aria-hidden="true" />
            <Typography variant="body2">Фото товару недоступне</Typography>
          </Stack>
        </Box>
      )}
    </SectionCard>
  );
}
