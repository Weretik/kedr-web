import type { AttributeProblem } from './attribute-problem';

export interface AdminProductListItem {
  id: number;
  nameUk: string;
  nameRu: string;
  productSlug: string;
  photo: string;
  categoryId: number | null;
  categoryName: string;
  inStock: boolean;
  isSale: boolean;
  isNew: boolean;
  exportToSite: boolean;
  price: number | null;
  stock: number;
  quantityInPack: number;
  /** Set only for products the 1C import soft-deleted. */
  deletedAt: string | null;
  /** Variant group; only the paged list fills it. */
  groupId: number | null;
  groupName: string | null;
  /** Why the attributes need review; empty when they do not. */
  problems: readonly AttributeProblem[];
}
