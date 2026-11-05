import { wholesaleLanguages } from '@admin/wholesale-content/model';

import { adminWholesalePageSchema } from '../validators/wholesale-content.schemas';

import type {
  SaveWholesalePageBody,
  WholesaleTextDto,
} from '../contracts/admin-wholesale-content.contract';
import type { WholesaleDraft, WholesalePage, WholesaleText } from '@admin/wholesale-content/model';

export function mapWholesalePage(response: unknown): WholesalePage {
  const page = adminWholesalePageSchema.parse(response);
  const byLanguage = (language: 'uk' | 'ru'): WholesaleText => {
    const found = page.texts.find((text) => text.language === language);
    if (!found) throw new Error(`The page has no ${language} text.`);
    return Object.fromEntries(
      Object.entries(found).filter(([key]) => key !== 'language'),
    ) as unknown as WholesaleText;
  };
  return {
    texts: { uk: byLanguage('uk'), ru: byLanguage('ru') },
    updatedAt: page.updatedAt,
    updatedBy: page.updatedBy,
  };
}

const trimText = (text: WholesaleText): Omit<WholesaleTextDto, 'language'> => ({
  ...(Object.fromEntries(
    Object.entries(text).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.trim() : value,
    ]),
  ) as WholesaleText),
  steps: text.steps.map((step) => ({ title: step.title.trim(), text: step.text.trim() })),
  faq: text.faq.map((item) => ({ question: item.question.trim(), answer: item.answer.trim() })),
});

/** Both languages, trimmed, `uk` first. */
export function toSaveWholesaleBody(draft: WholesaleDraft): SaveWholesalePageBody {
  return {
    texts: wholesaleLanguages.map((language) => ({ language, ...trimText(draft[language]) })),
  };
}
