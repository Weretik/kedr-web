import { contentLanguages } from '@admin/categories/model';
import { CategoryContentForm, CategoryContentView } from '@admin/categories/ui';
import { PageLoader, SectionCard } from '@admin/shared/ui';
import { Alert, Box, Button, Tab, Tabs } from '@mui/material';
import { useState } from 'react';

import type { useCategoryContentEditor } from '../hooks/use-category-content-editor';
import type { CategoryContentByLanguage } from '@admin/categories/data-access';
import type { ContentLanguage } from '@admin/categories/model';

const languageLabels: Record<ContentLanguage, string> = { uk: 'Українська', ru: 'Русский' };

interface CategoryContentSectionProps {
  content: CategoryContentByLanguage | undefined;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  /** With an editor the section is the form of the edit panel; without one it is read-only. */
  editor?: ReturnType<typeof useCategoryContentEditor>;
}

/** SEO text and FAQ per language; both panes stay mounted so unsaved text survives a tab switch. */
export function CategoryContentSection({
  content,
  editor,
  error,
  loading,
  onRetry,
}: CategoryContentSectionProps) {
  const [language, setLanguage] = useState<ContentLanguage>('uk');

  return (
    <SectionCard title="Тексти для сайту">
      {loading ? (
        <PageLoader label="Завантаження текстів" />
      ) : error || !content ? (
        <Alert action={<Button onClick={onRetry}>Повторити</Button>} severity="error">
          Не вдалося завантажити тексти категорії.
        </Alert>
      ) : (
        <Box>
          <Tabs
            aria-label="Мова тексту"
            onChange={(_event, value: ContentLanguage) => setLanguage(value)}
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
            value={language}
          >
            {contentLanguages.map((code) => (
              <Tab
                aria-controls={`category-content-${code}`}
                id={`category-content-tab-${code}`}
                key={code}
                label={editor?.isDirty(code) ? `${languageLabels[code]} •` : languageLabels[code]}
                value={code}
              />
            ))}
          </Tabs>
          {contentLanguages.map((code) => {
            return (
              <Box
                aria-labelledby={`category-content-tab-${code}`}
                hidden={code !== language}
                id={`category-content-${code}`}
                key={code}
                role="tabpanel"
              >
                {editor ? (
                  <CategoryContentForm
                    dirty={editor.isDirty(code)}
                    draft={editor.draftOf(code) ?? content[code]}
                    errors={editor.errorsOf(code)}
                    onChange={(next) => editor.change(code, next)}
                    onReset={() => editor.reset(code)}
                    onSave={() => void editor.save(code)}
                    saveError={editor.saveErrorOf(code)}
                    saving={editor.saving}
                  />
                ) : (
                  <CategoryContentView content={content[code]} />
                )}
              </Box>
            );
          })}
        </Box>
      )}
    </SectionCard>
  );
}
