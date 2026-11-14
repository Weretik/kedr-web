import { countUk } from './plural';

import type { AttentionItem } from '../entities/attention-item';
import type { DashboardContent } from '../entities/dashboard-overview';

const dayMs = 24 * 60 * 60 * 1000;

/** Unfinished articles and documents, and article covers outside the media library. */
export function contentAttention(content: DashboardContent, now: Date): AttentionItem[] {
  const items: AttentionItem[] = [];

  if (content.articleDrafts > 0) {
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

  if (content.legacyArticleCovers > 0) {
    items.push({
      kind: 'legacy-covers',
      tone: 'note',
      title: `${countUk(content.legacyArticleCovers, ['обкладинка статті', 'обкладинки статей', 'обкладинок статей'])} не в медіатеці`,
      detail: 'Перенесіть їх кнопкою «Перенести в CDN» у статтях',
      href: '/articles',
      actionLabel: 'Відкрити статті',
    });
  }

  if (content.documentDrafts > 0) {
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
