export { getReturnsDictionary } from './lib/returns-dictionary';
export type { ReturnsDictionary, ReturnsRow } from './lib/returns-types';
export { getContactsDictionary } from './lib/contacts-dictionary';
export type { ContactsDictionary, ContactsDetails } from './lib/contacts-types';
export { ARTICLE_PAGE_SIZES, DEFAULT_ARTICLES_QUERY } from './lib/articles/article-types';
export { ARTICLES_PATH, articlePath } from './lib/articles/article-routes';
export { articlePlainText } from './lib/articles/article-text';
export { articlePageNumbers } from './lib/articles/article-page-window';
export type {
  Article,
  ArticlesListing,
  ArticlesPageSize,
  ArticlesQuery,
  ArticlesSearchParams,
} from './lib/articles/article-types';
export {
  articlesHref,
  parseArticlesQuery,
  serializeArticlesQuery,
} from './lib/articles/articles-query';
export { buildArticlesListing } from './lib/articles/articles-listing';
export { ARTICLES_TOOLS_MIN_TOTAL, showArticlesTools } from './lib/articles/articles-tools';
export { getArticlesDictionary } from './lib/articles/articles-dictionary';
export type { ArticlesDictionary } from './lib/articles/articles-dictionary';
export { getWholesaleDictionary } from './lib/wholesale-dictionary';
export type { WholesaleCompanyDetails, WholesaleDictionary } from './lib/wholesale-types';
export { getRequisitesDictionary } from './lib/requisites-dictionary';
export { formatRequisitesCopy } from './lib/requisites-copy';
export type {
  RequisitesValues,
  RequisitesDetails,
  RequisitesFieldLabels,
  RequisitesCopyLabels,
  RequisitesDictionary,
} from './lib/requisites-types';
export { getPublicOfferDictionary } from './lib/public-offer/public-offer-dictionary';
export type { PublicOfferDictionary } from './lib/public-offer/public-offer-types';
export { getPrivacyDictionary } from './lib/privacy-dictionary';
export type {
  PrivacyContactBindings,
  PrivacyDictionary,
  PrivacySummaryItem,
} from './lib/privacy-types';
export type {
  GalleryFilter,
  GalleryImage,
  GalleryMedia,
  GalleryPhoto,
  GalleryVideo,
} from './lib/gallery/gallery-types';
export {
  GALLERY_BATCH_SIZE,
  INITIAL_GALLERY_COUNT,
  filterGalleryMedia,
  getInitialGalleryCount,
  getNextGalleryCount,
} from './lib/gallery/gallery-filter';
export { getGalleryDictionary } from './lib/gallery/gallery-dictionary';
export type { GalleryDictionary } from './lib/gallery/gallery-dictionary';
export type {
  LegalDocument,
  LegalDocumentBindings,
  LegalDocumentKind,
  LegalDocumentSection,
  LegalDocumentSource,
} from './lib/documents/legal-document-types';
export {
  buildLegalDocument,
  demoteHeadings,
  fillDocumentPlaceholders,
  formatEffectiveDate,
  htmlToText,
  splitDocumentSections,
} from './lib/documents/legal-document-html';
