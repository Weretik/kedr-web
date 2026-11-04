import { articleCoverAcceptedTypes, articleCoverRulesHint } from '@admin/articles/model';
import { SectionCard } from '@admin/shared/ui';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';

import type { ChangeEvent } from 'react';

interface ArticleCoverCardProps {
  coverUrl: string | null;
  busy: boolean;
  /** File or server error in the words of the page. */
  error?: string;
  onFileSelected: (file: File) => void;
  onRemove: () => void;
}

/** Cover preview with upload and remove; the site shows it in the list and above the text. */
export function ArticleCoverCard({
  busy,
  coverUrl,
  error,
  onFileSelected,
  onRemove,
}: ArticleCoverCardProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Reset so choosing the same file again still fires a change.
    event.target.value = '';
    if (file) onFileSelected(file);
  };

  return (
    <SectionCard title="Обкладинка">
      <Stack spacing={2}>
        <Box
          sx={{
            alignItems: 'center',
            aspectRatio: '16 / 9',
            bgcolor: 'action.hover',
            borderRadius: 2,
            color: 'text.disabled',
            display: 'flex',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {coverUrl ? (
            <Box
              alt="Обкладинка статті"
              component="img"
              src={coverUrl}
              sx={{ height: '100%', objectFit: 'cover', width: '100%' }}
            />
          ) : (
            <ImageOutlinedIcon aria-label="Обкладинки немає" sx={{ fontSize: 48 }} />
          )}
        </Box>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }} useFlexGap>
          <Button component="label" disabled={busy} variant="outlined">
            {busy ? 'Завантаження…' : coverUrl ? 'Замінити' : 'Завантажити'}
            <input
              accept={articleCoverAcceptedTypes.join(',')}
              hidden
              onChange={handleChange}
              type="file"
            />
          </Button>
          {coverUrl ? (
            <Button
              color="error"
              disabled={busy}
              onClick={onRemove}
              startIcon={<DeleteOutlinedIcon />}
            >
              Прибрати
            </Button>
          ) : null}
        </Stack>
        <Typography color="text.secondary" variant="caption">
          {articleCoverRulesHint} Сайт зберігає її у WebP шириною до 1600 px.
        </Typography>
        {error ? <Alert severity="warning">{error}</Alert> : null}
      </Stack>
    </SectionCard>
  );
}
