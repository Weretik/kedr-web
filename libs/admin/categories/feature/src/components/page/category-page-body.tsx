import { descendantCount } from '@admin/categories/model';
import {
  CategoryDeleteDialog,
  CategoryMoveDialog,
  CategoryProblemsCard,
  CategorySiteVisibilityDialog,
} from '@admin/categories/ui';
import { appConfig } from '@admin/shared/config';
import { NoticeSnackbar } from '@admin/shared/ui';
import { Stack } from '@mui/material';
import { useMemo } from 'react';

import { CategoryPageHeader } from './category-page-header';
import { CategoryPageTabs } from './category-page-tabs';
import { useCategoryPageData } from '../../hooks/page/use-category-page-data';
import { useCategoryDelete } from '../../hooks/placement/use-category-delete';
import { useCategoryPlacement } from '../../hooks/placement/use-category-placement';
import { useCategorySiteVisibility } from '../../hooks/tree/use-category-site-visibility';
import { CategoryMainSection } from '../sections/category-main-section';

import type { CategoryPageTab } from './category-page-tabs';
import type { AdminCategory } from '@admin/categories/model';
import type { RefObject } from 'react';

type PageData = ReturnType<typeof useCategoryPageData>;

interface CategoryPageBodyProps {
  page: NonNullable<PageData['page']>;
  categories: readonly AdminCategory[];
  content: PageData['content'];
  tab: CategoryPageTab;
  canEdit: boolean;
  notice: string | null;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onTabChange: (tab: CategoryPageTab) => void;
  onNotice: (message: string | null) => void;
  onDeleted: (parentId: number | null) => void;
}

/** The loaded page: header, «Основне», «Що бракує», tabs and their dialogs. */
export function CategoryPageBody({ page, ...props }: CategoryPageBodyProps) {
  const { category } = page;
  const placement = useCategoryPlacement(category, props.categories, props.onNotice);
  const visibility = useCategorySiteVisibility(props.onNotice);
  const removal = useCategoryDelete(category, props.onDeleted);
  const byId = useMemo(
    () => new Map(props.categories.map((row) => [row.id, row])),
    [props.categories],
  );
  const siteHref = `${appConfig.storefrontBaseUrl.replace(/\/$/, '')}/uk/catalog/${encodeURIComponent(category.slug)}`;

  return (
    <Stack component="section" spacing={3}>
      <CategoryPageHeader
        ancestors={page.ancestors}
        category={category}
        headingRef={props.headingRef}
        onDelete={props.canEdit && removal.canDelete ? removal.ask : undefined}
        onMove={props.canEdit ? placement.startMove : undefined}
        onToggleSite={props.canEdit ? () => visibility.ask(category) : undefined}
        siteHref={siteHref}
      />
      <CategoryMainSection
        canEdit={props.canEdit}
        category={category}
        onNotice={props.onNotice}
        path={page.path}
      />
      <CategoryProblemsCard onOpenTab={props.onTabChange} problems={page.problems} />
      <CategoryPageTabs
        canEdit={props.canEdit}
        content={props.content}
        data={page}
        onNotice={props.onNotice}
        onTabChange={props.onTabChange}
        placement={placement}
        tab={props.tab}
      />
      {props.canEdit ? (
        <CategoryMoveDialog
          busy={placement.busy}
          categoryName={category.nameUk}
          dirty={placement.dirty}
          draft={placement.draft}
          error={placement.error}
          onClose={placement.closeMove}
          onDraftChange={placement.setDraft}
          onSubmit={() => void placement.save()}
          open={placement.dialogOpen}
          options={placement.options}
        />
      ) : null}
      {visibility.target ? (
        <CategorySiteVisibilityDialog
          category={visibility.target}
          descendantCount={descendantCount(props.categories, category.id, byId)}
          error={visibility.error}
          onCancel={visibility.cancel}
          onConfirm={() => void visibility.confirm()}
          submitting={visibility.submitting}
        />
      ) : null}
      {removal.open ? (
        <CategoryDeleteDialog
          deleting={removal.deleting}
          error={removal.error}
          name={category.nameUk}
          onCancel={removal.cancel}
          onConfirm={() => void removal.confirm()}
        />
      ) : null}
      <NoticeSnackbar message={props.notice} onClose={() => props.onNotice(null)} />
    </Stack>
  );
}
