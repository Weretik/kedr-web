import {
  wholesaleLanguages,
  wholesaleLimits,
  wholesaleTextFields,
} from '../entities/wholesale-page';

import type {
  WholesaleLanguage,
  WholesaleText,
  WholesaleTextField,
} from '../entities/wholesale-page';
import type { WholesaleDraft } from '../forms/wholesale-draft';

export interface WholesaleTextErrors {
  fields?: Partial<Record<WholesaleTextField, string>>;
  steps?: { title?: string; text?: string }[];
  faq?: { question?: string; answer?: string }[];
  faqCount?: string;
}

export type WholesaleDraftErrors = Partial<Record<WholesaleLanguage, WholesaleTextErrors>>;

const check = (value: string, max: number) =>
  !value.trim()
    ? 'Заповніть поле.'
    : value.trim().length > max
      ? `Не більше ${max} символів.`
      : undefined;

const compact = <T extends object>(value: T) =>
  Object.values(value).some((entry) => entry !== undefined) ? value : undefined;

function validateText(text: WholesaleText): WholesaleTextErrors | undefined {
  const fields: Partial<Record<WholesaleTextField, string>> = {};
  for (const [field, max] of Object.entries(wholesaleTextFields) as [
    WholesaleTextField,
    number,
  ][]) {
    const error = check(text[field], max);
    if (error) fields[field] = error;
  }
  const steps = text.steps.map((step) =>
    compact({
      title: check(step.title, wholesaleLimits.shortTitle),
      text: check(step.text, wholesaleLimits.shortText),
    }),
  );
  const faq = text.faq.map((item) =>
    compact({
      question: check(item.question, wholesaleLimits.question),
      answer: check(item.answer, wholesaleLimits.answer),
    }),
  );
  const faqCount =
    text.faq.length === 0
      ? 'Додайте хоча б одне питання.'
      : text.faq.length > wholesaleLimits.maxFaq
        ? `Не більше ${wholesaleLimits.maxFaq} питань.`
        : undefined;

  const errors: WholesaleTextErrors = {
    fields: Object.keys(fields).length ? fields : undefined,
    steps: steps.some(Boolean) ? steps.map((step) => step ?? {}) : undefined,
    faq: faq.some(Boolean) ? faq.map((item) => item ?? {}) : undefined,
    faqCount,
  };
  return compact(errors);
}

/** Errors per language, or `undefined` when both can be saved. */
export function validateWholesaleDraft(draft: WholesaleDraft): WholesaleDraftErrors | undefined {
  const errors: WholesaleDraftErrors = {};
  for (const language of wholesaleLanguages) {
    const textErrors = validateText(draft[language]);
    if (textErrors) errors[language] = textErrors;
  }
  return Object.keys(errors).length ? errors : undefined;
}
