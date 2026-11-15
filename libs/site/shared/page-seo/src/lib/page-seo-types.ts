/**
 * The site pages that exist once and whose search texts editors may set. The API sends the page as a string, so the
 * names are the frontend's copy of KedrStore `SitePages`.
 */
export type SitePage =
  | 'Home'
  | 'Catalog'
  | 'Wholesale'
  | 'DeliveryPayment'
  | 'ReturnsExchanges'
  | 'Contacts'
  | 'Gallery'
  | 'Articles'
  | 'Requisites'
  | 'PublicOffer'
  | 'PrivacyPolicy';

/** What an editor set; null keeps the page's own text. */
export type PageSeoText = { title: string | null; description: string | null };
