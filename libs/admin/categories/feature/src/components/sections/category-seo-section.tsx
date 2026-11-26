import { categoryGooglePreview, contentLanguages } from '@admin/categories/model';
import {
  CategoryContentForm,
  CategoryContentView,
  CategoryGooglePreview,
} from '@admin/categories/ui';
import { appConfig } from '@admin/shared/config';
import { PageLoader, SectionCard } from '@admin/shared/ui';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Alert, Box, Button, Stack } from '@mui/material';
import { useState } from 'react';

import { useCategoryContentEditor } from '../../hooks/editing/use-category-content-editor';

import type { CategoryContentByLanguage } from '@admin/categories/data-access';
import type { AdminCategory, ContentLanguage } from '@admin/categories/model';

const languageLabels: Record<ContentLanguage, string> = { uk: 'Українська', ru: 'Русский' };

interface CategorySeoSectionProps {
  category: AdminCategory;
  content: CategoryContentByLanguage | undefined;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  canEdit: boolean;
  onNotice: (message: string) => void;
}

/**
 * «SEO та тексти»: Ukrainian and Russian side by side, each with «Як у Google» and its texts; «Редагувати» per language
 * turns the column into the content form (spec 003 R-009).
 */
export function CategorySeoSection(props: CategorySeoSectionProps) {
  const { category, content } = props;
  const editor = useCategoryContentEditor(category.id, content, props.onNotice);
  const [editing, setEditing] = useState<ReadonlySet<ContentLanguage>>(new Set());
  const setLanguageEditing = (language: ContentLanguage, on: boolean) =>
    setEditing((current) => {
      const next = new Set(current);
      if (on) next.add(language);
      else next.delete(language);
      return next;
    });

  if (props.loading) return <PageLoader label="Завантаження текстів" />;
  if (props.error || !content)
    return (
      <Alert action={<Button onClick={props.onRetry}>Повторити</Button>} severity="error">
        Не вдалося завантажити тексти категорії.
      </Alert>
    );

  return (
    <Box
      sx={{
        alignItems: 'start',
        display: 'grid',
        gap: 3,
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' },
      }}
    >
      {contentLanguages.map((language) => {
        const draft = editor.draftOf(language) ?? content[language];
        const isEditing = editing.has(language);
        return (
          <SectionCard
            action={
              props.canEdit && !isEditing ? (
                <Button
                  onClick={() => setLanguageEditing(language, true)}
                  startIcon={<EditOutlinedIcon />}
                  variant="outlined"
                >
                  Редагувати
                </Button>
              ) : undefined
            }
            key={language}
            title={
              editor.isDirty(language) ? `${languageLabels[language]} •` : languageLabels[language]
            }
          >
            <Stack spacing={3}>
              <CategoryGooglePreview
                preview={categoryGooglePreview({
                  siteUrl: appConfig.storefrontBaseUrl,
                  language,
                  slug: category.slug,
                  seoTitle: draft.seoTitle,
                  metaDescription: draft.metaDescription,
                })}
              />
              {isEditing ? (
                <CategoryContentForm
                  dirty={editor.isDirty(language)}
                  draft={draft}
                  errors={editor.errorsOf(language)}
                  onChange={(next) => editor.change(language, next)}
                  onReset={() => {
                    editor.reset(language);
                    setLanguageEditing(language, false);
                  }}
                  onSave={() =>
                    void editor.save(language).then((saved) => {
                      if (saved) setLanguageEditing(language, false);
                    })
                  }
                  saveError={editor.saveErrorOf(language)}
                  saving={editor.saving}
                />
              ) : (
                <CategoryContentView content={content[language]} />
              )}
            </Stack>
          </SectionCard>
        );
      })}
    </Box>
  );
}
