import { countUk } from './plural';

import type { AttentionItem } from '../entities/attention-item';
import type { DashboardCatalog } from '../entities/dashboard-overview';

/** Site showcase, photo, and category text problems of the catalog. */
export function catalogAttention(catalog: DashboardCatalog): AttentionItem[] {
  const items: AttentionItem[] = [];
  const site = catalog.siteModels;

  if (site && site.productsWithoutModel > 0) {
    items.push({
      kind: 'site-no-model',
      tone: 'error',
      title: `Товари на сайті без моделі: ${site.productsWithoutModel}`,
      detail: 'На сайті вони не мають своєї сторінки',
      href: '/site-showcase?view=lone',
      actionLabel: 'Відкрити товари без моделі',
    });
  }

  if (catalog.productsWithoutPhoto > 0) {
    const top = catalog.topCategoryWithoutPhoto;
    items.push({
      kind: 'photos',
      tone: 'warning',
      title: `${countUk(catalog.productsWithoutPhoto, ['товар', 'товари', 'товарів'])} без фото`,
      detail: top ? `Покупець бачить заглушку · найбільше в «${top.name}» (${top.count})` : null,
      href: '/catalog?mode=missing',
      actionLabel: 'Відкрити товари без фото',
    });
  }

  const productProblems = site
    ? site.productsWithoutAttributes +
      site.productsMissingAxisValue +
      site.productsWithSameCombination
    : 0;
  if (site && productProblems > 0) {
    items.push({
      kind: 'site-product-problems',
      tone: 'warning',
      title: `Товари на сайті з неповними ознаками: ${productProblems}`,
      detail:
        [
          site.productsWithoutAttributes ? `без ознак ${site.productsWithoutAttributes}` : null,
          site.productsMissingAxisValue
            ? `не заповнена ознака ${site.productsMissingAxisValue}`
            : null,
          site.productsWithSameCombination
            ? `однакові варіанти ${site.productsWithSameCombination}`
            : null,
        ]
          .filter(Boolean)
          .join(' · ') || null,
      href: '/site-showcase',
      actionLabel: 'Відкрити вітрину сайту',
    });
  }

  const modelProblems = site
    ? site.modelsWithoutAxes + site.modelsWithoutSeo + site.modelsWithoutPhoto
    : 0;
  if (site && modelProblems > 0) {
    items.push({
      kind: 'site-model-problems',
      tone: 'warning',
      title: `Моделі, які треба доповнити: ${modelProblems}`,
      detail:
        [
          site.modelsWithoutSeo ? `без SEO ${site.modelsWithoutSeo}` : null,
          site.modelsWithoutAxes ? `без ознак ${site.modelsWithoutAxes}` : null,
          site.modelsWithoutPhoto ? `без фото ${site.modelsWithoutPhoto}` : null,
        ]
          .filter(Boolean)
          .join(' · ') || null,
      href: '/site-showcase?view=problems',
      actionLabel: 'Відкрити моделі з проблемами',
    });
  }

  if (catalog.categoriesWithoutText > 0) {
    items.push({
      kind: 'category-texts',
      tone: 'warning',
      title: `${countUk(catalog.categoriesWithoutText, ['категорія', 'категорії', 'категорій'])} без тексту для сайту`,
      detail: 'Немає опису або питань українською чи російською',
      href: '/categories',
      actionLabel: 'Відкрити категорії',
    });
  }

  if (site && site.proposedModels > 0) {
    items.push({
      kind: 'site-proposed-models',
      tone: 'note',
      title: `Запропоновані моделі: ${site.proposedModels}`,
      detail: 'Перегляньте кожну й погодьте, щоб товари отримали свої сторінки',
      href: '/site-showcase?view=review',
      actionLabel: 'Перевірити моделі',
    });
  }

  return items;
}
