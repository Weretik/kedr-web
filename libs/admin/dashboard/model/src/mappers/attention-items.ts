import { catalogAttention } from './catalog-attention';
import { contentAttention } from './content-attention';
import { orderAttention } from './order-attention';

import type { AttentionItem, AttentionSources } from '../entities/attention-item';

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
  return [
    ...(orders ? orderAttention(orders) : []),
    ...(catalog ? catalogAttention(catalog) : []),
    ...(content ? contentAttention(content, now) : []),
  ];
}
