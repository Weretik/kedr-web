import { countUk } from './plural';

import type {
  DashboardCatalog,
  DashboardContent,
  DashboardOrders,
} from '../entities/dashboard-overview';

export type AttentionKind =
  | 'sync'
  | 'photos'
  | 'attribute-problems'
  | 'no-name'
  | 'category-texts'
  | 'article-drafts'
  | 'legacy-covers'
  | 'document-drafts';

/** Problem tone: errors block work, warnings hurt the site, notes are unfinished work. */
export type AttentionTone = 'error' | 'warning' | 'note';

export interface AttentionItem {
  kind: AttentionKind;
  tone: AttentionTone;
  title: string;
  detail: string | null;
  href: string;
  actionLabel: string;
}

export interface AttentionSources {
  orders: DashboardOrders | undefined;
  catalog: DashboardCatalog | undefined;
  content: DashboardContent | undefined;
  now: Date;
}

const dayMs = 24 * 60 * 60 * 1000;

/**
 * What needs someone, most urgent first. A block that did not load adds nothing, and a count of zero is not
 * shown: the overview never says that something is fine.
 */
export function attentionItems({
  orders,
  catalog,
  content,
  now,
}: AttentionSources): AttentionItem[] {
  const items: AttentionItem[] = [];

  if (orders && orders.syncProblemCount > 0) {
    const numbers = orders.syncProblems.map((order) => `№ ${order.orderNumber}`).join(', ');
    const reason = orders.syncProblems.find((order) => order.errorMessage)?.errorMessage ?? null;
    const single = orders.syncProblemCount === 1 ? orders.syncProblems[0] : undefined;
    items.push({
      kind: 'sync',
      tone: 'error',
      title: `1С не прийняла ${countUk(orders.syncProblemCount, ['замовлення', 'замовлення', 'замовлень'])}`,
      detail: [numbers, reason].filter(Boolean).join(' · ') || null,
      href: single ? `/orders/${single.orderId}` : '/orders',
      actionLabel: 'Відкрити замовлення',
    });
  }

  if (catalog && catalog.productsWithoutPhoto > 0) {
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

  if (catalog && catalog.productsWithProblems > 0) {
    items.push({
      kind: 'attribute-problems',
      tone: 'warning',
      title: `Товари з нерозпізнаними властивостями: ${catalog.productsWithProblems}`,
      detail: 'Фільтри й варіанти на сайті можуть їх не показати',
      href: '/catalog?mode=site&siteProblemsOnly=true',
      actionLabel: 'Відкрити проблемні товари',
    });
  }

  if (catalog && catalog.noNameProducts > 0) {
    items.push({
      kind: 'no-name',
      tone: 'warning',
      title: `Товари No name: ${catalog.noNameProducts}`,
      detail: 'Без маркування бренду; у групи не потрапляють, доки їх не перевірять',
      href: '/catalog?mode=site&siteProblemReason=no_name',
      actionLabel: 'Відкрити товари No name',
    });
  }

  if (catalog && catalog.categoriesWithoutText > 0) {
    items.push({
      kind: 'category-texts',
      tone: 'warning',
      title: `${countUk(catalog.categoriesWithoutText, ['категорія', 'категорії', 'категорій'])} без тексту для сайту`,
      detail: 'Немає опису або питань українською чи російською',
      href: '/categories',
      actionLabel: 'Відкрити категорії',
    });
  }

  if (content && content.articleDrafts > 0) {
    const oldest = content.oldestArticleDraft;
    items.push({
      kind: 'article-drafts',
      tone: 'note',
      title: countUk(content.articleDrafts, [
        'чернетка статті',
        'чернетки статей',
        'чернеток статей',
      ]),
      detail: oldest
        ? `Найдовше без змін — «${oldest.title}», ${ageUk(oldest.updatedAt, now)}`
        : null,
      href: content.articleDrafts === 1 && oldest ? `/articles/${oldest.id}` : '/articles',
      actionLabel: 'Відкрити статті',
    });
  }

  if (content && content.legacyArticleCovers > 0) {
    items.push({
      kind: 'legacy-covers',
      tone: 'note',
      title: `${countUk(content.legacyArticleCovers, ['обкладинка статті', 'обкладинки статей', 'обкладинок статей'])} не в медіатеці`,
      detail: 'Перенесіть їх кнопкою «Перенести в CDN» у статтях',
      href: '/articles',
      actionLabel: 'Відкрити статті',
    });
  }

  if (content && content.documentDrafts > 0) {
    items.push({
      kind: 'document-drafts',
      tone: 'note',
      title: countUk(content.documentDrafts, [
        'чернетка документа',
        'чернетки документів',
        'чернеток документів',
      ]),
      detail: 'Зміни не видно на сайті, доки чернетку не опубліковано',
      href: '/documents',
      actionLabel: 'Відкрити документи',
    });
  }

  return items;
}

function ageUk(updatedAt: string, now: Date): string {
  const days = Math.floor((now.getTime() - new Date(updatedAt).getTime()) / dayMs);
  if (days < 1) return 'сьогодні';
  return countUk(days, ['день', 'дні', 'днів']);
}
