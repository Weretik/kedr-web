import { legalDocumentLanguages } from '../entities/legal-document';

import type {
  LegalDocumentLanguage,
  LegalDocumentText,
  LegalDocumentVersion,
} from '../entities/legal-document';

/** Both languages of an edition being edited. */
export interface LegalDocumentDraft {
  texts: Record<LegalDocumentLanguage, LegalDocumentText>;
}

export const versionToDraft = (version: LegalDocumentVersion): LegalDocumentDraft => ({
  texts: {
    uk: { ...version.texts.uk },
    ru: { ...version.texts.ru },
  },
});

export const isSameLegalDocumentDraft = (a: LegalDocumentDraft, b: LegalDocumentDraft) =>
  legalDocumentLanguages.every(
    (language) =>
      a.texts[language].title === b.texts[language].title &&
      a.texts[language].bodyHtml === b.texts[language].bodyHtml,
  );
