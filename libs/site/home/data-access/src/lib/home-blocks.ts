/** One FAQ entry as the home page shows it. */
export interface HomeFaqEntry {
  question: string;
  answer: string;
}

/** One brand logo; width and height are absent when the library does not know them. */
export interface HomeBrandLogo {
  name: string;
  src: string;
  width?: number;
  height?: number;
}

/** The home page blocks read: both lists in site order, or an API failure. */
export type HomeBlocksResult =
  | { kind: 'ok'; faq: readonly HomeFaqEntry[]; brands: readonly HomeBrandLogo[] }
  | { kind: 'unavailable' };
