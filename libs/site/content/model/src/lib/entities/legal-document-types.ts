import type { Locale } from '@site/core/i18n';

/** URL names of the documents the admin edits; they match the API. */
export type LegalDocumentKind =
  'public-offer' | 'privacy-policy' | 'returns-policy' | 'delivery-payment';

/** The published edition as the API returns it; the body still holds its placeholders. */
export interface LegalDocumentSource {
  readonly kind: LegalDocumentKind;
  readonly number: number;
  /** «Редакція від», `YYYY-MM-DD`. */
  readonly effectiveFrom: string;
  readonly title: string;
  readonly bodyHtml: string;
}

/** Public facts that replace `{site}`, `{email}` and `{phone}` in a document body. */
export interface LegalDocumentBindings {
  readonly siteHost: string;
  readonly email: string;
  readonly phoneDisplay: string;
  readonly phoneHref: string;
}

/** One `<h2>` part of a document: its anchor id, plain-text title and the sanitized HTML below the heading. */
export interface LegalDocumentSection {
  readonly id: string;
  readonly title: string;
  readonly html: string;
}

/** A published document ready to render: text before the first heading, then its sections. */
export interface LegalDocument {
  readonly locale: Locale;
  readonly kind: LegalDocumentKind;
  readonly number: number;
  readonly effectiveFrom: string;
  readonly title: string;
  readonly leadHtml: string;
  readonly sections: readonly LegalDocumentSection[];
}
