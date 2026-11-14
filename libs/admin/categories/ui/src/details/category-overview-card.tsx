import { DetailField, DetailFieldList, SectionCard } from '@admin/shared/ui';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Alert, Box, Button, Chip, Skeleton, Stack, Typography } from '@mui/material';

import { CategoryBreadcrumbs } from './category-breadcrumbs';
import { CategoryLanguageSummary } from './category-language-summary';
import { CategorySiteVisibility } from './category-site-visibility';

import type { AdminCategory, CategoryContent, ContentLanguage } from '@admin/categories/model';

const orDash = (value: string) => value.trim() || '—';

interface CategoryOverviewCardProps {
  category: AdminCategory;
  /** Categories from the root down to the parent. */
  ancestors: readonly AdminCategory[];
  childCategories: readonly AdminCategory[];
  content: Record<ContentLanguage, CategoryContent> | undefined;
  contentLoading: boolean;
  contentError: boolean;
  /** Public path before the slug, for example `/uk/catalog/`. */
  pathPrefix: string;
  /** In-app link to the full read-only page with the whole text. */
  detailsHref: string;
  onRetryContent: () => void;
  onSelect: (categoryId: number) => void;
  /** Administrators only: opens the edit panel. */
  onEdit?: () => void;
  /** Administrators only: asks to show or hide the category on the site. */
  onToggleSite?: () => void;
}

/** Right side of «Категорії»: everything about the selected category at a glance, read-only. */
export function CategoryOverviewCard({
  ancestors,
  category,
  childCategories,
  content,
  contentError,
  contentLoading,
  detailsHref,
  onEdit,
  onToggleSite,
  onRetryContent,
  onSelect,
  pathPrefix,
}: CategoryOverviewCardProps) {
  return (
    <SectionCard
      action={
        onEdit ? (
          <Button onClick={onEdit} startIcon={<EditOutlinedIcon />} variant="contained">
            Редагувати
          </Button>
        ) : undefined
      }
      as="article"
      eyebrow="Категорія"
      title={category.nameUk}
      titleVariant="h5"
    >
      <CategoryBreadcrumbs ancestors={ancestors} category={category} onSelect={onSelect} />
      <CategorySiteVisibility category={category} onToggleSite={onToggleSite} />
      <DetailFieldList columns={2}>
        <DetailField label="Назва російською" value={orDash(category.nameRu)} />
        <DetailField label="Назва в 1С" value={orDash(category.sourceName)} />
        <DetailField
          label="Адреса на сайті"
          value={
            <Box component="code" sx={{ fontSize: '0.8125rem' }}>
              {pathPrefix}
              {category.slug}
            </Box>
          }
        />
        <DetailField label="Ключ 1С · ID" value={`${category.sourceKey} · ${category.id}`} />
        {category.productCount !== null ? (
          <DetailField
            label="Товарів (з підкатегоріями)"
            value={
              <Box component="span" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                {category.productCount}
              </Box>
            }
          />
        ) : null}
      </DetailFieldList>

      <Stack spacing={1}>
        <Typography color="text.secondary" component="h3" variant="overline">
          Тексти для сайту
        </Typography>
        {contentLoading ? (
          <Skeleton aria-label="Завантаження текстів" height={120} variant="rounded" />
        ) : contentError || !content ? (
          <Alert action={<Button onClick={onRetryContent}>Повторити</Button>} severity="error">
            Не вдалося завантажити тексти категорії.
          </Alert>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gap: 1.5,
              gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))' },
            }}
          >
            <CategoryLanguageSummary content={content.uk} language="uk" />
            <CategoryLanguageSummary content={content.ru} language="ru" />
          </Box>
        )}
      </Stack>

      {childCategories.length > 0 ? (
        <Stack spacing={1}>
          <Typography color="text.secondary" component="h3" variant="overline">
            Підкатегорії · {childCategories.length}
          </Typography>
          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
            {childCategories.map((child) => (
              <Chip
                key={child.id}
                label={child.nameUk}
                onClick={() => onSelect(child.id)}
                variant="outlined"
              />
            ))}
          </Stack>
        </Stack>
      ) : null}

      <Box>
        <Button href={detailsHref} variant="text">
          Відкрити сторінку категорії
        </Button>
      </Box>
    </SectionCard>
  );
}
