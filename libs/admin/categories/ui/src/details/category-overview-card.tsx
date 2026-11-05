import { isCategoryContentEmpty } from '@admin/categories/model';
import { DetailField, DetailFieldList, SectionCard, StatusPill } from '@admin/shared/ui';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Link,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';

import type { AdminCategory, CategoryContent, ContentLanguage } from '@admin/categories/model';

const languageLabels: Record<ContentLanguage, string> = { uk: 'Українська', ru: 'Русский' };
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

function LanguageSummary({
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
      {ancestors.length > 0 ? (
        <Breadcrumbs aria-label="Шлях категорії" sx={{ mt: -1 }}>
          {ancestors.map((ancestor) => (
            <Link
              component="button"
              key={ancestor.id}
              onClick={() => onSelect(ancestor.id)}
              type="button"
              underline="hover"
              variant="body2"
            >
              {ancestor.nameUk}
            </Link>
          ))}
          <Typography color="text.primary" variant="body2">
            {category.nameUk}
          </Typography>
        </Breadcrumbs>
      ) : null}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
      >
        {category.isShownOnSite ? (
          <Typography variant="body2">Показується на сайті</Typography>
        ) : (
          <Box>
            <StatusPill label="Не показується на сайті" tone="warning" />
          </Box>
        )}
        {onToggleSite ? (
          <Button
            color={category.isShownOnSite ? 'inherit' : 'primary'}
            onClick={onToggleSite}
            size="small"
            startIcon={
              category.isShownOnSite ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />
            }
            variant="outlined"
          >
            {category.isShownOnSite ? 'Сховати з сайту' : 'Показати на сайті'}
          </Button>
        ) : null}
      </Stack>
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
            <LanguageSummary content={content.uk} language="uk" />
            <LanguageSummary content={content.ru} language="ru" />
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
