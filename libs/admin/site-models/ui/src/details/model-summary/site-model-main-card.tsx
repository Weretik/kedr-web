import { DetailField, DetailFieldList, SectionCard, StatusPill } from '@admin/shared/ui';
import { siteModelAllProblems } from '@admin/site-models/model';

import { SiteProblemPills } from '../../components/display/site-problem-pills';

import type { SiteModel } from '@admin/site-models/model';

/** The main block of the model page: site category, products, switchers and what is missing. */
export function SiteModelMainCard({ model }: { model: SiteModel }) {
  const onSite = model.products.filter((product) => product.exportToSite).length;
  const problems = siteModelAllProblems(model);
  return (
    <SectionCard
      action={model.status === 'proposed' ? <StatusPill label="Не перевірена" tone="info" /> : null}
      as="article"
      eyebrow={`ID ${model.id} · /${model.slug}`}
      title="Основне"
    >
      <DetailFieldList columns={4}>
        <DetailField label="Категорія на сайті" value={model.categoryName} />
        <DetailField label="Товарів" value={`${model.products.length} (на сайті ${onSite})`} />
        <DetailField
          label="Перемикачі"
          value={model.axes.length > 0 ? model.axes.map((axis) => axis.name).join(', ') : '—'}
        />
        <DetailField
          label="Чого бракує"
          value={problems.length > 0 ? <SiteProblemPills problems={problems} /> : 'Нічого'}
        />
      </DetailFieldList>
    </SectionCard>
  );
}
