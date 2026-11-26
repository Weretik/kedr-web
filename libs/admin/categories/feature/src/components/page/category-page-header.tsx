import { siteNameOf } from '@admin/categories/model';
import { CategoryManualChip } from '@admin/categories/ui';
import { StatusPill } from '@admin/shared/ui';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Breadcrumbs, Button, Link, Stack, Typography } from '@mui/material';

import type { AdminCategory } from '@admin/categories/model';
import type { Ref } from 'react';

interface CategoryPageHeaderProps {
  category: AdminCategory;
  ancestors: readonly AdminCategory[];
  /** Public page of the category. */
  siteHref: string;
  headingRef: Ref<HTMLHeadingElement>;
  /** Administrators only. */
  onMove?: () => void;
  onToggleSite?: () => void;
  /** Only a manual category can be deleted. */
  onDelete?: () => void;
}

/** Path, name, the marks that need attention and the page actions (spec 003 R-005). */
export function CategoryPageHeader({
  ancestors,
  category,
  headingRef,
  onDelete,
  onMove,
  onToggleSite,
  siteHref,
}: CategoryPageHeaderProps) {
  return (
    <Stack spacing={1.5}>
      <Breadcrumbs aria-label="Шлях категорії">
        <Link href="/categories" underline="hover">
          Категорії
        </Link>
        {ancestors.map((ancestor) => (
          <Link href={`/categories/${ancestor.id}`} key={ancestor.id} underline="hover">
            {siteNameOf(ancestor)}
          </Link>
        ))}
      </Breadcrumbs>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{ alignItems: { md: 'flex-start' }, justifyContent: 'space-between' }}
      >
        <Stack spacing={1} sx={{ minWidth: 0 }}>
          <Typography
            component="h1"
            ref={headingRef}
            sx={{ overflowWrap: 'anywhere', '&:focus': { outline: 'none' } }}
            tabIndex={-1}
            variant="h4"
          >
            {siteNameOf(category)}
          </Typography>
          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
            <CategoryManualChip isManual={category.isManual} />
            {category.isShownOnSite ? null : <StatusPill label="Сховано з сайту" tone="warning" />}
            {category.isClosedFromSearch ? (
              <StatusPill label="Закрито від пошуку" tone="warning" />
            ) : null}
          </Stack>
        </Stack>
        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Button
            href={siteHref}
            rel="noopener"
            startIcon={<OpenInNewIcon />}
            target="_blank"
            variant="outlined"
          >
            Відкрити на сайті
          </Button>
          {onMove ? (
            <Button onClick={onMove} startIcon={<OpenWithIcon />} variant="outlined">
              Перемістити
            </Button>
          ) : null}
          {onToggleSite ? (
            <Button
              onClick={onToggleSite}
              startIcon={
                category.isShownOnSite ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />
              }
              variant="outlined"
            >
              {category.isShownOnSite ? 'Сховати з сайту' : 'Показати на сайті'}
            </Button>
          ) : null}
          {onDelete ? (
            <Button
              color="error"
              onClick={onDelete}
              startIcon={<DeleteOutlinedIcon />}
              variant="outlined"
            >
              Видалити
            </Button>
          ) : null}
        </Stack>
      </Stack>
    </Stack>
  );
}
