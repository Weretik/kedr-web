import { articleLimits } from '@admin/articles/model';
import { CountedTextField } from '@admin/shared/ui';
import { FormControlLabel, Stack, Switch, TextField } from '@mui/material';

import type { ArticleDraft, ArticleDraftErrors } from '@admin/articles/model';

interface ArticleSettingsFieldsProps {
  draft: ArticleDraft;
  errors?: ArticleDraftErrors;
  isNew: boolean;
  onChange: (patch: Partial<ArticleDraft>) => void;
}

/**
 * Address, date, and visibility: shared by both languages. A new article has no address field: the server builds it
 * from the Ukrainian title; it can be changed afterwards when editing.
 */
export function ArticleSettingsFields({
  draft,
  errors,
  isNew,
  onChange,
}: ArticleSettingsFieldsProps) {
  return (
    <Stack spacing={2}>
      {isNew ? null : (
        <CountedTextField
          error={errors?.slug}
          hint="Адреса на сайті: /uk/articles/… Після зміни старі посилання перестануть працювати."
          label="Адреса (slug)"
          maxLength={articleLimits.slug}
          onChange={(slug) => onChange({ slug })}
          value={draft.slug}
        />
      )}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ alignItems: { sm: 'center' } }}
      >
        <TextField
          error={Boolean(errors?.publishedOn)}
          helperText={errors?.publishedOn ?? 'Показується на сайті; новіші статті вище.'}
          label="Дата публікації"
          onChange={(event) => onChange({ publishedOn: event.target.value })}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ maxWidth: { sm: 240 } }}
          type="date"
          value={draft.publishedOn}
        />
        <FormControlLabel
          control={
            <Switch
              checked={draft.isPublished}
              onChange={(event) => onChange({ isPublished: event.target.checked })}
            />
          }
          label="Показувати на сайті"
        />
      </Stack>
    </Stack>
  );
}
