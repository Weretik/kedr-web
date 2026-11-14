import type { Locale } from '@site/core/i18n';

/** Official values supplied by the feature; codes remain strings without normalization. */
export interface RequisitesValues {
  readonly legalName: string;
  readonly code: string;
  readonly registrationExtractNumber: string;
  readonly iban: string;
  readonly bankName: string;
  readonly bankCode: string;
}

export interface RequisitesDetails extends RequisitesValues {
  readonly phone: {
    readonly display: string;
    readonly e164: string;
  };
}

export interface RequisitesFieldLabels {
  readonly legalName: string;
  readonly code: string;
  readonly registrationExtractNumber: string;
  readonly iban: string;
  readonly bankName: string;
  readonly bankCode: string;
}

export interface RequisitesCopyLabels {
  readonly iban: string;
  readonly all: string;
  readonly copied: string;
  readonly fallback: string;
}

/** Translatable interface text only; no official company or banking values. */
export interface RequisitesDictionary {
  readonly locale: Locale;
  readonly home: string;
  readonly breadcrumbLabel: string;
  readonly title: string;
  readonly intro: string;
  readonly paymentNote: string;
  readonly navigationLabel: string;
  readonly administrationLink: string;
  readonly administrationTitle: string;
  readonly bankLink: string;
  readonly bankTitle: string;
  readonly paymentLink: string;
  readonly fields: RequisitesFieldLabels;
  readonly copy: RequisitesCopyLabels;
  readonly paymentTitle: string;
  readonly paymentText: string;
  readonly deliveryLink: string;
  readonly legalTitle: string;
  readonly publicOfferLink: string;
  readonly privacyPolicyLink: string;
  readonly helpTitle: string;
  readonly call: string;
}
