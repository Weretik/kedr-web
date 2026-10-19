import { Box, ButtonBase, Card, CardContent, Typography } from '@mui/material';

interface ProductImageCardProps {
  failed?: boolean;
  kind: 'photo' | 'scheme';
  onError: () => void;
  onPreview: () => void;
  src: string;
}

export function ProductImageCard({ failed = false, kind, onError, onPreview, src }: ProductImageCardProps) {
  const isScheme = kind === 'scheme';
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography component="h2" gutterBottom variant="subtitle1">{isScheme ? 'Схема товару' : 'Фото товару'}</Typography>
        {src && !failed ? (
          <ButtonBase
            aria-label={isScheme ? 'Збільшити схему товару' : 'Збільшити фото товару'}
            onClick={onPreview}
            sx={{ borderRadius: 1, display: 'block', overflow: 'hidden', width: '100%' }}
          >
            <Box alt="" component="img" onError={onError} src={src} sx={{ aspectRatio: '1 / 1', display: 'block', objectFit: 'contain', width: '100%' }} />
          </ButtonBase>
        ) : (
          <Box aria-label="Фото товару недоступне" sx={{ alignItems: 'center', aspectRatio: '1 / 1', bgcolor: 'action.hover', borderRadius: 1, display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Typography color="text.secondary">Фото товару недоступне</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
