import type { Locale } from '@site/core/i18n';

/** Saved contacts for the «write to us» block; supplied by the feature, the model does not read config. */
export interface PrivacyContactBindings {
  readonly email: string;
  readonly phoneDisplay: string;
  readonly phoneHref: string;
}

export interface PrivacySummaryItem {
  readonly id: 'data' | 'purpose' | 'rights';
  readonly title: string;
  readonly body: string;
}

/** Page chrome of the privacy policy around the published document. */
export interface PrivacyDictionary {
  readonly locale: Locale;
  readonly breadcrumbLabel: string;
  readonly home: string;
  readonly title: string;
  readonly intro: string;
  readonly contentsLabel: string;
  readonly summary: readonly PrivacySummaryItem[];
  readonly contactTitle: string;
  readonly contactAction: string;
  readonly contact: PrivacyContactBindings;
  readonly relatedOffer: {
    readonly heading: string;
    readonly title: string;
    readonly description: string;
  };
}
