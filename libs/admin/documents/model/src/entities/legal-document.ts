export const legalDocumentLanguages = ['uk', 'ru'] as const;
export type LegalDocumentLanguage = (typeof legalDocumentLanguages)[number];

export type LegalDocumentKind =
  'public-offer' | 'privacy-policy' | 'returns-policy' | 'delivery-payment';

export type LegalDocumentStatus = 'draft' | 'published' | 'archived';

/** Limits of the backend (Content: LegalDocumentText). */
export const legalDocumentLimits = { title: 200, bodyHtml: 100_000 } as const;

interface LegalDocumentKindInfo {
  readonly label: string;
  /** Site page, without the language prefix. */
  readonly sitePath: string;
  /** Legal texts show «Редакція від» on the site; delivery & payment does not. */
  readonly showsEditionDate: boolean;
}

/** The four documents in menu order. */
export const legalDocumentKinds: Readonly<Record<LegalDocumentKind, LegalDocumentKindInfo>> = {
  'public-offer': { label: 'Публічна оферта', sitePath: '/public-offer', showsEditionDate: true },
  'privacy-policy': {
    label: 'Політика конфіденційності',
    sitePath: '/privacy-policy',
    showsEditionDate: true,
  },
  'returns-policy': {
    label: 'Повернення та обмін',
    sitePath: '/returns-exchanges',
    showsEditionDate: true,
  },
  'delivery-payment': {
    label: 'Доставка та оплата',
    sitePath: '/delivery-and-payment',
    showsEditionDate: false,
  },
};

export const isLegalDocumentKind = (value: string | undefined): value is LegalDocumentKind =>
  value !== undefined && Object.prototype.hasOwnProperty.call(legalDocumentKinds, value);

export interface LegalDocumentText {
  title: string;
  bodyHtml: string;
}

/** Short facts of one edition. `number` and `effectiveFrom` are `null` while a draft. */
export interface LegalDocumentVersionSummary {
  id: number;
  status: LegalDocumentStatus;
  number: number | null;
  effectiveFrom: string | null;
  updatedAt: string;
  updatedBy: string;
  publishedAt: string | null;
  publishedBy: string | null;
}

export interface LegalDocumentVersion extends LegalDocumentVersionSummary {
  kind: LegalDocumentKind;
  texts: Record<LegalDocumentLanguage, LegalDocumentText>;
}

/** One row of the list: what is on the site now and the waiting draft. */
export interface LegalDocumentOverview {
  kind: LegalDocumentKind;
  published: LegalDocumentVersionSummary | null;
  draft: LegalDocumentVersionSummary | null;
}
