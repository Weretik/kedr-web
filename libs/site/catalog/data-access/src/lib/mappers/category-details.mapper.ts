import { isHiddenCategoryId } from '@site/catalog/model';

import { mapCatalogTree } from './category-tree.mapper';

import type { components } from '@shared/api-contracts';
import type { CategoryContent, CategoryDetails } from '@site/catalog/model';

type ApiCategoryDetails = components['schemas']['CategoryDetails'];
type ApiCategoryContent = components['schemas']['CategoryContent'];

const text = (value: string | null | undefined): string | null => value?.trim() || null;

const price = (value: number | null | undefined): number | null =>
  typeof value === 'number' && value > 0 ? value : null;

function mapContent(content: ApiCategoryContent | null): CategoryContent | null {
  if (!content) return null;
  const mapped: CategoryContent = {
    seoTitle: text(content.seoTitle),
    metaDescription: text(content.metaDescription),
    h1: text(content.h1),
    bodyHtml: text(content.bodyHtml),
    faq: content.faq
      .map((item) => ({ question: item.question.trim(), answer: item.answer.trim() }))
      .filter((item) => item.question && item.answer),
  };
  const empty =
    !mapped.seoTitle &&
    !mapped.metaDescription &&
    !mapped.h1 &&
    !mapped.bodyHtml &&
    !mapped.faq.length;
  return empty ? null : mapped;
}

export function mapCategoryDetails(category: ApiCategoryDetails): CategoryDetails {
  return {
    id: category.id,
    slug: category.slug,
    name: category.name.trim(),
    productCount: category.productCount,
    breadcrumbs: category.breadcrumbs
      .filter((crumb) => crumb.slug.trim() && crumb.name.trim() && !isHiddenCategoryId(crumb.id))
      .map((crumb) => ({ id: crumb.id, slug: crumb.slug, name: crumb.name.trim() })),
    children: mapCatalogTree(category.children),
    minPrice: price(category.minPrice),
    maxPrice: price(category.maxPrice),
    content: mapContent(category.content),
  };
}

/** The slug of a category the API points to from a 404 (a deleted category's nearest active ancestor). */
export function readRedirectSlug(body: unknown): string | null {
  if (typeof body !== 'object' || body === null) return null;
  const { redirectSlug, redirectType } = body as { redirectSlug?: unknown; redirectType?: unknown };
  return redirectType === 'category' && typeof redirectSlug === 'string' && redirectSlug.trim()
    ? redirectSlug
    : null;
}
