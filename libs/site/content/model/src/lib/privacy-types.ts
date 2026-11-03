import type { Locale } from '@site/core/i18n';

export type PrivacySectionId =
  | 'privacy-general'
  | 'privacy-data'
  | 'privacy-purpose'
  | 'privacy-sharing'
  | 'privacy-storage'
  | 'privacy-rights'
  | 'privacy-changes'
  | 'privacy-contact';

/** Explicit public facts supplied by the feature; the model does not read config. */
export interface PrivacyPolicyBindings {
  readonly siteHost: string;
  readonly email: string;
  readonly phoneDisplay: string;
  readonly phoneHref: string;
}

export interface PrivacyInline {
  readonly text: string;
  readonly href?: string;
}

export type PrivacyPolicyBlock =
  | {
      readonly kind: 'paragraph';
      readonly sourceKey: string;
      readonly content: readonly PrivacyInline[];
    }
  | {
      readonly kind: 'list';
      readonly items: readonly {
        readonly sourceKey: string;
        readonly content: readonly PrivacyInline[];
      }[];
    };

export interface PrivacyPolicySection {
  readonly id: PrivacySectionId;
  readonly title: string;
  readonly tocLabel: string;
  readonly blocks: readonly PrivacyPolicyBlock[];
}

export interface PrivacySummaryItem {
  readonly id: 'data' | 'purpose' | 'rights';
  readonly title: string;
  readonly body: string;
}

export interface PrivacyDictionary {
  readonly locale: Locale;
  readonly breadcrumbLabel: string;
  readonly home: string;
  readonly title: string;
  readonly intro: string;
  readonly contentsLabel: string;
  readonly summary: readonly PrivacySummaryItem[];
  readonly sections: readonly PrivacyPolicySection[];
  readonly contactTitle: string;
  readonly contactAction: string;
  readonly contact: {
    readonly email: string;
    readonly phoneDisplay: string;
    readonly phoneHref: string;
  };
  readonly relatedOffer: {
    readonly heading: string;
    readonly title: string;
    readonly description: string;
  };
}
