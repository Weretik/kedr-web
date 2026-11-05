/** One variant of a group as the admin shows it. */
export interface ProductGroupMember {
  productId: number;
  name: string;
  exportToSite: boolean;
  isDeleted: boolean;
  photo: string;
  isPinned: boolean;
  isMain: boolean;
  colors: readonly string[];
  size: string | null;
  side: string | null;
  /** Color, size, and side do not tell it apart from another variant («Однакові варіанти»). */
  hasSameVariants: boolean;
}

export interface ProductGroup {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  mainProductId: number | null;
  isCreatedManually: boolean;
  members: readonly ProductGroupMember[];
}

/** The group of one product. Pinned: a person placed it; pinned without a group means taken out on purpose. */
export interface ProductGroupMembership {
  productId: number;
  isPinned: boolean;
  group: ProductGroup | null;
}

/** A group found by the «Перенести в іншу групу» search. */
export interface ProductGroupOption {
  id: number;
  name: string;
  productCount: number;
}

/** Where a person puts a product: a group, out of groups, or back to automatic grouping. */
export type ProductGroupChange = { groupId: number } | { noGroup: true } | { automatic: true };

/** Color, size, and side of a variant in one line. */
export function variantText(member: ProductGroupMember): string {
  return [member.colors.join(' / '), member.size, member.side].filter(Boolean).join(' · ') || '—';
}
