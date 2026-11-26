import type { ContentLanguage } from '../../entities/category-content';

/** Where Google usually cuts a title and a description in results. */
export const googleTitleLimit = 60;
export const googleDescriptionLimit = 160;

export interface GooglePreview {
  /** «classkedr.com.ua › uk › catalog › zamky». */
  address: string;
  /** `null` when the site builds the text itself from the category name. */
  title: string | null;
  description: string | null;
  titleCut: boolean;
  descriptionCut: boolean;
}

const cut = (text: string, limit: number) =>
  text.length > limit ? `${text.slice(0, limit - 1).trimEnd()}…` : text;

/** How the category page may look in Google results (spec 003 R-009). */
export function categoryGooglePreview(input: {
  siteUrl: string;
  language: ContentLanguage;
  slug: string;
  seoTitle: string;
  metaDescription: string;
}): GooglePreview {
  const host = input.siteUrl.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  const title = input.seoTitle.trim();
  const description = input.metaDescription.trim();
  return {
    address: [host, input.language, 'catalog', input.slug].join(' › '),
    title: title ? cut(title, googleTitleLimit) : null,
    description: description ? cut(description, googleDescriptionLimit) : null,
    titleCut: title.length > googleTitleLimit,
    descriptionCut: description.length > googleDescriptionLimit,
  };
}
