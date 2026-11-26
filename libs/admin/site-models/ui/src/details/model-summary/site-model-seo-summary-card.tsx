import { DetailField, DetailFieldList, SectionCard } from '@admin/shared/ui';
import { siteModelText } from '@admin/site-models/model';
import { Box, Stack, Typography } from '@mui/material';

import type { SiteModel, SiteModelLanguage } from '@admin/site-models/model';

const languages: { language: SiteModelLanguage; name: string }[] = [
  { language: 'uk', name: 'Українська' },
  { language: 'ru', name: 'Російська' },
];

const orEmpty = (value: string) => value.trim() || 'Не заповнено';

/** «SEO та опис» on the model page: the two languages side by side, read-only; edited in the panel. */
export function SiteModelSeoSummaryCard({ model }: { model: SiteModel }) {
  return (
    <SectionCard title="SEO та опис">
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        {languages.map(({ language, name }) => {
          const text = siteModelText(model, language);
          return (
            <Stack key={language} spacing={1}>
              <Typography component="h3" variant="subtitle2">
                {name}
              </Typography>
              <DetailFieldList>
                <DetailField label="SEO-заголовок" value={orEmpty(text.seoTitle)} />
                <DetailField label="SEO-опис" value={orEmpty(text.seoDescription)} />
                <DetailField label="Короткий опис" value={orEmpty(text.shortDescription)} />
                <DetailField
                  label="Опис"
                  value={text.description.trim() ? 'Заповнено' : 'Не заповнено'}
                />
              </DetailFieldList>
            </Stack>
          );
        })}
      </Box>
    </SectionCard>
  );
}
