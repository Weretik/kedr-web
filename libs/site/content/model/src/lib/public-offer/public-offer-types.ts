import type { Locale } from '@site/core/i18n';

export interface PublicOfferSection {
  readonly id: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly tocLabel: string;
  readonly paragraphs: readonly string[];
}

export interface PublicOfferDictionary {
  readonly locale: Locale;
  readonly title: string;
  readonly fullTitle: string;
  readonly home: string;
  readonly breadcrumbLabel: string;
  readonly contentsLabel: string;
  readonly helpTitle: string;
  readonly call: string;
  readonly deliveryLink: string;
  readonly returnsLink: string;
  readonly print: string;
  readonly printHint: string;
  readonly sections: readonly PublicOfferSection[];
  readonly note: string;
}
