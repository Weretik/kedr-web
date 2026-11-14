export { getReturnsDictionary } from './lib/copy/returns/returns-dictionary';
export type { ReturnsDictionary, ReturnsRow } from './lib/copy/returns/returns-types';
export { getContactsDictionary } from './lib/copy/contacts/contacts-dictionary';
export type { ContactsDictionary, ContactsDetails } from './lib/copy/contacts/contacts-types';
export { ARTICLE_PAGE_SIZES, DEFAULT_ARTICLES_QUERY } from './lib/entities/article-types';
export { ARTICLES_PATH, articlePath } from './lib/paths/article-routes';
export { articlePlainText } from './lib/mappers/article-text';
export { articlePageNumbers } from './lib/queries/article-page-window';
export type {
  Article,
  ArticlesListing,
  ArticlesPageSize,
  ArticlesQuery,
  ArticlesSearchParams,
} from './lib/entities/article-types';
export {
  articlesHref,
  parseArticlesQuery,
  serializeArticlesQuery,
} from './lib/queries/articles-query';
export { buildArticlesListing } from './lib/queries/articles-listing';
export { ARTICLES_TOOLS_MIN_TOTAL, showArticlesTools } from './lib/mappers/articles-tools';
export { getArticlesDictionary } from './lib/copy/articles/articles-dictionary';
export type { ArticlesDictionary } from './lib/copy/articles/articles-dictionary';
export { getWholesaleDictionary } from './lib/copy/wholesale/wholesale-dictionary';
export { applyWholesaleTexts } from './lib/copy/wholesale/wholesale-texts';
export type {
  WholesaleCompanyDetails,
  WholesaleDictionary,
  WholesaleFaqItem,
  WholesaleStep,
  WholesaleTexts,
} from './lib/copy/wholesale/wholesale-types';
export { getRequisitesDictionary } from './lib/copy/requisites/requisites-dictionary';
export { formatRequisitesCopy } from './lib/copy/requisites/requisites-copy';
export type {
  RequisitesValues,
  RequisitesDetails,
  RequisitesFieldLabels,
  RequisitesCopyLabels,
  RequisitesDictionary,
} from './lib/copy/requisites/requisites-types';
export { getPublicOfferDictionary } from './lib/copy/public-offer/public-offer-dictionary';
export type { PublicOfferDictionary } from './lib/copy/public-offer/public-offer-types';
export { getPrivacyDictionary } from './lib/copy/privacy/privacy-dictionary';
export type {
  PrivacyContactBindings,
  PrivacyDictionary,
  PrivacySummaryItem,
} from './lib/copy/privacy/privacy-types';
export type {
  GalleryFilter,
  GalleryImage,
  GalleryMedia,
  GalleryPhoto,
  GalleryVideo,
} from './lib/entities/gallery-types';
export {
  GALLERY_BATCH_SIZE,
  INITIAL_GALLERY_COUNT,
  filterGalleryMedia,
  getInitialGalleryCount,
  getNextGalleryCount,
} from './lib/queries/gallery-filter';
export { getGalleryDictionary } from './lib/copy/gallery/gallery-dictionary';
export type { GalleryDictionary } from './lib/copy/gallery/gallery-dictionary';
export type {
  LegalDocument,
  LegalDocumentBindings,
  LegalDocumentKind,
  LegalDocumentSection,
  LegalDocumentSource,
} from './lib/entities/legal-document-types';
export {
  buildLegalDocument,
  demoteHeadings,
  fillDocumentPlaceholders,
  formatEffectiveDate,
  htmlToText,
  splitDocumentSections,
} from './lib/mappers/legal-document-html';
