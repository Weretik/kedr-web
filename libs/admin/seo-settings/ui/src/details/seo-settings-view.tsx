import { seoCodeFields } from '@admin/seo-settings/model';
import { DetailField, DetailFieldList, SectionCard } from '@admin/shared/ui';
import { Alert, Stack, Typography } from '@mui/material';

import { seoCodeLabels } from '../forms/seo-settings-fields';
import { SharePicturePreview } from './share-picture-preview';

import type { SeoSettings } from '@admin/seo-settings/model';

const notSet = 'Не вказано';

/** Read-only settings: the codes the site places on every page and the link-preview picture. */
export function SeoSettingsView({ settings }: { settings: SeoSettings }) {
  const picture = settings.sharePicture;
  return (
    <Stack spacing={2}>
      <SectionCard title="Коди сервісів">
        <DetailFieldList>
          {seoCodeFields.map((field) => (
            <DetailField
              key={field}
              label={seoCodeLabels[field].label}
              value={
                settings[field] ?? (
                  <Typography color="text.secondary" component="span" variant="body2">
                    {notSet}
                  </Typography>
                )
              }
            />
          ))}
        </DetailFieldList>
      </SectionCard>
      <SectionCard title="Фото для поширення">
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <SharePicturePreview picture={picture} />
          <Stack spacing={1} sx={{ minWidth: 0 }}>
            {picture?.missing ? (
              <Alert severity="warning">
                Файл фото видалено з медіатеки, тому сайт показує своє стандартне фото. Виберіть
                інше.
              </Alert>
            ) : null}
            <Typography color="text.secondary" variant="body2">
              {picture && !picture.missing
                ? `Файл: ${picture.fileName ?? '—'}${
                    picture.width && picture.height ? `, ${picture.width} × ${picture.height}` : ''
                  }`
                : 'Не обрано: сторінки без власного фото показують стандартне фото сайту.'}
            </Typography>
            <Typography color="text.secondary" variant="caption">
              Показується, коли посиланням на сторінку без власного фото діляться в месенджерах і
              соцмережах. Товари та статті мають свої фото.
            </Typography>
          </Stack>
        </Stack>
      </SectionCard>
    </Stack>
  );
}
