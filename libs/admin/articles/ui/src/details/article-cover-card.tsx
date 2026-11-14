import { articleCoverAcceptedTypes, articleCoverRulesHint } from '@admin/articles/model';
import { SectionCard } from '@admin/shared/ui';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';

import type { ChangeEvent } from 'react';

interface ArticleCoverCardProps {
  coverUrl: string | null;
  busy: boolean;
  /** File or server error in the words of the page. */
  error?: string;
  /** The article has a cover whose library file was deleted. */
  missing?: boolean;
  onFileSelected: (file: File) => void;
  onPickFromLibrary: () => void;
  onRemove: () => void;
}

/**
 * Cover preview with upload, pick from the media library and remove; the choice is saved with the article.
 * The site shows the cover in the list and above the text.
 */
export function ArticleCoverCard({
  busy,
  coverUrl,
  error,
  missing = false,
  onFileSelected,
  onPickFromLibrary,
  onRemove,
}: ArticleCoverCardProps) {
  const hasCover = Boolean(coverUrl) || missing;
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
            {busy ? 'Завантаження…' : hasCover ? 'Замінити' : 'Завантажити'}
            <input
              accept={articleCoverAcceptedTypes.join(',')}
              hidden
              onChange={handleChange}
              type="file"
            />
          </Button>
          <Button
            disabled={busy}
            onClick={onPickFromLibrary}
            startIcon={<PhotoLibraryOutlinedIcon />}
          >
            З медіатеки
          </Button>
          {hasCover ? (
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
          {articleCoverRulesHint} Файл стає WebP шириною до 1600 px і потрапляє в медіатеку, папка
          «Статті». Обкладинка збережеться разом зі статтею.
        </Typography>
        {missing ? (
          <Alert severity="warning">Файл обкладинки видалено з медіатеки. Оберіть інший.</Alert>
        ) : null}
        {error ? <Alert severity="warning">{error}</Alert> : null}
      </Stack>
    </SectionCard>
  );
}
