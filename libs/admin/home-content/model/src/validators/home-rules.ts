import {
  homeAnswerMaxLength,
  homeBrandNameMaxLength,
  homeQuestionMaxLength,
} from '../entities/home-blocks';

import type { HomeFaqTexts } from '../entities/home-blocks';
import type { HomeBrandDraft } from '../forms/home-forms';

type Issues<T> = Partial<Record<keyof T, string>>;

const textIssue = (value: string, max: number) => {
  const text = value.trim();
  if (!text) return 'Заповніть поле.';
  return text.length > max ? `Не більше ${max} символів.` : undefined;
};

const collect = <T>(entries: [keyof T, string | undefined][]): Issues<T> =>
  Object.fromEntries(entries.filter(([, issue]) => issue !== undefined)) as Issues<T>;

/** Field → message; empty when the question can be saved. Both languages are required, as on the backend. */
export const homeFaqIssues = (texts: HomeFaqTexts): Issues<HomeFaqTexts> =>
  collect<HomeFaqTexts>([
    ['questionUk', textIssue(texts.questionUk, homeQuestionMaxLength)],
    ['questionRu', textIssue(texts.questionRu, homeQuestionMaxLength)],
    ['answerUk', textIssue(texts.answerUk, homeAnswerMaxLength)],
    ['answerRu', textIssue(texts.answerRu, homeAnswerMaxLength)],
  ]);

/** Field → message; empty when the brand can be saved. */
export const homeBrandIssues = (draft: HomeBrandDraft): Issues<HomeBrandDraft> =>
  collect<HomeBrandDraft>([
    ['name', textIssue(draft.name, homeBrandNameMaxLength)],
    ['logo', draft.logo ? undefined : 'Виберіть логотип.'],
  ]);

/** The IDs after moving one entry to another place, for the order request. */
export function moveHomeItem(ids: readonly number[], id: number, to: number): number[] {
  const from = ids.indexOf(id);
  const target = Math.max(0, Math.min(ids.length - 1, to));
  if (from < 0 || from === target) return [...ids];
  const next = ids.filter((value) => value !== id);
  next.splice(target, 0, id);
  return next;
}
