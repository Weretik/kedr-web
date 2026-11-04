import { legalDocumentLanguages, legalDocumentLimits } from '../entities/legal-document';

import type { LegalDocumentLanguage } from '../entities/legal-document';
import type { LegalDocumentDraft } from '../forms/legal-document-draft';

export interface LegalDocumentTextErrors {
  title?: string;
  bodyHtml?: string;
}

export type LegalDocumentDraftErrors = Partial<
  Record<LegalDocumentLanguage, LegalDocumentTextErrors>
>;

const isEmptyHtml = (html: string) => {
  const trimmed = html.trim();
  return !trimmed || trimmed === '<p></p>';
};

/** Field errors per language, or `undefined` when the draft can be saved. */
export function validateLegalDocumentDraft(
  draft: LegalDocumentDraft,
): LegalDocumentDraftErrors | undefined {
  const errors: LegalDocumentDraftErrors = {};
  for (const language of legalDocumentLanguages) {
    const { title, bodyHtml } = draft.texts[language];
    const text: LegalDocumentTextErrors = {
      title: !title.trim()
        ? 'Вкажіть назву.'
        : title.trim().length > legalDocumentLimits.title
          ? `Не більше ${legalDocumentLimits.title} символів.`
          : undefined,
      bodyHtml: isEmptyHtml(bodyHtml)
        ? 'Напишіть текст документа.'
        : bodyHtml.length > legalDocumentLimits.bodyHtml
          ? 'Текст задовгий. Скоротіть його.'
          : undefined,
    };
    if (text.title || text.bodyHtml) errors[language] = text;
  }
  return Object.keys(errors).length ? errors : undefined;
}

/** «Редакція від» may not be earlier than the edition on the site. */
export function validateEffectiveFrom(
  value: string,
  publishedFrom: string | null,
): string | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Вкажіть дату.';
  if (publishedFrom && value < publishedFrom)
    return `Не раніше за дату чинної редакції (${formatDate(publishedFrom)}).`;
  return undefined;
}

/** `2026-11-03` → `03.11.2026`. */
export const formatDate = (value: string) => value.slice(0, 10).split('-').reverse().join('.');
