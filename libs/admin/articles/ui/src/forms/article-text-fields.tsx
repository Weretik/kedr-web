import { articleLimits } from '@admin/articles/model';
import { CountedTextField, RichTextEditor } from '@admin/shared/ui';
import { Stack } from '@mui/material';

import type { ArticleText, ArticleTextErrors } from '@admin/articles/model';

interface ArticleTextFieldsProps {
  text: ArticleText;
  errors?: ArticleTextErrors;
  onChange: (text: ArticleText) => void;
}

/** Title, short description, body, and the optional search title and description of one language. */
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
      <CountedTextField
        error={errors?.seoTitle}
        hint="Заголовок вкладки й пошуку. Порожньо — заголовок статті."
        label="SEO-заголовок (title)"
        maxLength={articleLimits.seoTitle}
        onChange={(seoTitle) => set({ seoTitle })}
        value={text.seoTitle}
      />
      <CountedTextField
        error={errors?.metaDescription}
        hint="Опис у результатах пошуку. Порожньо — короткий опис."
        label="Мета-опис (description)"
        maxLength={articleLimits.metaDescription}
        multiline
        onChange={(metaDescription) => set({ metaDescription })}
        value={text.metaDescription}
      />
    </Stack>
  );
}
