import { CategoryMainView, CategorySiteNamesForm } from '@admin/categories/ui';
import { SectionCard, SlugEditForm } from '@admin/shared/ui';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { useCategorySiteNames } from '../../hooks/editing/use-category-site-names';
import { useCategorySlugChange } from '../../hooks/editing/use-category-slug-change';

import type { AdminCategory } from '@admin/categories/model';

const publicPathPrefix = '/uk/catalog/';

interface CategoryMainSectionProps {
  category: AdminCategory;
  path: readonly string[];
  canEdit: boolean;
  onNotice: (message: string) => void;
}

/** «Основне»: four columns to read; «Редагувати» turns it into the site names and address forms (spec 003 R-006). */
export function CategoryMainSection({
  canEdit,
  category,
  onNotice,
  path,
}: CategoryMainSectionProps) {
  const [editing, setEditing] = useState(false);
  const names = useCategorySiteNames(category, onNotice);
  const slug = useCategorySlugChange(category.id, onNotice);
  const busy = names.saving || slug.saving;

  return (
    <SectionCard
      action={
        !canEdit ? undefined : editing ? (
          <Button disabled={busy} onClick={() => setEditing(false)} variant="outlined">
            Готово
          </Button>
        ) : (
          <Button
            onClick={() => setEditing(true)}
            startIcon={<EditOutlinedIcon />}
            variant="outlined"
          >
            Редагувати
          </Button>
        )
      }
      title="Основне"
    >
      {editing ? (
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' },
          }}
        >
          <Stack spacing={1}>
            <Typography component="h3" variant="subtitle2">
              Назва на сайті
            </Typography>
            <CategorySiteNamesForm
              dirty={names.dirty}
              error={names.error}
              onChange={names.change}
              onReset={names.reset}
              onSave={() => void names.submit()}
              saving={names.saving}
              sourceName={category.sourceName}
              value={names.draft}
            />
          </Stack>
          <Stack spacing={1}>
            <Typography component="h3" variant="subtitle2">
              Адреса на сайті
            </Typography>
            <SlugEditForm
              currentSlug={category.slug}
              error={slug.error}
              onSubmit={(input) => void slug.submit(input)}
              pathPrefix={publicPathPrefix}
              saving={slug.saving}
            />
          </Stack>
        </Box>
      ) : (
        <CategoryMainView category={category} path={path} pathPrefix={publicPathPrefix} />
      )}
    </SectionCard>
  );
}
