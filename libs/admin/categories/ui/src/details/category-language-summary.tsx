import { isCategoryContentEmpty } from '@admin/categories/model';
import { DetailField, DetailFieldList, StatusPill } from '@admin/shared/ui';
import { Box, Typography } from '@mui/material';

import type { CategoryContent, ContentLanguage } from '@admin/categories/model';

const languageLabels: Record<ContentLanguage, string> = { uk: 'Українська', ru: 'Русский' };
const orDash = (value: string) => value.trim() || '—';

/** SEO texts of one language, or a note that the category has none. */
export function CategoryLanguageSummary({
  content,
  language,
}: {
  content: CategoryContent;
  language: ContentLanguage;
}) {
  const empty = isCategoryContentEmpty(content);
  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: '14px',
        display: 'grid',
        gap: 1,
        p: 2,
      }}
    >
      <Typography component="h3" variant="subtitle2">
        {languageLabels[language]}
      </Typography>
      {empty ? (
        <>
          <Box>
            <StatusPill label="Немає тексту" tone="error" />
          </Box>
          <Typography color="text.secondary" variant="body2">
            На сайті буде лише назва категорії.
          </Typography>
        </>
      ) : (
        <DetailFieldList>
          <DetailField label="SEO-заголовок" value={orDash(content.seoTitle)} />
          <DetailField label="Мета-опис" value={orDash(content.metaDescription)} />
          <DetailField
            label="Питання та відповіді"
            value={content.faq.length === 0 ? '—' : String(content.faq.length)}
          />
        </DetailFieldList>
      )}
    </Box>
  );
}
