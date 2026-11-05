import type { Locale } from '@site/core/i18n';

/** Public company facts selected and localized by the feature. */
export interface WholesaleCompanyDetails {
  name: string;
  phone: { display: string; e164: string };
  city: string;
  telegram: string;
  viber: string;
}

export interface WholesaleStep {
  title: string;
  text: string;
}

export interface WholesaleFaqItem {
  question: string;
  answer: string;
}

/** Editorial copy only: no contact values, category routes or commercial terms. */
export interface WholesaleDictionary {
  locale: Locale;
  home: string;
  breadcrumb: string;
  breadcrumbLabel: string;
  hero: {
    title: string;
    lead: string;
    conditionsAction: string;
    catalogAction: string;
    contactTitle: string;
    contactNote: string;
  };
  assortment: {
    title: string;
    intro: string;
    unavailable: string;
  };
  company: {
    /** The feature supplies the company name before this title. */
    title: string;
    text: string;
    wholesaleRetail: string;
    cityPrefix: string;
    selectionSupport: string;
    selection: { title: string; text: string };
    warehouse: { title: string; text: string };
    aboutLink: string;
  };
  steps: {
    title: string;
    items: readonly [WholesaleStep, WholesaleStep, WholesaleStep];
  };
  faq: {
    title: string;
    /** One or more questions; the admin keeps up to twelve. */
    items: readonly WholesaleFaqItem[];
  };
  contact: {
    title: string;
    managerAction: string;
    deliveryLink: string;
    returnsLink: string;
  };
}

/** The copy managers edit in the admin; everything else on the page stays in the dictionary. */
export interface WholesaleTexts {
  heroTitle: string;
  heroLead: string;
  contactCardTitle: string;
  contactCardNote: string;
  assortmentTitle: string;
  assortmentIntro: string;
  /** Shown after the company name, like the dictionary's company title. */
  companyTitle: string;
  companyText: string;
  selectionTitle: string;
  selectionText: string;
  warehouseTitle: string;
  warehouseText: string;
  stepsTitle: string;
  steps: readonly [WholesaleStep, WholesaleStep, WholesaleStep];
  faqTitle: string;
  faq: readonly WholesaleFaqItem[];
  closingTitle: string;
}
