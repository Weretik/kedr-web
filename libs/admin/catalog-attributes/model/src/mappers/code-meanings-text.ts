import type { CodeMeaning } from '../entities/unresolved-code';

/** «Колір: Золото · Конфігурація: Z» */
export function codeMeaningsText(meanings: readonly CodeMeaning[]): string {
  return meanings.map((meaning) => `${meaning.attributeName}: ${meaning.valueName}`).join(' · ');
}
