import { AdminDetailHeader, PageLoader } from '@admin/shared/ui';
import { Alert, Button, Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { CategoryPageBody } from '../components/page/category-page-body';
import { useCategoryPageData } from '../hooks/page/use-category-page-data';

import type { CategoryPageTab } from '../components/page/category-page-tabs';

const tabs: readonly CategoryPageTab[] = ['models', 'seo', 'search', 'place'];
const arrivalNotice = (state: unknown) => (state as { notice?: string } | null)?.notice ?? null;

/** One category in blocks, edited right on the page, no side panel (spec 003 R-005…R-012). */
export function CategoryDetailsPage({ canEdit }: { canEdit: boolean }) {
  const params = useParams();
  const categoryId = params['categoryId'];
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [notice, setNotice] = useState<string | null>(() => arrivalNotice(location.state));
  const data = useCategoryPageData(Number(categoryId));
  const tabParam = searchParams.get('tab') as CategoryPageTab | null;
  const tab = tabParam && tabs.includes(tabParam) ? tabParam : 'models';

  const pageReady = data.page !== null;
  useEffect(() => {
    headingRef.current?.focus();
  }, [categoryId, pageReady]);

  if (!data.valid || data.notFound)
    return (
      <Stack spacing={3}>
        <AdminDetailHeader backLabel="До категорій" backTo="/categories" title="Категорія" />
        <Alert severity="info">Категорію не знайдено: можливо, її видалено.</Alert>
      </Stack>
    );
  if (data.loading) return <PageLoader label="Завантаження категорії" />;
  if (data.error || !data.page)
    return (
      <Stack spacing={3}>
        <AdminDetailHeader backLabel="До категорій" backTo="/categories" title="Категорія" />
        <Alert action={<Button onClick={data.retry}>Повторити</Button>} severity="error">
          Не вдалося завантажити категорію. Спробуйте ще раз.
        </Alert>
      </Stack>
    );

  return (
    <CategoryPageBody
      canEdit={canEdit}
      categories={data.categories}
      content={data.content}
      headingRef={headingRef}
      notice={notice}
      onDeleted={(parentId) =>
        navigate(parentId === null ? '/categories' : `/categories/${parentId}`, {
          state: { notice: 'Категорію видалено.' },
        })
      }
      onNotice={setNotice}
      onTabChange={(next) =>
        setSearchParams(next === 'models' ? {} : { tab: next }, { replace: true })
      }
      page={data.page}
      tab={tab}
    />
  );
}

export default CategoryDetailsPage;
