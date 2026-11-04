import { articleLimits } from '@admin/articles/model';
import { CountedTextField, RichTextEditor } from '@admin/shared/ui';
import { Stack } from '@mui/material';

import type { ArticleText, ArticleTextErrors } from '@admin/articles/model';

interface ArticleTextFieldsProps {
  text: ArticleText;
  errors?: ArticleTextErrors;
  onChange: (text: ArticleText) => void;
}

/** Title, short description, and body of one language. */
export function ArticleTextFields({ errors, onChange, text }: ArticleTextFieldsProps) {
  const set = (patch: Partial<ArticleText>) => onChange({ ...text, ...patch });

  return (
    <Stack spacing={2}>
      <CountedTextField
        error={errors?.title}
        hint="Заголовок H1 і назва в пошуку."
        label="Заголовок"
        maxLength={articleLimits.title}
        onChange={(title) => set({ title })}
        value={text.title}
      />
      <CountedTextField
        error={errors?.excerpt}
        hint="Під заголовком у списку статей і в результатах пошуку."
        label="Короткий опис"
        maxLength={articleLimits.excerpt}
        multiline
        onChange={(excerpt) => set({ excerpt })}
        value={text.excerpt}
      />
      <RichTextEditor
        error={errors?.bodyHtml}
        label="Текст статті"
        onChange={(bodyHtml) => set({ bodyHtml })}
        value={text.bodyHtml}
      />
    </Stack>
  );
}
