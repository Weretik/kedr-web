import { contentLanguages, emptyCategoryContent } from '@admin/categories/model';

import type {
  AdminCategoryContentDto,
  AdminCategoryContentItemDto,
  SaveCategoryContentBody,
} from '../contracts/admin-categories.contract';
import type {
  CategoryContent,
  CategoryContentDraft,
  ContentLanguage,
} from '@admin/categories/model';

export type CategoryContentByLanguage = Record<ContentLanguage, CategoryContent>;

export function mapCategoryContentItem(dto: AdminCategoryContentItemDto): CategoryContent {
  return {
    language: dto.language,
    seoTitle: dto.seoTitle ?? '',
    metaDescription: dto.metaDescription ?? '',
    h1: dto.h1 ?? '',
    bodyHtml: dto.bodyHtml ?? '',
    faq: dto.faq.map(({ answer, question }) => ({ answer, question })),
    updatedAt: dto.updatedAt,
  };
}

/** Every language, with empty content where none is stored yet. */
export function mapCategoryContent(dto: AdminCategoryContentDto): CategoryContentByLanguage {
  const stored = new Map(dto.items.map((item) => [item.language, mapCategoryContentItem(item)]));
  return Object.fromEntries(
    contentLanguages.map((language) => [
      language,
      stored.get(language) ?? emptyCategoryContent(language),
    ]),
  ) as CategoryContentByLanguage;
}

const textOrNull = (value: string) => value.trim() || null;

/** An editor with only an empty paragraph means "no text". */
const bodyOrNull = (html: string) => {
  const trimmed = html.trim();
  return trimmed && trimmed !== '<p></p>' ? trimmed : null;
};

export function toSaveCategoryContentBody(draft: CategoryContentDraft): SaveCategoryContentBody {
  return {
    seoTitle: textOrNull(draft.seoTitle),
    metaDescription: textOrNull(draft.metaDescription),
    h1: textOrNull(draft.h1),
    bodyHtml: bodyOrNull(draft.bodyHtml),
    faq: draft.faq.map((item) => ({ question: item.question.trim(), answer: item.answer.trim() })),
  };
}
