import {
  countSeoIssues,
  filterSeoReview,
  parseSeoReviewFilter,
  seoReviewEditPath,
  seoReviewFilterSearch,
} from '@admin/seo-review/model';
import { SeoReviewFilters, SeoReviewTable } from '@admin/seo-review/ui';
import { AdminPageHeader } from '@admin/shared/ui';
import { Card, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useSeoReview } from '../hooks/use-seo-review';

export interface SeoReviewPageProps {
  canEditCatalog: boolean;
}

/** «SEO-огляд»: site pages without text or description, with a long or repeated title (spec platform/010). */
export function SeoReviewPage({ canEditCatalog }: SeoReviewPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const filter = useMemo(() => parseSeoReviewFilter(searchParams.toString()), [searchParams]);
  const review = useSeoReview(canEditCatalog);
  const rows = useMemo(() => filterSeoReview(review.items, filter), [review.items, filter]);

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader title="SEO-огляд" />
      <Typography color="text.secondary" variant="body2">
        Сторінки сайту, які Google покаже гірше: без тексту чи опису, із задовгим (понад 70
        символів) або однаковим заголовком. Опис довший за 160 символів пошук обріже.
      </Typography>
      <SeoReviewFilters
        counts={countSeoIssues(review.items, filter.kind)}
        filter={filter}
        kinds={review.kinds}
        onChange={(next) => setSearchParams(seoReviewFilterSearch(next), { replace: true })}
      />
      <Card sx={{ overflow: 'hidden' }} variant="outlined">
        <SeoReviewTable
          error={review.error}
          loading={review.loading}
          onOpen={(item) => void navigate(seoReviewEditPath(item))}
          onRetry={review.retry}
          rows={rows}
        />
      </Card>
    </Stack>
  );
}

export default SeoReviewPage;
