import { categoryContentLimits } from '@admin/categories/model';
import { Alert, Button, Divider, Stack, Typography } from '@mui/material';

import { CountedTextField } from './counted-text-field';
import { FaqListEditor } from './faq-list-editor';
import { RichTextEditor } from '../editor/rich-text-editor';

import type { CategoryContentDraft, CategoryContentErrors } from '@admin/categories/model';
import type { FormEvent } from 'react';

interface CategoryContentFormProps {
  draft: CategoryContentDraft;
  errors?: CategoryContentErrors;
  dirty: boolean;
  saving: boolean;
  /** Server error in the words of the page. */
  saveError?: string;
  onChange: (draft: CategoryContentDraft) => void;
  onReset: () => void;
  onSave: () => void;
}

/** SEO fields, text, and FAQ of one category in one language. */
export function CategoryContentForm({
  dirty,
  draft,
  errors,
  onChange,
  onReset,
  onSave,
  saveError,
  saving,
}: CategoryContentFormProps) {
  const limits = categoryContentLimits;
  const set = (patch: Partial<CategoryContentDraft>) => onChange({ ...draft, ...patch });
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave();
  };

  return (
    <Stack component="form" noValidate onSubmit={handleSubmit} spacing={3}>
      <Stack spacing={2}>
        <CountedTextField
          error={errors?.seoTitle}
          hint="Заголовок вкладки й пошуку. Порожньо — назва категорії."
          label="SEO-заголовок (title)"
          maxLength={limits.seoTitle}
          onChange={(seoTitle) => set({ seoTitle })}
          value={draft.seoTitle}
        />
        <CountedTextField
          error={errors?.metaDescription}
          hint="Опис у результатах пошуку."
          label="Мета-опис (description)"
          maxLength={limits.metaDescription}
          multiline
          onChange={(metaDescription) => set({ metaDescription })}
          value={draft.metaDescription}
        />
        <CountedTextField
          error={errors?.h1}
          hint="Заголовок на сторінці. Порожньо — назва категорії."
          label="Заголовок H1"
          maxLength={limits.h1}
          onChange={(h1) => set({ h1 })}
          value={draft.h1}
        />
      </Stack>
      <RichTextEditor
        error={errors?.bodyHtml}
        label="Текст під товарами"
        onChange={(bodyHtml) => set({ bodyHtml })}
        value={draft.bodyHtml}
      />
      <Divider />
      <Stack spacing={1}>
        <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 700 }}>
          Питання та відповіді
        </Typography>
        <FaqListEditor errors={errors} items={draft.faq} onChange={(faq) => set({ faq })} />
      </Stack>
      {saveError ? <Alert severity="error">{saveError}</Alert> : null}
      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
        <Button disabled={!dirty || saving} onClick={onReset}>
          Скасувати зміни
        </Button>
        <Button disabled={!dirty || saving} type="submit" variant="contained">
          {saving ? 'Збереження…' : 'Зберегти'}
        </Button>
      </Stack>
    </Stack>
  );
}
