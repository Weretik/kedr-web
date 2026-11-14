import type { Locale } from '@site/core/i18n';

/** Page chrome of the public offer; the legal text itself is the published document. */
export interface PublicOfferDictionary {
  readonly locale: Locale;
  readonly title: string;
  readonly home: string;
  readonly breadcrumbLabel: string;
  readonly contentsLabel: string;
  readonly helpTitle: string;
  readonly call: string;
  readonly deliveryLink: string;
  readonly returnsLink: string;
  readonly print: string;
  readonly printHint: string;
}
