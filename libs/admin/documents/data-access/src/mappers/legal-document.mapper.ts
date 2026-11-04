import {
  legalDocumentOverviewListSchema,
  legalDocumentVersionListSchema,
  legalDocumentVersionSchema,
} from '../validators/legal-documents.schemas';

import type { SaveLegalDocumentDraftBody } from '../contracts/admin-legal-documents.contract';
import type {
  LegalDocumentDraft,
  LegalDocumentLanguage,
  LegalDocumentOverview,
  LegalDocumentText,
  LegalDocumentVersion,
  LegalDocumentVersionSummary,
} from '@admin/documents/model';

export const mapLegalDocumentOverviews = (response: unknown): LegalDocumentOverview[] =>
  legalDocumentOverviewListSchema.parse(response);

export const mapLegalDocumentVersions = (response: unknown): LegalDocumentVersionSummary[] =>
  legalDocumentVersionListSchema.parse(response);

export function mapLegalDocumentVersion(response: unknown): LegalDocumentVersion {
  const { texts, ...version } = legalDocumentVersionSchema.parse(response);
  return {
    ...version,
    texts: Object.fromEntries(
      texts.map(({ language, title, bodyHtml }) => [language, { title, bodyHtml }]),
    ) as Record<LegalDocumentLanguage, LegalDocumentText>,
  };
}

export function toSaveDraftBody(draft: LegalDocumentDraft): SaveLegalDocumentDraftBody {
  return {
    texts: (['uk', 'ru'] as const).map((language) => ({
      language,
      title: draft.texts[language].title.trim(),
      bodyHtml: draft.texts[language].bodyHtml.trim(),
    })),
  };
}
