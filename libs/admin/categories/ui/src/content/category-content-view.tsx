import { DetailField, DetailFieldList } from '@admin/shared/ui';
import { Box, Divider, Stack, Typography } from '@mui/material';

import { RichTextEditor } from '../editor/rich-text-editor';

import type { CategoryContent } from '@admin/categories/model';

const orDash = (value: string) => value.trim() || '—';

/** Read-only content for managers. */
export function CategoryContentView({ content }: { content: CategoryContent }) {
  const hasBody = Boolean(content.bodyHtml.trim()) && content.bodyHtml.trim() !== '<p></p>';

  return (
    <Stack spacing={3}>
      <DetailFieldList>
        <DetailField label="SEO-заголовок (title)" value={orDash(content.seoTitle)} />
        <DetailField label="Мета-опис (description)" value={orDash(content.metaDescription)} />
        <DetailField label="Заголовок H1" value={orDash(content.h1)} />
      </DetailFieldList>
      {hasBody ? (
        <RichTextEditor label="Текст під товарами" readOnly value={content.bodyHtml} />
      ) : (
        <DetailFieldList>
          <DetailField label="Текст під товарами" value="—" />
        </DetailFieldList>
      )}
      <Divider />
      <Stack spacing={1.5}>
        <Typography component="h3" sx={{ fontWeight: 700 }} variant="subtitle1">
          Питання та відповіді
        </Typography>
        {content.faq.length === 0 ? (
          <Typography color="text.secondary" variant="body2">
            Питань немає.
          </Typography>
        ) : (
          <Box component="dl" sx={{ m: 0 }}>
            {content.faq.map((item, index) => (
              <Box key={index} sx={{ mb: 1.5 }}>
                <Typography component="dt" sx={{ fontWeight: 700 }} variant="body2">
                  {item.question}
                </Typography>
                <Typography component="dd" sx={{ m: 0, whiteSpace: 'pre-line' }} variant="body2">
                  {item.answer}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Stack>
    </Stack>
  );
}
