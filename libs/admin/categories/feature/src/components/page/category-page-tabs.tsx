import { CategoryChildrenList } from '@admin/categories/ui';
import { SectionCard } from '@admin/shared/ui';
import { Box, Stack, Tab, Tabs } from '@mui/material';

import { CategoryPlacementSection } from '../sections/category-placement-section';
import { CategorySearchSection } from '../sections/category-search-section';
import { CategorySeoSection } from '../sections/category-seo-section';
import { CategorySiteModelsSection } from '../sections/category-site-models-section';

import type { useCategoryPageData } from '../../hooks/page/use-category-page-data';
import type { useCategoryPlacement } from '../../hooks/placement/use-category-placement';

export type CategoryPageTab = 'models' | 'seo' | 'search' | 'place';

type PageData = NonNullable<ReturnType<typeof useCategoryPageData>['page']>;

interface CategoryPageTabsProps {
  tab: CategoryPageTab;
  onTabChange: (tab: CategoryPageTab) => void;
  data: PageData;
  content: ReturnType<typeof useCategoryPageData>['content'];
  placement: ReturnType<typeof useCategoryPlacement>;
  canEdit: boolean;
  onNotice: (message: string) => void;
}

/** One tab at a time: models or subcategories, SEO texts, search and sharing, place (spec 003 R-008). */
export function CategoryPageTabs({ data, tab, ...props }: CategoryPageTabsProps) {
  const { category } = data;
  const first = data.isFinal
    ? `Моделі · ${category.modelCount ?? '—'}`
    : `Підкатегорії · ${data.children.length}`;
  return (
    <Stack spacing={3}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          aria-label="Розділи категорії"
          onChange={(_event, value: CategoryPageTab) => props.onTabChange(value)}
          value={tab}
          variant="scrollable"
        >
          <Tab label={first} value="models" />
          <Tab label="SEO та тексти" value="seo" />
          <Tab label="Пошук і поширення" value="search" />
          <Tab label="Розташування" value="place" />
        </Tabs>
      </Box>
      {tab === 'models' && data.isFinal ? (
        <CategorySiteModelsSection
          canEdit={props.canEdit}
          category={category}
          onNotice={props.onNotice}
        />
      ) : null}
      {tab === 'models' && !data.isFinal ? (
        <SectionCard title="Підкатегорії">
          <CategoryChildrenList categories={data.children} />
        </SectionCard>
      ) : null}
      {tab === 'seo' ? (
        <CategorySeoSection
          canEdit={props.canEdit}
          category={category}
          content={props.content.data}
          error={props.content.isError}
          loading={props.content.isLoading}
          onNotice={props.onNotice}
          onRetry={() => void props.content.refetch()}
        />
      ) : null}
      {tab === 'search' ? (
        <CategorySearchSection
          canEdit={props.canEdit}
          category={category}
          onNotice={props.onNotice}
        />
      ) : null}
      {tab === 'place' ? (
        <CategoryPlacementSection
          canEdit={props.canEdit}
          path={data.path}
          placement={props.placement}
        />
      ) : null}
    </Stack>
  );
}
