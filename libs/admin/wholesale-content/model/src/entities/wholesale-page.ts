export type WholesaleLanguage = 'uk' | 'ru';

export const wholesaleLanguages: readonly WholesaleLanguage[] = ['uk', 'ru'];

export interface WholesaleStep {
  title: string;
  text: string;
}

export interface WholesaleFaqItem {
  question: string;
  answer: string;
}

/** One language of the page «Співпраця», block by block from the top. Plain text, no HTML. */
export interface WholesaleText {
  heroTitle: string;
  heroLead: string;
  contactCardTitle: string;
  contactCardNote: string;
  assortmentTitle: string;
  assortmentIntro: string;
  /** Shown after the company name («Class Kedr — …»), so it may start in lower case. */
  companyTitle: string;
  companyText: string;
  selectionTitle: string;
  selectionText: string;
  warehouseTitle: string;
  warehouseText: string;
  stepsTitle: string;
  /** Always three: the page design has three order steps. */
  steps: WholesaleStep[];
  faqTitle: string;
  faq: WholesaleFaqItem[];
  closingTitle: string;
}

export interface WholesalePage {
  texts: Record<WholesaleLanguage, WholesaleText>;
  updatedAt: string;
  /** Who saved last; null for the texts the migration moved from the site. */
  updatedBy: string | null;
}

/** Limits of the Content backend (spec content/009). */
export const wholesaleLimits = {
  title: 120,
  shortTitle: 80,
  shortText: 200,
  text: 600,
  question: 200,
  answer: 1000,
  steps: 3,
  maxFaq: 12,
} as const;

/** The single-line texts and their limits; `steps` and `faq` are lists. */
export const wholesaleTextFields = {
  heroTitle: wholesaleLimits.title,
  heroLead: wholesaleLimits.text,
  contactCardTitle: wholesaleLimits.shortTitle,
  contactCardNote: wholesaleLimits.shortText,
  assortmentTitle: wholesaleLimits.title,
  assortmentIntro: wholesaleLimits.shortText,
  companyTitle: wholesaleLimits.title,
  companyText: wholesaleLimits.text,
  selectionTitle: wholesaleLimits.shortTitle,
  selectionText: wholesaleLimits.shortText,
  warehouseTitle: wholesaleLimits.shortTitle,
  warehouseText: wholesaleLimits.shortText,
  stepsTitle: wholesaleLimits.title,
  faqTitle: wholesaleLimits.title,
  closingTitle: wholesaleLimits.title,
} as const satisfies Partial<Record<keyof WholesaleText, number>>;

export type WholesaleTextField = keyof typeof wholesaleTextFields;
