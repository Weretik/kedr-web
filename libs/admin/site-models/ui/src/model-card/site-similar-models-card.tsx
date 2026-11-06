import { SectionCard } from '@admin/shared/ui';
import MergeOutlinedIcon from '@mui/icons-material/MergeOutlined';
import { Alert, Button, Stack, Typography } from '@mui/material';

import type { SiteShowcaseRow } from '@admin/site-models/model';

interface SiteSimilarModelsCardProps {
  models: readonly SiteShowcaseRow[];
  busy: boolean;
  error: string | null;
  onMerge: (row: SiteShowcaseRow) => void;
}

/**
 * «Схожі моделі»: other proposals of the category with a similar name. «Об’єднати сюди» moves their products into this
 * model; an emptied proposal disappears.
 */
export function SiteSimilarModelsCard({
  busy,
  error,
  models,
  onMerge,
}: SiteSimilarModelsCardProps) {
  if (models.length === 0) return null;
  return (
    <SectionCard title="Схожі моделі в цій категорії">
      <Stack spacing={1.5}>
        <Typography color="text.secondary" variant="body2">
          Якщо це той самий товар в іншому кольорі чи розмірі, об’єднайте їх в одну сторінку.
        </Typography>
        {error ? <Alert severity="error">{error}</Alert> : null}
        {models.map((row) => (
          <Stack
            direction="row"
            key={row.key}
            spacing={1.5}
            sx={{
              alignItems: 'center',
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              p: 1.5,
            }}
          >
            <Stack sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 600, overflowWrap: 'anywhere' }} variant="body2">
                {row.name}
              </Typography>
              <Typography color="text.secondary" variant="caption">
                {row.products.length} тов.
              </Typography>
            </Stack>
            <Button
              disabled={busy}
              onClick={() => onMerge(row)}
              size="small"
              startIcon={<MergeOutlinedIcon />}
            >
              Об’єднати сюди
            </Button>
          </Stack>
        ))}
      </Stack>
    </SectionCard>
  );
}
