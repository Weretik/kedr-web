import type { Locale } from '@site/core/i18n';

/** Public company facts selected and localized by the feature. */
export interface WholesaleCompanyDetails {
  name: string;
  phone: { display: string; e164: string };
  city: string;
  telegram: string;
  viber: string;
}

interface WholesaleStep {
  title: string;
  text: string;
}

interface WholesaleFaqItem {
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
    items: readonly [WholesaleFaqItem, WholesaleFaqItem, WholesaleFaqItem];
  };
  contact: {
    title: string;
    managerAction: string;
    deliveryLink: string;
    returnsLink: string;
  };
}
